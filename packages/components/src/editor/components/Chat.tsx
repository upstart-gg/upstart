import { tx, css } from "@upstart.gg/style-system/twind";
import { Button, Text, Switch, toast } from "@upstart.gg/style-system/system";
import { motion, AnimatePresence } from "motion/react";
import {
  type ChatOnToolCallCallback,
  DefaultChatTransport,
  type DynamicToolUIPart,
  lastAssistantMessageIsCompleteWithToolCalls,
  tool,
  type ToolUIPart,
} from "ai";

import { TbSend2 } from "react-icons/tb";
import { IoIosAttach } from "react-icons/io";
import { useChat, type UseChatHelpers } from "@ai-sdk/react";
import { type FormEvent, useEffect, useMemo, useRef, useState, Suspense } from "react";
import { createIdGenerator } from "ai";
import {
  useAdditionalAssets,
  useDraftHelpers,
  useGenerationState,
  usePage,
  useSite,
  useSitePrompt,
  useThemes,
} from "../hooks/use-page-data";
import { MdDone } from "react-icons/md";
import { useDebounceCallback } from "usehooks-ts";
import { Spinner } from "@upstart.gg/style-system/system";
import { BiStopCircle } from "react-icons/bi";
import { defineDataRecord } from "@upstart.gg/sdk/shared/datarecords";
import { useDeepCompareEffect } from "use-deep-compare";
import type { SimpleImageMetadata } from "@upstart.gg/sdk/shared/images";
import { useDebugMode, useEditorHelpers } from "../hooks/use-editor";
import { defineDatasource } from "@upstart.gg/sdk/shared/datasources";
import type { Tools, UpstartUIMessage } from "@upstart.gg/sdk/shared/ai/types";
import Markdown from "./Markdown";
import type { Brick, Section } from "@upstart.gg/sdk/shared/bricks";

const WEB_SEARCH_ENABLED = false;

const msgCommon = tx(
  "rounded-lg p-6 text-pretty transition-all duration-300 flex flex-col gap-1.5",
  css({
    // whiteSpace: "pre-line",
    "& p": {
      marginBlock: ".5rem",
      lineHeight: "1.625",
    },
    "& p:first-child": {
      marginTop: "0",
    },
    "& p:last-child": {
      marginBottom: "0",
    },
    "& code": {
      fontSize: "88%",
    },
    "& ul, ol": {
      listStyle: "outside",
      listStyleType: "square",
      paddingLeft: "1.6rem",
      marginTop: "0.5rem",
      marginBottom: "0.2rem",
    },
    "& li": {
      marginBottom: "0.25rem",
      paddingLeft: ".3rem",
    },
    "& div.choices": {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "space-between",
      gap: ".5rem",
      marginBlock: "1rem",
      "& > button": {
        backgroundColor: "var(--violet-10)",
        color: "#fff",
        flexGrow: "1",
        padding: "0.4rem 0.7rem",
        borderRadius: "0.5rem",
        border: "none",
        fontSize: ".95em",
        fontWeight: "500",
        "&:hover": {
          backgroundColor: "var(--violet-9)",
        },
      },
    },
  }),
);

const userMsgClass = tx(
  "text-gray-800 text-[0.8rem] opacity-70 bg-gradient-to-tr from-gray-200/20 to-gray-100/20 w-fit max-w-[90%] dark:(bg-dark-900 text-white/70) self-end",
);

export default function Chat() {
  const sitePrompt = useSitePrompt();
  const setupRef = useRef(false);
  const draftHelpers = useDraftHelpers();
  const additionalAssets = useAdditionalAssets();
  const generationState = useGenerationState();
  const site = useSite();
  const page = usePage();
  const siteThemes = useThemes();
  const [userLanguage, setUserLanguage] = useState<string>();
  const [input, setInput] = useState("");
  const debug = useDebugMode();
  const [showToastWorking, setShowToastWorking] = useState(generationState.isSetup);
  const [hasScrolledUp, setHasScrolledUp] = useState(false);

  // If user has scrolled up, we want to update the hasScrolledUp state

  // listen for scroll events on the window to detect if user has scrolled up
  useEffect(() => {
    const onScroll = (e: Event) => {
      const target = e.target as HTMLDivElement;
      if (target && messagesListRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = messagesListRef.current;
        // Consider user "at bottom" if within 100px of the bottom
        const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100;
        setHasScrolledUp(!isNearBottom);
      }
    };

    const messagesContainer = messagesListRef.current;
    if (messagesContainer) {
      messagesContainer.addEventListener("scroll", onScroll);
      return () => {
        messagesContainer.removeEventListener("scroll", onScroll);
      };
    }
  }, []);

  useEffect(() => {
    if (showToastWorking) {
      toast.loading("Setting up your site...", { duration: Infinity, id: "chat-setup" });
    } else {
      toast.dismiss("chat-setup");
    }
  }, [showToastWorking]);

  // console.log({ site, page });

  const listPlaceholderRef = useRef<HTMLDivElement>(null);
  const handledToolResults = useRef(new Set<string>());

  const aiMsgClass = tx(
    "text-black/80 dark:text-upstart-200",
    generationState.isReady
      ? "bg-gradient-to-tr from-upstart-200/80 to-upstart-100 text-sm"
      : "bg-white/80 dark:bg-dark-800 text-fluid-sm backdrop-blur-md",
  );

  const siteRef = useRef(site);
  const pageRef = useRef(page);
  const generationStateRef = useRef(generationState);
  const userLanguageRef = useRef(userLanguage);
  const assetsRef = useRef(additionalAssets);

  useEffect(() => {
    siteRef.current = site;
    pageRef.current = page;
    generationStateRef.current = generationState;
    userLanguageRef.current = userLanguage;
    assetsRef.current = additionalAssets;
  }, [site, page, generationState, userLanguage, additionalAssets]);

  const initialMessages = useMemo(() => {
    if (generationState.isSetup) {
      return [
        {
          id: "init-setup",
          role: "user",
          parts: [
            {
              type: "text",
              text: `Create a website based on this prompt:\n${sitePrompt}`,
            },
          ],
        },
      ] satisfies UpstartUIMessage[];
    } else {
      return [
        {
          id: "init-edit",
          role: "assistant",
          parts: [
            {
              type: "text",
              text: `Hey! 👋\n\nReady to keep building? You can:
- Chat with me to make changes
- Use the visual editor for direct editing

What should we work on together? 🤖`,
            },
          ],
        },
      ] satisfies UpstartUIMessage[];
    }
  }, [generationState.isSetup, sitePrompt]);

  const onToolCall: ChatOnToolCallCallback<UpstartUIMessage> = ({ toolCall }) => {
    console.log("Tool call: %s: ", toolCall.toolName, toolCall);
    // The "done" tool is a special case that indicates the server has finished processing the request.
    // We need to handle it client-side and return the "result" for the tool call.
    // here, we just return true to indicate that we handled the tool call
    const toolResult = { tool: toolCall.toolName as keyof Tools, toolCallId: toolCall.toolCallId };

    switch (toolCall.toolName) {
      case "listThemes": {
        console.debug(
          "Cient tool call %s",
          toolCall.toolName,
          " replying with themes",
          siteRef.current.themes,
        );
        addToolResult({
          ...toolResult,
          output: siteRef.current.themes,
        });
        break;
      }
      case "getCurrentTheme": {
        console.debug(
          "Client tool call %s",
          toolCall.toolName,
          " replying with current theme ",
          siteRef.current.theme,
        );
        addToolResult({
          ...toolResult,
          output: siteRef.current.theme,
        });
        break;
      }
      case "listImages": {
        console.debug("Client tool call %s", toolCall.toolName, " replying with images ", assetsRef.current);
        addToolResult({
          ...toolResult,
          output: assetsRef.current ?? [],
        });
        break;
      }
      case "getSitemap": {
        console.debug(
          "Client tool call %s",
          toolCall.toolName,
          " replying with sitemap ",
          siteRef.current.sitemap,
        );
        addToolResult({
          ...toolResult,
          output: siteRef.current.sitemap,
        });
        break;
      }
      case "getSiteAttributes": {
        console.debug(
          "Client tool call %s",
          toolCall.toolName,
          " replying with site attributes ",
          siteRef.current.attributes,
        );
        addToolResult({
          ...toolResult,
          output: siteRef.current.attributes,
        });
        break;
      }

      case "getSection": {
        const input = toolCall.input as Tools["getSection"]["input"];
        console.debug(
          "Client tool call %s",
          toolCall.toolName,
          " replying with section ",
          input.id,
          pageRef.current.sections,
        );
        addToolResult({
          ...toolResult,
          output:
            pageRef.current.sections.find((s) => s.id === input.id) ??
            `Section with id '${input.id}' not found`,
        });
        break;
      }
      case "listSections": {
        console.debug(
          "Client tool call %s",
          toolCall.toolName,
          " replying with sections ",
          pageRef.current.sections,
        );
        addToolResult({
          ...toolResult,
          output: pageRef.current.sections,
        });
        break;
      }

      case "deleteBrick": {
        const input = toolCall.input as Tools["deleteBrick"]["input"];
        draftHelpers.deleteBrick(input.id);
        addToolResult({
          ...toolResult,
          output: true,
        });
        break;
      }

      default:
        if (toolCall.toolName.startsWith("get") || toolCall.toolName.startsWith("list")) {
          console.log("UNHANDLED TOOL CALL client-side", toolCall.toolName);
        }
    }
  };

  const { messages, sendMessage, error, status, regenerate, stop, addToolResult } = useChat<UpstartUIMessage>(
    {
      // resume: generationState.isReady === false,
      transport: new DefaultChatTransport({
        api: "/editor/chat",
        credentials: "include",
        body: () => ({
          callContext: {
            site: siteRef.current,
            page: pageRef.current,
            generationState: generationStateRef.current,
            userLanguage: userLanguageRef.current,
            assets: assetsRef.current,
          },
        }),
      }),
      sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
      messages: initialMessages,
      // generateId: createIdGenerator({
      //   prefix: "ups",
      //   separator: "_",
      //   size: 16,
      // }),
      onError: (error) => {
        console.error("ERROR", error);
      },
      // id: `chat-${site.id}`,
      /**
       * For tools that should be called client-side
       */
      onToolCall,
    },
  );
  const promptRef = useRef<HTMLTextAreaElement>(null);
  const messagesListRef = useRef<HTMLDivElement>(null);

  const onSubmit = (e: Event | FormEvent) => {
    e.preventDefault();
    sendMessage({ text: input });
    setInput("");
    if (promptRef?.current) {
      promptRef.current.focus();
    }
  };

  const debouncedScroll = useDebounceCallback(() => {
    // when messages change, scroll to the bottom
    if (listPlaceholderRef.current && !hasScrolledUp) {
      // Only autoscroll if user hasn't scrolled up or is already near the bottom
      listPlaceholderRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, 300);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(debouncedScroll, [status, messages, hasScrolledUp]);

  useEffect(() => {
    if (userLanguage) return;
    for (const msg of messages) {
      if (msg.metadata?.userLanguage) {
        console.log("Setting user language to", msg.metadata.userLanguage);
        setUserLanguage(msg.metadata.userLanguage);
        break;
      }
    }
  }, [messages, userLanguage]);

  // console.log({ messages });

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (setupRef.current) return;
    setupRef.current = true;
    if (generationState.isReady === false) {
      console.log("Chat initialized", { sitePrompt });
      regenerate();
    }
  }, []);

  const toolInvocations = useMemo(() => {
    const results = messages
      .filter((msg) => msg.role === "assistant")
      .flatMap((msg) => msg.parts as ToolUIPart<Tools>[])
      .filter((part) => part.type.startsWith("tool-"))
      .filter(
        (part) => part.state === "output-available" && !handledToolResults.current.has(part.toolCallId),
      );
    return results;
  }, [messages]);

  const hasRunningTools = useMemo(() => {
    const results = messages
      .filter((msg) => msg.role === "assistant")
      .flatMap((msg) => msg.parts as ToolUIPart<Tools>[])
      .filter((part) => part.type.startsWith("tool-"))
      .filter((part) => part.state !== "output-available" && part.state !== "output-error");
    return results.length > 0;
  }, [messages]);

  useDeepCompareEffect(() => {
    for (const toolInvocation of toolInvocations.filter((t) => t.state === "output-available")) {
      if (handledToolResults.current.has(toolInvocation.toolCallId)) {
        continue;
      }
      handledToolResults.current.add(toolInvocation.toolCallId);
      switch (toolInvocation.type) {
        case "tool-createPage": {
          const page = toolInvocation.output;
          console.log("Generated page", page);
          draftHelpers.addPage({ ...page, version: crypto.randomUUID(), sections: [] });
          break;
        }

        case "tool-createNavbar":
          console.log("Generated navbar", toolInvocation.output);
          draftHelpers.updateSiteAttributes({
            navbar: toolInvocation.output,
          });
          break;

        case "tool-createFooter":
          console.log("Generated footer", toolInvocation.output);
          draftHelpers.updateSiteAttributes({
            footer: toolInvocation.output,
          });
          break;

        case "tool-createThemes": {
          const themes = toolInvocation.output;
          console.log("Generated themes", themes);
          draftHelpers.setThemes(themes);
          break;
        }

        case "tool-createDatasource": {
          const datasource = toolInvocation.output;
          console.log("Generated datasource", datasource);
          draftHelpers.addDatasource(defineDatasource(datasource));
          break;
        }

        case "tool-createDatarecord": {
          const datarecord = toolInvocation.output;
          console.log("Generated data record", datarecord);
          draftHelpers.addDatarecord(defineDataRecord(datarecord));
          break;
        }

        case "tool-createSitemap": {
          const sitemap = toolInvocation.output;
          console.log("Generated sitemap", sitemap);
          draftHelpers.setSitemap(sitemap);
          break;
        }

        case "tool-createSiteAttributes": {
          const siteAttributes = toolInvocation.output;
          console.log("Generated site attributes", siteAttributes);
          draftHelpers.updateSiteAttributes(siteAttributes);
          break;
        }

        case "tool-createSiteQueries": {
          const queries = toolInvocation.output;
          console.log("Generated site queries", queries);
          draftHelpers.updateSiteAttributes({
            queries: [...(site.attributes.queries ?? []), ...queries],
          });
          break;
        }

        case "tool-editSiteQueries": {
          const queries = toolInvocation.output;
          console.log("Edited site queries", queries);
          draftHelpers.updateSiteAttributes({
            queries: [...(site.attributes.queries ?? []), ...queries],
          });
          break;
        }

        case "tool-createPageQueries": {
          const queries = toolInvocation.output;
          console.log("Generated page queries", queries);
          draftHelpers.updatePageAttributes({
            ...page.attributes,
            queries: [...(page.attributes.queries ?? []), ...queries],
          });
          break;
        }

        case "tool-editPageQueries": {
          const queries = toolInvocation.output;
          console.log("Edited page queries", queries);
          draftHelpers.updatePageAttributes({
            ...page.attributes,
            queries: [...(page.attributes.queries ?? []), ...queries],
          });
          break;
        }

        case "tool-createSection": {
          const section = toolInvocation.output;
          console.log("Generated section", section);
          // @ts-expect-error Bricks overwrite
          draftHelpers.addSection({ bricks: [], ...section });
          break;
        }

        case "tool-createBrick": {
          const brick = toolInvocation.output;
          console.log("Generated brick", brick);
          const { sectionId, index } = toolInvocation.input;
          draftHelpers.addBrick(brick, sectionId, index);
          break;
        }

        case "tool-editBrick": {
          draftHelpers.updateBrickProps(toolInvocation.input.id, toolInvocation.output.props);
          break;
        }

        case "tool-deleteBrick": {
          const { id } = toolInvocation.input;
          draftHelpers.deleteBrick(id);
          break;
        }

        case "tool-searchImages": {
          const images = toolInvocation.output;
          console.log("Generated images", images);
          draftHelpers.addAdditionalAssets(images);
          break;
        }

        default:
          console.log("Default tool invocation", toolInvocation.type, toolInvocation);
          break;
      }
    }
  }, [toolInvocations, draftHelpers, siteThemes]);

  // filter out the "init" messages
  const displayedMessages = messages.filter((msg) => msg.id !== "init-setup" && msg.parts.length > 0);

  return (
    <div
      className={tx(
        "flex flex-col mx-auto w-full",
        {
          "rounded-xl h-[calc(100%-6rem)] max-h-[calc(100%-6rem)] my-[3rem] ":
            generationState.isReady === false,
          "rounded-tr-xl bg-gray-50 max-h-[inherit]": generationState.isReady === true,
        },
        css({
          gridArea: "chat",
          maxWidth: generationState.isReady ? "none" : "clamp(500px, 60dvw, 740px)",
        }),
        generationState.isReady === false &&
          css({
            // boxShadow: "rgba(100, 100, 111, 0.3) 0px 0px 36px 0px",
            // padding: "12px",
          }),
      )}
    >
      <div
        ref={messagesListRef}
        className={tx(
          ` overflow-y-auto h-[calc(100cqh-250px-6rem)]
            flex flex-col gap-y-2.5 flex-grow scroll-smooth relative transition-all duration-300`,
          {
            "rounded-tr-xl shadow-inner": generationState.isReady === true,
            "rounded-xl": generationState.isReady === false,
            "p-2": generationState.isReady === true,
            "p-0": generationState.isReady === false,
          },
          css({
            scrollbarWidth: "none",
            // scrollbarColor: "var(--violet-a8) var(--violet-a2)",
            // scrollbarColor: "var(--violet-4) var(--violet-2)",
            // scrollbarGutter: "stable",
          }),
        )}
      >
        {displayedMessages.map((msg, index) => (
          <div
            key={msg.id}
            data-message-id={msg.id}
            className={tx(msg.role === "assistant" ? aiMsgClass : userMsgClass, msgCommon, "empty:hidden")}
          >
            {msg.parts.map((part, i) => {
              if (part.type.startsWith("tool-")) {
                return (
                  <ToolRenderer
                    key={i}
                    toolPart={part as ToolUIPart<Tools>}
                    addToolResult={addToolResult}
                    sendMessage={sendMessage}
                    error={error}
                  />
                );
              }

              switch (part.type) {
                case "dynamic-tool": {
                  // console.log("Dynamic tool part", part);
                  return null;
                }
                case "text":
                  return (
                    <Suspense key={i}>
                      <Markdown content={part.text} key={i} />
                    </Suspense>
                  );

                // case "source":
                //   // @ts-ignore
                //   if (part.sourceType === "images") {
                //     return (
                //       <ImagesPreview
                //         key={i}
                //         // @ts-ignore
                //         query={part.source.query as string}
                //         // @ts-ignore
                //         images={part.source.images as SimpleImageMetadata[]}
                //       />
                //     );
                //   }
                //   return <p key={i}>{JSON.stringify(part)}</p>;

                case "reasoning":
                  if (!debug) {
                    // Only show reasoning in debug mode
                    return null;
                  }
                  return (
                    <div key={i} className="flex items-center gap-1.5">
                      <details>
                        <summary className="cursor-pointer list-none flex gap-1 items-center">
                          <svg
                            className="-rotate-90 transform opacity-60 transition-all duration-300"
                            fill="none"
                            height="14"
                            width="14"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <title>Arrow</title>
                            <polyline points="6 9 12 15 18 9" />
                          </svg>
                          <span className="text-xs font-normal">Thinking...</span>
                        </summary>
                        <Text
                          as="div"
                          size="2"
                          className="text-gray-500 mt-2 ml-2 border-l-2 border-gray-300 pl-3"
                        >
                          <Markdown content={part.text} />
                        </Text>
                      </details>
                    </div>
                  );

                // case "file":
                //   return <img key={i} alt="" src={`data:${part.mediaType};base64,${part.url}`} />;
              }
            })}

            <AnimatePresence initial={false}>
              {index === displayedMessages.length - 1 &&
                !hasRunningTools &&
                (status === "submitted" || status === "streaming") && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "1.5rem" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className={tx(
                      "p-4 my-4 text-fluid-sm text-gray-600 flex items-center justify-center gap-1.5 backdrop-blur-md bg-white/80 max-w-fit mx-auto rounded-lg",
                    )}
                  >
                    <Spinner size="2" /> Please wait...
                  </motion.div>
                )}
            </AnimatePresence>
          </div>
        ))}

        {error && (
          <div className={tx(msgCommon, "bg-red-200 text-red-800 text-sm")}>
            <p>An error occured. {error.message ?? "Please retry."}</p>
            <button
              type="button"
              className={tx(
                "rounded bg-red-700 text-white border border-red-600 hover:opacity-90 block w-full text-center font-semibold py-1 px-2",
              )}
              onClick={() => {
                regenerate();
              }}
            >
              Retry
            </button>
          </div>
        )}
        <div ref={listPlaceholderRef} className={tx("h-2")} aria-label="separator" aria-hidden />
      </div>
      <form
        onSubmit={onSubmit}
        className={tx(
          "flex flex-col flex-1 min-h-[150px] max-h-[150px] gap-1.5 p-2 justify-center mt-2",
          "bg-upstart-100 border-t border-upstart-300 relative",
          // generationState.isReady === false && "hidden",
          generationState.isReady === false && "rounded-lg",
          // "[&:has(textarea:focus)]:(ring-2 ring-upstart-700)",
        )}
      >
        <textarea
          onChange={(e) => setInput(e.target.value)}
          ref={promptRef}
          value={input}
          // biome-ignore lint/a11y/noAutofocus: <explanation>
          autoFocus
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) onSubmit(e);
          }}
          name="prompt"
          // disabled={messagingDisabled}
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          placeholder={
            messages.some((m) => m.role === "user")
              ? undefined
              : "Add a section just below the navbar containing a paragraph with a short description of the site."
          }
          className={tx(
            "form-textarea ",
            generationState.isReady === false ? "!text-fluid-sm" : "text-sm",
            "h-full w-full rounded scrollbar-thin p-2 !bg-white !pb-9 border-upstart-300 shadow-inner focus:(!outline-0 !ring-upstart-500 !border-upstart-500)",
          )}
        />
        <div
          className={tx(
            "flex justify-between items-center h-9 text-gray-500 absolute left-[9px] right-[9px] rounded bottom-2.5 px-2 z-50 bg-white",
          )}
        >
          <button type="button" className={tx("hover:bg-upstart-200 p-1 rounded inline-flex text-sm gap-1")}>
            <IoIosAttach className="h-5 w-5" />
          </button>
          {generationState.isReady && WEB_SEARCH_ENABLED && (
            <label className={tx("inline-flex items-center gap-1 text-[80%] select-none")}>
              <Switch
                name="allow_web_search"
                size={"1"}
                onCheckedChange={() => {
                  promptRef.current?.focus();
                }}
              />{" "}
              Allow web search
            </label>
          )}
          {status === "submitted" || status === "streaming" ? (
            <Button
              type="button"
              size={"1"}
              className={tx("flex items-center justify-center gap-0.5")}
              onClick={stop}
            >
              <BiStopCircle className="text-lg" />
            </Button>
          ) : (
            <Button
              type="submit"
              size={"1"}
              className={tx("flex items-center gap-0.5")}
              disabled={hasRunningTools}
            >
              <TbSend2 className="text-lg" />
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}

function ImagesPreview({ query, images }: { query: string; images: SimpleImageMetadata[] }) {
  return (
    <div className="basis-full flex flex-col gap-2 mt-1 mb-6 text-sm ml-6 font-normal">
      <div className="grid grid-cols-3 gap-1 min-h-60 max-h-60">
        {images.map((image, index) => (
          <div
            key={image.url}
            className={tx(
              "rounded-md relative z-10 hover:z-50 hover:(scale-110 shadow-2xl) transition-transform duration-150",
            )}
          >
            <img
              key={image.url}
              src={image.url}
              alt={image.description}
              className={tx(
                "rounded-md h-auto !object-cover object-center w-full aspect-video",
                css({
                  // animation delay
                  animationDelay: `${index * 100}ms`,
                }),
              )}
              loading="lazy"
            />
            {image.user?.name && (
              <div className="absolute px-1.5 bottom-0 left-0 right-0 bg-black/50 text-white text-[0.6rem] p-0.5 rounded-b-md truncate capitalize">
                By{" "}
                {image.user.profile_url ? (
                  <a
                    href={image.user.profile_url}
                    target="_blank"
                    rel="noreferrer"
                    className="underline hover:text-upstart-300"
                  >
                    {image.user.name}
                  </a>
                ) : (
                  image.user.name
                )}{" "}
                / {image.provider}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const hiddenTools = ["setUserLanguage", "getUserLanguage"];

function ToolRenderer({
  toolPart,
  sendMessage,
  addToolResult,
  error,
}: {
  toolPart: ToolUIPart<Tools>;
  error?: Error;
  addToolResult: UseChatHelpers<UpstartUIMessage>["addToolResult"];
  sendMessage: UseChatHelpers<UpstartUIMessage>["sendMessage"];
}) {
  const debug = useDebugMode();
  // Some tools are not meant to be displayed in the chat, like the "setUserLanguage" tool
  if (hiddenTools.includes(toolPart.type)) {
    return null;
  }
  // If there is an error, don't show pending tool invocations
  if (error) {
    return null;
  }
  if (toolPart.type === "tool-askUserChoice" && toolPart.state !== "input-streaming") {
    return (
      <Suspense key={toolPart.toolCallId}>
        <AnimatePresence initial={false}>
          {toolPart.state === "input-available" ? (
            <motion.div
              className="choices"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4 }}
            >
              {toolPart.input.question && (
                <div className="basis-full">
                  <Markdown content={toolPart.input.question} />
                </div>
              )}
              {toolPart.input.choices.map((choice, i) => {
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      console.log("addtoolresult to part", toolPart);
                      addToolResult({
                        tool: "askUserChoice",
                        toolCallId: toolPart.toolCallId,
                        output: choice,
                      });
                      // sendMessage({
                      //   text: choice,
                      // });
                    }}
                  >
                    {choice}
                  </button>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              className="choices"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4 }}
            >
              {toolPart.input?.question && (
                <div className="basis-full">
                  <Markdown content={toolPart.input.question} />
                </div>
              )}
              <div className="basis-full text-right italic text-gray-800">{toolPart.output}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </Suspense>
    );
  }

  if (toolPart.type !== "tool-askUserChoice" && toolPart.input && "waitingMessage" in toolPart.input) {
    return (
      <AnimatePresence initial={false}>
        {toolPart.state === "input-available" ? (
          <motion.div
            className="flex items-center gap-1.5 font-medium flex-wrap"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Spinner size="1" className="w-4 mx-0.5" />
            <span>{toolPart.input.waitingMessage}</span>
          </motion.div>
        ) : toolPart.state === "output-available" ? (
          <motion.div
            className="flex items-center gap-1.5 flex-wrap font-medium"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <MdDone className="w-4 h-4 text-green-600" />
            <span>{toolPart.input.waitingMessage}</span>
            <details className="cursor-pointer basis-full">
              <summary className="cursor-pointer list-none flex gap-1 items-center">
                <svg
                  className="-rotate-90 transform opacity-60 transition-all duration-300"
                  fill="none"
                  height="14"
                  width="14"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <title>Arrow</title>
                  <polyline points="6 9 12 15 18 9" />
                </svg>
                <span className="text-xs font-normal">View tool call</span>
              </summary>
              <pre className="whitespace-pre-wrap text-xs">
                {JSON.stringify({ input: toolPart.input, output: toolPart.output }, null, 2)}
              </pre>
            </details>
            {/* {toolPart.type === "tool-searchImages" && (
              <ImagesPreview
                key={toolPart.toolCallId}
                query={toolPart.input.query}
                images={toolPart.output}
              />
            )} */}
          </motion.div>
        ) : toolPart.state === "output-error" ? (
          <motion.div
            className="flex items-center gap-1.5 font-medium"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <MdDone className="w-4 h-4 text-red-600" />
            <span>
              {toolPart.input.waitingMessage} (Error: {toolPart.errorText})
            </span>
          </motion.div>
        ) : null}
      </AnimatePresence>
    );
  }

  if (debug) {
    const codeClassName = tx(
      css({
        display: "block",
        fontFamily: "monospace",
        fontSize: "0.7rem",
        lineHeight: "1.3",
        wordWrap: "break-word",
        whiteSpace: "pre-wrap",
      }),
    );
    return (
      <details>
        <summary className="cursor-pointer list-none flex gap-1 items-center">
          <svg
            className="-rotate-90 transform opacity-60 transition-all duration-300"
            fill="none"
            height="14"
            width="14"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <title>Arrow</title>
            <polyline points="6 9 12 15 18 9" />
          </svg>
          <span className="text-xs font-normal">
            Tool: {toolPart.type} ({toolPart.state})
          </span>
        </summary>
        <pre className={codeClassName}>{JSON.stringify(toolPart, null, 2)}</pre>
      </details>
    );
  }

  // if (toolPart.input?.message) {
  //   return <Markdown content={toolPart.args.message} />;
  // }
  return null;
}

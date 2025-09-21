import { tx, css } from "@upstart.gg/style-system/twind";
import { toast } from "@upstart.gg/style-system/system";
import { motion, AnimatePresence } from "motion/react";
import { type ChatOnToolCallCallback, DefaultChatTransport, type ToolUIPart } from "ai";
import { useChat } from "@ai-sdk/react";
import { type FormEvent, useEffect, useMemo, useRef, useState, Suspense } from "react";
import {
  useAdditionalAssets,
  useDraftHelpers,
  useGenerationState,
  usePage,
  useSite,
  useSitePrompt,
  useThemes,
} from "../../hooks/use-page-data";
import { useDebounceCallback } from "usehooks-ts";
import { Spinner } from "@upstart.gg/style-system/system";
import { defineDataRecord } from "@upstart.gg/sdk/shared/datarecords";
import { useDeepCompareEffect } from "use-deep-compare";
import { useDebugMode } from "../../hooks/use-editor";
import { defineDatasource } from "@upstart.gg/sdk/shared/datasources";
import type { Tools, UpstartUIMessage } from "@upstart.gg/sdk/shared/ai/types";
import Markdown from "../Markdown";
import ChatBox from "./ChatBox";
import ChatReasoningPart from "./ChatReasoningPart";
import ToolRenderer from "./ChatToolRenderer";

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
      // sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
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
  const messagesListRef = useRef<HTMLDivElement>(null);

  const onSubmit = (e: Event | FormEvent) => {
    e.preventDefault();
    sendMessage({ text: input });
    setInput("");
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
  const displayedMessages = messages.filter(
    (msg) =>
      msg.id !== "init-setup" &&
      msg.parts.some(
        (part) => part.type === "text" || part.type === "reasoning" || part.type.startsWith("tool-"),
      ),
  );

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
                case "text":
                  return (
                    <Suspense key={i}>
                      <Markdown content={part.text} key={i} />
                    </Suspense>
                  );

                case "reasoning":
                  return debug ? <ChatReasoningPart key={i} part={part} /> : null;
              }
            })}
          </div>
        ))}

        <AnimatePresence initial={false}>
          {!hasRunningTools && (status === "submitted" || status === "streaming") && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "1.5rem" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className={tx(
                "p-4 my-4 text-fluid-sm text-gray-700 flex items-center justify-center gap-1.5 backdrop-blur-md bg-white/70 max-w-fit mx-auto rounded-md",
              )}
            >
              <Spinner size="2" /> Please wait...
            </motion.div>
          )}
        </AnimatePresence>

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
      <ChatBox
        input={input}
        setInput={setInput}
        onSubmit={onSubmit}
        status={status}
        hasRunningTools={hasRunningTools}
        stop={stop}
        messages={messages}
      />
    </div>
  );
}

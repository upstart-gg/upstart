import { tx, css } from "@upstart.gg/style-system/twind";
import { Button, TextArea, Text, Switch } from "@upstart.gg/style-system/system";
import { motion, AnimatePresence } from "motion/react";
import { TbSend2 } from "react-icons/tb";
import { IoIosAttach } from "react-icons/io";
import { type CreateMessage, type Message, useChat } from "@ai-sdk/react";
import { type FormEvent, useCallback, useEffect, useMemo, useRef, useState, lazy, Suspense } from "react";
import { createIdGenerator, type ToolInvocation } from "ai";
import {
  useDraftHelpers,
  useGenerationState,
  usePage,
  useSite,
  useSitemap,
  useSitePrompt,
  useThemes,
} from "../hooks/use-page-data";
import { MdDone } from "react-icons/md";
import { useDebounceCallback } from "usehooks-ts";
import { Spinner } from "@upstart.gg/style-system/system";
import { BiStopCircle } from "react-icons/bi";
import { type Theme, processTheme } from "@upstart.gg/sdk/shared/theme";
import type { CallContextProps } from "@upstart.gg/sdk/shared/context";
import { defineDataRecord } from "@upstart.gg/sdk/shared/datarecords";
import { useDeepCompareEffect } from "use-deep-compare";
import type { ImageSearchResultsType, SimpleImageMetadata } from "@upstart.gg/sdk/shared/images";
import type { Page } from "@upstart.gg/sdk/shared/page";
import type { Sitemap } from "@upstart.gg/sdk/shared/sitemap";
import { useEditorHelpers } from "../hooks/use-editor";
import { defineDatasource } from "@upstart.gg/sdk/shared/datasources";
import type { SiteAttributes } from "@upstart.gg/sdk/shared/attributes";

const WEB_SEARCH_ENABLED = false;

// Lazy import "Markdown"
const Markdown = lazy(() => import("./Markdown"));

const msgCommon = tx(
  "rounded-lg px-2.5 py-2 text-pretty transition-all duration-300 flex flex-col gap-1.5",
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
  const { setImagesSearchResults } = useEditorHelpers();
  const generationState = useGenerationState();
  const site = useSite();
  const page = usePage();
  const sitemap = useSitemap();
  const siteThemes = useThemes();
  const [userLanguage, setUserLanguage] = useState<string>();
  // const [flow, setFlow] = useState<CallContextProps["flow"]>(
  //   new URL(window.location.href).searchParams.get("action") === "setup" ? "setup" : "edit",
  // );

  const listPlaceholderRef = useRef<HTMLDivElement>(null);
  const handledToolResults = useRef(new Set<string>());

  const aiMsgClass = tx(
    "text-black/80 dark:text-upstart-200",
    generationState.isReady
      ? "bg-gradient-to-tr from-upstart-200/80 to-upstart-100 text-sm"
      : "bg-white/80 dark:bg-dark-800 text-fluid-sm",
  );

  const onFinish = useCallback(
    (message: Message, options: unknown) => {
      console.log("message finished", message, options);
      console.log("Generation state after message finish", generationState);
    },
    [generationState],
  );

  const {
    messages,
    handleInputChange,
    handleSubmit,
    error,
    status,
    reload,
    append,
    stop,
    data,
    setData,
    addToolResult,
    id,
    metadata,
    experimental_resume,
  } = useChat({
    api: "/editor/chat",
    // sendExtraMessageFields: true,
    // maxSteps: 30,
    initialMessages:
      generationState.isReady === false
        ? [
            {
              id: "init-generate",
              role: "user",
              content: `Create a website based on this prompt:\n${sitePrompt}`,
            },
          ]
        : [
            {
              id: "init-edit",
              role: "assistant",
              content: `Hey! 👋\n\nReady to keep building? You can:
- Chat with me to make changes
- Use the visual editor for direct editing

What should we work on together? 🤖`,
            },
          ],
    credentials: "include",
    experimental_prepareRequestBody({ requestData, ...rest }) {
      return {
        ...rest,
        requestData: { site, sitemap, page, generationState, userLanguage } satisfies CallContextProps,
      };
    },
    generateId: createIdGenerator({
      prefix: "ups",
      separator: "_",
      size: 16,
    }),
    onFinish,
    onError: (error) => {
      console.error("ERROR", error);
    },
    key: `chat-${generationState.isReady}-${site.id}`,

    /**
     * For tools that should be called client-side
     */
    onToolCall: ({ toolCall }) => {
      console.log("Tool call: %s: ", toolCall.toolName, toolCall);
      // The "done" tool is a special case that indicates the server has finished processing the request.
      // We need to handle it client-side and return the "result" for the tool call.
      // here, we just return true to indicate that we handled the tool call
      if (toolCall.toolName === "done") {
        return true;
      }
    },
  });
  const promptRef = useRef<HTMLTextAreaElement>(null);
  const messagesListRef = useRef<HTMLDivElement>(null);

  const onSubmit = useCallback(
    (e: Event | FormEvent) => {
      e.preventDefault();
      handleSubmit();
      if (promptRef?.current) {
        promptRef.current.value = "";
        promptRef.current.focus();
      }
    },
    [handleSubmit],
  );

  const debouncedScroll = useDebounceCallback(() => {
    // when messages change, scroll to the bottom
    if (listPlaceholderRef.current) {
      listPlaceholderRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, 300);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(debouncedScroll, [status, data, messages]);

  useDeepCompareEffect(() => {
    data?.forEach((item) => {
      if (typeof item === "object" && !Array.isArray(item) && item?.userLanguage) {
        setUserLanguage(item.userLanguage as string);
      }
    });
  }, [data]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (setupRef.current) return;
    setupRef.current = true;
    if (generationState.isReady === false) {
      console.log("Chat initialized", { sitePrompt });
      reload();
    }
  }, []);

  const toolInvocations = useMemo(() => {
    const results = messages
      .filter((msg) => msg.role === "assistant")
      .flatMap((msg) => msg.parts)
      .filter((part) => part.type === "tool-invocation")
      .map((part) => part.toolInvocation)
      .filter(
        (toolInvocation) =>
          toolInvocation.state === "result" && !handledToolResults.current.has(toolInvocation.toolCallId),
      );
    return results;
  }, [messages]);

  const hasRunningTools = useMemo(() => {
    const results = messages
      .filter((msg) => msg.role === "assistant")
      .flatMap((msg) => msg.parts)
      .filter((part) => part.type === "tool-invocation")
      .map((part) => part.toolInvocation)
      .filter((toolInvocation) => toolInvocation.state !== "result");
    return results.length > 0;
  }, [messages]);

  const messagingDisabled = status === "streaming" || status === "submitted" || hasRunningTools;

  useDeepCompareEffect(() => {
    for (const toolInvocation of toolInvocations.filter((t) => t.state === "result")) {
      if (handledToolResults.current.has(toolInvocation.toolCallId)) {
        continue;
      }
      handledToolResults.current.add(toolInvocation.toolCallId);
      switch (toolInvocation.toolName) {
        case "generatePage": {
          const result = toolInvocation.result as { page: Page } | { error: string };
          if ("error" in result) {
            console.error("Error generating page:", result.error);
            return;
          }
          console.log("Generated page", result.page);
          draftHelpers.addPage({ ...result.page, version: crypto.randomUUID() });
          break;
        }

        case "generateThemes": {
          const themes = toolInvocation.result as Theme[];
          console.log("Generated themes", themes);
          draftHelpers.setThemes(themes);
          break;
        }

        case "generateDatasource": {
          const datasource = toolInvocation.result as Parameters<typeof draftHelpers.addDatasource>[0];
          console.log("Generated datasource", datasource);
          draftHelpers.addDatasource(defineDatasource(datasource));
          break;
        }

        case "generateDatarecord": {
          const datarecord = toolInvocation.result as Parameters<typeof draftHelpers.addDatarecord>[0];
          console.log("Generated data record", datarecord);
          draftHelpers.addDatarecord(defineDataRecord(datarecord));
          break;
        }

        case "generateSitemap": {
          const sitemap = toolInvocation.result as Sitemap;
          console.log("Generated sitemap", sitemap);
          draftHelpers.setSitemap(sitemap);
          break;
        }
        case "generateSiteAttributes": {
          const siteAttributes = toolInvocation.result as SiteAttributes;
          console.log("Generated site attributes", siteAttributes);
          draftHelpers.updateSiteAttributes(siteAttributes);
          break;
        }

        case "searchImages": {
          const images = toolInvocation.result as ImageSearchResultsType;
          console.log("Generated images", images);
          setImagesSearchResults(images);
          break;
        }

        default:
          console.log("Default tool invocation", toolInvocation.toolName, toolInvocation);
          break;
      }
    }
  }, [toolInvocations, draftHelpers, siteThemes]);

  // filter out the "init" messages
  const displayedMessages = messages.filter((msg) => msg.id !== "init-generate" && msg.parts.length > 0);

  return (
    <div
      className={tx(
        "flex flex-col mx-auto w-full",
        {
          "rounded-xl animate-border h-[calc(100%-6rem)] max-h-[calc(100%-6rem)] my-[3rem]":
            generationState.isReady === false,
          "rounded-tr-xl bg-gray-50 max-h-[inherit]": generationState.isReady === true,
        },
        css({
          gridArea: "chat",
          maxWidth: generationState.isReady ? "none" : "clamp(500px, 40dvw, 640px)",
        }),
        generationState.isReady === false &&
          css({
            scrollbarColor: "var(--violet-4) var(--violet-2)",
            border: "2px solid transparent",
            boxShadow: "rgba(100, 100, 111, 0.3) 0px 0px 36px 0px",
            // padding: "12px",
            background: `linear-gradient(#ffffff, #ffffff) padding-box, linear-gradient(var(--border-angle), transparent 15%, #9291e7, #7270c6, #c050c2, #ef50a2, #ff6285, #ff806b, #ffa25a, #ffc358, transparent 85%) border-box`,
          }),
      )}
    >
      <div
        ref={messagesListRef}
        className={tx(
          // h-full max-h-[calc(100cqh-250px)]
          ` overflow-y-auto h-[calc(100cqh-250px-6rem)]
            flex flex-col gap-y-2.5 flex-grow scroll-smooth scrollbar-thin relative`,
          {
            "rounded-tr-xl shadow-inner": generationState.isReady === true,
            "p-2": generationState.isReady === true,
            "p-6 pb-12": generationState.isReady === false,
          },
          css({
            scrollbarColor: "var(--violet-a8) var(--violet-a2)",
            // scrollbarColor: "var(--violet-4) var(--violet-2)",
            // scrollbarGutter: "stable",
          }),
        )}
      >
        {displayedMessages.map((msg, index) => (
          <div
            key={msg.id}
            className={tx(msg.role === "assistant" ? aiMsgClass : userMsgClass, msgCommon, "empty:hidden")}
          >
            {msg.parts.map((part, i) => {
              switch (part.type) {
                case "text":
                  return (
                    <Suspense key={i}>
                      <Markdown content={part.text} key={i} />
                    </Suspense>
                  );

                case "source":
                  // @ts-ignore
                  if (part.source.sourceType === "images") {
                    return (
                      <ImagesPreview
                        key={i}
                        // @ts-ignore
                        query={part.source.query as string}
                        // @ts-ignore
                        images={part.source.images as SimpleImageMetadata[]}
                      />
                    );
                  }
                  return <p key={i}>{JSON.stringify(part)}</p>;
                case "reasoning":
                  if (index !== messages.length - 1 || msg.parts.length - 1 !== i) {
                    // If the last message is not the current one, we don't show the reasoning
                    return null;
                  }
                  return (
                    <p key={i} className="flex items-center gap-1.5">
                      <Spinner size="1" className="mr-1" />
                      <Text as="p" size="1" className="text-black/60">
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
                          <Text size="2" className="text-gray-500">
                            {part.reasoning}
                          </Text>
                        </details>
                      </Text>
                    </p>
                  );
                case "tool-invocation":
                  return (
                    <ToolRenderer
                      key={i}
                      toolInvocation={part.toolInvocation}
                      addToolResult={addToolResult}
                      append={append}
                      error={error}
                    />
                  );
                case "file":
                  return <img key={i} alt="" src={`data:${part.mimeType};base64,${part.data}`} />;
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
              className={tx("px-2 my-4 text-fluid-sm text-gray-600 flex items-center justify-center gap-1.5")}
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
                reload();
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
          "flex flex-col flex-1 min-h-[150px] max-h-[150px] gap-1.5 p-2 justify-center ",
          "bg-upstart-100 border-t border-upstart-300 relative",
          // generationState.isReady === false && "hidden",
          generationState.isReady === false && "rounded-b-xl",
          // "[&:has(textarea:focus)]:(ring-2 ring-upstart-700)",
        )}
      >
        <textarea
          ref={promptRef}
          // biome-ignore lint/a11y/noAutofocus: <explanation>
          autoFocus
          onChange={handleInputChange}
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
            generationState.isReady === false && "!text-fluid-sm",
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

const toolsWorkingLabels: Record<string, string> = {
  generateThemes: "Generating color themes",
  generateSitemap: "Generating site map",
  generateImages: "Generating images",
  setTheme: "Applying theme",
  searchImages: "Searching images",
};

function getToolWaitingLabel(toolInvocation: ToolInvocation) {
  if (toolInvocation.args?.waitingMessage) {
    return toolInvocation.args.waitingMessage;
  }
  switch (toolInvocation.toolName) {
    case "generatePage":
      return `Generating page '${toolInvocation.args.pageId}', this can take a while`;
    default:
      return toolsWorkingLabels[toolInvocation.toolName];
  }
}

function ImagesPreview({ query, images }: { query: string; images: SimpleImageMetadata[] }) {
  return (
    <div className="flex flex-col gap-2 my-3" key={query}>
      <span>I found those images on the web for query: "{query}"</span>
      <div className="grid grid-cols-3 gap-1 max-h-60 overflow-y-auto">
        {images.map((image, index) => (
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
        ))}
      </div>
    </div>
  );
}

const hiddenTools = ["setUserLanguage", "getUserLanguage"];

function ToolRenderer({
  toolInvocation,
  addToolResult,
  error,
  append,
}: {
  toolInvocation: ToolInvocation;
  error?: Error;
  addToolResult: ({
    toolCallId,
    result,
  }: {
    toolCallId: string;
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    result: any;
  }) => void;
  append: (message: Message | CreateMessage) => void;
}) {
  // Some tools are not meant to be displayed in the chat, like the "setUserLanguage" tool
  if (hiddenTools.includes(toolInvocation.toolName)) {
    return null;
  }
  // If there is an error, don't show pending tool invocations
  if (error) {
    return null;
  }
  if (toolInvocation.toolName === "askUserChoice") {
    const args = toolInvocation.args as {
      choices: string[];
      question?: string;
      allowMultiple?: boolean;
    };
    return (
      <Suspense key={toolInvocation.toolCallId}>
        <AnimatePresence initial={false}>
          {toolInvocation.state !== "result" ? (
            <motion.div
              className="choices"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4 }}
            >
              {args.question && (
                <div className="basis-full">
                  <Markdown content={args.question} />
                </div>
              )}
              {args.choices.map((choice, i) => {
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      addToolResult({
                        toolCallId: toolInvocation.toolCallId,
                        result: choice,
                      });
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
              {args.question && (
                <div className="basis-full">
                  <Markdown content={args.question} />
                </div>
              )}
              <div className="basis-full text-right italic text-gray-800">{toolInvocation.result}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </Suspense>
    );
  }
  const waitLabel = getToolWaitingLabel(toolInvocation);
  if (waitLabel) {
    return (
      <AnimatePresence initial={false}>
        {toolInvocation.state !== "result" ? (
          <motion.div
            className="flex items-center gap-1.5"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Spinner size="1" className="w-4 mx-0.5" />
            <span>{waitLabel}</span>
          </motion.div>
        ) : (
          <motion.div
            className="flex items-center gap-1.5"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <MdDone className="w-4 h-4 text-green-600" />
            <span>{waitLabel}</span>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  if (toolInvocation.args.message) {
    return <Markdown content={toolInvocation.args.message} />;
  }
  return null;
}

import { TextArea } from "@radix-ui/themes";
import { tx, css } from "@upstart.gg/style-system/twind";
import { Button, Text, Switch } from "@upstart.gg/style-system/system";
import { motion, AnimatePresence } from "motion/react";
import { TbSend2 } from "react-icons/tb";
import { IoIosAttach } from "react-icons/io";
import { type CreateMessage, type Message, useChat } from "@ai-sdk/react";
import { type FormEvent, useCallback, useEffect, useMemo, useRef, useState, lazy, Suspense } from "react";
import { createIdGenerator, type ToolInvocation } from "ai";
import {
  useDraftHelpers,
  useEditorHelpers,
  useGenerationState,
  useLastToolCall,
  useSerializedPage,
  useSerializedSite,
  useSitePrompt,
  useSiteReady,
  useTheme,
  useThemes,
} from "../hooks/use-editor";
import { MdDone } from "react-icons/md";

import { useDebounceCallback } from "usehooks-ts";
import { Spinner } from "@upstart.gg/style-system/system";
import { BiStopCircle } from "react-icons/bi";
import { type Theme, processTheme } from "@upstart.gg/sdk/shared/theme";
import { useDeepCompareEffect } from "use-deep-compare";
import type { ImageSearchResultsType } from "@upstart.gg/sdk/shared/images";
import type { GenericPageConfig } from "@upstart.gg/sdk/shared/page";

// Lazy import "Markdown"
// import Markdown from "./Markdown";
const Markdown = lazy(() => import("./Markdown"));

const msgCommon = tx(
  "rounded-lg text-sm px-2.5 py-2 text-pretty transition-all duration-300",
  css({
    // whiteSpace: "pre-line",
    "& > p:not(:has(+ul)):not(:last-child)": {
      marginBottom: "1rem",
    },
    "& ul": {
      listStyle: "outside",
      listStyleType: "square",
      paddingLeft: "1rem",
      marginTop: "0.25rem",
      marginBottom: "1rem",
    },
    "& ol": {
      listStyle: "outside",
      listStyleType: "decimal",
      paddingLeft: "1rem",
      marginTop: "0.25rem",
      marginBottom: "1rem",
    },
    "& div.choices": {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "space-between",
      gap: ".5rem",
      marginTop: "1rem",
      "&:not(:last-child)": {
        marginBottom: "1rem",
      },
      "& > button": {
        backgroundColor: "var(--violet-10)",
        color: "#fff",
        flexGrow: "1",
        padding: "0.3rem 0.7rem",
        borderRadius: "0.5rem",
        border: "none",
        fontSize: "0.8rem",
        "&:hover": {
          backgroundColor: "var(--violet-9)",
        },
      },
    },
  }),
);
const aiMsgClass = tx(
  "text-black/80 bg-gradient-to-tr from-upstart-200/80 to-upstart-100 dark:text-upstart-200",
);
const userMsgClass = tx(
  "text-gray-800 opacity-80 bg-gradient-to-tr from-gray-200/80 to-gray-100 w-fit max-w-[90%] dark:(bg-dark-900 text-white/70) self-end",
);

export default function Chat() {
  const siteReady = useSiteReady();
  const prompt = useSitePrompt();
  const setupRef = useRef(false);
  const draftHelpers = useDraftHelpers();
  const { setImagesSearchResults, setLastToolCall, clearLastToolCall } = useEditorHelpers();
  const generationState = useGenerationState();
  const page = useSerializedPage();
  const site = useSerializedSite();
  const siteThemes = useThemes();
  const theme = useTheme();
  const listPlaceholderRef = useRef<HTMLDivElement>(null);
  const handledToolResults = useRef(new Set<string>());
  const lastToolCall = useLastToolCall();

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
    addToolResult,
    id,
    metadata,
  } = useChat({
    api: "/editor/chat",
    headers: {
      "x-upstart-user-id": crypto.randomUUID(),
    },
    sendExtraMessageFields: true,
    maxSteps: 30,
    initialMessages:
      generationState.isReady === false
        ? [
            {
              id: "init-website",
              role: "user",
              content: `action:generate_website\n\nContext:\n${JSON.stringify(prompt, null, 2)}}\n\nStart by generating color themes for the website`,
            },
          ]
        : [],
    credentials: "include",
    experimental_prepareRequestBody({ requestData, ...rest }) {
      return { ...rest, requestData: { generationState, page, site, prompt } };
    },
    generateId: createIdGenerator({
      prefix: "ups",
      separator: "_",
      size: 16,
    }),
    onFinish: (message, options) => {
      console.log("message finished", message, options);
    },
    onError: (error) => {
      console.error("chat onError", error);
    },

    /**
     * For tools that should be called client-side
     */
    onToolCall: ({ toolCall }) => {
      console.log("Tool call: %s [%s]: ", toolCall.toolName, toolCall.toolCallId, toolCall);
      switch (toolCall.toolName) {
        case "set_theme":
        case "show_images": {
          setLastToolCall(toolCall.toolCallId);
          return true;
        }
        default: {
          // !WARNING: don't return anything for server-side tools otherwise it would override the tool result
        }
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
      listPlaceholderRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, 500);
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(debouncedScroll, [status, data, messages]);

  useEffect(() => {
    console.log("NEW CHAT DATA", data);
  }, [data]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (setupRef.current) return;
    setupRef.current = true;
    const url = new URL(window.location.href);
    if (url.searchParams.get("action") === "generate") {
      console.log("Chat initialized");
      reload();
    }
    //
  }, []);

  // useEffect(() => {
  //   const clickListener = (e: MouseEvent) => {
  //     // detect click on button
  //     if (e.target instanceof HTMLButtonElement && e.target.parentElement?.classList.contains("choices")) {
  //       // const text = e.target.innerText;
  //       // append({
  //       //   role: "user",
  //       //   content: text,
  //       // });
  //       const elements = messagesListRef.current?.querySelectorAll<HTMLDivElement>(".choices") ?? [];
  //       // reset all choices
  //       elements.forEach((el) => {
  //         el.style.setProperty("transition", "all 0.2s");
  //         el.style.setProperty("opacity", "0.1");
  //         el.style.setProperty("pointer-events", "none");
  //         // scale down
  //         el.style.setProperty("transform", "scale(0)");
  //       });
  //       setTimeout(() => {
  //         elements.forEach((el) => {
  //           el.remove();
  //         });
  //       }, 200);
  //     }
  //   };
  //   if (messagesListRef.current) {
  //     messagesListRef.current.addEventListener("click", clickListener);
  //   }
  //   return () => {
  //     if (messagesListRef.current) {
  //       messagesListRef.current.removeEventListener("click", clickListener);
  //     }
  //   };
  // }, []);

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

  useDeepCompareEffect(() => {
    for (const toolInvocation of toolInvocations.filter((t) => t.state === "result")) {
      if (handledToolResults.current.has(toolInvocation.toolCallId)) {
        continue;
      }
      switch (toolInvocation.toolName) {
        case "generatePage": {
          const page = toolInvocation.result as GenericPageConfig | { error: string };
          handledToolResults.current.add(toolInvocation.toolCallId);
          // if ("error" in page) {
          //   console.error("Error generating page:", page.error);
          //   return;
          // }
          console.log("Generated page", page);
          // draftHelpers.setSections(page.sections);
          break;
        }
        case "generateThemes": {
          const themes = toolInvocation.result as Theme[];
          const themesProcessed = themes.map(processTheme);
          console.log("Generated themes", themesProcessed);
          draftHelpers.setThemes(themesProcessed);
          handledToolResults.current.add(toolInvocation.toolCallId);
          break;
        }
        case "searchImages": {
          const images = toolInvocation.result as ImageSearchResultsType;
          console.log("Generated images", images);
          setImagesSearchResults(images);
          handledToolResults.current.add(toolInvocation.toolCallId);
          break;
        }

        default:
          console.log("Default tool invocation", toolInvocation.toolName, toolInvocation);
          handledToolResults.current.add(toolInvocation.toolCallId);
          break;
      }
    }
  }, [toolInvocations, draftHelpers, siteThemes]);

  // Check when last toolcall result has been updated outside the chat so that we can addToolResult()
  useEffect(() => {
    if (lastToolCall == null) return;
    if (handledToolResults.current.has(lastToolCall.id)) {
      return;
    }
    addToolResult({ toolCallId: lastToolCall.id, result: lastToolCall.result });
    clearLastToolCall();
  }, [lastToolCall, addToolResult, clearLastToolCall]);

  return (
    <div
      className={tx(
        "flex flex-col bg-gray-50",
        css({
          gridArea: "chat",
        }),
        generationState.isReady === false ? "rounded-xl mb-5" : "rounded-tr-xl",
      )}
    >
      <div
        ref={messagesListRef}
        className={tx(
          // h-full max-h-[calc(100cqh-250px)]
          `scrollbar-thin overflow-y-auto
           py-2 pl-2 pr-3 flex flex-col gap-y-2.5 flex-grow
           shadow-inner scroll-smooth relative`,
          {
            "rounded-tr-xl": generationState.isReady === true,
            "rounded-t-xl": !generationState.isReady,
          },
          css({
            // scrollbarColor: "var(--violet-a8) var(--violet-a2)",
            scrollbarGutter: "stable",
          }),
        )}
      >
        {messages
          // filter out the "init" messages
          .filter((msg) => msg.id.startsWith("init-") === false)
          .map((msg, index) => (
            <div key={msg.id} className={tx(msg.role === "assistant" ? aiMsgClass : userMsgClass, msgCommon)}>
              {msg.parts.map((part, i) => {
                switch (part.type) {
                  case "text":
                    return (
                      <Suspense key={i}>
                        <Markdown content={part.text} key={i} />
                      </Suspense>
                    );
                  case "source":
                    return <p key={i}>{part.source.url}</p>;
                  case "reasoning":
                    if (index !== messages.length - 1 || msg.parts.length - 1 !== i) {
                      // If the last message is not the current one, we don't show the reasoning
                      return null;
                    }
                    return (
                      <p key={i} className="flex items-center gap-1.5">
                        <Spinner size="1" />
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
        {!hasRunningTools && (status === "submitted" || status === "streaming") && (
          <div className={tx("h-6 px-2 text-xs text-gray-600 flex items-center justify-center gap-1.5")}>
            <Spinner size="1" /> Please wait...
          </div>
        )}
        {error && (
          <div className={tx(msgCommon, "bg-red-200 text-red-800")}>
            <p>An error occured: {error.message}</p>
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
          "flex flex-col flex-1 h-36 max-h-36 gap-1.5 p-2 justify-center ",
          "bg-upstart-100 border-t border-upstart-300 relative",
          generationState.isReady === false && "rounded-b-xl border",
          // "[&:has(textarea:focus)]:(ring-2 ring-upstart-700)",
        )}
      >
        <TextArea
          ref={promptRef}
          autoFocus
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) onSubmit(e);
          }}
          name="prompt"
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          placeholder={
            messages.some((m) => m.role === "user")
              ? undefined
              : "Add a section just below the navbar showing a large photo of space"
          }
          size="2"
          className={tx(
            "h-full w-full scrollbar-thin p-2 !bg-white !pb-9 !border-0 !outline-0 !box-shadow-none [&>textarea]:focus:(!outline-0 !shadow-none !ring-0 !border-0)",
          )}
        />
        <div
          className={tx(
            "flex justify-between items-center h-9 bg-white tems-center text-gray-500 absolute left-[9px] right-[9px] rounded bottom-2.5 px-2 z-50",
          )}
        >
          <button type="button" className={tx("hover:bg-upstart-200 p-1 rounded inline-flex text-sm gap-1")}>
            <IoIosAttach className="h-5 w-5" />
          </button>
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
            <Button type="submit" size={"1"} className={tx("flex items-center gap-0.5")}>
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
      return `Generating page '${toolInvocation.args.pageLabel}', this can take a while`;
    default:
      return toolsWorkingLabels[toolInvocation.toolName];
  }
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
  if (hiddenTools.includes(toolInvocation.toolName)) {
    return null;
  }
  if (toolInvocation.toolName === "askUserChoice") {
    const args = toolInvocation.args as {
      choices: string[];
      question?: string;
      allowMultiple: boolean;
    };
    return (
      <Suspense key={toolInvocation.toolCallId}>
        <AnimatePresence>
          {toolInvocation.state !== "result" ? (
            <motion.div
              className="choices"
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: 1, scaleY: 1 }}
              exit={{ opacity: 0, scaleY: 0 }}
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
                      append({
                        role: "user",
                        content: choice,
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
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: 1, scaleY: 1 }}
              exit={{ opacity: 0, scaleY: 0 }}
            >
              {args.question && (
                <div className="basis-full">
                  <Markdown content={args.question} />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </Suspense>
    );
  }
  const waitLabel = getToolWaitingLabel(toolInvocation);
  if (waitLabel) {
    return (
      <AnimatePresence>
        {toolInvocation.state !== "result" ? (
          <motion.div
            className="flex items-center gap-1.5"
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            exit={{ opacity: 0, scaleY: 0 }}
          >
            <Spinner size="1" />
            <Text size="2">{waitLabel}</Text>
          </motion.div>
        ) : (
          <motion.div
            className="flex items-center gap-1.5"
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            exit={{ opacity: 0, scaleY: 0 }}
          >
            <MdDone className="w-4 h-4 text-green-600" />
            <Text size="2">{waitLabel}</Text>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
  return null;
  // return (
  //   <details className="flex flex-col mt-0 mb-4 text-xs [&_svg]:open:-rotate-0">
  //     <summary className="flex items-center gap-1 cursor-pointer list-none text-black/60">
  //       <div className="text-xs font-normal">
  //         <svg
  //           className="-rotate-90 transform text-upstart-500 transition-all duration-300"
  //           fill="none"
  //           height="14"
  //           width="14"
  //           stroke="currentColor"
  //           strokeLinecap="round"
  //           strokeLinejoin="round"
  //           strokeWidth="2"
  //           viewBox="0 0 24 24"
  //         >
  //           <title>Arrow</title>
  //           <polyline points="6 9 12 15 18 9" />
  //         </svg>
  //       </div>
  //       <div>{tools[toolInvocation.toolName] ?? toolInvocation.toolName}</div>
  //     </summary>
  //     <Text size="2" className="text-gray-500">
  //       Tool: {toolInvocation.toolName}
  //     </Text>
  //     <Text size="2" className="text-gray-500">
  //       State: {toolInvocation.state}
  //     </Text>
  //     <Text size="2" className="text-gray-500">
  //       Call ID: {toolInvocation.toolCallId}
  //     </Text>
  //     {toolInvocation.state === "result" && (
  //       <Text size="2" className="text-gray-500">
  //         {JSON.stringify(toolInvocation.result)}
  //       </Text>
  //     )}
  //   </details>
  // );
}

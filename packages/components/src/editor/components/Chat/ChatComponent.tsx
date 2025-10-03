import { useChat } from "@ai-sdk/react";
import type { Tools, UpstartUIMessage } from "@upstart.gg/sdk/shared/ai/types";
import { defineDataRecord } from "@upstart.gg/sdk/shared/datarecords";
import { defineDatasource } from "@upstart.gg/sdk/shared/datasources";
import { Spinner, toast } from "@upstart.gg/style-system/system";
import { css, tx } from "@upstart.gg/style-system/twind";
import { type ChatOnToolCallCallback, createIdGenerator, DefaultChatTransport, type ToolUIPart } from "ai";
import { AnimatePresence, motion } from "motion/react";
import { type FormEvent, lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useDeepCompareEffect } from "use-deep-compare";
import { useDebounceCallback } from "usehooks-ts";
import { useChatSession, useDebugMode } from "../../hooks/use-editor";
import {
  useAdditionalAssets,
  useDraftHelpers,
  useDraftUndoManager,
  useGenerationState,
  usePage,
  useSite,
  useSitePrompt,
  useThemes,
} from "../../hooks/use-page-data";
import type { CallContextProps } from "@upstart.gg/sdk/shared/context";

// Lazy load heavy components
const Markdown = lazy(() => import("../Markdown"));
const ChatBox = lazy(() => import("./ChatBox"));
const ChatReasoningPart = lazy(() => import("./ChatReasoningPart"));
const ToolRenderer = lazy(() => import("./ChatToolRenderer"));

const WEB_SEARCH_ENABLED = false;

const msgCommon = tx(
  "rounded-lg p-4 text-pretty transition-all duration-300 flex flex-col gap-1.5",
  css({
    "& pre:has(> code) ": {
      display: "hidden",
    },
    "& code": {
      fontSize: "88%",
    },
    "& ul": {
      listStyle: "outside",
      listStyleType: "square",
    },
    "& ol": {
      listStyle: "outside",
      listStyleType: "decimal",
    },

    // whiteSpace: "pre-line",
    "& >p:first-child": {
      marginTop: "0",
    },
    "& > p:last-child": {
      marginBottom: "0",
    },
    "& table": {
      width: "100%",
      fontSize: "0.8em",
    },
  }),
);

const userMsgClass = tx(
  "text-gray-800 text-[0.8rem] opacity-70 bg-gradient-to-tr from-gray-200/20 to-gray-100/20 w-fit max-w-[90%] dark:(bg-dark-900 text-white/70) self-end",
);

export default function Chat() {
  const chatSession = useChatSession();
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
  const chatboxRef = useRef<HTMLTextAreaElement>(null);
  const { undo } = useDraftUndoManager();

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
    if (showToastWorking && generationState.isReady) {
      toast.loading("Setting up your site...", { duration: Infinity, id: "chat-setup" });
    } else {
      toast.dismiss("chat-setup");
    }
  }, [showToastWorking, generationState.isReady]);

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

  const onToolCall: ChatOnToolCallCallback<UpstartUIMessage> = ({ toolCall }) => {
    console.log("Tool call: %s: ", toolCall.toolName, toolCall);
  };

  const { messages, sendMessage, setMessages, error, status, regenerate, stop, addToolResult } =
    useChat<UpstartUIMessage>({
      id: chatSession.id,
      // resume: generationState.isReady === false,
      transport: new DefaultChatTransport({
        api: "/editor/chat",
        credentials: "include",
        // body: () => ({
        //   callContext: {
        //     site: siteRef.current,
        //     page: pageRef.current,
        //     generationState: generationStateRef.current,
        //     userLanguage: userLanguageRef.current,
        //     assets: assetsRef.current,
        //   } satisfies Omit<CallContextProps, "userId">,
        // }),
        prepareSendMessagesRequest: ({ messages }) => {
          // send only the last message and chat id
          // we will then fetch message history (for our chatId) on server
          // and append this message for the full context to send to the model
          const message = messages[messages.length - 1];
          const previousMessage = messages.length > 1 ? messages[messages.length - 2] : undefined;

          const callContext = {
            site: siteRef.current,
            page: pageRef.current,
            generationState: generationStateRef.current,
            userLanguage: userLanguageRef.current,
            assets: assetsRef.current,
          } satisfies Omit<CallContextProps, "userId">;

          const hasToolResults = previousMessage?.parts.some((part) => part.type === "tool-askUserChoice");

          console.log("Send chat request with hasToolResults=%s", hasToolResults);
          console.log({ message });
          console.log({ previousMessage });

          return {
            body: {
              messages: hasToolResults ? messages.slice(-2) : [message],
              chatSessionId: chatSession.id,
              callContext,
            },
          };
        },
      }),
      messages: chatSession.messages,

      generateId: createIdGenerator({
        prefix: "user",
        separator: "_",
        size: 8,
      }),
      onError: (error) => {
        console.error("ERROR", error);
      },
      onToolCall,
    });
  const messagesListRef = useRef<HTMLDivElement>(null);

  const onSubmit = (e: Event | FormEvent) => {
    e.preventDefault();
    sendMessage({ text: input });
    setInput("");
  };

  const updateMessage = (id: string, update: Partial<UpstartUIMessage>) => {
    setMessages((prevMessages) => prevMessages.map((msg) => (msg.id === id ? { ...msg, ...update } : msg)));
  };

  const debouncedScroll = useDebounceCallback(() => {
    // when messages change, scroll to the bottom
    if (messagesListRef.current && !hasScrolledUp) {
      // Only autoscroll if user hasn't scrolled up or is already near the bottom
      messagesListRef.current?.scrollTo({ behavior: "smooth", top: messagesListRef.current.scrollHeight });
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
    const messagesToAnalyze = messages.slice(-1);
    console.log({ messagesToAnalyze });
    const results = messagesToAnalyze
      .filter((msg) => msg.role === "assistant")
      .flatMap((msg) => msg.parts as ToolUIPart<Tools>[])
      .filter((part) => part.type.startsWith("tool-"))
      .filter(
        (part) => part.state === "output-available" && !handledToolResults.current.has(part.toolCallId),
      );
    return results;
  }, [messages]);

  const hasRunningTools = useMemo(() => {
    // get the last 2 messages
    const results = messages
      .slice(-1)
      .filter((msg) => msg.role === "assistant")
      .flatMap((msg) => msg.parts as ToolUIPart<Tools>[])
      .filter((part) => part.type.startsWith("tool-") && part.type !== "tool-askUserChoice")
      .filter((part) => part.state !== "output-available" && part.state !== "output-error");

    return results.length > 0;
  }, [messages]);

  const isWaitingForNChoices = useMemo(() => {
    const results = messages
      .slice(-1)
      .filter((msg) => msg.role === "assistant")
      .flatMap((msg) => msg.parts as ToolUIPart<Tools>[])
      .filter((part) => part.type === "tool-askUserChoice")
      .filter((part) => part.state.startsWith("input"));
    return results.length;
  }, [messages]);

  const sendingEnabled = !hasRunningTools && !isWaitingForNChoices && status === "ready";

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
          draftHelpers.registerPageInSitemap(page);
          // Add a slight delay to ensure the page has been saved in the backend due to the sitemap update
          setTimeout(() => {
            draftHelpers.addPage({ ...page, sections: [] });
          }, 250);
          break;
        }

        case "tool-editPage": {
          const page = toolInvocation.output;
          console.log("Edited page", page);
          draftHelpers.updatePage(page);
          break;
        }

        case "tool-undo": {
          undo(toolInvocation.input.steps ?? 1);
          addToolResult({
            output: true,
            tool: "undo",
            toolCallId: toolInvocation.toolCallId,
          });
          regenerate();
          break;
        }

        case "tool-setTheme": {
          const theme = toolInvocation.output;
          console.log("Setting theme", theme);
          draftHelpers.setTheme(theme);
          break;
        }

        case "tool-createThemes": {
          const themes = toolInvocation.output;
          console.log("Generated themes", themes);
          draftHelpers.addThemes(themes);
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

        // case "tool-createSitemap": {
        //   const sitemap = toolInvocation.output;
        //   console.log("Generated sitemap", sitemap);
        //   draftHelpers.setSitemap(sitemap);
        //   break;
        // }

        case "tool-editSiteAttributes": {
          const siteAttributes = toolInvocation.output;
          console.log("Generated site attributes", siteAttributes);
          draftHelpers.updateSiteAttributes(siteAttributes);
          break;
        }

        case "tool-setSiteLabel": {
          const { label } = toolInvocation.input;
          console.log("Set site label", label);
          draftHelpers.setSiteLabel(label);
          break;
        }

        case "tool-createSection": {
          const section = toolInvocation.output;
          console.log("Generated section", section);
          // @ts-expect-error Bricks overwrite
          draftHelpers.addSection({ bricks: [], ...section });
          break;
        }

        case "tool-editSection": {
          const section = toolInvocation.output;
          console.log("Edited section", section);
          draftHelpers.updateSection(section.id, section, true); // totally override
          break;
        }

        case "tool-createBrick": {
          const brick = toolInvocation.output;
          console.log("Generated brick", brick);
          const { sectionId, insertAt } = toolInvocation.input;
          if (insertAt.type === "section") {
            draftHelpers.addBrick(brick, sectionId, insertAt.index);
          } else {
            draftHelpers.addBrick(brick, sectionId, insertAt.index, insertAt.id);
          }
          break;
        }

        case "tool-editBrick": {
          const brick = toolInvocation.output;
          console.log("Edit brick props", brick);
          if (brick.props) {
            draftHelpers.updateBrickProps(brick.id, brick.props);
          }
          if (brick.mobileProps) {
            draftHelpers.updateBrickProps(brick.id, brick.mobileProps, true);
          }
          break;
        }

        case "tool-setSitePrompt": {
          const { prompt } = toolInvocation.input;
          console.log("Set site prompt", prompt);
          draftHelpers.setSitePrompt(prompt);
          break;
        }

        case "tool-deleteBrick": {
          const { id } = toolInvocation.input;
          draftHelpers.deleteBrick(id);
          break;
        }

        case "tool-searchImages": {
          const images = toolInvocation.output;
          console.log("Searched images", images);
          draftHelpers.addAdditionalAssets(images);
          break;
        }

        case "tool-generateImages": {
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

  // Only show messages that have text or tool parts
  const displayedMessages = messages.filter(
    (msg) =>
      msg.metadata?.init !== true &&
      msg.parts.some((part) => part.type === "text" || part.type.startsWith("tool-")),
  );

  // console.log("messages", chatSession.messages);
  // console.log("All messages length is %d, displaying %d", messages.length, displayedMessages.length);

  useEffect(() => {
    if (sendingEnabled) {
      chatboxRef.current?.focus();
    }
  }, [sendingEnabled]);

  useEffect(() => {
    if (sendingEnabled) {
      chatboxRef.current?.focus();
    }
  }, [sendingEnabled]);

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
                  <Suspense key={i} fallback={null}>
                    <ToolRenderer
                      key={i}
                      // test showing tools
                      hasToolsRunning={hasRunningTools}
                      toolPart={part as ToolUIPart<Tools>}
                      addToolResult={addToolResult}
                      addToolResultMessage={(text: string) => sendMessage({ text })}
                      error={error}
                    />
                  </Suspense>
                );
              }

              switch (part.type) {
                case "text":
                  return (
                    <Suspense key={i} fallback={null}>
                      <Markdown content={part.text} key={i} />
                    </Suspense>
                  );

                case "reasoning":
                  return debug ? (
                    <Suspense key={i} fallback={null}>
                      <ChatReasoningPart key={i} part={part} />
                    </Suspense>
                  ) : null;
              }
            })}
          </div>
        ))}

        <AnimatePresence initial={false}>
          {(status === "submitted" || status === "streaming") && isWaitingForNChoices === 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "1.5rem" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
              className={tx(
                "p-4 my-4 text-sm text-gray-800 flex items-center justify-center gap-1.5 backdrop-blur-md bg-white/50 max-w-fit mx-auto rounded-md",
              )}
            >
              <Spinner size="2" className={tx("text-gray-700")} /> Please wait...
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
      <Suspense fallback={null}>
        <ChatBox
          ref={chatboxRef}
          input={input}
          setInput={setInput}
          onSubmit={onSubmit}
          status={status}
          disabled={sendingEnabled === false}
          stop={stop}
          messages={messages}
        />
      </Suspense>
    </div>
  );
}

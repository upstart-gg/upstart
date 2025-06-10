import { TextArea } from "@radix-ui/themes";
import { tx, css } from "@upstart.gg/style-system/twind";
import { Button, Text, Switch } from "@upstart.gg/style-system/system";
import { motion, AnimatePresence } from "motion/react";
import { TbSend2 } from "react-icons/tb";
import { IoIosAttach } from "react-icons/io";
import { type CreateMessage, type Message, useChat } from "@ai-sdk/react";
import {
  type FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  lazy,
  Suspense,
  Fragment,
} from "react";
import { createIdGenerator, type ToolInvocation } from "ai";
import {
  useDraftHelpers,
  useEditorHelpers,
  useGenerationState,
  useSite,
  useSiteAndPages,
  useSitePrompt,
  useTheme,
  useThemes,
} from "../hooks/use-editor";
import { MdDone } from "react-icons/md";

import { useDebounceCallback } from "usehooks-ts";
import { Spinner } from "@upstart.gg/style-system/system";
import { BiStopCircle } from "react-icons/bi";
import { type Theme, processTheme } from "@upstart.gg/sdk/shared/theme";
import type { CallContextProps } from "@upstart.gg/sdk/shared/context";
import { useDeepCompareEffect } from "use-deep-compare";
import type { ImageSearchResultsType, SimpleImageMetadata } from "@upstart.gg/sdk/shared/images";
import type { GenericPageConfig } from "@upstart.gg/sdk/shared/page";
import type { Sitemap } from "@upstart.gg/sdk/shared/sitemap";

// Lazy import "Markdown"
// import Markdown from "./Markdown";
const Markdown = lazy(() => import("./Markdown"));

const msgCommon = tx(
  "rounded-lg px-2.5 py-2 text-pretty transition-all duration-300 flex flex-col gap-1.5",
  css({
    // whiteSpace: "pre-line",
    "& p": {
      marginTop: ".5rem",
      marginBottom: ".5rem",
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
      paddingLeft: "1rem",
      // marginTop: "0.25rem",
      marginBottom: "0.2rem",
    },
    "& li": {
      marginBottom: "0.25rem",
    },
    "& div.choices": {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "space-between",
      gap: ".5rem",
      marginTop: "1rem",
      // "&:not(:last-child)": {
      //   marginBottom: "1rem",
      // },

      "& > button": {
        backgroundColor: "var(--violet-10)",
        color: "#fff",
        flexGrow: "1",
        padding: "0.3rem 0.7rem",
        borderRadius: "0.5rem",
        border: "none",
        fontSize: "0.8rem",
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
  const prompt = useSitePrompt();
  const setupRef = useRef(false);
  const draftHelpers = useDraftHelpers();
  const { setImagesSearchResults } = useEditorHelpers();
  const generationState = useGenerationState();
  const siteAndPages = useSiteAndPages();
  const siteThemes = useThemes();
  const theme = useTheme();
  const [flow, setFlow] = useState<CallContextProps["flow"]>(
    new URL(window.location.href).searchParams.get("action") === "generate" ? "setup" : "edit",
  );

  const listPlaceholderRef = useRef<HTMLDivElement>(null);
  const handledToolResults = useRef(new Set<string>());

  const aiMsgClass = tx(
    " text-sm text-black/80 dark:text-upstart-200",
    generationState.isReady
      ? "bg-gradient-to-tr from-upstart-200/80 to-upstart-100"
      : "bg-white/80 dark:bg-dark-800",
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
      flow === "setup"
        ? import.meta.env.DEV
          ? ([
              {
                id: "fake-1",
                role: "assistant",
                content: `Welcome to Upsie! This is a fake message to test the chat component in dev mode. You can ignore it.`,
              },
              {
                id: "fake-1-2",
                role: "user",
                content: `Hey Upsie, can you help me create a website?`,
              },
              {
                id: "fake-2",
                role: "assistant",
                content: `Sure! I can help you create a website. What kind of website do you want to create?`,
              },
              {
                id: "fake-3",
                role: "user",
                content: `I want to create a website about my favorite hobby.`,
              },
              {
                id: "fake-4",
                role: "assistant",
                content: `Great! What is your favorite hobby?`,
              },
              {
                id: "fake-5",
                role: "user",
                content: `My favorite hobby is photography. I love taking pictures of nature and landscapes.
I also enjoy editing my photos to make them look even better.
I would like to create a website to showcase my photography work and share my passion with others.

I want the website to have a clean and modern design, with a gallery to display my photos,
a blog section to share my thoughts and experiences, and a contact page for people to reach out to me.

I would also like to have a section where I can share tips and tutorials on photography techniques and editing software.
I want the website to be easy to navigate and visually appealing, with a focus on showcasing my photography work.
                `,
              },
              {
                id: "fake-6",
                role: "assistant",
                content: `That sounds like a great idea! I can help you create a website that showcases your photography work and shares your passion with others.
Let's start by generating some color themes for your website. This will help us create a cohesive design that reflects your style and personality.`,
              },
              {
                id: "fake-7",
                role: "user",
                content: `Super! I can't wait to see the color themes you come up with. Let's do it!`,
              },
              {
                id: "fake-8",
                role: "assistant",
                content: `Great! Let's get started on generating some color themes for your website. I'll start by analyzing your preferences and the type of photography you do.`,
              },
            ] satisfies Message[])
          : [
              {
                id: "init-website",
                role: "user",
                content: `Create a website based on this prompt:\n${prompt}`,
              },
            ]
        : [],
    credentials: "include",
    experimental_prepareRequestBody({ requestData, ...rest }) {
      return { ...rest, requestData: { ...siteAndPages, flow, generationState } satisfies CallContextProps };
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
    key: `chat-${flow}-${siteAndPages.site.id}`,

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
      listPlaceholderRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, 200);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(debouncedScroll, [status, data, messages]);

  useDeepCompareEffect(() => {
    if (generationState) {
      console.log("generation state changed", generationState);
    }
  }, [generationState]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (setupRef.current) return;
    setupRef.current = true;
    if (flow === "setup") {
      console.log("Chat initialized");
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
          const result = toolInvocation.result as { page: GenericPageConfig } | { error: string };
          if ("error" in result) {
            console.error("Error generating page:", result.error);
            return;
          }
          console.log("Generated page", result.page);
          draftHelpers.addPage(result.page);
          break;
        }

        case "generateThemes": {
          const themes = toolInvocation.result as Theme[];
          const themesProcessed = themes.map(processTheme);
          console.log("Generated themes", themesProcessed);
          draftHelpers.setThemes(themesProcessed);
          break;
        }

        case "generateDatasource": {
          const datasource = toolInvocation.result as Parameters<typeof draftHelpers.addDatasource>[0];
          console.log("Generated datasource", datasource);
          draftHelpers.addDatasource(datasource);
          break;
        }

        case "generateDatarecord": {
          const datarecord = toolInvocation.result as Parameters<typeof draftHelpers.addDatarecord>[0];
          console.log("Generated data record", datarecord);
          draftHelpers.addDatarecord(datarecord);
          break;
        }

        case "generateSitemap": {
          const sitemap = toolInvocation.result as Sitemap;
          console.log("Generated sitemap", sitemap);
          draftHelpers.setSitemap(sitemap);
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

  return (
    <div
      className={tx(
        "flex flex-col mx-auto w-full",
        {
          "rounded-xl animate-border my-auto h-full max-h-[calc(100dvh-100px)]":
            generationState.isReady === false,
          "rounded-tr-xl bg-gray-50 max-h-[inherit]": generationState.isReady === true,
        },
        css({
          gridArea: "chat",
          maxWidth: generationState.isReady ? "none" : "clamp(500px, 40dvw, 650px)",
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
          ` overflow-y-auto h-full max-h-[inherit] p-2 pr-4
            flex flex-col gap-y-2.5 flex-grow scroll-smooth scrollbar-thin relative`,
          {
            "rounded-tr-xl shadow-inner": generationState.isReady === true,
          },
          css({
            scrollbarColor: "var(--violet-a8) var(--violet-a2)",
            // scrollbarColor: "var(--violet-4) var(--violet-2)",
            scrollbarGutter: "stable",
          }),
        )}
      >
        {messages
          // filter out the "init" messages
          .filter((msg) => msg.id.startsWith("init-") === false && msg.parts.length > 0)
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
                    // @ts-ignore
                    if (part.source.sourceType === "images") {
                      // @ts-ignore
                      return <ImagesPreview key={i} images={part.source.images as SimpleImageMetadata[]} />;
                    }
                    return <p key={i}>{JSON.stringify(part)}</p>;
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
          <div className={tx("h-6 px-2 text-sm text-gray-600 flex items-center justify-center gap-1.5")}>
            <Spinner size="2" /> Please wait...
          </div>
        )}
        {error && (
          <div className={tx(msgCommon, "bg-red-200 text-red-800 text-sm")}>
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
          "flex flex-col flex-1 min-h-[150px] max-h-[150px] gap-1.5 p-2 justify-center ",
          "bg-upstart-100 border-t border-upstart-300 relative",
          // generationState.isReady === false && "hidden",
          generationState.isReady === false && "rounded-b-xl",
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
          disabled={messagingDisabled}
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
            "h-full w-full scrollbar-thin p-2 bg-white !pb-9 !border-0 !outline-0 !box-shadow-none [&>textarea]:focus:(!outline-0 !shadow-none !ring-0 !border-0)",
          )}
        />
        <div
          className={tx(
            "flex justify-between items-center h-9 text-gray-500 absolute left-[9px] right-[9px] rounded bottom-2.5 px-2 z-50",
            { "bg-white": !messagingDisabled, "bg-transparent": messagingDisabled },
          )}
        >
          <button type="button" className={tx("hover:bg-upstart-200 p-1 rounded inline-flex text-sm gap-1")}>
            <IoIosAttach className="h-5 w-5" />
          </button>
          {generationState.isReady && (
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
      return `Generating page '${toolInvocation.args.pageLabel}', this can take a while`;
    default:
      return toolsWorkingLabels[toolInvocation.toolName];
  }
}

function ImagesPreview({ images }: { images: SimpleImageMetadata[] }) {
  return (
    <div className="grid grid-cols-3 gap-1 max-h-60 overflow-y-auto">
      {images.map((image, index) => (
        <img
          key={image.url}
          src={image.url}
          alt={image.description}
          className={tx(
            "rounded-md h-auto !object-cover object-center w-full aspect-video animate-fade-in",
            css({
              // animation delay
              animationDelay: `${index * 100}ms`,
            }),
          )}
          loading="lazy"
        />
      ))}
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
      allowMultiple: boolean;
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
                      // append({
                      //   role: "user",
                      //   content: choice,
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
            <Spinner size="1" className="w-4" />
            <Text size="2">{waitLabel}</Text>
          </motion.div>
        ) : (
          <motion.div
            className="flex items-center gap-1.5"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <MdDone className="w-4 h-4 text-green-600" />
            <Text size="2">{waitLabel}</Text>
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

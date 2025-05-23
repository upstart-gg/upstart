import { TextArea } from "@radix-ui/themes";
import { tx, css } from "@upstart.gg/style-system/twind";
import { Button, Text, Switch } from "@upstart.gg/style-system/system";
import { TbSend2 } from "react-icons/tb";
import { IoIosAttach } from "react-icons/io";
import { useChat } from "@ai-sdk/react";
import { type FormEvent, useCallback, useEffect, useMemo, useRef, useState, lazy, Suspense } from "react";
import { createIdGenerator, type ToolInvocation } from "ai";
import {
  useDraftHelpers,
  useGenerationState,
  useSerializedPage,
  useSerializedSite,
  useSitePrompt,
  useSiteReady,
  useTheme,
  useThemes,
} from "../hooks/use-editor";

import { useDebounceCallback } from "usehooks-ts";
import { Spinner } from "@upstart.gg/style-system/system";
import { BiStopCircle } from "react-icons/bi";
import { type Theme, processTheme } from "@upstart.gg/sdk/shared/theme";
import { useDeepCompareEffect } from "use-deep-compare";

// Lazy import "Markdown"
// import Markdown from "./Markdown";
const Markdown = lazy(() => import("./Markdown"));

const msgCommon = tx(
  "rounded-lg",
  css({
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
      marginBottom: "1rem",
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "space-between",
      gap: ".5rem",
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
  "px-2.5 py-2 text-sm text-black/80 bg-gradient-to-tr from-upstart-200/80 to-upstart-100 dark:text-upstart-200 text-base text-pretty",
);
const userMsgClass = tx(
  "px-2.5 py-2 text-sm opacity-80 bg-gradient-to-tr from-gray-200/80 to-gray-100 w-fit max-w-[90%] text-gray-800 dark:(bg-dark-900 text-white/70) self-end text-pretty",
);

export default function Chat() {
  const siteReady = useSiteReady();
  const sitePrompt = useSitePrompt();
  const setupRef = useRef(false);
  const draftHelpers = useDraftHelpers();
  const generationState = useGenerationState();
  const page = useSerializedPage();
  const site = useSerializedSite();
  const siteThemes = useThemes();
  const theme = useTheme();
  const listPlaceholderRef = useRef<HTMLDivElement>(null);
  const handledToolResults = useRef(new Set<string>());

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
    metadata,
  } = useChat({
    api: "/editor/chat",
    headers: {
      "x-upstart-user-id": crypto.randomUUID(),
    },
    sendExtraMessageFields: true,
    maxSteps: 30,
    initialMessages: [
      {
        id: "init-website",
        role: "user",
        content: `Generate a website for me with the following info: ${JSON.stringify(sitePrompt, null, 2)}}`,
      },
    ],
    credentials: "include",
    experimental_prepareRequestBody({ requestData, ...rest }) {
      return { ...rest, requestData: { generationState, page, site } };
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

    onToolCall: ({ toolCall }) => {
      console.log("Tool call: %s [%s]: ", toolCall.toolName, toolCall.toolCallId, toolCall);
      // switch (toolCall.toolName) {
      //   case "set_theme": {
      //     return true;
      //   }
      //   default: {
      //     // console.log("Tool call", toolCall);
      //     // WARNING: don't return anything for server-side tools otherwise it will override the tool result
      //   }
      // }
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

  useEffect(() => {
    const clickListener = (e: MouseEvent) => {
      // detect click on button
      if (e.target instanceof HTMLButtonElement && e.target.parentElement?.classList.contains("choices")) {
        const text = e.target.innerText;
        append({
          role: "user",
          content: text,
        });
        const elements = messagesListRef.current?.querySelectorAll<HTMLDivElement>(".choices") ?? [];
        // reset all choices
        elements.forEach((el) => {
          el.style.setProperty("transition", "all 0.2s");
          el.style.setProperty("opacity", "0.1");
          el.style.setProperty("pointer-events", "none");
          // scale down
          el.style.setProperty("transform", "scale(0)");
        });
        setTimeout(() => {
          elements.forEach((el) => {
            el.remove();
          });
        }, 200);
      }
    };
    if (messagesListRef.current) {
      messagesListRef.current.addEventListener("click", clickListener);
    }
    return () => {
      if (messagesListRef.current) {
        messagesListRef.current.removeEventListener("click", clickListener);
      }
    };
  }, [append]);

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

  useDeepCompareEffect(() => {
    for (const toolInvocation of toolInvocations.filter((t) => t.state === "result")) {
      if (handledToolResults.current.has(toolInvocation.toolCallId)) {
        continue;
      }
      switch (toolInvocation.toolName) {
        case "generate_themes": {
          const themes = toolInvocation.result as Theme[];
          const themesProcessed = themes.map(processTheme);
          console.log("Generated themes", themes);
          console.log("Processed themes", themesProcessed);
          draftHelpers.setThemes(themesProcessed);
          handledToolResults.current.add(toolInvocation.toolCallId);
          break;
        }
        // case "set_theme": {
        //   const themeId = (toolInvocation.args as { themeId: string }).themeId;
        //   draftHelpers.pickTheme(themeId);
        //   handledToolResults.current.add(toolInvocation.toolCallId);
        //   console.log("Set theme", themeId);
        //   break;
        // }
      }
    }
  }, [toolInvocations, draftHelpers, siteThemes]);

  return (
    <div
      className={tx(
        "flex flex-col rounded-tr-xl bg-gray-50",
        css({
          gridArea: "chat",
        }),
      )}
    >
      <div
        ref={messagesListRef}
        className={tx(
          `scrollbar-thin overflow-y-auto h-full max-h-[calc(100cqh-250px)]
           text-xl py-2 pl-2 pr-3 rounded flex flex-col gap-y-2.5
           shadow-inner scroll-smooth rounded-tr-xl relative`,
          css({
            // scrollbarColor: "var(--violet-a8) var(--violet-a2)",
            scrollbarGutter: "stable",
          }),
        )}
      >
        {messages
          // filter out the "init" messages
          .filter((msg) => msg.id.startsWith("init-") === false)
          .map((msg) => (
            <div key={msg.id} className={tx(msg.role === "assistant" ? aiMsgClass : userMsgClass, msgCommon)}>
              {msg.parts.map((part, i) => {
                switch (part.type) {
                  case "text":
                    return (
                      <Suspense key={i}>
                        <Markdown id={msg.id} content={part.text} key={i} />
                      </Suspense>
                    );
                  case "source":
                    return <p key={i}>{part.source.url}</p>;
                  case "reasoning":
                    return (
                      <p key={i} className="text-xs text-gray-500">
                        {part.reasoning}
                      </p>
                    );
                  case "tool-invocation":
                    return <ToolRenderer key={i} toolInvocation={part.toolInvocation} />;
                  case "file":
                    return <img key={i} alt="" src={`data:${part.mimeType};base64,${part.data}`} />;
                }
              })}
            </div>
          ))}
        {(status === "submitted" || status === "streaming") && (
          <div className={tx("h-6 px-2 text-xs text-gray-600 inline-flex items-center gap-1.5")}>
            <Spinner size="2" />
          </div>
        )}
        <div ref={listPlaceholderRef} className={tx("h-2")} aria-label="separator" aria-hidden />
      </div>
      <form
        onSubmit={onSubmit}
        className={tx(
          "flex flex-col flex-1 h-60 max-h-60 gap-1.5 p-2 justify-center ",
          "bg-upstart-100 border-t border-upstart-300",
        )}
      >
        <TextArea
          ref={promptRef}
          disabled={error != null}
          autoFocus
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) onSubmit(e);
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
          className={tx("h-32 w-full scrollbar-thin p-2")}
        />
        <div className={tx("flex justify-between items-center text-gray-500")}>
          <button type="button" className={tx("hover:bg-upstart-200 p-1 rounded inline-flex text-sm gap-1")}>
            <IoIosAttach className="h-5 w-5" /> 0 files
          </button>
          <label className={tx("inline-flex items-center gap-1 text-sm select-none")}>
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
              size={"2"}
              className={tx("flex items-center justify-center gap-0.5")}
              onClick={stop}
            >
              <BiStopCircle className="text-lg" />
            </Button>
          ) : (
            <Button
              type="submit"
              size={"2"}
              className={tx("flex items-center gap-0.5")}
              disabled={status !== "ready"}
            >
              <span className="text-[80%] font-normal opacity-80 w-6 text-nowrap">⌘⏎</span>
              <TbSend2 className="text-lg" />
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}

const tools: Record<string, string> = {
  generate_themes: "Themes generation",
  generate_pages_map: "Site structure generation",
  generate_images: "Images generation",
  generate_page: "Page generation",
};

const toolsWorkingLabels: Record<string, string> = {
  generate_themes: "Generating color themes",
  generate_pages_map: "Generating site structure",
  generate_images: "Generating images",
  generate_page: "Generating page",
};

function ToolRenderer({ toolInvocation }: { toolInvocation: ToolInvocation }) {
  if (toolInvocation.state !== "result") {
    return (
      <div className="flex items-center gap-1.5">
        <Spinner size="1" />{" "}
        <Text size="1" className="text-black/60">
          {toolsWorkingLabels[toolInvocation.toolName] ?? toolInvocation.toolName} ...
        </Text>
      </div>
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

import { tx, css } from "@upstart.gg/style-system/twind";
import { motion, AnimatePresence } from "motion/react";
import type { ToolUIPart } from "ai";
import type { UseChatHelpers } from "@ai-sdk/react";
import { MdDone } from "react-icons/md";
import { Spinner } from "@upstart.gg/style-system/system";
import type { SimpleImageMetadata } from "@upstart.gg/sdk/shared/images";
import { useDebugMode } from "../../hooks/use-editor";
import type { Tools, UpstartUIMessage } from "@upstart.gg/sdk/shared/ai/types";
import { useState } from "react";
import Markdown from "../Markdown";

export default function ToolRenderer({
  toolPart,
  addToolResultMessage,
  addToolResult,
  error,
  hasToolsRunning,
}: {
  toolPart: ToolUIPart<Tools>;
  error?: Error;
  addToolResult: UseChatHelpers<UpstartUIMessage>["addToolResult"];
  addToolResultMessage: (text: string) => void;
  hasToolsRunning: boolean;
}) {
  const debug = useDebugMode();
  const [showPreview, setShowPreview] = useState(false);
  // If there is an error, don't show pending tool invocations
  if (error) {
    return null;
  }
  // Don't show user choices until all other tools have finished
  if (toolPart.type === "tool-askUserChoice" && hasToolsRunning) {
    return null;
  }
  if (toolPart.type === "tool-askUserChoice") {
    return (
      <AnimatePresence key={toolPart.toolCallId}>
        <motion.div
          className="bg-black/5 p-4 rounded-md text-[90%] mt-3"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
        >
          {toolPart.input?.question && <Markdown content={toolPart.input.question} />}
          {toolPart.state === "input-available" ? (
            <UserChoicesButtons
              key={toolPart.toolCallId}
              part={toolPart}
              addToolResult={addToolResult}
              addToolResultMessage={addToolResultMessage}
            />
          ) : null}
        </motion.div>
      </AnimatePresence>
    );
  }

  if (toolPart.input && "waitingMessage" in toolPart.input) {
    return (
      <AnimatePresence key={toolPart.toolCallId}>
        {toolPart.state === "input-available" ? (
          <RunningToolDisplay part={toolPart} />
        ) : toolPart.state === "output-available" ? (
          <motion.div
            className={tx("flex items-center gap-1.5 flex-wrap font-medium")}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <MdDone className="w-4 h-4 text-green-600" />
            <span>{toolPart.input.waitingMessage}</span>

            {(toolPart.type === "tool-searchImages" || toolPart.type === "tool-generateImages") && (
              <>
                <button
                  type="button"
                  className={tx(
                    "text-sm text-upstart-700 font-medium inline-flex items-center hover:underline",
                  )}
                  onClick={() => setShowPreview((val) => !val)}
                >
                  {showPreview ? "Hide" : "Show"} Preview
                </button>
                {showPreview && (
                  <ImagesPreview
                    key={toolPart.toolCallId}
                    query={toolPart.input.query}
                    images={toolPart.output}
                  />
                )}
              </>
            )}
            {debug && <ToolCallDebugInfo part={toolPart} />}
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
            {debug && <ToolCallDebugInfo part={toolPart} />}
          </motion.div>
        ) : null}
      </AnimatePresence>
    );
  }

  if (debug) {
    return <ToolCallDebugInfo key={toolPart.toolCallId} part={toolPart} />;
  }

  return null;
}

function ToolCallDebugInfo({ part }: { part: ToolUIPart<Tools> }) {
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
          Tool: {part.type} ({part.state})
        </span>
      </summary>
      <pre className={codeClassName}>{JSON.stringify(part, null, 2)}</pre>
    </details>
  );
}

function RunningToolDisplay({ part }: { part: Extract<ToolUIPart<Tools>, { state: "input-available" }> }) {
  const debug = useDebugMode();
  if (typeof part.input !== "object" || part.input === null || !("waitingMessage" in part.input)) {
    return null;
  }
  return (
    <motion.div
      className="flex items-center gap-1.5 font-medium flex-wrap"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
    >
      <Spinner size="1" className="w-4 mx-0.5" />
      <span>{part.input.waitingMessage as string}</span>
      {debug && (
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
            <span className="text-xs font-normal">[{part.type}] View tool call</span>
          </summary>
          <pre className="whitespace-pre-wrap text-xs">
            {JSON.stringify({ type: part.type, input: part.input }, null, 2)}
          </pre>
        </details>
      )}
    </motion.div>
  );
}

function UserChoicesButtons({
  part,
  addToolResult,
  addToolResultMessage,
}: {
  part: Extract<ToolUIPart<Tools>, { type: "tool-askUserChoice"; state: "input-available" }>;
  addToolResult: UseChatHelpers<UpstartUIMessage>["addToolResult"];
  addToolResultMessage: (text: string) => void;
}) {
  const [selectedChoices, setSelectedChoices] = useState<string[]>([]);

  const handleChoiceClick = (choice: string) => {
    if (part.input.allowMultiple) {
      setSelectedChoices((prev) =>
        prev.includes(choice) ? prev.filter((c) => c !== choice) : [...prev, choice],
      );
    } else {
      setSelectedChoices([choice]);
    }
  };
  return (
    <motion.div
      className={tx("flex flex-wrap gap-2 mt-4 justify-between")}
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
    >
      {part.input.allowMultiple ? (
        <>
          <div className="flex flex-col flex-wrap gap-1.5">
            {part.input.choices.map((choice, i) => {
              return (
                <button
                  key={`multi-${i}`}
                  type="button"
                  className={tx(
                    "inline-flex justify-center flex-1 text-[.95em] gap-3 items-center font-medium px-3 py-1.5 rounded-md",
                    {
                      "border !border-upstart-300 !text-gray-700 hover:border-upstart-300":
                        !selectedChoices.includes(choice),
                      "border !border-transparent !bg-upstart-700 text-white":
                        selectedChoices.includes(choice),
                    },
                  )}
                  onClick={async () => {
                    console.log("addtoolresult to part", part);
                    handleChoiceClick(choice);
                  }}
                >
                  <span className={tx("text-nowrap", selectedChoices.includes(choice) ? "font-bold" : "")}>
                    {choice}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="basis-full w-full mt-6 flex justify-end">
            <button
              type="button"
              disabled={selectedChoices.length === 0}
              className={tx(
                "inline-flex justify-center content-center flex-1 text-[.95em] gap-3 items-center font-medium px-3 py-1.5 rounded-md !bg-upstart-700 hover:opacity-90 text-white disabled:opacity-50 disabled:cursor-not-allowed max-w-[150px]",
              )}
              onClick={async () => {
                console.log("addtoolresult to part", part);
                await addToolResult({
                  tool: "askUserChoice",
                  toolCallId: part.toolCallId,
                  output: selectedChoices,
                });
                addToolResultMessage(selectedChoices.join(", "));
                setSelectedChoices([]);
              }}
            >
              Continue
            </button>
          </div>
        </>
      ) : (
        part.input.choices.map((choice, i) => {
          return (
            <button
              key={`single-${i}`}
              type="button"
              className={tx(
                "inline-flex text-nowrap text-center justify-center content-center flex-1 text-[.95em] gap-3 items-center font-medium px-3 py-1.5 rounded-md !bg-upstart-700 hover:opacity-90 text-white",
              )}
              onClick={async () => {
                await addToolResult({
                  tool: "askUserChoice",
                  toolCallId: part.toolCallId,
                  output: choice,
                });
                addToolResultMessage(choice);
              }}
            >
              {choice}
            </button>
          );
        })
      )}
    </motion.div>
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
            {image.author?.name && (
              <div className="absolute px-1.5 bottom-0 left-0 right-0 bg-black/50 text-white text-[0.6rem] p-0.5 rounded-b-md truncate capitalize">
                By{" "}
                {image.author.profile_url ? (
                  <a
                    href={image.author.profile_url}
                    target="_blank"
                    rel="noreferrer"
                    className="underline hover:text-upstart-300"
                  >
                    {image.author.name}
                  </a>
                ) : (
                  image.author.name
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

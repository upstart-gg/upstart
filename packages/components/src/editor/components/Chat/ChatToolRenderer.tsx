import { tx, css } from "@upstart.gg/style-system/twind";
import { motion, AnimatePresence } from "motion/react";
import type { ToolUIPart } from "ai";
import type { UseChatHelpers } from "@ai-sdk/react";
import { MdDone } from "react-icons/md";
import { Spinner } from "@upstart.gg/style-system/system";
import type { SimpleImageMetadata, Tools, UpstartUIMessage } from "@upstart.gg/sdk/ai";
import { useDebugMode } from "../../hooks/use-editor";
import { useState } from "react";
import ThemePreview from "../ThemePreview";

export default function ToolRenderer({
  toolPart,
  error,
}: {
  toolPart: ToolUIPart<Tools>;
  error?: Error;
}) {
  const debug = useDebugMode();
  const [showPreview, setShowPreview] = useState(false);
  // If there is an error, don't show pending tool invocations
  if (error) {
    return null;
  }
  if (toolPart.state === "output-error" && !debug) {
    return null;
  }
  // Don't show user choices until all other tools have finished
  // if (toolPart.type === "tool-askUserChoice" && hasToolsRunning) {
  //   return null;
  // }
  // if (toolPart.type === "tool-askUserChoice") {
  //   return (
  //     <AnimatePresence key={toolPart.toolCallId}>
  //       {toolPart.state === "input-available" && (
  //         <motion.div
  //           className={tx("bg-black/5 p-4 rounded-md text-[90%] mt-3")}
  //           initial={{ opacity: 0, height: 0 }}
  //           animate={{ opacity: 1, height: "auto" }}
  //           exit={{ opacity: 0, height: 0 }}
  //           transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
  //         >
  //           <UserChoicesButtons
  //             key={toolPart.toolCallId}
  //             part={toolPart}
  //             addToolResult={addToolResult}
  //             addToolResultMessage={addToolResultMessage}
  //           />
  //         </motion.div>
  //       )}
  //     </AnimatePresence>
  //   );
  // }

  const userFacingToolInfo =
    typeof toolPart.output === "object" && toolPart.output !== null && "waitingMessage" in toolPart.output
      ? toolPart.output
      : typeof toolPart.input === "object" && toolPart.input !== null && "waitingMessage" in toolPart.input
        ? toolPart.input
        : null;

  if (userFacingToolInfo) {
    return (
      <AnimatePresence key={toolPart.toolCallId}>
        {toolPart.state === "input-available" ||
        (toolPart.state === "output-available" && toolPart.preliminary) ? (
          <RunningToolDisplay part={toolPart} />
        ) : toolPart.state === "output-available" ? (
          <motion.div
            className={tx("flex items-center gap-1.5 flex-wrap font-medium")}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <MdDone className={tx("w-4 h-4 text-green-600")} />
            <span>{userFacingToolInfo.waitingMessage as string}</span>

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
                {showPreview && <ImagesPreview key={toolPart.toolCallId} images={toolPart.output} />}
              </>
            )}
            {toolPart.type === "tool-createThemes" && (
              <div className={tx("basis-full flex flex-wrap justify-evenly gap-2 mt-4 mb-2")}>
                {toolPart.output.map((theme) => (
                  <div key={theme.id} className="flex-shrink-0 basis-[calc(33%-2rem)] h-16">
                    <ThemePreview
                      noPreview
                      className="!h-full"
                      selected={false}
                      theme={theme}
                      onClick={() => {}}
                    />
                  </div>
                ))}
              </div>
            )}
            {debug && <ToolCallDebugInfo part={toolPart} />}
          </motion.div>
        ) : toolPart.state === "output-error" ? (
          <motion.div
            className={tx("flex items-center gap-1.5 font-medium")}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <MdDone className={tx("w-4 h-4 text-red-600")} />
            <span>
              {userFacingToolInfo.waitingMessage as string} (Error: {toolPart.errorText})
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
      <summary className={tx("cursor-pointer list-none flex gap-1 items-center")}>
        <svg
          className={tx("-rotate-90 transform opacity-60 transition-all duration-300")}
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
        <span className={tx("text-xs font-normal")}>
          Tool: {part.type} ({part.state})
        </span>
      </summary>
      <pre className={codeClassName}>{JSON.stringify(part, null, 2)}</pre>
    </details>
  );
}

function RunningToolDisplay({
  part,
}: {
  part: ToolUIPart<Tools>;
}) {
  const debug = useDebugMode();
  if (typeof part.input !== "object" || part.input === null) {
    return null;
  }
  if (
    !("waitingMessage" in part.input) &&
    !(typeof part.output === "object" && part.output !== null && "waitingMessage" in part.output)
  ) {
    return null;
  }
  return (
    <motion.div
      className={tx("flex items-center gap-1.5 font-medium flex-wrap")}
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
    >
      <Spinner size="1" className={tx("w-4 mx-0.5")} />
      {/* @ts-ignore */}
      <span>{(part.input.waitingMessage ?? part.output.waitingMessage) as string}</span>
      {debug && (
        <details className={tx("cursor-pointer basis-full")}>
          <summary className={tx("cursor-pointer list-none flex gap-1 items-center")}>
            <svg
              className={tx("-rotate-90 transform opacity-60 transition-all duration-300")}
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
            <span className={tx("text-xs font-normal")}>[{part.type}] View tool call</span>
          </summary>
          <pre className={tx("whitespace-pre-wrap text-xs")}>
            {JSON.stringify({ type: part.type, input: part.input, output: part.output }, null, 2)}
          </pre>
        </details>
      )}
    </motion.div>
  );
}

function ImagesPreview({ images }: { images: SimpleImageMetadata[] }) {
  return (
    <div className={tx("basis-full flex flex-col gap-2 mt-1 mb-6 text-sm ml-6 font-normal")}>
      <div className={tx("grid grid-cols-3 gap-1 min-h-60 max-h-60")}>
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
              <div
                className={tx(
                  "absolute px-1.5 bottom-0 left-0 right-0 bg-black/50 text-white text-[0.6rem] p-0.5 rounded-b-md truncate capitalize",
                )}
              >
                By{" "}
                {image.author.profileUrl ? (
                  <a
                    href={image.author.profileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className={tx("underline hover:text-upstart-300")}
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

import type { UseChatHelpers } from "@ai-sdk/react";
import type { Tools, UpstartUIMessage } from "@upstart.gg/sdk/ai";
import { tx } from "@upstart.gg/style-system/twind";
import type { ToolUIPart } from "ai";
import { motion } from "motion/react";
import { useState } from "react";

export default function UserChoicesButtons({
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
      className={tx("flex flex-wrap gap-2 justify-between")}
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
    >
      {part.input.allowMultiple ? (
        <>
          <div className={tx("flex flex-col flex-wrap gap-1.5")}>
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
          <div className={tx("basis-full w-full mt-6 flex justify-end")}>
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

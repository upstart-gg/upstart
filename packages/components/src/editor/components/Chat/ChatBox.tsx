import { tx } from "@upstart.gg/style-system/twind";
import { Button, Switch } from "@upstart.gg/style-system/system";
import { TbSend2 } from "react-icons/tb";
import { IoIosAttach } from "react-icons/io";
import { BiStopCircle } from "react-icons/bi";
import { type FormEvent, useRef } from "react";
import { useGenerationState } from "../../hooks/use-page-data";
import type { UpstartUIMessage } from "@upstart.gg/sdk/shared/ai/types";

interface ChatBoxProps {
  input: string;
  setInput: (value: string) => void;
  onSubmit: (e: Event | FormEvent) => void;
  status: string;
  disabled: boolean;
  stop: () => void;
  messages: UpstartUIMessage[];
  showWebSearch?: boolean;
  onWebSearchToggle?: () => void;
}

export default function ChatBox({
  input,
  setInput,
  onSubmit,
  status,
  disabled,
  stop,
  messages,
  showWebSearch = false,
  onWebSearchToggle,
}: ChatBoxProps) {
  const promptRef = useRef<HTMLTextAreaElement>(null);
  const generationState = useGenerationState();

  const WEB_SEARCH_ENABLED = false;

  return (
    <form
      onSubmit={onSubmit}
      className={tx(
        "flex flex-col flex-1 min-h-[150px] max-h-[150px] gap-1.5 p-2 justify-center mt-2",
        "bg-upstart-100 border-t border-upstart-300 relative",
        generationState.isReady === false && "rounded-lg",
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
        disabled={disabled}
        name="prompt"
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
          "h-full w-full rounded scrollbar-thin p-2 !pb-9 border-upstart-300 shadow-inner focus:(!outline-0 !ring-upstart-500 !border-upstart-500)",
          disabled ? "!bg-gray-200" : "!bg-white",
        )}
      />
      <div
        className={tx(
          "flex justify-between items-center h-9 text-gray-500 absolute left-[9px] right-[9px] rounded bottom-2.5 px-2 z-50 ",
          disabled ? "bg-gray-200" : "bg-white",
        )}
      >
        <button
          disabled={disabled}
          type="button"
          className={tx("hover:bg-upstart-200 p-1 rounded inline-flex text-sm gap-1")}
        >
          <IoIosAttach className="h-5 w-5" />
        </button>
        {generationState.isReady && WEB_SEARCH_ENABLED && (
          <label className={tx("inline-flex items-center gap-1 text-[80%] select-none")}>
            <Switch
              name="allow_web_search"
              size={"1"}
              onCheckedChange={() => {
                promptRef.current?.focus();
                onWebSearchToggle?.();
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
            disabled={disabled || input.trim().length === 0}
          >
            <TbSend2 className="text-lg" />
          </Button>
        )}
      </div>
    </form>
  );
}

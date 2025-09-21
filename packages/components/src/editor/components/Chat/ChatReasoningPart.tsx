import type { ReasoningUIPart } from "ai";
import { Text } from "@upstart.gg/style-system/system";
import Markdown from "../Markdown";

export default function ChatReasoningPart({ part }: { part: ReasoningUIPart }) {
  return (
    <div className="flex items-center gap-1.5">
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
        <Text as="div" size="2" className="text-gray-500 mt-2 ml-2 border-l-2 border-gray-300 pl-3">
          <Markdown content={part.text} />
        </Text>
      </details>
    </div>
  );
}

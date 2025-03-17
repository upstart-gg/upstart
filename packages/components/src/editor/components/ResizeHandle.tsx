import { tx } from "@upstart.gg/style-system/twind";

export default function ResizeHandle({
  direction,
}: {
  direction: "s" | "w" | "e" | "n" | "sw" | "nw" | "se" | "ne";
}) {
  return (
    <div
      className={tx(
        "react-resizable-handle absolute z-10 transition-opacity duration-300 opacity-0",
        "group-hover/brick:opacity-90 overflow-visible ",
        `react-resizable-handle-${direction}`,
        // test
        // direction === "s" && "resize-handle-disabled",
        {
          "-bottom-0.5 left-px right-px h-1 w-[inherit] cursor-s-resize": direction === "s",
          "top-px -left-0.5 bottom-px w-1 h-[inherit] cursor-w-resize": direction === "w",
          "top-px -right-0.5 bottom-px w-1 h-[inherit] cursor-e-resize": direction === "e",
          "-top-0.5 left-px right-px h-1 w-[inherit] cursor-n-resize": direction === "n",
          // sw and nw
          "bottom-px left-px w-1 h-1 cursor-sw-resize": direction === "sw",
          "top-px left-px w-1 h-1 cursor-nw-resize": direction === "nw",
          // se and ne
          "bottom-px right-px w-1 h-1 cursor-se-resize": direction === "se",
          "top-px right-px w-1 h-1 cursor-ne-resize": direction === "ne",
        },
      )}
    >
      <div
        className={tx(
          "absolute w-[10px] h-[10px] border-upstart-500 bg-white border-2 rounded-sm z-10 shadow-md",
          {
            "top-1/2 -translate-y-1/2 -left-1": direction === "w",
            "top-1/2 -translate-y-1/2 -right-1": direction === "e",
            "left-1/2 -translate-x-1/2 -top-1": direction === "n",
            "left-1/2 -translate-x-1/2 -bottom-1": direction === "s",

            // sw and nw
            "-bottom-1.5 -left-1.5": direction === "sw",
            "-top-1.5 -left-1.5": direction === "nw",

            // se and ne
            "-bottom-1.5 -right-1.5": direction === "se",
            "-top-1.5 -right-1.5": direction === "ne",
          },
        )}
      />
    </div>
  );
}

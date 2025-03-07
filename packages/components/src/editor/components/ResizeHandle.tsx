import { tx } from "@upstart.gg/style-system/twind";

export default function ResizeHandle({
  direction,
}: {
  direction: "s" | "w" | "e" | "n" | "sw" | "nw" | "se" | "ne";
}) {
  return (
    <div
      className={tx(
        "react-resizable-handle absolute z-10 transition-opacity duration-200 opacity-0",
        "group-hover/brick:opacity-90 hover:!opacity-100 overflow-visible",
        `react-resizable-handle-${direction}`,
        {
          "bottom-px left-px right-px h-1 w-[inherit] cursor-s-resize": direction === "s",
          "top-px left-px bottom-px w-1 h-[inherit] cursor-w-resize": direction === "w",
          "top-px right-px bottom-px w-1 h-[inherit] cursor-e-resize": direction === "e",
          "top-px left-px right-px h-1 w-[inherit] cursor-n-resize": direction === "n",
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
            "top-1/2 -translate-y-1/2 -left-[9px]": direction === "w",
            "top-1/2 -translate-y-1/2 -right-[9px]": direction === "e",
            "left-1/2 -translate-x-1/2 -top-[9px]": direction === "n",
            "left-1/2 -translate-x-1/2 -bottom-[9px]": direction === "s",

            // sw and nw
            "-bottom-[9px] -left-[9px]": direction === "sw",
            "-top-[9px] -left-[9px]": direction === "nw",

            // se and ne
            "-bottom-[9px] -right-[9px]": direction === "se",
            "-top-[9px] -right-[9px]": direction === "ne",
          },
        )}
      />
    </div>
  );
}

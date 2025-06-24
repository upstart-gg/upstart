import { tx, css } from "@upstart.gg/style-system/twind";

export default function ResizeHandle({
  direction,
}: {
  direction: "s" | "w" | "e" | "n" | "sw" | "nw" | "se" | "ne";
}) {
  return (
    <div
      className={tx(
        "react-resizable-handle absolute z-auto transition-opacity opacity-0",
        "group-hover/brick:opacity-90 overflow-visible ",
        `react-resizable-handle-${direction}`,
        {
          "-bottom-0 left-0 right-0 h-1 w-[inherit] cursor-s-resize": direction === "s",
          "top-0 left-0 bottom-0 w-1 cursor-w-resize": direction === "w",
          "top-0 right-0 bottom-0 w-1 cursor-e-resize": direction === "e",
          "-top-0 left-0 right-0 h-1 w-[inherit] cursor-n-resize": direction === "n",
          // sw and nw
          "bottom-0 left-0 w-1 h-1 cursor-sw-resize": direction === "sw",
          "top-0 left-0 w-1 h-1 cursor-nw-resize": direction === "nw",
          // se and ne
          "bottom-0 right-0 w-1 h-1 cursor-se-resize": direction === "se",
          "top-0 right-0 w-1 h-1 cursor-ne-resize": direction === "ne",
        },
      )}
    >
      <div
        className={tx(
          "absolute w-[10px] h-[10px] border-upstart-500 bg-white border-2 rounded-full z-[99999] shadow-md",
          {
            "top-1/2 -translate-y-1/2 -left-[5px]": direction === "w",
            "top-1/2 -translate-y-1/2 -right-[5px]": direction === "e",
            "left-1/2 -translate-x-1/2 -top-[5px]": direction === "n",
            "left-1/2 -translate-x-1/2 -bottom-[5px]": direction === "s",

            // sw and nw
            "-bottom-[5px] -left-[5px]": direction === "sw",
            "-top-[5px] -left-[5px]": direction === "nw",

            // se and ne
            "-bottom-[5px] -right-[5px]": direction === "se",
            "-top-[5px] -right-[5px]": direction === "ne",
          },
        )}
      />
    </div>
  );
}

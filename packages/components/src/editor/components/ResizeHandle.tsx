import type { BrickManifest } from "@upstart.gg/sdk/shared/brick-manifest";
import { tx } from "@upstart.gg/style-system/twind";

export default function ResizeHandle({
  direction,
  show,
  manifest,
}: {
  direction: "s" | "w" | "e" | "n" | "sw" | "nw" | "se" | "ne";
  show: boolean;
  manifest: BrickManifest;
}) {
  return (
    <button
      type="button"
      className={tx(
        "resizable-handle absolute focus:outline-none",
        "overflow-visible z-[9998]",
        `resizable-handle-${direction}`,
        {
          "-bottom-[2px] left-0 right-0 h-[6px] cursor-row-resize": direction === "s",
          "-top-[2px] left-0 right-0 h-[6px] cursor-row-resize": direction === "n",
          "top-0 -left-[2px] bottom-0 w-[6px] cursor-col-resize": direction === "w",
          "top-0 -right-[2px] bottom-0 w-[6px] cursor-col-resize": direction === "e",
          // sw and nw
          "-bottom-[2px] -left-[2px] w-[6px] h-[6px] cursor-nesw-resize": direction === "sw",
          "-top-[2px] -left-[2px] w-[6px] h-[6px] cursor-nwse-resize": direction === "nw",
          // se and ne
          "-bottom-[2px] -right-[2px] w-[6px] h-[6px] cursor-nwse-resize": direction === "se",
          "-top-[2px] -right-[2px] w-[6px] h-[6px] cursor-nesw-resize": direction === "ne",
        },
      )}
    >
      <div
        className={tx(
          "opacity-0 z-[9999] group-hover/brick:opacity-100 transition-opacity absolute w-[10px] h-[10px] bg-white border-2 rounded-full shadow-md resizable-handle-dot",
          manifest.isContainer ? "border-orange-500" : "border-upstart-500",
          show && "opacity-100",
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
    </button>
  );
}

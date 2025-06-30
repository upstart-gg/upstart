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
        "resizable-handle absolute z-[9999] transition-opacity opacity-0 group-hover/brick:opacity-100",
        "overflow-visible z-[9998]",
        show && "opacity-100",
        `resizable-handle-${direction}`,
        {
          "bottom-0 left-0 right-0 h-[10px] w-[inherit] cursor-row-resize": direction === "s",
          "top-0 left-0 right-0 h-[10px] w-[inherit] cursor-row-resize": direction === "n",
          "top-0 left-0 bottom-0 w-[10px] cursor-col-resize": direction === "w",
          "top-0 right-0 bottom-0 w-[10px] cursor-col-resize": direction === "e",
          // sw and nw
          "bottom-0 left-0 w-[10px] h-[10px] cursor-nesw-resize": direction === "sw",
          "top-0 left-0 w-[10px] h-[10px] cursor-nwse-resize": direction === "nw",
          // se and ne
          "bottom-0 right-0 w-[10px] h-[10px] cursor-nwse-resize": direction === "se",
          "top-0 right-0 w-[10px] h-[10px] cursor-nesw-resize": direction === "ne",
        },
      )}
    >
      <div
        className={tx(
          "opacity-0 group-hover/brick:opacity-100 transition-opacity absolute w-[10px] h-[10px] bg-white border-2 rounded-full z-auto shadow-md resizable-handle-dot",
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

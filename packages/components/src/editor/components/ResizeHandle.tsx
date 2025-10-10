import type { BrickManifest } from "@upstart.gg/sdk/bricks";
import { tx } from "@upstart.gg/style-system/twind";
import { usePreviewMode } from "../hooks/use-editor";

export default function ResizeHandle({
  direction,
  show,
  manifest,
}: {
  direction: "s" | "w" | "e" | "n" | "sw" | "nw" | "se" | "ne";
  show: boolean;
  manifest: BrickManifest;
  isContainerChild?: boolean;
}) {
  const previewMode = usePreviewMode();
  if (previewMode === "mobile" && direction !== "s" && direction !== "n") {
    return null; // Hide resize handles for mobile view except for vertical resizing
  }
  const dotShift = manifest.isContainer ? 8 : 6; // Adjust dot position based on whether it's a container
  return (
    <button
      type="button"
      className={tx(
        "resizable-handle absolute focus:outline-none",
        "overflow-visible z-[9999]",
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
          "z-[9999] absolute w-[10px] h-[10px] bg-white border-2 rounded-full shadow-md resizable-handle-dot",
          manifest.isContainer ? "border-orange-500" : "border-upstart-500",
          show && "opacity-100",
          {
            [`top-1/2 -translate-y-1/2 -left-[${dotShift}px]`]: direction === "w",
            [`top-1/2 -translate-y-1/2 -right-[${dotShift}px]`]: direction === "e",
            [`left-1/2 -translate-x-1/2 -top-[${dotShift}px]`]: direction === "n",
            [`left-1/2 -translate-x-1/2 -bottom-[${dotShift}px]`]: direction === "s",

            // sw and nw
            [`-bottom-[${dotShift}px] -left-[${dotShift}px]`]: direction === "sw",
            [`-top-[${dotShift}px] -left-[${dotShift}px]`]: direction === "nw",

            // se and ne
            [`-bottom-[${dotShift}px] -right-[${dotShift}px]`]: direction === "se",
            [`-top-[${dotShift}px] -right-[${dotShift}px]`]: direction === "ne",
          },
        )}
      />
    </button>
  );
}

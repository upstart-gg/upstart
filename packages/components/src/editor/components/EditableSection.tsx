import interact from "interactjs";
import type { Section as SectionType } from "@upstart.gg/sdk/shared/bricks";
import { usePreviewMode, useSection, useSelectedBrick } from "../hooks/use-editor";
import { DropdownMenu } from "@upstart.gg/style-system/system";
import BrickWrapper from "./EditableBrick";
import ResizeHandle from "./ResizeHandle";
import { useSectionStyle } from "~/shared/hooks/use-section-style";
import {
  TbArrowAutofitHeight,
  TbBorderCorners,
  TbArrowUp,
  TbArrowDown,
  TbArrowUpBar,
  TbDots,
} from "react-icons/tb";
import { tx } from "@upstart.gg/style-system/twind";
import { useEffect, useRef, useState } from "react";
import invariant from "@upstart.gg/sdk/shared/utils/invariant";

export default function EditableSection(section: SectionType) {
  const { bricks, id } = useSection(section.id);
  useResizableSection(section);
  const previewMode = usePreviewMode();
  // todo: replace by selected section or merge the two notions
  const selectedBrick = useSelectedBrick();
  const className = useSectionStyle({ section, editable: true, selected: selectedBrick?.id === section.id });
  return (
    <section key={id} id={id} data-element-type="section" className={className}>
      <SectionResizeHandle section={section} />
      {bricks
        .filter((b) => !b.position[previewMode]?.hidden)
        .map((brick, index) => (
          <BrickWrapper key={`${previewMode}-${brick.id}`} brick={brick} index={index}>
            <ResizeHandle direction="s" />
            <ResizeHandle direction="n" />
            <ResizeHandle direction="w" />
            <ResizeHandle direction="e" />
            <ResizeHandle direction="se" />
            <ResizeHandle direction="sw" />
            <ResizeHandle direction="ne" />
            <ResizeHandle direction="nw" />
          </BrickWrapper>
        ))}
    </section>
  );
}

function useResizableSection(section: SectionType) {
  // Use interact.js to allow resizing a section manually
  const interactable = useRef<Interact.Interactable | null>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const handle = document.getElementById(`${section.id}-resize-handle`);
    const line = document.getElementById(`${section.id}-resize-line`);
    const sectionEl = document.getElementById(section.id);

    invariant(sectionEl, "Section element not found");
    invariant(handle, "Resize handle not found");
    invariant(line, "Resize line not found");

    interactable.current = interact(`#${section.id}`);
    interactable.current.resizable({
      edges: {
        top: false,
        left: false,
        bottom: ".section-resizable-handle",
        right: false,
      },
      inertia: true,
      autoScroll: false,
      listeners: {
        start: (event) => {
          event.stopPropagation();
          // resizeCallbacks.onResizeStart?.(event);
        },
        move: (event) => {
          event.stopPropagation();

          const h = sectionEl.dataset.h ? parseFloat(sectionEl.dataset.h) : sectionEl.offsetHeight;
          const newHeight = h + event.delta.y;

          Object.assign(sectionEl.style, {
            height: `${newHeight}px`,
            maxHeight: `${newHeight}px`,
            flex: "none",
          });
          Object.assign(sectionEl.dataset, { h: newHeight });
        },
        end: (event) => {
          console.log("resize end");
          Object.assign(line.style, {
            opacity: "0",
          });
        },
      },
    });
    return () => {
      interactable.current?.unset();
      interactable.current = null;
    };
  }, []);
}

function SectionResizeHandle({ section }: { section: SectionType }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  return (
    <>
      {/* this is a line that will be displayed when the section is resized */}
      <div
        id={`${section.id}-resize-line`}
        className="section-resizable-line absolute z-[99998] -bottom-0 right-0 left-0 h-1
        bg-upstart-500/70 transition-opacity duration-500 opacity-0 group-hover/section:opacity-50"
      />
      <div className="absolute z-[99999] -bottom-5 left-1/2 -translate-x-1/2 flex gap-0 rounded-md [&>*:first-child]:rounded-l-md [&>*:last-child]:rounded-r-md">
        <button
          type="button"
          id={`${section.id}-resize-handle`}
          className={tx(
            "section-resizable-handle select-none",
            " text-base px-2.5 h-10 backdrop-blur-md shadow-lg",
            "transition-opacity duration-500 opacity-0 group-hover/section:opacity-80 hover:!opacity-100",
            "bg-white/70 border-2 border-white/80 text-black/80 font-bold flex items-center cursor-ns-resize gap-1",
            dialogOpen && "opacity-100",
          )}
        >
          <TbArrowAutofitHeight className="w-6 h-6" />
          Resize
        </button>
        <button
          type="button"
          className={tx(
            "select-none",
            "text-base px-2.5 h-10 backdrop-blur-md shadow-lg",
            "transition-opacity duration-500 opacity-0 group-hover/section:opacity-80 hover:!opacity-100 active:shadow-md",
            "bg-white/70 border-2 border-white/80 text-black/80 font-bold flex items-center cursor-pointer gap-1",
            dialogOpen && "opacity-100",
          )}
        >
          <TbBorderCorners className="w-6 h-6" />
        </button>

        <DropdownMenu.Root modal={false} onOpenChange={setDialogOpen}>
          <DropdownMenu.Trigger>
            <button
              type="button"
              className={tx(
                "select-none",
                "text-base px-2.5 h-10 backdrop-blur-md shadow-lg",
                "transition-opacity duration-500 opacity-0 group-hover/section:opacity-80 hover:!opacity-100",
                "bg-white/70 border-2 border-white/80 text-black/80 font-bold flex items-center cursor-pointer gap-1 active:(outline-none ring-0) focus:(outline-none ring-0)",
                dialogOpen && "opacity-100 shadow-md",
              )}
            >
              <TbDots className="w-6 h-6" />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content sideOffset={-2} size="2">
            <DropdownMenu.Item className="!pl-1">
              <div className="flex items-center justify-start gap-1.5">
                <TbArrowUp className="w-4 h-4" />
                <span>Move up</span>
              </div>
            </DropdownMenu.Item>
            <DropdownMenu.Item className="!pl-1">
              <div className="flex items-center justify-start gap-1.5">
                <TbArrowDown className="w-4 h-4" />
                <span>Move down</span>
              </div>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>
    </>
  );
}

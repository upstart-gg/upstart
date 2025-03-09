import interact from "interactjs";
import type { Section as SectionType } from "@upstart.gg/sdk/shared/bricks";
import {
  useDraftHelpers,
  usePreviewMode,
  useSection,
  useSections,
  useSelectedBrick,
} from "../hooks/use-editor";
import { DropdownMenu, Popover, Tooltip } from "@upstart.gg/style-system/system";
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
  TbBackground,
  TbTrash,
} from "react-icons/tb";
import { VscSettings } from "react-icons/vsc";
import { PiWaveSine } from "react-icons/pi";

import { tx } from "@upstart.gg/style-system/twind";
import { useEffect, useRef, useState } from "react";
import invariant from "@upstart.gg/sdk/shared/utils/invariant";
import TestMenu from "./json-form/TestMenu";
import type { GridConfig } from "~/shared/hooks/use-grid-config";
import { getGridSize } from "~/shared/utils/layout-utils";

type EditableSectionProps = {
  section: SectionType;
  gridConfig: GridConfig;
};

export default function EditableSection({ section, gridConfig }: EditableSectionProps) {
  const { bricks, id } = useSection(section.id);
  useResizableSection(section, gridConfig);

  const previewMode = usePreviewMode();
  // todo: replace by selected section or merge the two notions
  const selectedBrick = useSelectedBrick();
  const className = useSectionStyle({ section, editable: true, selected: selectedBrick?.id === section.id });

  return (
    <section key={id} id={id} data-element-type="section" className={className}>
      <SectionOptionsButtons section={section} />
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

function useResizableSection(section: SectionType, gridConfig: GridConfig) {
  // Use interact.js to allow resizing a section manually
  const interactable = useRef<Interact.Interactable | null>(null);
  const draftHelpers = useDraftHelpers();
  const previewMode = usePreviewMode();

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const handle = document.getElementById(`${section.id}-resize-handle`);
    const sectionEl = document.getElementById(section.id);

    invariant(sectionEl, "Section element not found");
    invariant(handle, "Resize handle not found");

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

          requestAnimationFrame(() => {
            Object.assign(sectionEl.style, {
              height: `${newHeight}px`,
              maxHeight: `${newHeight}px`,
              flex: "none",
            });
          });

          Object.assign(sectionEl.dataset, { h: newHeight });
        },
        end: (event) => {
          const size = getGridSize(sectionEl, gridConfig);
          sectionEl.style.height = "";
          sectionEl.style.maxHeight = "";
          sectionEl.style.flex = "";
          sectionEl.dataset.h = "";
          draftHelpers.updateSection(section.id, {
            position: {
              ...section.position,
              [previewMode]: {
                h: size.h,
              },
            },
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

function SectionOptionsButtons({ section }: { section: SectionType }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const draftHelpers = useDraftHelpers();
  const sections = useSections();
  const isLastSection = section.order === sections.length - 1;
  const isFirstSection = section.order === 0;
  return (
    <>
      <Popover.Root onOpenChange={setModalOpen}>
        {/* Don't put height on Popover otherwise it bugs and disapears just after appearing */}
        <Popover.Content width="390px" className="!p-0">
          <TestMenu />
        </Popover.Content>
        <div
          className={tx(
            "section-options-buttons",
            "absolute z-[99999] left-1/2 -translate-x-1/2 flex gap-0 rounded-md [&>*:first-child]:rounded-l-md [&>*:last-child]:rounded-r-md",
            isLastSection ? "bottom-1" : "-bottom-5",
          )}
        >
          <Tooltip content="Drag vertically to resize section" delayDuration={500}>
            <button
              type="button"
              id={`${section.id}-resize-handle`}
              className={tx(
                dropdownOpen || modalOpen ? "opacity-100" : "opacity-0",
                "section-resizable-handle select-none",
                " text-base px-2.5 h-10 backdrop-blur-md shadow-lg",
                "transition-opacity duration-500 group-hover/section:opacity-80 hover:!opacity-100",
                "bg-white/70 border-2 border-white/80 text-black/80 font-bold flex items-center cursor-ns-resize gap-1",
              )}
            >
              <TbArrowAutofitHeight className="w-6 h-6" />
            </button>
          </Tooltip>
          <Tooltip content="Fill entire screen height" delayDuration={500}>
            <button
              type="button"
              onClick={() =>
                draftHelpers.updateSection(section.id, {
                  position: {
                    desktop: {
                      h: "full",
                    },
                    mobile: {
                      h: "full",
                    },
                  },
                })
              }
              className={tx(
                "select-none",
                dropdownOpen || modalOpen ? "opacity-100" : "opacity-0",
                "text-base px-2.5 h-10 backdrop-blur-md shadow-lg",
                "transition-opacity duration-500 group-hover/section:opacity-80 hover:!opacity-100 active:shadow-md",
                "bg-white/70 border-2 border-white/80 text-black/80 font-bold flex items-center cursor-pointer gap-1",
              )}
            >
              <TbBorderCorners className="w-6 h-6" />
            </button>
          </Tooltip>
          <DropdownMenu.Root modal={false} onOpenChange={setDropdownOpen}>
            <DropdownMenu.Trigger>
              <button
                type="button"
                className={tx(
                  "select-none",
                  dropdownOpen || modalOpen ? "opacity-100" : "opacity-0",
                  "text-base px-2.5 h-10 backdrop-blur-md shadow-lg",
                  "transition-opacity duration-500 group-hover/section:opacity-80 hover:!opacity-100",
                  "bg-white/70 border-2 border-white/80 text-black/80 font-bold flex items-center cursor-pointer gap-1 active:(outline-none ring-0) focus:(outline-none ring-0)",
                )}
              >
                <TbDots className="w-6 h-6" />
                <Popover.Anchor />
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content sideOffset={-2} size="2">
              <DropdownMenu.Group>
                <DropdownMenu.Label>Manage {section.label ?? "section"}</DropdownMenu.Label>
                {!isFirstSection && (
                  <DropdownMenu.Item onClick={() => draftHelpers.moveSectionUp(section.id)}>
                    <div className="flex items-center justify-start gap-2">
                      <TbArrowUp className="w-4 h-4" />
                      <span>Reorder up</span>
                    </div>
                  </DropdownMenu.Item>
                )}
                {!isLastSection && (
                  <DropdownMenu.Item onClick={() => draftHelpers.moveSectionDown(section.id)}>
                    <div className="flex items-center justify-start gap-2">
                      <TbArrowDown className="w-4 h-4" />
                      <span>Reorder down</span>
                    </div>
                  </DropdownMenu.Item>
                )}
              </DropdownMenu.Group>
              <DropdownMenu.Separator />
              <DropdownMenu.Group>
                <Popover.Trigger>
                  <DropdownMenu.Item>
                    <div className="flex items-center justify-start gap-2.5">
                      <VscSettings className="w-4 h-4" />
                      <span>Settings</span>
                    </div>
                  </DropdownMenu.Item>
                </Popover.Trigger>
              </DropdownMenu.Group>
              <DropdownMenu.Separator />
              <DropdownMenu.Item color="red" onClick={() => draftHelpers.deleteSection(section.id)}>
                <div className="flex items-center justify-start gap-2.5">
                  <TbTrash className="w-4 h-4" />
                  <span>Delete</span>
                </div>
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </div>
      </Popover.Root>
    </>
  );
}

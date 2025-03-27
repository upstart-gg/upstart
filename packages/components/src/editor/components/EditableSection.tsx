import interact from "interactjs";
import type { Section as SectionType } from "@upstart.gg/sdk/shared/bricks";
import { useDraftHelpers, usePreviewMode, useSection, useSections } from "../hooks/use-editor";
import { DropdownMenu, Popover, Tooltip } from "@upstart.gg/style-system/system";
import EditableBrickWrapper from "./EditableBrick";
import ResizeHandle from "./ResizeHandle";
import { useSectionStyle } from "~/shared/hooks/use-section-style";
import {
  TbArrowAutofitHeight,
  TbBorderCorners,
  TbArrowUp,
  TbArrowDown,
  TbDots,
  TbTrash,
} from "react-icons/tb";
import { VscSettings } from "react-icons/vsc";
import { tx } from "@upstart.gg/style-system/twind";
import { useEffect, useRef, useState } from "react";
import invariant from "@upstart.gg/sdk/shared/utils/invariant";
import type { GridConfig } from "~/shared/hooks/use-grid-config";
import { getBrickResizeOptions, getGridPosition } from "~/shared/utils/layout-utils";
import { manifests } from "@upstart.gg/sdk/shared/bricks/manifests/all-manifests";
import { brickWithDefaults } from "@upstart.gg/sdk/shared/bricks";

type EditableSectionProps = {
  section: SectionType;
  gridConfig: GridConfig;
};

export default function EditableSection({ section, gridConfig }: EditableSectionProps) {
  const { bricks, id } = useSection(section.id);
  useResizableSection(section, gridConfig);

  const previewMode = usePreviewMode();
  const className = useSectionStyle({ section, editable: true });

  return (
    <section key={id} id={id} data-element-kind="section" className={className}>
      <SectionOptionsButtons section={section} />
      {bricks
        .filter((b) => !b.position[previewMode]?.hidden && !b.parentId)
        .map((brick, index) => {
          const resizeOpts = getBrickResizeOptions(brick, manifests[brick.type], previewMode);
          // const brickWithDef = brickWithDefaults(brick);
          return (
            <EditableBrickWrapper key={`${previewMode}-${brick.id}`} brick={brick} index={index}>
              {manifests[brick.type]?.resizable && (
                <>
                  {(resizeOpts.canGrowVertical || resizeOpts.canShrinkVertical) && (
                    <>
                      <ResizeHandle direction="s" />
                      <ResizeHandle direction="n" />
                    </>
                  )}
                  {(resizeOpts.canGrowHorizontal || resizeOpts.canShrinkHorizontal) && (
                    <>
                      <ResizeHandle direction="w" />
                      <ResizeHandle direction="e" />
                    </>
                  )}
                  {((resizeOpts.canGrowVertical && resizeOpts.canGrowHorizontal) ||
                    (resizeOpts.canShrinkVertical && resizeOpts.canShrinkHorizontal)) && (
                    <>
                      <ResizeHandle direction="se" />
                      <ResizeHandle direction="sw" />
                      <ResizeHandle direction="ne" />
                      <ResizeHandle direction="nw" />
                    </>
                  )}
                </>
              )}
            </EditableBrickWrapper>
          );
        })}
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
    const sectionEl = document.getElementById(section.id);

    invariant(sectionEl, "Section element not found");

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
          const size = getGridPosition(sectionEl, gridConfig);
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
  const previewMode = usePreviewMode();
  const isLastSection = section.order === sections.length - 1;
  const isFirstSection = section.order === 0;

  const btnCls = tx(
    "select-none",
    "text-base px-2.5 h-9  ",
    "text-black/80 font-bold flex items-center gap-1",
    "active:(outline-none ring-0) focus:(outline-none ring-0)",
  );
  return (
    <>
      <Popover.Root onOpenChange={setModalOpen}>
        {/* Don't put height on Popover otherwise it bugs and disapears just after appearing */}
        <Popover.Content width="390px" className="!p-0">
          Foo
        </Popover.Content>
        <div
          className={tx(
            dropdownOpen || modalOpen ? "opacity-100" : "opacity-0",
            "section-options-buttons bottom-0 absolute z-[99999] left-1/2 -translate-x-1/2 border border-gray-200 border-b-0",
            "flex gap-0 rounded-t-md [&>*:first-child]:rounded-tl-md [&>*:last-child]:rounded-tr-md divide-x divide-white/80",
            "bg-white/70 backdrop-blur-md transition-opacity duration-500  group-hover/section:opacity-80",
          )}
        >
          <div
            className={tx(btnCls, "cursor-default flex-col leading-[0.5] items-start justify-center gap-0")}
          >
            <div className="text-xs font-light leading-[0.8] ">Section</div>
            <div className="text-sm font-semibold -mt-2">{section.label ?? "No name"}</div>
          </div>
          {!isLastSection && (
            <Tooltip content="Drag vertically to resize section" delayDuration={500}>
              <button
                type="button"
                id={`${section.id}-resize-handle`}
                className={tx(btnCls, "cursor-ns-resize", "section-resizable-handle")}
              >
                <TbArrowAutofitHeight className="w-6 h-6" />
              </button>
            </Tooltip>
          )}
          {section.position[previewMode]?.h !== "full" && (
            <Tooltip content="Fill entire screen height" delayDuration={500}>
              <button
                type="button"
                onClick={() => {
                  draftHelpers.updateSection(section.id, {
                    position: {
                      desktop: {
                        h: "full",
                      },
                      mobile: {
                        h: "full",
                      },
                    },
                  });
                  setTimeout(() => {
                    window.scrollTo(0, document.body.scrollHeight);
                    document.getElementById(section.id)?.scrollIntoView({ behavior: "smooth" });
                  }, 100);
                }}
                className={tx(btnCls, "cursor-pointer")}
              >
                <TbBorderCorners className="w-6 h-6" />
              </button>
            </Tooltip>
          )}
          <DropdownMenu.Root modal={false} onOpenChange={setDropdownOpen}>
            <DropdownMenu.Trigger>
              <button type="button" className={tx(btnCls)}>
                <TbDots className="w-6 h-6" />
                <Popover.Anchor />
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content sideOffset={5} size="2" side="bottom" align="end">
              <DropdownMenu.Group>
                <DropdownMenu.Label>{section.label ?? ""} section</DropdownMenu.Label>
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

import interact from "interactjs";
import type { Section as SectionType } from "@upstart.gg/sdk/shared/bricks";
import {
  useDraftHelpers,
  useEditorHelpers,
  useGridConfig,
  usePreviewMode,
  useSection,
  useSections,
  useSelectedBrickId,
  useSelectedSectionId,
} from "../hooks/use-editor";
import { DropdownMenu, Inset, Popover, Tooltip, useMergeRefs } from "@upstart.gg/style-system/system";
import EditableBrickWrapper from "./EditableBrick";
import ResizeHandle from "./ResizeHandle";
import { useSectionStyle } from "~/shared/hooks/use-section-style";
import { TbArrowAutofitHeight, TbBorderCorners, TbDots } from "react-icons/tb";
import { startTransition, useEffect, useRef, useState, type MouseEvent } from "react";
import invariant from "@upstart.gg/sdk/shared/utils/invariant";
import { useGridObserver, type GridConfig } from "~/shared/hooks/use-grid-observer";
import { getBrickResizeOptions, getBrickPosition } from "~/shared/utils/layout-utils";
import { manifests } from "@upstart.gg/sdk/shared/bricks/manifests/all-manifests";
import SectionSettingsView from "./SectionSettingsView";
import { tx, css } from "@upstart.gg/style-system/twind";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import { useCmdOrCtrlPressed } from "../hooks/use-key-pressed";

type EditableSectionProps = {
  section: SectionType;
  index: number;
};

export default function EditableSection({ section, index }: EditableSectionProps) {
  const { bricks, id } = section;

  const ref = useRef<HTMLDivElement>(null);
  const gridConfig = useGridConfig();
  const { setSelectedSectionId, setPanel } = useEditorHelpers();
  const isCmdOrCtrlPressed = useCmdOrCtrlPressed();

  const { resizing } = useResizableSection(section, gridConfig);

  const previewMode = usePreviewMode();
  const selectedSectionId = useSelectedSectionId();
  const selectedBrickId = useSelectedBrickId();
  const className = useSectionStyle({
    section,
    editable: true,
    selected: selectedSectionId === section.id,
    previewMode,
  });

  const onClick = (e: MouseEvent) => {
    if (e.defaultPrevented || resizing) {
      // If the click was handled by a child element, do not propagate
      return;
    }
    console.log("SECTION ONCLICK", e);
    setSelectedSectionId(section.id);
    setPanel("inspector");
  };

  return (
    <Draggable draggableId={section.id} index={index} isDragDisabled={!isCmdOrCtrlPressed}>
      {(draggableProvided, draggableSnapshot) => {
        return (
          <Droppable droppableId={section.id} type="brick" direction="horizontal">
            {(droppableProvided, droppableSnapshot) => {
              // Merge the section and droppable div into one element
              const mergedRef = useMergeRefs([draggableProvided.innerRef, droppableProvided.innerRef, ref]);

              return (
                <section
                  key={id}
                  id={id}
                  ref={mergedRef}
                  {...droppableProvided.droppableProps}
                  {...draggableProvided.draggableProps}
                  {...draggableProvided.dragHandleProps}
                  data-element-kind="section"
                  onClick={onClick}
                  className={tx(
                    className,
                    "flex flex-row gap-4 min-h-40 w-full bg-green-500",
                    draggableSnapshot.isDragging && "opacity-50",
                    droppableSnapshot.isDraggingOver && "bg-blue-50 border-2 border-blue-300 border-dashed",
                    isCmdOrCtrlPressed && "cursor-move border-2 border-blue-300 border-dashed",
                    !isCmdOrCtrlPressed && "border-2 border-transparent",
                  )}
                >
                  {!selectedBrickId && <SectionOptionsButtons section={section} />}
                  {/* Show visual indicator when sections can be dragged */}
                  {isCmdOrCtrlPressed && (
                    <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium z-50">
                      Sections can be dragged
                    </div>
                  )}
                  {bricks
                    .filter((b) => !b.props.hidden?.[previewMode])
                    .map((brick, brickIndex) => {
                      const resizeOpts = getBrickResizeOptions(brick, manifests[brick.type], previewMode);
                      const test = Math.random();
                      return (
                        <EditableBrickWrapper
                          key={`${previewMode}-${brick.id}`}
                          brick={brick}
                          index={brickIndex}
                        >
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

                  {bricks.length === 0 && (
                    <div className="w-full self-stretch min-h-40 flex-1 text-center rounded bg-gray-100 flex justify-center items-center text-base text-black/50 font-medium">
                      This is a section.
                      <br />
                      Drag bricks here to stack them inside.
                    </div>
                  )}
                  {droppableProvided.placeholder}
                </section>
              );
            }}
          </Droppable>
        );
      }}
    </Draggable>
  );
}

function useResizableSection(section: SectionType, gridConfig?: GridConfig) {
  // Use interact.js to allow resizing a section manually
  const interactable = useRef<Interact.Interactable | null>(null);
  const draftHelpers = useDraftHelpers();
  const previewMode = usePreviewMode();
  const [resizing, setResizing] = useState(false);

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
          setResizing(true);
          event.stopPropagation();

          const h = sectionEl.dataset.h ? parseFloat(sectionEl.dataset.h) : sectionEl.offsetHeight;
          const newHeight = h + event.delta.y;

          requestAnimationFrame(() => {
            Object.assign(sectionEl.style, {
              minHeight: `${newHeight}px`,
              maxHeight: `${newHeight}px`,
              flex: "none",
            });
          });

          Object.assign(sectionEl.dataset, { h: newHeight });
        },
        end: (event) => {
          startTransition(() => {
            setResizing(false);
          });
          event.stopPropagation();
          event.preventDefault();
          const size = getBrickPosition(sectionEl, previewMode);
          sectionEl.style.height = "";
          sectionEl.style.maxHeight = "";
          sectionEl.style.flex = "";
          sectionEl.dataset.h = "";
          draftHelpers.updateSectionProps(section.id, {
            minHeight: `${size.h}px`,
          });
        },
      },
    });
    return () => {
      interactable.current?.unset();
      interactable.current = null;
    };
  }, []);

  return {
    resizing,
  };
}

function SectionOptionsButtons({ section }: { section: SectionType }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const draftHelpers = useDraftHelpers();
  const { setSelectedSectionId, setPanel, setSelectedBrickId } = useEditorHelpers();
  const sections = useSections();
  const isCmdOrCtrlPressed = useCmdOrCtrlPressed();
  const isLastSection = section.order === sections.length - 1;
  const isFirstSection = section.order === 0;

  const btnCls = tx(
    "select-none hover:opacity-90",
    "text-base px-2.5 h-9  ",
    "text-black/80 font-bold flex items-center gap-1",
    "active:(outline-none ring-0) focus:(outline-none ring-0)",
  );
  return (
    <div
      role="toolbar"
      className={tx(
        dropdownOpen || modalOpen ? "opacity-100" : "opacity-0",
        `section-options-buttons bottom-0
            absolute z-[99999] left-1/2 -translate-x-1/2 border border-gray-200 border-b-0`,
        "gap-0 rounded-t-md [&>*:first-child]:rounded-tl-md [&>*:last-child]:rounded-tr-md divide-x divide-white/80",
        "bg-white/70 backdrop-blur-md transition-opacity duration-500  group-hover/section:opacity-80 flex",
        isCmdOrCtrlPressed && "opacity-100 ring-2 ring-blue-300",
      )}
    >
      <div
        className={tx(btnCls, "cursor-pointer flex-col items-start justify-center gap-0 hover:text-black")}
      >
        <div className="text-xs font-light leading-[0.9] ">Section</div>
        <div className="text-sm font-semibold -mt-1.5">{section.label ?? `${section.order + 1}`}</div>
      </div>
      {/* {!isLastSection && ( */}
      <span
        id={`${section.id}-resize-handle`}
        className={tx("!cursor-ns-resize", btnCls, "section-resizable-handle")}
      >
        <TbArrowAutofitHeight className="w-6 h-6" />
      </span>
      {/* )} */}
      {section.props.minHeight !== "full" && (
        <Tooltip content="Fill entire screen height" delayDuration={500}>
          <button
            type="button"
            onClick={() => {
              draftHelpers.updateSectionProps(section.id, {
                minHeight: "full",
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
        <DropdownMenu.Trigger
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <button type="button" className={tx(btnCls)}>
            <TbDots className="w-6 h-6" />
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content sideOffset={5} size="2" side="bottom" align="end">
          <DropdownMenu.Group>
            <DropdownMenu.Label>{section.label ?? ""} section</DropdownMenu.Label>
            {!isFirstSection && (
              <DropdownMenu.Item onClick={() => draftHelpers.moveSectionUp(section.id)}>
                <div className="flex items-center justify-start gap-2">
                  <span>Reorder up</span>
                </div>
              </DropdownMenu.Item>
            )}
            {!isLastSection && (
              <DropdownMenu.Item onClick={() => draftHelpers.moveSectionDown(section.id)}>
                <div className="flex items-center justify-start gap-2">
                  <span>Reorder down</span>
                </div>
              </DropdownMenu.Item>
            )}
          </DropdownMenu.Group>
          <DropdownMenu.Separator />
          <DropdownMenu.Group>
            <DropdownMenu.Item
              onClick={(e) => {
                e.stopPropagation();
                draftHelpers.createEmptySection(section.id);
              }}
            >
              <div className="flex items-center justify-start gap-2">
                <span>Create new section below</span>
              </div>
            </DropdownMenu.Item>
            <DropdownMenu.Item
              onClick={(e) => {
                e.stopPropagation();
                draftHelpers.duplicateSection(section.id);
              }}
            >
              <div className="flex items-center justify-start gap-2">
                <span>Duplicate</span>
              </div>
            </DropdownMenu.Item>
            {/* <DropdownMenu.Item
              onClick={() => {
                setSelectedSectionId(section.id);
                setPanel("inspector");
              }}
            >
              <div className="flex items-center justify-start gap-2">
                <span>Settings</span>
              </div>
            </DropdownMenu.Item> */}
          </DropdownMenu.Group>
          <DropdownMenu.Separator />
          <DropdownMenu.Item
            color="red"
            onClick={(e) => {
              e.stopPropagation();
              draftHelpers.deleteSection(section.id);
              setSelectedSectionId();
              setSelectedBrickId();
              setPanel();
            }}
          >
            <div className="flex items-center justify-start gap-2.5">
              <span>Delete</span>
            </div>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  );
}

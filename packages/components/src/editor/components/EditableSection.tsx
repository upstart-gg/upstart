import interact from "interactjs";
import { generateId, type Section as SectionType } from "@upstart.gg/sdk/shared/bricks";
import {
  useDraftHelpers,
  useDraggingBrickType,
  useEditorHelpers,
  useGridConfig,
  usePreviewMode,
  useSection,
  useSections,
  useSelectedBrickId,
  useSelectedSectionId,
} from "../hooks/use-editor";
import { DropdownMenu, Inset, Popover, Tooltip } from "@upstart.gg/style-system/system";
import EditableBrickWrapper from "./EditableBrick";
import { useSectionStyle } from "~/shared/hooks/use-section-style";
import { TbArrowAutofitHeight, TbBorderCorners, TbDots } from "react-icons/tb";
import { startTransition, useEffect, useLayoutEffect, useRef, useState, type MouseEvent } from "react";
import invariant from "@upstart.gg/sdk/shared/utils/invariant";
import { getBrickResizeOptions, getBrickPosition } from "~/shared/utils/layout-utils";
import { manifests } from "@upstart.gg/sdk/shared/bricks/manifests/all-manifests";
import SectionSettingsView from "./SectionSettingsView";
import { tx, css } from "@upstart.gg/style-system/twind";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import { useMutationObserver } from "../hooks/use-mutation-observer";
import { useDeepCompareEffect } from "use-deep-compare";

type EditableSectionProps = {
  section: SectionType;
  index: number;
};

export default function EditableSection({ section, index }: EditableSectionProps) {
  const { bricks, id } = section;
  const { setSelectedSectionId, setPanel } = useEditorHelpers();
  const { resizing } = useResizableSection(section);
  const draftHelpers = useDraftHelpers();
  const previewMode = usePreviewMode();
  const selectedSectionId = useSelectedSectionId();
  const selectedBrickId = useSelectedBrickId();
  const draggingBrickType = useDraggingBrickType();
  const className = useSectionStyle({
    section,
    editable: true,
    selected: selectedSectionId === section.id,
    previewMode,
  });
  const sectionObj = useSection(section.id);

  useDeepCompareEffect(() => {
    // This effect runs when the section object changes, which includes props updates
    console.log("EditableSection useDeepCompareEffect", sectionObj?.section.id);
    // Check if the section is overflowing vertically
    const sectionEl = document.getElementById(section.id);
    invariant(sectionEl, `Section element with id ${section.id} not found`);
    const isOverflowing =
      sectionEl.scrollHeight > sectionEl.clientHeight + parseFloat(section.props.gap ?? "0") * 2; // 8px for padding. Todo: fix this magic number
    if (isOverflowing) {
      console.warn(
        `Section ${section.id} is overflowing vertically. Consider adjusting its height or content. sectionEl.scrollHeight = %s, sectionEl.clientHeight = %s`,
        sectionEl.scrollHeight,
        sectionEl.clientHeight,
      );
    }
  }, [sectionObj]);

  const onClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (
      !target.closest("[data-trigger-section-inspector]") &&
      (e.defaultPrevented || resizing || target.nodeName !== "SECTION")
    ) {
      console.log("Click prevented on section", target);
      // If the click was handled by a child element, do not propagate
      return;
    }
    console.log("Section clicked", section.id, target, e);
    setSelectedSectionId(section.id);
    setPanel("inspector");
  };

  return (
    <Droppable
      droppableId={section.id}
      type="brick"
      direction="horizontal"
      isDropDisabled={!!draggingBrickType && manifests[draggingBrickType]?.inlineDragDisabled}
    >
      {(droppableProvided, droppableSnapshot) => {
        if (droppableSnapshot.isDraggingOver) {
          console.log("Droppable provided:", droppableProvided, "Snapshot:", droppableSnapshot);
        }
        return (
          <section
            key={id}
            id={id}
            ref={(el) => {
              // Combine both refs
              droppableProvided.innerRef(el);
            }}
            data-element-kind="section"
            onClick={onClick}
            className={tx(
              className,
              droppableSnapshot.isDraggingOver && "!outline-2 !outline-dashed !outline-usptart-300",
            )}
            {...droppableProvided.droppableProps}
          >
            {!selectedBrickId && <SectionOptionsButtons section={section} />}
            {bricks
              .filter((b) => !b.props.hidden?.[previewMode])
              .map((brick, brickIndex) => (
                <EditableBrickWrapper key={`${previewMode}-${brick.id}`} brick={brick} index={brickIndex} />
              ))}
            {bricks.length === 0 && (
              <div className="w-full self-stretch py-6 h-auto flex-grow text-center rounded bg-gray-50 hover:bg-upstart-50 flex flex-col justify-center items-center text-base text-black/50 font-medium">
                This section is empty.
                <span>
                  Drag bricks here to stack them inside, or{" "}
                  <button
                    type="button"
                    onClick={() => draftHelpers.deleteSection(section.id)}
                    className="text-red-800 inline-block hover:underline"
                  >
                    delete it
                  </button>
                  .
                </span>
              </div>
            )}
            {droppableProvided.placeholder}
          </section>
        );
      }}
    </Droppable>
  );
}

function useResizableSection(section: SectionType) {
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
          setResizing(true);
        },
        move: (event) => {
          event.stopPropagation();

          const h = sectionEl.dataset.h ? parseFloat(sectionEl.dataset.h) : sectionEl.offsetHeight;
          const newHeight = h + event.delta.y;

          requestAnimationFrame(() => {
            Object.assign(sectionEl.style, {
              minHeight: `${newHeight}px`,
              // maxHeight: `${newHeight}px`,
              flex: "none",
            });
          });

          Object.assign(sectionEl.dataset, { h: newHeight });
        },
        end: (event) => {
          const size = getBrickPosition(sectionEl, previewMode);
          sectionEl.style.removeProperty("minHeight");
          sectionEl.style.removeProperty("height");
          sectionEl.style.removeProperty("maxHeight");
          sectionEl.style.removeProperty("flex");
          sectionEl.dataset.h = "";
          draftHelpers.updateSectionProps(section.id, {
            minHeight: `${size.h}px`,
          });
          startTransition(() => {
            setResizing(false);
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
  const draftHelpers = useDraftHelpers();
  const { setSelectedSectionId, setPanel, setSelectedBrickId } = useEditorHelpers();
  const sections = useSections();
  // compare the curret section "order" to the max order of sections to determine if this is the first or last section
  const maxOrder = sections.reduce((max, sec) => Math.max(max, sec.order), -1);
  const minOrder = sections.reduce((min, sec) => Math.min(min, sec.order), Infinity);
  const isLastSection = section.order === maxOrder;
  const isFirstSection = section.order === minOrder;

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
        dropdownOpen ? "opacity-100" : "opacity-0",
        `section-options-buttons bottom-0
            absolute z-[99999] left-1/2 -translate-x-1/2 border border-gray-200 border-b-0`,
        "gap-0 rounded-t-md [&>*:first-child]:rounded-tl-md [&>*:last-child]:rounded-tr-md divide-x divide-white/80",
        "bg-white/70 backdrop-blur-md transition-opacity duration-500  group-hover/section:opacity-80 flex",
      )}
    >
      <div
        className={tx(
          btnCls,
          "cursor-pointer flex-col items-start justify-center gap-0 hover:text-upstart-800",
        )}
        data-trigger-section-inspector
      >
        <div className="text-xs font-light leading-[0.9] ">Section</div>
        <div className="text-sm font-semibold -mt-[8px]">{section.label ?? `${section.order + 1}`}</div>
      </div>
      {/* {!isLastSection && ( */}
      <button
        type="button"
        id={`${section.id}-resize-handle`}
        className={tx("!cursor-ns-resize", btnCls, "section-resizable-handle")}
      >
        <TbArrowAutofitHeight className="w-6 h-6" />
      </button>
      {/* )} */}
      {section.props.minHeight !== "full" && (
        <Tooltip content="Fill entire screen height" delayDuration={500}>
          <button
            type="button"
            onClick={() => {
              draftHelpers.updateSectionProps(section.id, {
                minHeight: "full",
              });
              const el = document.getElementById(section.id);
              if (el) {
                el.style.removeProperty("minHeight");
                el.style.removeProperty("maxHeight");
                el.style.removeProperty("height");
              }
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
                draftHelpers.createEmptySection(`s_${generateId()}`, section.id);
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

import interact from "interactjs";
import { generateId, type Section, type Section as SectionType } from "@upstart.gg/sdk/shared/bricks";
import {
  useDebugMode,
  useDraggingBrickType,
  useEditingTextForBrickId,
  useEditorHelpers,
  useIsMouseOverPanel,
  usePreviewMode,
  useSelectedSectionId,
} from "../hooks/use-editor";
import { HiOutlineCog6Tooth } from "react-icons/hi2";
import { ContextMenu, DropdownMenu, Portal, Tooltip } from "@upstart.gg/style-system/system";
import EditableBrickWrapper from "./EditableBrick";
import { useSectionStyle } from "~/shared/hooks/use-section-style";
import { TbArrowAutofitHeight, TbBorderCorners, TbDots, TbCirclePlus } from "react-icons/tb";
import {
  forwardRef,
  type PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
} from "react";
import invariant from "@upstart.gg/sdk/shared/utils/invariant";
import { manifests } from "@upstart.gg/sdk/shared/bricks/manifests/all-manifests";
import { tx } from "@upstart.gg/style-system/twind";
import { Droppable } from "@hello-pangea/dnd";
import { useDeepCompareEffect } from "use-deep-compare";
import { useDeviceInfo } from "../hooks/use-device-info";
import { useDraftHelpers, useSection, useSections } from "../hooks/use-page-data";

type EditableSectionProps = {
  section: SectionType;
  index: number;
};

export default function EditableSection({ section, index }: EditableSectionProps) {
  const { bricks, id } = section;
  const { setSelectedSectionId, setPanel, setSelectedBrickId, setIsEditingText } = useEditorHelpers();
  const draftHelpers = useDraftHelpers();
  const previewMode = usePreviewMode();
  const selectedSectionId = useSelectedSectionId();
  const editingBrick = useEditingTextForBrickId();
  const draggingBrickType = useDraggingBrickType();
  const isMouseOverPanel = useIsMouseOverPanel();
  const { isDesktop } = useDeviceInfo();
  const className = useSectionStyle({
    section,
    editable: true,
    selected: selectedSectionId === section.id,
    previewMode,
  });
  const sectionObj = useSection(section.id);
  const isSpecialSection = typeof section.props.variant !== "undefined";

  useResizableSection(section);

  useDeepCompareEffect(() => {
    // This effect runs when the section object changes, which includes props updates
    // Check if the section is overflowing
    const sectionEl = document.getElementById(section.id);
    invariant(sectionEl, `Section element with id ${section.id} not found`);
    const isOverflowing = () =>
      sectionEl.scrollWidth > sectionEl.clientWidth + parseFloat(section.props.gap ?? "0") * 2; // 8px for padding. Todo: fix this magic number
    if (isOverflowing()) {
      console.warn(
        `Section ${section.id} is overflowing. Consider adjusting its width or content. sectionEl.scrollWidth = %s, sectionEl.clientWidth = %s`,
        sectionEl.scrollWidth,
        sectionEl.clientWidth,
      );

      // do {
      //   const bricks = section.bricks;
      //   // Reduce the width of each brick by 1% until it fits
      //   bricks.forEach((brick) => {
      //     const brickEl = document.getElementById(brick.id) as HTMLDivElement;
      //     if (brickEl) {
      //       const currentWidth = parseFloat(brickEl.style.width || "100%");
      //       const newWidth = Math.max(currentWidth - 1, 10); // Ensure it doesn't go below 10%
      //       brickEl.style.width = `${newWidth}%`;
      //     }
      //   });
      // } while (isOverflowing());
    }
  }, [sectionObj]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const onClick = useCallback(
    (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        !target.closest("[data-trigger-section-inspector]") &&
        (e.defaultPrevented || target.nodeName !== "SECTION" || draggingBrickType)
      ) {
        console.debug("Click prevented on section", target);
        // If the click was handled by a child element, do not propagate
        return;
      }
      // console.debug("Section clicked", section.id, target, e);
      setSelectedSectionId(section.id);
      setSelectedBrickId();
      setIsEditingText(false);
      setPanel("inspector");
    },
    [draggingBrickType, section.id],
  );

  const dropDisabled =
    isMouseOverPanel ||
    isSpecialSection ||
    /* Not DnD on mobile */ previewMode === "mobile" ||
    /* No DnD on small screens */
    !isDesktop ||
    /* No DnD when dragging a brick that has inline drag disabled */
    (!!draggingBrickType && manifests[draggingBrickType]?.inlineDragDisabled);

  return (
    <Droppable
      droppableId={section.id}
      type="brick"
      direction={section.props.direction === "flex-row" ? "horizontal" : "vertical"}
      mode={section.bricks.length > 0 ? "standard" : "virtual"}
      renderClone={
        section.bricks.length > 0
          ? undefined
          : (provided, snapshot) => {
              return null; // No clone rendering for empty sections
            }
      }
      isDropDisabled={dropDisabled}
    >
      {(droppableProvided, droppableSnapshot) => {
        return (
          <SectionContextMenu section={section}>
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
              {
                /*!selectedBrickId &&*/ !editingBrick && !draggingBrickType && (
                  <SectionOptionsButtons section={section} />
                )
              }
              {bricks
                .filter((b) => !b.props.hidden?.[previewMode])
                .map((brick, brickIndex) => (
                  <EditableBrickWrapper key={`${previewMode}-${brick.id}`} brick={brick} index={brickIndex} />
                ))}
              {bricks.length === 0 && (
                <div
                  data-trigger-section-inspector
                  className={tx(
                    "w-full min-w-full self-stretch py-2 h-auto flex-1 text-center rounded",
                    "flex justify-center items-center font-normal",
                    droppableSnapshot.isDraggingOver && "bg-upstart-50",
                    "opacity-0 hover:opacity-80 transition-opacity duration-300",
                  )}
                >
                  This section is empty. Drag bricks here to stack them inside,&nbsp;
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      draftHelpers.deleteSection(section.id);
                      setSelectedSectionId();
                      setPanel();
                    }}
                    className="inline-block underline underline-offset-2"
                  >
                    delete it
                  </button>
                  , or leave it empty.
                </div>
              )}
              {bricks.length === 0 ? null : droppableProvided.placeholder}
            </section>
          </SectionContextMenu>
        );
      }}
    </Droppable>
  );
}

function useResizableSection(section: SectionType) {
  // Use interact.js to allow resizing a section manually
  const interactable = useRef<Interact.Interactable | null>(null);
  const draftHelpers = useDraftHelpers();

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const sectionEl = document.getElementById(section.id);

    invariant(sectionEl, "Section element not found");

    interactable.current = interact(`#${section.id}`);
    const resizable = interactable.current.resizable({
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
          const minHeight = `${parseFloat(sectionEl.dataset.h as string).toFixed(0)}px`;
          sectionEl.style.removeProperty("minHeight");
          sectionEl.style.removeProperty("height");
          sectionEl.style.removeProperty("maxHeight");
          sectionEl.style.removeProperty("flex");
          sectionEl.dataset.h = "";
          console.log("Resized section", section.id, "to height", minHeight);
          draftHelpers.updateSectionProps(section.id, {
            minHeight,
          });
        },
      },
    });
    // DO NOT REMOVE
    // IMPORTANT: This prevents the default click event from propagating and
    // causing selection of elements like the section itself or other bricks
    resizable.on("resizeend", function () {
      window.addEventListener("click", (ev) => ev.stopImmediatePropagation(), {
        capture: true,
        once: true,
      });
    });
    // END OF DO NOT REMOVE
    return () => {
      interactable.current?.unset();
      interactable.current = null;
    };
  }, []);
}

function SectionOptionsButtons({ section }: { section: SectionType }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const draftHelpers = useDraftHelpers();
  const { setSelectedSectionId, setPanel, hidePanel, setSelectedBrickId } = useEditorHelpers();
  const sections = useSections();
  const selectedSectionId = useSelectedSectionId();
  // compare the curret section "order" to the max order of sections to determine if this is the first or last section
  const maxOrder = sections.reduce((max, sec) => Math.max(max, sec.order), -1);
  const minOrder = sections.reduce((min, sec) => Math.min(min, sec.order), Infinity);
  const isLastSection = section.order === maxOrder;
  const isFirstSection = section.order === minOrder;
  const isSpecialSection = typeof section.props.variant !== "undefined";
  const resizable = section.props.variant !== "navbar" && section.props.variant !== "footer";

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const onSettingsBtnClick = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      if (selectedSectionId !== section.id) {
        setSelectedSectionId(section.id);
        setPanel("inspector");
      } else {
        hidePanel();
        setSelectedSectionId();
      }
    },
    [selectedSectionId],
  );

  const btnCls = tx(
    "select-none hover:opacity-90",
    "text-base px-1.5 h-7  ",
    "text-black/80 hover:bg-upstart-300/20 font-bold flex items-center gap-1",
    "active:(outline-none ring-0) focus:(outline-none ring-0)",
  );
  return (
    <div
      role="toolbar"
      className={tx(
        // bottom-[3px]
        isLastSection ? "bottom-3" : "bottom-0",
        dropdownOpen ? "opacity-100" : "opacity-0",
        `section-options-buttons translate-y-1/2 shadow
            absolute z-[99999] left-1/2 -translate-x-1/2 min-w-fit border border-gray-200`,
        "gap-0 rounded-md [&>*:first-child]:rounded-l-md [&>*:last-child]:rounded-r-md ",
        "bg-white/90 backdrop-blur-md transition-opacity duration-500 group-hover/section:opacity-100 flex",
      )}
    >
      <div
        className={tx(btnCls, "inline-flex flex-nowrap items-center gap-1 !px-2.5 pointer-events-none")}
        data-trigger-section-inspector
      >
        <div className="text-xs font-light text-nowrap">Section</div>
        <div className="text-xs font-semibold text-nowrap max-w-[120px] truncate">
          {section.label ?? "Unnamed"}
        </div>
      </div>
      <button
        type="button"
        id={`${section.id}-resize-handle`}
        className={tx(btnCls)}
        onClick={onSettingsBtnClick}
      >
        <HiOutlineCog6Tooth className="w-5 h-5" />
      </button>
      {resizable && (
        <button
          type="button"
          id={`${section.id}-resize-handle`}
          className={tx("!cursor-ns-resize", btnCls, "section-resizable-handle")}
        >
          <TbArrowAutofitHeight className="w-5 h-5" />
        </button>
      )}
      {resizable && section.props.minHeight !== "full" && (
        <Tooltip content="Fill entire screen height" delayDuration={400}>
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
            <TbBorderCorners className="w-5 h-5" />
          </button>
        </Tooltip>
      )}

      <Tooltip content="Create new section below" delayDuration={400}>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            const newId = `s_${generateId()}`;
            draftHelpers.createEmptySection(newId, section.id);
            setSelectedSectionId(newId);
            setPanel("inspector");
          }}
          className={tx(btnCls, "cursor-pointer")}
        >
          <TbCirclePlus className="w-5 h-5" />
        </button>
      </Tooltip>
      <DropdownMenu.Root modal={false} onOpenChange={setDropdownOpen}>
        <DropdownMenu.Trigger
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <button type="button" className={tx(btnCls)}>
            <TbDots className="w-5 h-5" />
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content sideOffset={5} size="2" side="bottom" align="end">
          <DropdownMenu.Group>
            <DropdownMenu.Label>{section.label ?? "Unnamed"} (section)</DropdownMenu.Label>
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
                const newId = `s_${generateId()}`;
                draftHelpers.createEmptySection(newId, section.id);
                setSelectedSectionId(newId);
                setPanel("inspector");
              }}
            >
              <div className="flex items-center justify-start gap-2">
                <span>Create new section below</span>
              </div>
            </DropdownMenu.Item>
            {isSpecialSection === false && (
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
            )}
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
              <span>Delete section</span>
            </div>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  );
}

type SectionContextMenuProps = PropsWithChildren<{
  section: Section;
}>;

const SectionContextMenu = forwardRef<HTMLDivElement, SectionContextMenuProps>(
  ({ section, children }, ref) => {
    const debugMode = useDebugMode();
    const sections = useSections();
    const draftHelpers = useDraftHelpers();
    const { setSelectedSectionId, setPanel, setSelectedBrickId } = useEditorHelpers();
    // compare the curret section "order" to the max order of sections to determine if this is the first or last section
    const maxOrder = sections.reduce((max, sec) => Math.max(max, sec.order), -1);
    const minOrder = sections.reduce((min, sec) => Math.min(min, sec.order), Infinity);
    const isLastSection = section.order === maxOrder;
    const isFirstSection = section.order === minOrder;
    return (
      <ContextMenu.Root
        modal={false}
        onOpenChange={(menuOpen) => {
          // editorHelpers.setContextMenuVisible(menuOpen);
        }}
      >
        <ContextMenu.Trigger disabled={debugMode} ref={ref}>
          {children}
        </ContextMenu.Trigger>
        <Portal>
          <ContextMenu.Content className="nodrag" size="2">
            <ContextMenu.Group>
              <ContextMenu.Label>{section.label ?? "Unnamed"} (section)</ContextMenu.Label>
              <ContextMenu.Item
                onClick={() => {
                  setSelectedSectionId(section.id);
                  setPanel("inspector");
                }}
              >
                <div className="flex items-center justify-start gap-2">
                  <span>Settings</span>
                </div>
              </ContextMenu.Item>
              <ContextMenu.Separator />
              {!isFirstSection && (
                <ContextMenu.Item onClick={() => draftHelpers.moveSectionUp(section.id)}>
                  <div className="flex items-center justify-start gap-2">
                    <span>Reorder up</span>
                  </div>
                </ContextMenu.Item>
              )}
              {!isLastSection && (
                <ContextMenu.Item onClick={() => draftHelpers.moveSectionDown(section.id)}>
                  <div className="flex items-center justify-start gap-2">
                    <span>Reorder down</span>
                  </div>
                </ContextMenu.Item>
              )}
            </ContextMenu.Group>
            <ContextMenu.Separator />
            <ContextMenu.Group>
              <ContextMenu.Item
                onClick={(e) => {
                  e.stopPropagation();
                  const newId = `s_${generateId()}`;
                  draftHelpers.createEmptySection(newId, section.id);
                  setSelectedSectionId(newId);
                  setPanel("inspector");
                }}
              >
                <div className="flex items-center justify-start gap-2">
                  <span>Create new section below</span>
                </div>
              </ContextMenu.Item>
              <ContextMenu.Item
                onClick={(e) => {
                  e.stopPropagation();
                  draftHelpers.duplicateSection(section.id);
                }}
              >
                <div className="flex items-center justify-start gap-2">
                  <span>Duplicate</span>
                </div>
              </ContextMenu.Item>
            </ContextMenu.Group>
            <ContextMenu.Separator />
            <ContextMenu.Item
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
                <span>Delete section</span>
              </div>
            </ContextMenu.Item>
          </ContextMenu.Content>
        </Portal>
      </ContextMenu.Root>
    );
  },
);

import { useEditorHelpers, useSelectedBrickId, useSelectedSectionId } from "../hooks/use-editor";
import type { Brick, Section } from "@upstart.gg/sdk/shared/bricks";
import { manifests } from "@upstart.gg/sdk/bricks/manifests/all-manifests";
import { css, tx } from "@upstart.gg/style-system/twind";
import { PanelBlockTitle } from "./PanelBlockTitle";
import { startTransition, useEffect, useRef, useState } from "react";
import { RxDragHandleHorizontal } from "react-icons/rx";
import { HelpIcon } from "./json-form/HelpIcon";
import {
  type BeforeCapture,
  DragDropContext,
  Draggable,
  Droppable,
  type DropResult,
} from "@hello-pangea/dnd";
import { useSections, useDraftHelpers } from "../hooks/use-page-data";

export default function PageHierarchy({
  brick: selectedBrick,
  className = "h-[calc(50cqh-58px)]",
}: { brick?: Brick; section: Section; className?: string }) {
  const { setSelectedBrickId, setSelectedSectionId } = useEditorHelpers();
  const sections = useSections();
  const selectedSectionId = useSelectedSectionId();
  const selectedBrickId = useSelectedBrickId();
  const draftHelpers = useDraftHelpers();
  const [hoverElement, setHoverElement] = useState<{ type: string; id: string }>();
  const lastElementHovered = useRef<HTMLElement | null>(null);
  const pageRef = useRef<HTMLElement | null>(null);
  const draggingRef = useRef<string | null>(null);

  useEffect(() => {
    const currentElement = selectedSectionId ?? selectedBrickId;
    // Restore scroll position after render
    if (currentElement) {
      const domObj = document.getElementById(`hierarchy_${currentElement}`);
      if (
        domObj &&
        "scrollIntoViewIfNeeded" in domObj &&
        typeof domObj?.scrollIntoViewIfNeeded === "function"
      ) {
        // Use scrollIntoViewIfNeeded if available
        domObj.scrollIntoViewIfNeeded({ behavior: "smooth", block: "center" });
      } else if (domObj) {
        domObj.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  }, [selectedSectionId, selectedBrickId]);

  useEffect(() => {
    pageRef.current = document.getElementById("page-container")!;
  }, []);

  useEffect(() => {
    if (lastElementHovered.current) {
      lastElementHovered.current.classList.remove(tx("outline-upstart-400"));
    }
    if (hoverElement) {
      lastElementHovered.current = document.getElementById(hoverElement.id);
      if (lastElementHovered.current) {
        lastElementHovered.current.classList.add(tx("outline-upstart-400"));
        if (pageRef.current && !isVisibleInContainer(lastElementHovered.current, pageRef.current)) {
          // Scroll the page to bring the hovered element into view
          lastElementHovered.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
      }
    }
  }, [hoverElement]);

  function BricksHierarchy({
    bricks,
    level = 0,
    // currentIndex = -1,
    isChild = false,
  }: {
    bricks: Brick[];
    level?: number;
    // currentIndex?: number;
    isChild?: boolean;
    disabledDragging?: boolean;
  }) {
    return bricks.map((brick, brickIndex) => {
      const childBricks: Brick[] = "$children" in brick.props ? brick.props.$children : [];
      const hasChildren = childBricks.length > 0;
      const isContainer = manifests[brick.type].isContainer;
      const Icon = manifests[brick.type].icon;
      const brickName = manifests[brick.type].name;
      return (
        <Draggable key={`hierarchy_${brick.id}`} draggableId={`hierarchy_${brick.id}`} index={brickIndex}>
          {(provided, snapshot) => (
            <div
              key={brick.id}
              ref={provided.innerRef}
              {...provided.draggableProps}
              className={tx("min-h-fit flex flex-col gap-2", isContainer && "mt-1 mr-1 ml-1 last:mb-1")}
            >
              <div
                id={`hierarchy_${brick.id}`}
                data-element-type="brick"
                data-brick-type={brick.type}
                data-level={level}
                data-has-children={hasChildren}
                className={tx(
                  "select-none cursor-pointer flex flex-col ",
                  // level > 0 || (hasChildren && "ml-1.5"),
                  isContainer && "rounded outline outline-2 min-h-fit",
                  isContainer
                    ? selectedBrick?.id === brick.id
                      ? "outline-orange-300 "
                      : "outline-transparent hover:(outline-orange-200)"
                    : selectedBrick?.id === brick.id
                      ? "outline-upstart-400 "
                      : "outline-transparent hover:(outline-upstart-100)",
                  snapshot.isDragging && "outline outline-2 outline-upstart-400 bg-upstart-100",
                )}
              >
                <div
                  className={tx(
                    `flex items-center justify-between group/${brick.id} transition-all py-1 px-1.5`,
                    (isChild || level === 0) &&
                      css({
                        paddingLeft: `${(level + 1) * 10}px`,
                      }),
                    isContainer
                      ? selectedBrick?.id === brick.id
                        ? "bg-orange-300 text-white font-bold"
                        : "hover:bg-orange-50"
                      : selectedBrick?.id === brick.id
                        ? "bg-upstart-500 text-white font-bold"
                        : "hover:bg-upstart-50",
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setSelectedBrickId(brick.id);
                    setSelectedSectionId();
                    document
                      .getElementById(brick.id)
                      ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
                  }}
                  // I DON'T KNOW WHY BUT SETTING ONMOUSEENTER HERE DISABLES ONCLICK
                  // onMouseEnter={() => {
                  //   if (dragging || snapshot.isDragging || snapshot.draggingOver || disabledDragging)
                  //     return true;
                  //   setHoverElement({ type: "brick", id: brick.id });
                  // }}
                >
                  <span className="inline-flex items-center gap-1.5 select-none">
                    <Icon className="w-4 h-4" /> {brickName}
                  </span>
                  <div {...provided.dragHandleProps}>
                    <RxDragHandleHorizontal
                      className={`w-5 h-5 cursor-row-resize opacity-0 group-hover/${brick.id}:opacity-80 transition-opacity`}
                    />
                  </div>
                </div>
                {childBricks.length > 0 && (
                  <Droppable
                    droppableId={`hierarchy_${brick.id}`}
                    // DON'T SPECIFY "type" OTHERWISE DRAGGING NESTED BRICKS DON'T WORK
                    // type="XXX"
                    direction="vertical"
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={tx("hierarchy-container")}
                      >
                        <BricksHierarchy bricks={childBricks} level={level + 1} isChild />
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                )}
              </div>
            </div>
          )}
        </Draggable>
      );
    });
  }

  const handleDragEnd = (result: DropResult) => {
    const { source, destination, type, draggableId } = result;

    draggingRef.current = null; // Reset dragging state

    if (destination) {
      const draggableId = result.draggableId.replace(/^hierarchy_/, "");
      let { droppableId: destDroppable, index: destIndex } = destination;
      destDroppable = destDroppable.replace(/^hierarchy_/, "");
      let { droppableId: sourceDroppable } = source;
      sourceDroppable = sourceDroppable.replace(/^hierarchy_/, "");

      if (destDroppable === "main-hierarchy") {
        // reorder sections
        const newSectionOrder = Array.from(sections);
        const [reorderedSection] = newSectionOrder.splice(source.index, 1);
        newSectionOrder.splice(destination.index, 0, reorderedSection);
        draftHelpers.reorderSections(newSectionOrder.map((section) => section.id));
      } else if (type === "brick-hierarchy" || type === "DEFAULT") {
        // reorder bricks within a section
        if (sourceDroppable === destDroppable) {
          console.log("Reordering brick within the same section/parent", result);
          draftHelpers.reorderBrickWithin(draggableId, destIndex);
        } else {
          // Check if destDroppable is a section or a brick
          const isDestSection = sections.some((s) => s.id === destDroppable);
          if (isDestSection) {
            // Move brick to section
            draftHelpers.moveBrickToSection(draggableId, destDroppable, destIndex);
          } else {
            // Move brick to another brick's children
            draftHelpers.moveBrickToContainerBrick(draggableId, destDroppable, destIndex);
          }
        }
      } else {
        console.warn("Unhandled drag type:", type);
        console.warn("Result:", result);
      }
    }

    const element = document.getElementById(draggableId);
    // reset z-index
    element?.style.removeProperty("z-index");

    // Hide all descendants of the dragged element
    if (element?.dataset.elementType === "section") {
      const descendants = element.querySelectorAll<HTMLDivElement>(".hierarchy-container");
      descendants.forEach((descendant) => {
        descendant.style.removeProperty("display");
        descendant.style.removeProperty("z-index");
      });
    } else if (element?.dataset.hasChildren === "true") {
      const lastChild = element.lastElementChild as HTMLDivElement | null;
      if (lastChild) {
        lastChild.style.removeProperty("display");
        lastChild.style.removeProperty("z-index");
      }
    }
  };

  const onBeforeCapture = (cap: BeforeCapture) => {
    draggingRef.current = cap.draggableId;

    const element = document.getElementById(cap.draggableId);

    console.log("BEFORE CAPTURE", { cap, dataset: element?.dataset });

    element?.style.setProperty("z-index", "9999");

    // Hide all descendants of the dragged element
    if (element?.dataset.elementType === "section") {
      const descendants = element.querySelectorAll<HTMLDivElement>(".hierarchy-container");
      descendants.forEach((descendant) => {
        descendant.style.setProperty("display", "none", "important");
      });
    } else if (element?.dataset.hasChildren === "true") {
      // Get the last child of the element
      const lastChild = element.lastElementChild as HTMLDivElement | null;
      lastChild?.style.setProperty("display", "none", "important");
    }
  };

  return (
    <div className={tx("grow shrink-0 bg-red", className)} onMouseLeave={() => setHoverElement(undefined)}>
      <PanelBlockTitle className="border-t">
        <span>Hierarchy</span>
        <HelpIcon
          help={`View and manage the hierarchy of sections and bricks on this page. Click on a section or brick to select it.
Drag and drop sections and bricks to reorder them.
          `}
        />
      </PanelBlockTitle>
      <DragDropContext onDragEnd={handleDragEnd} onBeforeCapture={onBeforeCapture}>
        <Droppable droppableId="main-hierarchy" type="hierarchy-section" direction="vertical">
          {(provided, snapshot) => {
            return (
              <div
                ref={provided.innerRef}
                className={tx(
                  "flex flex-col gap-1 py-2 pt-1 px-1 text-sm text-[80%] scrollbar-thin max-h-[calc(100%-38px)] overflow-y-auto",
                )}
                {...provided.droppableProps}
              >
                {sections.map((section, index) => (
                  <Draggable
                    key={`hierarchy_${section.id}`}
                    draggableId={`hierarchy_${section.id}`}
                    index={index}
                  >
                    {(provided, dragSnapshot) => (
                      <div
                        key={section.id}
                        id={`hierarchy_${section.id}`}
                        data-element-type="section"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={tx(
                          "rounded group mt-1 outline outline-2 outline-transparent",
                          dragSnapshot.isDragging && "outline-upstart-400 bg-upstart-100",
                          section.id === selectedSectionId
                            ? "outline-upstart-400"
                            : "hover:(outline-upstart-100)",
                        )}
                      >
                        <div
                          className={tx(
                            "py-1 px-1.5 rounded-t select-none flex justify-between items-center group min-h-fit",
                            section.id === selectedSectionId
                              ? "bg-upstart-500 text-white font-bold cursor-default"
                              : "hover:bg-upstart-50 cursor-pointer",
                          )}
                          onClick={(e) => {
                            if (e.defaultPrevented) {
                              console.log(
                                "Event was already handled, skipping click action on section hierarchy",
                              );
                              return; // If the event was already handled, do nothing
                            }
                            e.preventDefault();
                            setSelectedBrickId();
                            setSelectedSectionId(section.id);
                            document
                              .getElementById(section.id)
                              ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
                          }}
                          // onMouseEnter={() => {
                          //   if (
                          //     dragSnapshot.isDragging ||
                          //     dragSnapshot.draggingOver ||
                          //     snapshot.draggingFromThisWith ||
                          //     snapshot.isDraggingOver ||
                          //     draggingRef.current
                          //   ) {
                          //     return;
                          //   }
                          //   setHoverElement({ type: "section", id: section.id });
                          // }}
                        >
                          <span>Section {section.label ?? "Unnamed"}</span>
                          <div {...provided.dragHandleProps}>
                            <RxDragHandleHorizontal className="w-5 h-5 cursor-row-resize opacity-0 group-hover:opacity-80 transition-opacity" />
                          </div>
                        </div>
                        <Droppable droppableId={`hierarchy_${section.id}`} type="brick-hierarchy">
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              className={tx("hierarchy-container")}
                            >
                              {/* Always display the hierarchy to have a <Droppable> even if there are currently no bricks */}
                              <BricksHierarchy bricks={section.bricks} />
                              {section.bricks.length === 0 && (
                                <div
                                  className={tx(
                                    "w-full h-full px-2 py-1.5 flex items-center text-gray-500 font-normal",
                                  )}
                                >
                                  No bricks in this section.
                                </div>
                              )}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            );
          }}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
function isVisibleInContainer(element: HTMLElement, container: HTMLElement) {
  // Get element's position relative to the container
  const elementRect = element.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();

  // Calculate element's position relative to container's content area
  const elementRelativeTop = elementRect.top - containerRect.top + container.scrollTop;
  const elementRelativeLeft = elementRect.left - containerRect.left + container.scrollLeft;
  const elementRelativeBottom = elementRelativeTop + element.offsetHeight;
  const elementRelativeRight = elementRelativeLeft + element.offsetWidth;

  // Container's visible area (scroll position + visible dimensions)
  const containerScrollTop = container.scrollTop;
  const containerScrollLeft = container.scrollLeft;
  const containerVisibleBottom = containerScrollTop + container.clientHeight;
  const containerVisibleRight = containerScrollLeft + container.clientWidth;

  return (
    elementRelativeBottom > containerScrollTop &&
    elementRelativeTop < containerVisibleBottom &&
    elementRelativeRight > containerScrollLeft &&
    elementRelativeLeft < containerVisibleRight
  );
}

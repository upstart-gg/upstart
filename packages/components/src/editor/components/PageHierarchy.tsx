import {
  useDraftHelpers,
  useEditorHelpers,
  useSections,
  useSelectedBrickId,
  useSelectedSectionId,
} from "../hooks/use-editor";
import type { Brick, Section } from "@upstart.gg/sdk/shared/bricks";
import { manifests } from "@upstart.gg/sdk/bricks/manifests/all-manifests";
import { tx } from "@upstart.gg/style-system/twind";
import { PanelBlockTitle } from "./PanelBlockTitle";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { RxDragHandleHorizontal } from "react-icons/rx";
import { HelpIcon } from "./json-form/HelpIcon";
import { DragDropContext, Draggable, Droppable, type DropResult } from "@hello-pangea/dnd";

export default function PageHierarchy({ brick: selectedBrick }: { brick?: Brick; section: Section }) {
  const { setSelectedBrickId, setSelectedSectionId } = useEditorHelpers();
  const sections = useSections();
  const selectedSectionId = useSelectedSectionId();
  const selectedBrickId = useSelectedBrickId();
  const draftHelpers = useDraftHelpers();
  const [hoverElement, setHoverElement] = useState<{ type: string; id: string }>();
  const lastElementHovered = useRef<HTMLElement | null>(null);
  const pageRef = useRef<HTMLElement | null>(null);
  const [dragging, setDragging] = useState(false);

  useLayoutEffect(() => {
    console.log("PageHierarchy mounted, restoring scroll position");
    const currentElement = selectedSectionId ?? selectedBrickId;
    // Restore scroll position after render
    if (currentElement) {
      console.log("Restoring scroll position to %s", currentElement);
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
    } else {
      console.log("No section or brick selected, not restoring scroll position");
    }
  }, [selectedSectionId, selectedBrickId]);

  useEffect(() => {
    pageRef.current = document.getElementById("page-container")!;
  }, []);

  useEffect(() => {
    if (lastElementHovered.current) {
      lastElementHovered.current.classList.remove(tx("outline-upstart-400"));
    }
    if (!dragging && hoverElement) {
      lastElementHovered.current = document.getElementById(hoverElement.id);
      if (lastElementHovered.current) {
        lastElementHovered.current.classList.add(tx("outline-upstart-400"));
        if (pageRef.current && !isVisibleInContainer(lastElementHovered.current, pageRef.current)) {
          // Scroll the page to bring the hovered element into view
          lastElementHovered.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
      }
    }
  }, [hoverElement, dragging]);

  function BricksHierarchy({
    bricks,
    level = 0,
    currentIndex = -1,
    isChild = false,
    disabledDragging,
  }: {
    bricks: Brick[];
    level?: number;
    currentIndex?: number;
    isChild?: boolean;
    disabledDragging?: boolean;
  }) {
    return bricks.map((brick, brickIndex) => {
      const childBricks: Brick[] = "$children" in brick.props ? brick.props.$children : [];
      const hasChildren = childBricks.length > 0;
      const Icon = manifests[brick.type].icon;
      const brickName = manifests[brick.type].name;
      currentIndex += 1;
      return (
        <Draggable
          key={`hierarchy_${brick.id}`}
          draggableId={`hierarchy_${brick.id}`}
          index={currentIndex}
          isDragDisabled={disabledDragging}
        >
          {(provided, snapshot) => (
            <div
              key={brick.id}
              ref={provided.innerRef}
              {...provided.draggableProps}
              className={tx(
                "bricks-hierarchy-wrapper",
                // snapshot.isDragging && "[&>.bricks-hierarchy-wrapper]:bg-red-800",
              )}
            >
              <div
                id={`hierarchy_${brick.id}`}
                className={tx(
                  "rounded-md select-none cursor-pointer",
                  // isChild && "-mr-1.5",
                  hasChildren && "outline outline-2 outline-transparent",
                  hasChildren &&
                    (selectedBrick?.id === brick.id ? "outline-upstart-400" : "hover:(outline-upstart-100)"),
                  !hasChildren && selectedBrick?.id === brick.id && "bg-upstart-500 text-white font-bold",
                  snapshot.isDragging && "outline outline-2 outline-upstart-400 bg-upstart-400/30",
                )}
                style={{
                  paddingLeft: `${level * 8}px`,
                  marginTop: isChild && brickIndex === 0 ? "0.25rem" : "1px",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setSelectedBrickId(brick.id);
                  document.getElementById(brick.id)?.scrollIntoView({ behavior: "smooth", block: "nearest" });
                }}
                onMouseEnter={() => setHoverElement({ type: "brick", id: brick.id })}
              >
                <div
                  className={tx(
                    "flex items-center justify-between group transition-all py-1 px-1.5",
                    hasChildren && selectedBrick?.id === brick.id && "bg-upstart-500 text-white font-bold",
                    selectedBrick?.id !== brick.id && "hover:bg-upstart-50",
                  )}
                >
                  <span className="inline-flex items-center gap-1.5 select-none">
                    <Icon className="w-4 h-4" /> {brickName}
                  </span>
                  <div {...provided.dragHandleProps}>
                    <RxDragHandleHorizontal className="w-5 h-5 cursor-row-resize opacity-60 group-hover:opacity-80 transition-opacity" />
                  </div>
                </div>
                {childBricks.length > 0 && !snapshot.isDragging && (
                  <BricksHierarchy
                    bricks={childBricks}
                    level={level + 1}
                    currentIndex={currentIndex}
                    isChild
                    // Disable children dragging if the parent is being dragged
                    disabledDragging={snapshot.isDragging}
                  />
                )}
              </div>
            </div>
          )}
        </Draggable>
      );
    });
  }

  const handleDragEnd = (result: DropResult) => {
    console.log("Drag ended", result);
    const { source, destination, type } = result;

    if (!destination) {
      return; // If dropped outside a droppable area, do nothing
    }

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
    } else if (type === "brick-hierarchy") {
      // reorder bricks within a section
      console.log("Reordering bricks in section %s from %section s", destDroppable, sourceDroppable);
      if (sourceDroppable === destDroppable) {
        console.log(
          "Reordering brick %s in the same section %s from index %d to index %d",
          draggableId,
          sourceDroppable,
          source.index,
          destIndex,
        );
        draftHelpers.reorderBrickWithin(draggableId, destIndex);
      } else {
        console.log(
          "Moving brick %s from section %s to section %s at index %d",
          draggableId,
          sourceDroppable,
          destDroppable,
          destIndex,
        );
        draftHelpers.moveBrickToSection(draggableId, destDroppable, destIndex);
      }
    }

    console.log("Draggable ID:", draggableId);
    setDragging(false);
  };

  return (
    <div
      className="basis-[30%]"
      // Put a shadow at the top to indicate this is a scrollable area
      onMouseLeave={() => setHoverElement(undefined)}
    >
      <PanelBlockTitle>
        <span>Hierarchy</span>
        <HelpIcon
          help={`View and manage the hierarchy of sections and bricks on this page. Click on a section or brick to select it.
Drag and drop sections and bricks to reorder them.
          `}
        />
      </PanelBlockTitle>
      <DragDropContext onDragEnd={handleDragEnd} onBeforeCapture={() => setDragging(true)}>
        <Droppable droppableId="main-hierarchy" type="hierarchy-section" direction="vertical">
          {(provided, snapshot) => {
            return (
              <div
                ref={provided.innerRef}
                className={tx(
                  "py-2 pt-1 px-1 text-sm text-[80%] scrollbar-thin max-h-[calc(50cqh-5rem)] overflow-y-auto",
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
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={tx(
                          "grow gap-px rounded group pb-1 pr-1 mt-1 outline outline-2 outline-transparent",
                          dragSnapshot.isDragging && "outline-upstart-400 bg-upstart-400/30",
                          section.id === selectedSectionId
                            ? "outline-upstart-400"
                            : "hover:(outline-upstart-100)",
                        )}
                      >
                        <div
                          className={tx(
                            "py-1 px-1.5 rounded-t select-none flex justify-between items-center group -mr-1",
                            section.id === selectedSectionId
                              ? "bg-upstart-500 text-white font-bold cursor-default"
                              : "hover:bg-upstart-50  cursor-pointer",
                          )}
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            setSelectedBrickId();
                            setSelectedSectionId(section.id);
                            document
                              .getElementById(section.id)
                              ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
                          }}
                          onMouseEnter={() => setHoverElement({ type: "section", id: section.id })}
                        >
                          <span>Section {section.label ?? "Unnamed"}</span>
                          <div {...provided.dragHandleProps}>
                            <RxDragHandleHorizontal className="w-5 h-5 mr-1  cursor-row-resize opacity-60 group-hover:opacity-80 transition-opacity" />
                          </div>
                        </div>
                        <Droppable
                          droppableId={`hierarchy_${section.id}`}
                          type="brick-hierarchy"
                          direction="vertical"
                        >
                          {(provided) => (
                            <div ref={provided.innerRef} {...provided.droppableProps} className={tx("ml-2")}>
                              <BricksHierarchy bricks={section.bricks} />
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

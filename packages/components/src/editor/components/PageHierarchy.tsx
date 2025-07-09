import { useEditorHelpers, useSections, useSelectedSectionId } from "../hooks/use-editor";
import type { Brick, Section } from "@upstart.gg/sdk/shared/bricks";
import { manifests } from "@upstart.gg/sdk/bricks/manifests/all-manifests";
import { tx } from "@upstart.gg/style-system/twind";
import { PanelBlockTitle } from "./PanelBlockTitle";
import { useEffect, useRef, useState } from "react";
import { RxDragHandleHorizontal } from "react-icons/rx";
import { HelpIcon } from "./json-form/HelpIcon";
import { DragDropContext, Draggable, Droppable, type DropResult } from "@hello-pangea/dnd";

export default function PageHierarchy({ brick: selectedBrick }: { brick?: Brick; section: Section }) {
  const { setSelectedBrickId, setSelectedSectionId } = useEditorHelpers();
  const sections = useSections();
  const currentSectionId = useSelectedSectionId();
  const [hoverElement, setHoverElement] = useState<{ type: string; id: string }>();
  const lastElementHovered = useRef<HTMLElement | null>(null);
  const pageRef = useRef<HTMLElement | null>(null);
  const [dragging, setDragging] = useState(false);

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

  function mapBricks(bricks: Brick[], level = 0) {
    return bricks.map((brick, index) => {
      const childBricks = "$children" in brick.props ? (brick.props.$children as Brick[]) : null;
      const Icon = manifests[brick.type].icon;
      const brickName = manifests[brick.type].name;
      return (
        <Draggable key={`hierarchy_${brick.id}`} draggableId={`hierarchy_${brick.id}`} index={index}>
          {(provided, snapshot) => (
            <div key={brick.id} ref={provided.innerRef} {...provided.draggableProps}>
              <div
                className={tx(
                  "py-1 px-1.5 rounded-md select-none",
                  selectedBrick?.id === brick.id
                    ? "bg-upstart-500 text-white font-bold cursor-default"
                    : "hover:bg-gray-50 dark:hover:bg-white/10 cursor-pointer",
                  snapshot.isDragging && "outline outline-2 outline-upstart-400 bg-upstart-400/30",
                )}
                style={{ marginLeft: `${level * 10}px` }}
                onClick={(e) => {
                  e.stopPropagation();
                  console.log("clicking on brick %s", brick.id);
                  setSelectedBrickId(brick.id);
                }}
                onMouseEnter={() => setHoverElement({ type: "brick", id: brick.id })}
              >
                <div className="flex items-center justify-between group transition-all">
                  <span className="inline-flex items-center gap-1.5 select-none">
                    <Icon className="w-4 h-4" /> {brickName}
                  </span>
                  <div {...provided.dragHandleProps}>
                    <RxDragHandleHorizontal className="w-5 h-5 cursor-row-resize opacity-60 group-hover:opacity-80 transition-opacity" />
                  </div>
                </div>
              </div>
              {childBricks && childBricks.length > 0 && (
                <Draggable key={`hierarchy_${brick.id}`} draggableId={`hierarchy_${brick.id}`} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="flex flex-col gap-px"
                    >
                      {mapBricks(childBricks, level + 1)}
                    </div>
                  )}
                </Draggable>
              )}
            </div>
          )}
        </Draggable>
      );
    });
  }

  const handleDragEnd = (result: DropResult) => {
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
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={tx(
                "py-2 pt-1 px-1 text-sm text-[80%] scrollbar-thin max-h-[calc(50cqh-5rem)] overflow-y-auto",
                // snapshot.isDraggingOver && "overflow-y-hidden",
              )}
            >
              {sections.map((section, index) => (
                <Draggable
                  key={`hierarchy_${section.id}`}
                  draggableId={`hierarchy_${section.id}`}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      key={section.id}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={tx(
                        "grow gap-px rounded group hover:(outline outline-upstart-100) pb-1 pr-1 mt-1",
                        snapshot.isDragging && "outline outline-2 outline-upstart-400 bg-upstart-400/30",
                      )}
                    >
                      <div
                        className={tx(
                          "py-1 px-1.5 rounded-md select-none flex justify-between items-center group",
                          section.id === currentSectionId
                            ? "bg-upstart-500 text-white font-bold cursor-default"
                            : "hover:bg-gray-50 dark:hover:bg-white/10 cursor-pointer",
                        )}
                        onClick={() => {
                          setSelectedBrickId();
                          setSelectedSectionId(section.id);
                        }}
                        onMouseEnter={() => setHoverElement({ type: "section", id: section.id })}
                      >
                        <span>Section {section.label ?? "Unnamed"}</span>
                        <div {...provided.dragHandleProps}>
                          <RxDragHandleHorizontal className="w-5 h-5  cursor-row-resize opacity-60 group-hover:opacity-80 transition-opacity" />
                        </div>
                      </div>
                      <Droppable
                        droppableId={`${section.id}"-hierarchy`}
                        type="brick-hierarchy"
                        direction="vertical"
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={tx(
                              " gap-px ml-2",
                              // snapshot.isDraggingOver && "overflow-y-hidden",
                            )}
                          >
                            {mapBricks(section.bricks)}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
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

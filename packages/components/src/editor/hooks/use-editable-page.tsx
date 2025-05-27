import interact from "interactjs";
import { useCallback, useEffect, useRef, type RefObject } from "react";
import type { RestrictOptions } from "@interactjs/modifiers/restrict/pointer";
import type { DraggableOptions } from "@interactjs/actions/drag/plugin";
import type { ResizableOptions } from "@interactjs/actions/resize/plugin";
import { useGetBrick, usePreviewMode, useSelectedGroup, useSiteReady, useZoom } from "./use-editor";
import type { Brick, Section } from "@upstart.gg/sdk/shared/bricks";
import type { BrickConstraints } from "@upstart.gg/sdk/shared/brick-manifest";
import { defaultProps, manifests } from "@upstart.gg/sdk/bricks/manifests/all-manifests";
import invariant from "@upstart.gg/sdk/shared/utils/invariant";
import {
  getBrickPosition,
  getSectionElementAtPosition,
  getDropPosition,
  getGridConfig,
  getClosestSection,
  getBrickElementAtPosition,
  getBricksHovered,
  getDropInstructions,
  showDropIndicator,
  removeDropIndicator,
} from "~/shared/utils/layout-utils";

interface DragCallbacks {
  onDragEnd: (
    updatedPositions: {
      brick: Brick;
      gridPosition: { w: number; h: number; x: number; y: number };
      sectionId: string;
    }[],
    event: Interact.InteractEvent,
  ) => void;
}

interface DropCallbacks {
  onDropMove: (
    event: Interact.DropEvent,
    rect: { x: number; y: number; w: number; h: number },
    brickType: Brick["type"],
  ) => void;
  onDrop: (
    event: Interact.DropEvent,
    gridPosition: { x: number; y: number; w: number; h: number },
    section: HTMLElement,
    brickType: Brick["type"],
  ) => void;
  onDropActivate?: (event: Interact.DropEvent) => void;
  onDropDeactivate?: (event: Interact.DropEvent) => void;
}

interface ResizeCallbacks {
  onResizeMove?: (
    event: Interact.InteractEvent,
    size: { w: number; h: number; x: number; y: number },
  ) => void;
  onResizeEnd: (
    brickId: string,
    gridPos: { w: number; h: number; x: number; y: number },
    event: Interact.InteractEvent,
  ) => void;
}

interface UseInteractOptions {
  dragOptions?: Partial<DraggableOptions>;
  resizeOptions?: Partial<ResizableOptions>;
  dragRestrict?: Partial<RestrictOptions>;
  dragCallbacks: DragCallbacks;
  dropCallbacks: DropCallbacks;
  resizeCallbacks: ResizeCallbacks;
}

// Update element transform
const updateElementTransform = (target: HTMLElement, x: number, y: number) => {
  // target.style.transform = `translate(${x}px, ${y}px)`;

  requestAnimationFrame(() => {
    target.style.left = `${x}px`;
    target.style.top = `${y}px`;
  });
  target.dataset.tempX = x.toString();
  target.dataset.tempY = y.toString();
};

export const useEditablePage = (
  bricksSelectorOrRef: string,
  pageRef: RefObject<HTMLElement>,
  { dragOptions = {}, resizeOptions = {}, dragCallbacks, resizeCallbacks, dropCallbacks }: UseInteractOptions,
) => {
  const getBrick = useGetBrick();
  const selectedGroup = useSelectedGroup();
  const previewMode = usePreviewMode();
  const interactable = useRef<Interact.Interactable | null>(null);
  const dropzone = useRef<Interact.Interactable | null>(null);
  const dropTargetRef = useRef<HTMLElement | null>(null);
  const { zoom } = useZoom();
  const siteReady = useSiteReady();

  const snapPositionToGrid = useCallback(() => {
    return function (x: number, y: number, { element }: Interact.Interaction) {
      // Get the closest section element
      invariant(element, "Element not found");
      const section = getClosestSection(element);
      const { colWidth, rowHeight } = getGridConfig(section, previewMode);

      return {
        x: Math.round(x / colWidth) * colWidth,
        y: Math.round(y / rowHeight) * rowHeight,
      };
    };
  }, [previewMode]);

  const snapSizeToGrid = useCallback(() => {
    return function (x: number, y: number, { element }: Interact.Interaction) {
      invariant(element, "Element not found");
      const section = getClosestSection(element);
      const { colWidth, rowHeight } = getGridConfig(section, previewMode);
      return interact.snappers.grid({ width: colWidth, height: rowHeight });
    };
  }, [previewMode]);

  useEffect(() => {
    interactable.current = interact(bricksSelectorOrRef, {
      styleCursor: false,
      enabled: !!siteReady,
      // hold: 50,
    })
      .on("dragstart", (event) => {
        event.target.style.cursor = "move";
      })
      .on("dragend", (event) => {
        event.target.style.cursor = "";
      });

    const container = document.querySelector<HTMLElement>("#page-container")!;
    interactable.current.draggable({
      enabled: !!siteReady,
      // inertia: true,
      autoScroll: {
        container,
        margin: 40,
        speed: 800,
        enabled: true,
        distance: 100,
      },
      modifiers: [
        interact.modifiers.snap({
          targets: [snapPositionToGrid()],
          offset: "self",
          relativePoints: [{ x: 0, y: 0 }],
          endOnly: true,
        }),
        interact.modifiers.restrict({
          restriction: "#page-container",
          endOnly: true,
        }),
      ],
      listeners: {
        start: (event: Interact.InteractEvent) => {
          console.debug("useEditablePage:listeners:start()", event);
          const target = event.target as HTMLElement;

          // The group of elements that are being dragged (selected using "selecto" library)
          const elements = selectedGroup ? selectedGroup.map((id) => document.getElementById(id)!) : [target];

          elements.forEach((target) => {
            // Get initial position relative to container
            const computedStyle = window.getComputedStyle(target);
            const clone = target.cloneNode(true) as HTMLElement;
            clone.setAttribute("id", `${target.id}-clone`);

            clone.dataset.tempX = event.rect.left.toString();
            clone.dataset.tempY = event.rect.top.toString();
            clone.dataset.elementKind = "clone";

            // wasDragged has to be set on the original element
            target.dataset.wasDragged = "false";

            Object.assign(clone.style, {
              position: "fixed",
              top: `${event.rect.top}px`,
              left: `${event.rect.left}px`,
              width: `${event.rect.width}px`,
              height: `${event.rect.height}px`,
              zoom: 1 / zoom,
              zIndex: "999999",
              backgroundColor:
                computedStyle.backgroundColor === "rgba(0, 0, 0, 0)"
                  ? "var(--violet-a6)"
                  : computedStyle.backgroundColor,
            });

            target.insertAdjacentElement("afterend", clone);
          });
        },
        move: (event: Interact.InteractEvent) => {
          const target = event.target as HTMLElement;

          target.dataset.wasDragged = "true";

          requestAnimationFrame(() => {
            target.classList.add("moving");
          });

          const section = getSectionElementAtPosition(event.client.x, event.client.y);
          const hoveredBricks = section ? getBricksHovered(target.id, event.rect, section) : null;
          const instructions = hoveredBricks ? getDropInstructions(event.rect, hoveredBricks) : null;

          if (instructions?.dropTarget) {
            console.log("we have a drop target", instructions?.dropTarget.id);
            if (dropTargetRef.current && instructions.dropTarget.id !== dropTargetRef.current?.id) {
              dropTargetRef.current.style.backgroundColor =
                dropTargetRef.current?.dataset.originalBackgroundColor ?? "";
            }

            dropTargetRef.current = instructions.dropTarget;
            showDropIndicator(instructions);
            dropTargetRef.current.dataset.originalBackgroundColor =
              dropTargetRef.current.style.backgroundColor;
            dropTargetRef.current.style.backgroundColor = "var(--violet-a3)";
          } else if (dropTargetRef.current) {
            console.log("Resetting style of brick %s", dropTargetRef.current.id);
            dropTargetRef.current.style.backgroundColor =
              dropTargetRef.current.dataset.originalBackgroundColor ?? "";
          }

          // Update elements position
          const elements = selectedGroup ? selectedGroup.map((id) => document.getElementById(id)!) : [target];
          elements.forEach((element) => {
            const clone = document.getElementById(`${element.id}-clone`);
            if (!clone) {
              console.warn("Clone not found");
              return;
            }
            // hide the original element
            // element.style.visibility = "hidden";
            const x = parseFloat(clone.dataset.tempX || "0") + event.dx;
            const y = parseFloat(clone.dataset.tempY || "0") + event.dy;
            updateElementTransform(clone, x, y);
          });
        },

        end: (event: Interact.InteractEvent) => {
          console.log("useEditablePage:listeners:end()", event);

          removeDropIndicator();

          const target = event.target as HTMLElement;
          const updatedPositions: Parameters<DragCallbacks["onDragEnd"]>[0] = [];

          const elements = selectedGroup ? selectedGroup.map((id) => document.getElementById(id)!) : [target];
          const section = getSectionElementAtPosition(event.client.x, event.client.y);
          const hoveredBricks = section ? getBricksHovered(target.id, event.rect, section) : null;
          const instructions = hoveredBricks ? getDropInstructions(event.rect, hoveredBricks) : null;

          console.log("DROPPED instructions", instructions);

          // remove all clones
          document.querySelectorAll(`[data-element-kind="clone"]`).forEach((el) => {
            el.remove();
          });

          for (const draggedElement of elements) {
            // restore element visibility
            draggedElement.style.visibility = "visible";

            const brick = getBrick(draggedElement.id);
            if (brick && section && instructions) {
              // updatedPositions.push({
              //   brick,
              //   gridPosition: getBrickPosition(element, previewMode, section),
              //   sectionId: section.id,
              // });
              const { dropTarget, position } = instructions;
              if (!dropTarget) {
                console.warn("No drop target found");
                return;
              }
              dropTarget.insertAdjacentElement(position, draggedElement);
            }
          }

          // Important: only remove the `moving` class after we've collected the positions
          // otherwise the elements will snap back to their original position
          requestAnimationFrame(() => {
            target.classList.remove("moving");
            dragCallbacks.onDragEnd(updatedPositions, event);
          });

          setTimeout(() => {
            target.dataset.wasDragged = "false";
          }, 200);
        },
      },
      ...dragOptions,
    });

    interactable.current.resizable({
      // inertia: true,
      enabled: !!siteReady,
      ignoreFrom: ".resize-handle-disabled, [data-ui-options-bar], [data-ui-drag-handle]",
      listeners: {
        start: (event) => {
          const target = event.target as HTMLElement;
          target.dataset.tempX = "0";
          target.dataset.tempY = "0";
        },
        move: (event) => {
          event.stopPropagation();

          const target = event.target as HTMLElement;

          let { tempX, tempY } = target.dataset;
          tempX = parseFloat(tempX ?? "0") + event.deltaRect.left;
          tempY = parseFloat(tempY ?? "0") + event.deltaRect.top;

          const newStyle = {
            width: `${event.rect.width}px`,
            height: `${event.rect.height}px`,
            minHeight: "auto",
            transform: `translate(${tempX}px, ${tempY}px)`,
          };

          Object.assign(target.dataset, { tempX, tempY });

          requestAnimationFrame(() => {
            target.classList.add("moving");
            Object.assign(target.style, newStyle);
          });
        },
        end: (event) => {
          const target = event.target as HTMLElement;
          const gridPos = getBrickPosition(target, previewMode);

          requestAnimationFrame(() => {
            Object.assign(target.style, {
              width: "",
              height: "",
              minHeight: "",
              transform: "none",
            });
            target.classList.remove("moving");
            resizeCallbacks.onResizeEnd(target.id, gridPos, event);
          });
        },
      },
      modifiers: [
        interact.modifiers.restrictEdges({
          outer: "parent",
        }),
        interact.modifiers.restrictSize({
          // a function that returns the max/min width/height based on the target's current dimensions
          // @ts-ignore
          min: (x, y, event) => {
            const element = event.element as HTMLElement;
            const brickType = getBrick(element.id)?.type;

            invariant(brickType, "Brick type not found");

            const section = getClosestSection(element);
            const gridConfig = getGridConfig(section, previewMode);

            const minW = defaultProps[brickType].minWidth?.[previewMode];
            const minH = defaultProps[brickType].minHeight?.[previewMode];

            return {
              width: minW ? minW * gridConfig.colWidth : gridConfig.colWidth,
              height: minH ? minH * gridConfig.rowHeight : gridConfig.rowHeight,
            };
          },
          // @ts-ignore
          max: (x, y, event) => {
            const element = event.element as HTMLElement;
            const brickType = getBrick(element.id)?.type;

            invariant(brickType, "Brick type not found");

            const section = getClosestSection(element);
            const gridConfig = getGridConfig(section, previewMode);

            const maxW = manifests[brickType].maxWidth?.[previewMode];
            const maxH = manifests[brickType].maxHeight?.[previewMode];

            return {
              width: maxW ? maxW * gridConfig.colWidth : Infinity,
              height: maxH ? maxH * gridConfig.rowHeight : Infinity,
            };
          },
        }),
        // snap TEST
        interact.modifiers.snapSize({
          targets: [snapSizeToGrid()],
          endOnly: true,
        }),
        ...(resizeOptions.modifiers || []),
      ],

      edges: {
        top: true,
        left: true,
        bottom: true,
        right: true,
      },
      ...resizeOptions,
    });

    return () => {
      interactable.current?.unset();
      interactable.current = null;
    };
  }, [
    bricksSelectorOrRef,
    dragCallbacks,
    resizeCallbacks,
    dragOptions,
    resizeOptions,
    getBrick,
    previewMode,
    selectedGroup,
    snapPositionToGrid,
    snapSizeToGrid,
    siteReady,
    zoom,
  ]);

  useEffect(() => {
    if (pageRef.current && siteReady) {
      dropzone.current = interact('[data-dropzone="true"]');
      dropzone.current
        .dropzone({
          accept: ".draggable-brick",
          ondrop: (event: Interact.DropEvent) => {
            const type = event.relatedTarget.dataset.brickType as Brick["type"] | undefined;
            if (type) {
              const section = getSectionElementAtPosition(event.dragEvent.clientX, event.dragEvent.clientY);
              invariant(section, "Section not found");

              const gridConfig = getGridConfig(section, previewMode);
              const dropPosition = getDropPosition(event, gridConfig);
              const { defaultWidth, defaultHeight } = defaultProps[type];
              const w = defaultWidth?.[previewMode] ?? 20;
              const h = defaultHeight?.[previewMode] ?? 10;
              const x = Math.max(Math.round(dropPosition.x - w / 2), 1);
              const y = Math.max(Math.round(dropPosition.y - h / 2), 1);
              const position = { x, y, w, h };

              dropCallbacks.onDrop(event, position, section, type);
            }
          },
        })
        .on("dragenter", (event: Interact.DropEvent) => {
          console.log("dragenter", event.target.id);
        })
        .on("dragleave", (event: Interact.DropEvent) => {
          console.log("dragleave", event.target.id);
        })
        .on("dropactivate", function (event: Interact.DropEvent) {
          console.log("dropactivate", event.target.id);
          event.relatedTarget.setPointerCapture(1);
          dropCallbacks.onDropActivate?.(event);
        })
        .on("dropdeactivate", function (event: Interact.DropEvent) {
          console.log("dropdeactivate", event.target?.id);
          event.relatedTarget.releasePointerCapture(1);
          dropCallbacks.onDropDeactivate?.(event);
        })
        .on("dropmove", function (event: Interact.DropEvent) {
          const type = event.relatedTarget.dataset.brickType as Brick["type"] | undefined;
          const overElement = event.target as HTMLElement;

          // console.log("dropmove", event, type, overElement.id);

          if (type) {
            const section = getSectionElementAtPosition(event.dragEvent.clientX, event.dragEvent.clientY);
            invariant(section, "Section not found");
            const gridConfig = getGridConfig(section, previewMode);
            const constraints: BrickConstraints = defaultProps[type];
            const w = (constraints.defaultWidth?.[previewMode] ?? 20) * gridConfig.colWidth;
            const h = (constraints.defaultHeight?.[previewMode] ?? 10) * gridConfig.rowHeight;
            // change x and y to be centered on the rect
            const x = event.dragEvent.clientX - w / 2;
            const y = event.dragEvent.clientY - h / 2;
            const position = { x, y, w, h };

            dropCallbacks.onDropMove(event, position, type);
          }
        });
    }
    return () => {
      dropzone.current?.unset();
      dropzone.current = null;
    };
  }, [pageRef, dropCallbacks, siteReady, previewMode]);
};

import interact from "interactjs";
import { useCallback, useEffect, useRef, type RefObject } from "react";
import type { RestrictOptions } from "@interactjs/modifiers/restrict/pointer";
import type { DraggableOptions } from "@interactjs/actions/drag/plugin";
import type { ResizableOptions } from "@interactjs/actions/resize/plugin";
import { useGetBrick, usePreviewMode, useSelectedGroup } from "./use-editor";
import type { Brick } from "@upstart.gg/sdk/shared/bricks";
import type { BrickConstraints } from "@upstart.gg/sdk/shared/brick-manifest";
import { defaultProps } from "@upstart.gg/sdk/bricks/manifests/all-manifests";
import invariant from "@upstart.gg/sdk/shared/utils/invariant";
import {
  getGridPosition,
  getGridSize,
  getBrickCoordsInPage,
  getSectionAtPosition,
  getDropPosition,
} from "~/shared/utils/layout-utils";
import { useBricksRefs } from "./use-bricks-refs";
import type { GridConfig } from "~/shared/hooks/use-grid-config";

interface DragCallbacks {
  onDragMove?: (
    brick: Brick,
    position: { x: number; y: number },
    gridPosition: { x: number; y: number },
    event: Interact.InteractEvent,
  ) => void;
  onDragEnd: (
    updatedPositions: {
      brick: Brick;
      gridPosition: { x: number; y: number };
      position: { x: number; y: number };
      sectionId: string;
    }[],
    event: Interact.InteractEvent,
  ) => void;
  onDragStart?: (
    brick: Brick,
    position: { x: number; y: number },
    gridPosition: { x: number; y: number },
    event: Interact.InteractEvent,
  ) => void;
}

interface DropCallbacks {
  onDropMove?: (
    event: Interact.DropEvent,
    gridPosition: { x: number; y: number },
    brick: {
      type: Brick["type"];
      constraints: BrickConstraints;
    },
  ) => void;
  onDrop?: (
    event: Interact.DropEvent,
    gridPosition: { x: number; y: number },
    brick: {
      type: Brick["type"];
      constraints: BrickConstraints;
    },
  ) => void;
  onDropActivate?: (event: Interact.DropEvent) => void;
  onDropDeactivate?: (event: Interact.DropEvent) => void;
}

interface ResizeCallbacks {
  onResizeStart?: (event: Interact.InteractEvent) => void;
  onResizeMove?: (
    event: Interact.InteractEvent,
    size: { w: number; h: number; x: number; y: number },
  ) => void;
  onResizeEnd?: (
    brickId: string,
    size: { w: number; h: number; x: number; y: number },
    gridSize: { w: number; h: number },
    event: Interact.InteractEvent,
  ) => void;
}

interface UseInteractOptions {
  dragOptions?: Partial<DraggableOptions>;
  resizeOptions?: Partial<ResizableOptions>;
  dragRestrict?: Partial<RestrictOptions>;
  dragCallbacks: DragCallbacks;
  dropCallbacks?: DropCallbacks;
  resizeCallbacks?: ResizeCallbacks;
  gridConfig: GridConfig;
}

interface SnapToGridConfig {
  colWidth?: number;
  rowHeight?: number;
  paddingX?: number;
  paddingY?: number;
}

function snapPositionToGrid({
  colWidth = 200, // Width of each column
  rowHeight = 80, // Fixed height of rows
}: SnapToGridConfig) {
  return function (x: number, y: number) {
    return {
      x: Math.round(x / colWidth) * colWidth,
      y: Math.round(y / rowHeight) * rowHeight,
    };
  };
}

const getNextPosition = (target: HTMLElement, event: Interact.InteractEvent) => {
  const x = parseFloat(target.dataset.tempX || "0") + event.dx;
  const y = parseFloat(target.dataset.tempY || "0") + event.dy;
  return { x, y };
};

// Update element transform
const updateElementTransform = (target: HTMLElement, x: number, y: number) => {
  // target.style.transform = `translate(${x}px, ${y}px)`;
  target.style.left = `${x}px`;
  target.style.top = `${y}px`;
  target.dataset.tempX = x.toString();
  target.dataset.tempY = y.toString();
};

export const useEditablePage = (
  bricksSelectorOrRef: string,
  pageRef: RefObject<HTMLElement>,
  {
    gridConfig,
    dragOptions = {},
    resizeOptions = {},
    dragCallbacks,
    resizeCallbacks = {},
    dropCallbacks = {},
  }: UseInteractOptions,
) => {
  // Helper to get size from event
  const getSize = useCallback((event: Interact.ResizeEvent) => {
    const target = event.target as HTMLElement;
    const rect = event.rect;
    const x = parseFloat(target.dataset.x || "0") + (event.deltaRect?.left || 0);
    const y = parseFloat(target.dataset.y || "0") + (event.deltaRect?.top || 0);
    return {
      w: rect.width,
      h: rect.height,
      x,
      y,
    };
  }, []);

  const getBrick = useGetBrick();
  const selectedGroup = useSelectedGroup();
  const previewMode = usePreviewMode();
  const interactable = useRef<Interact.Interactable | null>(null);
  const dropzone = useRef<Interact.Interactable | null>(null);
  const { getBrickRef } = useBricksRefs();

  useEffect(() => {
    interactable.current = interact(bricksSelectorOrRef, {
      styleCursor: false,
    })
      .on("dragstart", (event) => {
        event.target.style.cursor = "move";
      })
      .on("dragend", (event) => {
        event.target.style.cursor = "";
      });

    const container = document.querySelector<HTMLElement>("#page-container")!;
    interactable.current.draggable({
      inertia: true,
      autoScroll: {
        container,
        margin: 40,
        speed: 800,
        enabled: true,
        distance: 100,
      },
      modifiers: [
        interact.modifiers.snap({
          targets: [
            snapPositionToGrid({
              colWidth: gridConfig.colWidth,
              rowHeight: gridConfig.rowHeight,
            }),
          ],
          offset: "self",
          relativePoints: [{ x: 0, y: 0 }],
          endOnly: true,
        }),
        interact.modifiers.restrict({
          restriction: "#page-container",
        }),
      ],
      listeners: {
        start: (event: Interact.InteractEvent) => {
          console.debug("useEditablePage:listeners:start()", event);
          const target = event.target as HTMLElement;
          const brick = getBrick(target.id);

          if (brick) {
            // Get initial position relative to container
            const initialPos = getBrickCoordsInPage(target, container);

            console.log({ initialPos, initialStyle: target.style });

            // Now set up the element for dragging
            target.style.position = "absolute";
            target.style.top = `${initialPos.y}px`;
            target.style.left = `${initialPos.x}px`;
            target.style.width = `${initialPos.w}px`;
            target.style.height = `${initialPos.h}px`;
            target.dataset.tempX = initialPos.x.toString();
            target.dataset.tempY = initialPos.y.toString();
            target.style.zIndex = "999999";

            // const gridPosition = getGridPosition(target, gridConfig);
            // we fire the callback for the main element only
            // dragCallbacks.onDragStart?.(brick, getPosition(target, event), gridPosition, event);
          }
        },
        end: (event: Interact.InteractEvent) => {
          const target = event.target as HTMLElement;
          target.classList.remove("moving");
          // Only proceed with collecting positions if we actually had a swap
          // (meaning we have at least 2 bricks in our set)
          const updatedPositions: Parameters<DragCallbacks["onDragEnd"]>[0] = [];
          const elements = selectedGroup ? selectedGroup.map(getBrickRef) : [target];
          const section = getSectionAtPosition(event.client.x, event.client.y);

          invariant(section, "Section not found");

          for (const element of elements) {
            const brick = getBrick(element.id);
            if (brick) {
              updatedPositions.push({
                brick,
                position: getNextPosition(element, event),
                gridPosition: getGridPosition(element, gridConfig, section),
                sectionId: section.id,
              });
            }

            // Reset to display mode (not dragging)
            element.style.transform = "none";
            element.style.transition = "none";
            element.style.position = "relative";
            element.style.top = "";
            element.style.left = "";
            element.style.width = "auto";
            element.style.height = "auto";

            // Store the final coordinates as custom attributes for the next drag
            const finalRect = element.getBoundingClientRect();
            const containerBox = container.getBoundingClientRect();
            // const container = document.querySelector("#page-container")!.getBoundingClientRect();
            // element.dataset.tempX = (finalRect.left - containerBox.left).toString();
            // element.dataset.tempY = (finalRect.top - containerBox.top).toString();
          }

          dragCallbacks.onDragEnd(updatedPositions, event);
        },

        move: (event: Interact.InteractEvent) => {
          const target = event.target as HTMLElement;

          target.classList.add("moving");

          const elements = selectedGroup ? selectedGroup.map(getBrickRef) : [target];

          elements.forEach((element) => {
            if (!element) return;
            const position = getNextPosition(element, event);
            updateElementTransform(element, position.x, position.y);
          });

          const brick = getBrick(target.id);

          if (brick) {
            const gridPosition = getGridPosition(target, gridConfig);
            // dragCallbacks.onDragMove?.(brick, getPosition(target, event), gridPosition, event);
          }
        },
      },
      ...dragOptions,
    });

    interactable.current.resizable({
      inertia: true,
      listeners: {
        start: (event) => {
          console.log("resize start", event);
          resizeCallbacks.onResizeStart?.(event);
        },
        move: (event) => {
          event.stopPropagation();
          event.target.classList.add("moving");
          let { tempX, tempY } = event.target.dataset;
          tempX = parseFloat(tempX ?? "0") + event.deltaRect.left;
          tempY = parseFloat(tempY ?? "0") + event.deltaRect.top;
          const newStyle = {
            width: `${event.rect.width}px`,
            height: `${event.rect.height}px`,
            transform: `translate(${tempX}px, ${tempY}px)`,
          };
          console.log("resize move", event, newStyle);
          Object.assign(event.target.style, newStyle);
          Object.assign(event.target.dataset, { tempX, tempY });
        },
        end: (event) => {
          const target = event.target as HTMLElement;
          target.classList.remove("moving");
          const size = getSize(event);
          const gridSize = getGridSize(target, gridConfig);
          target.style.width = "";
          target.style.height = "";
          Object.assign(event.target.dataset, { tempX: "0", tempY: "0" });
          resizeCallbacks.onResizeEnd?.(target.id, size, gridSize, event);
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
            const elementId = event.element?.id; // Access the element ID
            if (!elementId) return { width: 0, height: 0 };
            const brickType = getBrick(elementId)?.type;
            invariant(brickType, "Brick type not found");
            const minW = defaultProps[brickType].minWidth?.[previewMode];
            const minH = defaultProps[brickType].minHeight?.[previewMode];
            return {
              width: minW ? minW * gridConfig.colWidth : gridConfig.colWidth,
              height: minH ? minH * gridConfig.rowHeight : gridConfig.rowHeight,
            };
          },
          // @ts-ignore
          max: (x, y, event) => {
            const elementId = event.element?.id; // Access the element ID
            if (!elementId) return { width: Infinity, height: Infinity };
            const brickType = getBrick(elementId)?.type;
            invariant(brickType, "Brick type not found");
            const maxW = defaultProps[brickType].maxWidth?.[previewMode];
            return {
              width: maxW ? maxW * gridConfig.colWidth : Infinity,
              height: Infinity,
            };
          },
        }),
        // snap TEST
        interact.modifiers.snapSize({
          targets: [interact.snappers.grid({ width: gridConfig.colWidth, height: gridConfig.rowHeight })],
          endOnly: true,
        }),
        ...(resizeOptions.modifiers || []),
      ],
      edges: {
        top: ".react-resizable-handle-n",
        left: ".react-resizable-handle-w",
        bottom: ".react-resizable-handle-s",
        right: ".react-resizable-handle-e",
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
    getSize,
    getBrick,
    getBrickRef,
    previewMode,
    selectedGroup,
    gridConfig,
  ]);

  useEffect(() => {
    if (pageRef.current) {
      dropzone.current = interact("section");
      // dropzone.current = interact(pageRef.current);
      dropzone.current
        .dropzone({
          accept: ".draggable-brick",
          ondrop: (event: Interact.DropEvent) => {
            const pos = getDropPosition(event, gridConfig);
            const type = event.relatedTarget.dataset.brickType;
            if (type) {
              console.debug("Dropped %s", type);
              const constraints: BrickConstraints = defaultProps[type];
              dropCallbacks.onDrop?.(event, pos.grid, { type: type as Brick["type"], constraints });
            }
          },
        })
        .on("dropactivate", function (event: Interact.DropEvent) {
          console.log("dropactivate", event);
          dropCallbacks.onDropActivate?.(event);
        })
        .on("dropdeactivate", function (event: Interact.DropEvent) {
          console.debug("dropdeactivate", event);
          dropCallbacks.onDropDeactivate?.(event);
        })
        .on("dropmove", function (event: Interact.DropEvent) {
          const pos = getDropPosition(event, gridConfig);
          console.log("dropmove", event.relatedTarget, pos);
          const type = event.relatedTarget.dataset.brickType;
          if (type) {
            const constraints: BrickConstraints = defaultProps[type];
            dropCallbacks.onDropMove?.(event, pos.grid, { type: type as Brick["type"], constraints });
          }
        });
    }
    return () => {
      dropzone.current?.unset();
      dropzone.current = null;
    };
  }, [pageRef, gridConfig, dropCallbacks]);
};

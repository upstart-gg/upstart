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
import { getGridPosition, getGridSize } from "~/shared/utils/layout-utils";
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
  dragEnabled?: boolean;
  resizeEnabled?: boolean;
  dragOptions?: Partial<DraggableOptions>;
  resizeOptions?: Partial<ResizableOptions>;
  dragRestrict?: Partial<RestrictOptions>;
  dragCallbacks: DragCallbacks;
  dropCallbacks?: DropCallbacks;
  resizeCallbacks?: ResizeCallbacks;
  gridConfig: GridConfig;
}

interface InteractMethods {
  enable: () => void;
  disable: () => void;
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

const getPosition = (target: HTMLElement, event: Interact.InteractEvent) => {
  const x = parseFloat(target.dataset.x || "0") + event.dx;
  const y = parseFloat(target.dataset.y || "0") + event.dy;
  return { x, y };
};

// Update element transform
const updateElementTransform = (target: HTMLElement, x: number, y: number) => {
  target.style.transform = `translate(${x}px, ${y}px)`;
  target.dataset.x = x.toString();
  target.dataset.y = y.toString();
};

function getDropPosition(event: Interact.DropEvent, gridConfig: GridConfig) {
  const grid = event.target as HTMLElement;
  const gridRect = grid.getBoundingClientRect();

  // Calculate position relative to grid
  const rect = {
    left: event.dragEvent.clientX - gridRect.left,
    top: event.dragEvent.clientY - gridRect.top,
  };

  // Calculate grid position
  const col = Math.round((rect.left - gridConfig.colWidth / 2) / gridConfig.colWidth);
  const row = Math.round((rect.top - gridConfig.rowHeight / 2) / gridConfig.rowHeight);

  return {
    absolute: {
      left: rect.left - gridConfig.colWidth / 2,
      top: rect.top - gridConfig.rowHeight / 2,
    },
    grid: {
      x: Math.max(1, col),
      y: Math.max(1, row),
    },
  };
}
export const useEditablePage = (
  bricksSelectorOrRef: string,
  pageRef: RefObject<HTMLElement>,
  {
    gridConfig,
    dragEnabled = true,
    resizeEnabled = true,
    dragOptions = {},
    resizeOptions = {},
    dragCallbacks,
    resizeCallbacks = {},
    dropCallbacks = {},
  }: UseInteractOptions,
): InteractMethods => {
  // Helper to get size from event
  const getSize = useCallback((event: Interact.ResizeEvent) => {
    const target = event.target as HTMLElement;
    const rect = event.rect || { width: 0, height: 0 };
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

    if (dragEnabled) {
      const container = document.querySelector<HTMLElement>(".page-container")!;
      interactable.current.draggable({
        // hold: 30,
        inertia: true,
        autoScroll: {
          container,
          margin: 40,
          speed: 800,
        },
        modifiers: [
          interact.modifiers.snap({
            targets: [
              snapPositionToGrid({
                colWidth: gridConfig.colWidth, // Your column width
                rowHeight: gridConfig.rowHeight, // Your fixed row height
              }),
            ],
            offset: "parent",
            relativePoints: [{ x: 0, y: 0 }],
            endOnly: true,
          }),
          // interact.modifiers.restrict({
          //   restriction: createScrollAwareRestriction(
          //     container,
          //     gridConfig.containerHorizontalPadding,
          //     gridConfig.containerVerticalPadding,
          //   ),
          //   elementRect: { top: 0, left: 0, bottom: 1, right: 1 },
          //   endOnly: true,
          // }),
          interact.modifiers.restrict({
            restriction: "parent",
            elementRect: { top: 0, left: 0, bottom: 1, right: 1 },
          }),
        ],
        listeners: {
          start: (event: Interact.InteractEvent) => {
            console.debug("useEditablePage:listeners:start()", event);
            const target = event.target as HTMLElement;
            target.style.zIndex = "1000";

            const brick = getBrick(target.id);

            if (brick) {
              const gridPosition = getGridPosition(target, gridConfig);
              // we fire the callback for the main element only
              dragCallbacks.onDragStart?.(brick, getPosition(target, event), gridPosition, event);
            }
          },

          move: (event: Interact.InteractEvent) => {
            const target = event.target as HTMLElement;

            target.classList.add("moving");
            const elements = selectedGroup ? selectedGroup.map(getBrickRef) : [target];
            elements.forEach((element) => {
              if (!element) return;
              const position = getPosition(element, event);
              updateElementTransform(element, position.x, position.y);
            });

            if (!dragCallbacks.onDragMove) {
              return;
            }

            const brick = getBrick(target.id);

            if (brick) {
              const gridPosition = getGridPosition(target, gridConfig);
              dragCallbacks.onDragMove?.(brick, getPosition(target, event), gridPosition, event);
            }
          },
          end: (event: Interact.InteractEvent) => {
            const target = event.target as HTMLElement;
            target.classList.remove("moving");

            // Only proceed with collecting positions if we actually had a swap
            // (meaning we have at least 2 bricks in our set)
            const updatedPositions: Parameters<DragCallbacks["onDragEnd"]>[0] = [];

            const elements = selectedGroup ? selectedGroup.map(getBrickRef) : [target];
            for (const element of elements) {
              const brick = getBrick(element.id);
              if (brick) {
                updatedPositions.push({
                  brick,
                  position: getPosition(element, event),
                  gridPosition: getGridPosition(element, gridConfig),
                });
              }
              element.style.transform = "none";
              element.style.transition = "none";
              element.dataset.x = "0";
              element.dataset.y = "0";
            }

            dragCallbacks.onDragEnd(updatedPositions, event);
          },
        },
        ...dragOptions,
      });
    }

    if (resizeEnabled) {
      interactable.current.resizable({
        inertia: true,
        listeners: {
          start: (event) => {
            resizeCallbacks.onResizeStart?.(event);
          },
          move: (event) => {
            event.stopPropagation();
            event.target.classList.add("moving");
            let { x, y } = event.target.dataset;
            x = parseFloat(x ?? "0") + event.deltaRect.left;
            y = parseFloat(y ?? "0") + event.deltaRect.top;
            Object.assign(event.target.style, {
              width: `${event.rect.width}px`,
              height: `${event.rect.height}px`,
              transform: `translate(${x}px, ${y}px)`,
            });
            Object.assign(event.target.dataset, { x, y });
          },
          end: (event) => {
            const target = event.target as HTMLElement;
            target.classList.remove("moving");
            const size = getSize(event);
            const gridSize = getGridSize(target, gridConfig);
            resizeCallbacks.onResizeEnd?.(target.id, size, gridSize, event);

            Object.assign(event.target.style, {
              width: `auto`,
              height: `auto`,
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
    }

    return () => {
      interactable.current?.unset();
      interactable.current = null;
    };
  }, [
    bricksSelectorOrRef,
    dragCallbacks,
    resizeCallbacks,
    dragEnabled,
    dragOptions,
    resizeOptions,
    getSize,
    resizeEnabled,
    getBrick,
    getBrickRef,
    previewMode,
    selectedGroup,
    gridConfig,
  ]);

  useEffect(() => {
    if (pageRef.current) {
      dropzone.current = interact(pageRef.current);
      dropzone.current
        .dropzone({
          accept: ".draggable-brick",
          ondrop: (event: Interact.DropEvent) => {
            const pos = getDropPosition(event, gridConfig);
            const type = event.relatedTarget.dataset.brickType;
            if (type) {
              console.debug("Dropped %s", type);
              const constraints: BrickConstraints = {
                defaultHeight: defaultProps[type].defaultHeight,
                defaultWidth: defaultProps[type].defaultWidth,
                minHeight: defaultProps[type].minHeight,
                minWidth: defaultProps[type].minWidth,
                maxWidth: defaultProps[type].maxWidth,
                resizable: defaultProps[type].resizable,
                movable: defaultProps[type].movable,
              };
              dropCallbacks.onDrop?.(event, pos.grid, { type: type as Brick["type"], constraints });
            }
          },
        })
        .on("dropactivate", function (event: Interact.DropEvent) {
          console.debug("dropactivate", event);
          dropCallbacks.onDropActivate?.(event);
        })
        .on("dropdeactivate", function (event: Interact.DropEvent) {
          console.debug("dropdeactivate", event);
          dropCallbacks.onDropDeactivate?.(event);
        })
        .on("dropmove", function (event: Interact.DropEvent) {
          const pos = getDropPosition(event, gridConfig);
          const type = event.relatedTarget.dataset.brickType;

          if (type) {
            const constraints: BrickConstraints = {
              defaultHeight: defaultProps[type].defaultHeight,
              defaultWidth: defaultProps[type].defaultWidth,
              minHeight: defaultProps[type].minHeight,
              minWidth: defaultProps[type].minWidth,
              maxWidth: defaultProps[type].maxWidth,
              resizable: defaultProps[type].resizable,
              movable: defaultProps[type].movable,
            };
            dropCallbacks.onDropMove?.(event, pos.grid, { type: type as Brick["type"], constraints });
          }
        });
    }
    return () => {
      dropzone.current?.unset();
      dropzone.current = null;
    };
  }, [pageRef, gridConfig, dropCallbacks]);

  // Methods to control the interaction
  /**
   * Enable the draggable or resizable interaction
   */
  const enable = useCallback(() => {
    if (dragEnabled) interactable.current?.draggable(true);
    if (resizeEnabled) interactable.current?.resizable(true);
  }, [dragEnabled, resizeEnabled]);

  /**
   * Disable the draggable or resizable interaction
   */
  const disable = useCallback(() => {
    if (dragEnabled) interactable.current?.draggable(false);
    if (resizeEnabled) interactable.current?.resizable(false);
  }, [dragEnabled, resizeEnabled]);

  return {
    enable,
    disable,
  };
};

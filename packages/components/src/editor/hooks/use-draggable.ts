import interact from "interactjs";
import { useCallback, useEffect, useRef, type RefObject } from "react";
import type { RestrictOptions } from "@interactjs/modifiers/restrict/pointer";
import type { DraggableOptions } from "@interactjs/actions/drag/plugin";
import type { ResizableOptions } from "@interactjs/actions/resize/plugin";
import { useGetBrick, usePreviewMode, useSelectedGroup } from "./use-editor";
import type { Brick } from "@upstart.gg/sdk/shared/bricks";
import type { BrickConstraints } from "@upstart.gg/sdk/shared/brick-manifest";
import { defaults } from "@upstart.gg/sdk/bricks/manifests/all-manifests";
import invariant from "@upstart.gg/sdk/shared/utils/invariant";

interface DragCallbacks {
  onDragMove?: (
    brick: Brick,
    position: { x: number; y: number },
    gridPosition: { x: number; y: number },
    event: Interact.InteractEvent,
  ) => void;
  onDragEnd?: (
    brick: Brick,
    position: { x: number; y: number },
    gridPosition: { x: number; y: number },
    updatedPositions: Record<string, { x: number; y: number }> | undefined, // Added parameter
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
  dragCallbacks?: DragCallbacks;
  dropCallbacks?: DropCallbacks;
  resizeCallbacks?: ResizeCallbacks;
  gridConfig: GridConfig;
}

interface InteractMethods {
  enable: () => void;
  disable: () => void;
  updateDragOptions: (options: Parameters<Interact.Interactable["draggable"]>[0]) => void;
  updateResizeOptions: (options: Parameters<Interact.Interactable["resizable"]>[0]) => void;
}

type QuerySelector = string;

interface GridConfig {
  colWidth: number;
  rowHeight: number;
  containerHorizontalPadding: number;
  containerVerticalPadding: number;
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
  paddingX = 40, // Horizontal padding
  paddingY = 15, // Vertical padding
}: SnapToGridConfig) {
  return function (x: number, y: number) {
    return {
      x: Math.round((x - paddingX) / colWidth) * colWidth + paddingX,
      y: Math.round((y - paddingY) / rowHeight) * rowHeight + paddingY,
    };
  };
}

function createScrollAwareRestriction(container: HTMLElement, paddingX: number, paddingY: number) {
  return function (
    _x: number,
    _y: number,
    interaction: Interact.Interaction<keyof Interact.ActionMap>,
  ): { top: number; left: number; bottom: number; right: number } {
    const scroll = {
      x: container.scrollLeft,
      y: container.scrollTop,
    };

    const targetRect = interaction.element?.getBoundingClientRect();
    invariant(targetRect, "Element not found in createScrollAwareRestriction()");
    const containerRect = container.getBoundingClientRect();

    // Calculate boundaries including scroll position
    return {
      top: paddingY,
      left: paddingX,
      bottom: containerRect.height + scroll.y - targetRect.height - paddingY,
      right: containerRect.width + scroll.x - targetRect.width - paddingX,
    };
  };
}

function getGridPosition(element: HTMLElement | { left: number; top: number }, config: GridConfig) {
  // Get element's initial position (getBoundingClientRect gives position relative to viewport)
  const rect = element instanceof HTMLElement ? element.getBoundingClientRect() : element;
  const container = document.querySelector(".page-container")!.getBoundingClientRect();

  // Calculate actual position relative to container
  const actualX = rect.left - container.left;
  const actualY = rect.top - container.top;

  // Calculate grid position
  const gridX = Math.round((actualX - config.containerHorizontalPadding) / config.colWidth);
  const gridY = Math.round((actualY - config.containerVerticalPadding) / config.rowHeight);

  return {
    x: Math.max(0, gridX),
    y: Math.max(0, gridY),
  };
}

function getGridSize(element: HTMLElement, config: GridConfig) {
  const rect = element.getBoundingClientRect();
  return {
    w: Math.round(rect.width / config.colWidth),
    h: Math.round(rect.height / config.rowHeight),
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
  const col = Math.round(
    (rect.left - gridConfig.containerHorizontalPadding - gridConfig.colWidth / 2) / gridConfig.colWidth,
  );
  const row = Math.round(
    (rect.top - gridConfig.containerVerticalPadding - gridConfig.rowHeight / 2) / gridConfig.rowHeight,
  );

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
  bricksSelectorOrRef: QuerySelector,
  pageRef: RefObject<HTMLElement>,
  {
    gridConfig,
    dragEnabled = true,
    resizeEnabled = true,
    dragOptions = {},
    resizeOptions = {},
    dragCallbacks = {},
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

  // Refs for tracking drag state
  const draggedBrick = useRef<string | null>(null);
  const dragStartPosition = useRef<{ x: number; y: number } | null>(null);
  const currentSwapTarget = useRef<HTMLElement | null>(null);
  // final bricks position after move
  const swappedBricks = useRef<Set<string>>(new Set());

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
          container: container,
          margin: 40,
          speed: 800,
        },
        modifiers: [
          interact.modifiers.snap({
            targets: [
              snapPositionToGrid({
                colWidth: gridConfig.colWidth, // Your column width
                rowHeight: gridConfig.rowHeight, // Your fixed row height
                paddingX: gridConfig.containerHorizontalPadding, // Your container padding
                paddingY: gridConfig.containerVerticalPadding, // Your container padding
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
            offset: {
              left: gridConfig.containerHorizontalPadding,
              top: gridConfig.containerVerticalPadding,
              bottom: gridConfig.containerVerticalPadding,
              right: gridConfig.containerHorizontalPadding,
            },
          }),
        ],
        listeners: {
          start: (event: Interact.InteractEvent) => {
            console.debug("useEditablePage:listeners:start()", event);
            const target = event.target as HTMLElement;
            target.style.zIndex = "1000";

            draggedBrick.current = target.id;
            swappedBricks.current = new Set();

            const rect = target.getBoundingClientRect();

            dragStartPosition.current = {
              x: rect.left,
              y: rect.top,
            };

            const brick = getBrick(target.id);

            if (brick) {
              const {
                position: {
                  desktop: { w, h },
                },
              } = brick;

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

            if (brick && dragStartPosition.current) {
              const currentRect = target.getBoundingClientRect();

              // Calculate distance from original position
              const dx = Math.abs(currentRect.left - dragStartPosition.current.x);
              const dy = Math.abs(currentRect.top - dragStartPosition.current.y);

              // Convert to a 0-1 value where 1 means we're at the original position
              // and 0 means we're far away (using brick dimensions as reference)
              const overlapWithOriginal = Math.max(
                0,
                1 - Math.max(dx / currentRect.width, dy / currentRect.height),
              );

              if (overlapWithOriginal > 0.5) {
                if (currentSwapTarget.current) {
                  Object.assign(currentSwapTarget.current.style, {
                    transform: "none",
                    transition: "transform 0.2s",
                  });
                  currentSwapTarget.current = null;
                }
              } else {
                // Get all bricks on the page
                const allBricks = Array.from(document.querySelectorAll("[data-brick-type]")).filter(
                  (el): el is HTMLElement =>
                    el instanceof HTMLElement &&
                    el.id !== brick.id &&
                    (!el.closest('[data-brick-type="container"]') || el.dataset.brickType === "container"),
                );

                let bestTarget: HTMLElement | undefined = undefined;
                let maxOverlap = 0;

                // Check each brick for overlap with the dragged brick
                allBricks.forEach((targetBrick) => {
                  const targetRect = targetBrick.getBoundingClientRect();

                  // Calculate overlap area with target brick
                  const overlapX = Math.max(
                    0,
                    Math.min(currentRect.right, targetRect.right) -
                      Math.max(currentRect.left, targetRect.left),
                  );
                  const overlapY = Math.max(
                    0,
                    Math.min(currentRect.bottom, targetRect.bottom) -
                      Math.max(currentRect.top, targetRect.top),
                  );

                  // Calculate overlap as percentage of the smaller brick's area
                  const targetArea = targetRect.width * targetRect.height;
                  const currentArea = currentRect.width * currentRect.height;
                  const minArea = Math.min(targetArea, currentArea);
                  const overlapArea = (overlapX * overlapY) / minArea;

                  if (overlapArea > maxOverlap) {
                    maxOverlap = overlapArea;
                    bestTarget = targetBrick;
                  }
                });

                // Only swap if overlap is more than threshold (10%)
                if (
                  typeof bestTarget === "object" &&
                  maxOverlap > 0.1 &&
                  currentSwapTarget.current !== bestTarget
                ) {
                  // Reset previous swap if exists
                  if (currentSwapTarget.current) {
                    Object.assign(currentSwapTarget.current.style, {
                      transform: "none",
                      transition: "transform 0.2s",
                    });

                    // Remove the previous target from our tracking set if we're swapping with a different brick
                    if (currentSwapTarget.current !== bestTarget) {
                      swappedBricks.current.delete(currentSwapTarget.current.id);
                    }
                  }

                  // Add both the dragged brick and the target to our tracking set
                  swappedBricks.current.add(target.id);
                  swappedBricks.current.add((bestTarget as HTMLElement).id);

                  const rect2 = (bestTarget as HTMLElement).getBoundingClientRect();
                  const dx = dragStartPosition.current.x - rect2.left;
                  const dy = dragStartPosition.current.y - rect2.top;

                  Object.assign((bestTarget as HTMLElement).style, {
                    transform: `translate(${dx}px, ${dy}px)`,
                    transition: "transform 0.2s",
                  });

                  currentSwapTarget.current = bestTarget;

                  // Add the new target to our tracking set
                  swappedBricks.current.add((bestTarget as HTMLElement).id);
                }
              }

              const gridPosition = getGridPosition(target, gridConfig);
              dragCallbacks.onDragMove?.(brick, getPosition(target, event), gridPosition, event);
            }
          },
          end: (event: Interact.InteractEvent) => {
            const target = event.target as HTMLElement;
            target.classList.remove("moving");

            // Only proceed with collecting positions if we actually had a swap
            // (meaning we have at least 2 bricks in our set)
            const updatedPositions: Record<string, { x: number; y: number }> = {};

            if (swappedBricks.current.size >= 2) {
              // Process all swapped bricks
              swappedBricks.current.forEach((brickId) => {
                const element = getBrickRef(brickId);
                if (!element) return;

                const brick = getBrick(brickId);
                if (!brick) return;

                // Get the final grid position
                const gridPosition = getGridPosition(element, gridConfig);
                updatedPositions[brickId] = gridPosition;

                // Reset transform
                element.style.transform = "none";
                element.style.transition = "none";
                element.dataset.x = "0";
                element.dataset.y = "0";
              });
            } else {
              // No actual swap happened, just get the position of the dragged brick
              updatedPositions[target.id] = getGridPosition(target, gridConfig);
            }

            const elements = selectedGroup ? selectedGroup.map(getBrickRef) : [target];
            elements.forEach((element) => {
              if (!element) return;
              console.log("reset element", element.id);
              const brick = getBrick(element.id);
              if (!brick) return;
              const position = getPosition(element, event);
              const gridPosition = getGridPosition(element, gridConfig);
              element.style.transform = "none";
              element.style.transition = "none";
              element.dataset.x = "0";
              element.dataset.y = "0";
              dragCallbacks.onDragEnd?.(brick, position, gridPosition, updatedPositions, event);
            });

            // Reset swap state
            if (currentSwapTarget.current) {
              currentSwapTarget.current.style.transition = "none";
              currentSwapTarget.current.style.transform = "none";
            }
            draggedBrick.current = null;
            dragStartPosition.current = null;
            currentSwapTarget.current = null;
            swappedBricks.current.clear();
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
            // event.target.style.width = "auto";
            // event.target.style.height = "auto";
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
              const minW = defaults[brickType].minWidth[previewMode];
              const minH = defaults[brickType].minHeight[previewMode];
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
              const maxW = defaults[brickType].maxWidth[previewMode];
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
                preferredHeight: defaults[type].preferredHeight,
                preferredWidth: defaults[type].preferredWidth,
                minHeight: defaults[type].minHeight,
                minWidth: defaults[type].minWidth,
                maxWidth: defaults[type].maxWidth,
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
              preferredHeight: defaults[type].preferredHeight,
              preferredWidth: defaults[type].preferredWidth,
              minHeight: defaults[type].minHeight,
              minWidth: defaults[type].minWidth,
              maxWidth: defaults[type].maxWidth,
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

  /**
   * Update the draggable options
   */
  const updateDragOptions = useCallback((options: Parameters<Interact.Interactable["draggable"]>[0]) => {
    interactable.current?.draggable(options);
  }, []);

  /**
   * Update the resizable options
   */
  const updateResizeOptions = useCallback((options: Parameters<Interact.Interactable["resizable"]>[0]) => {
    interactable.current?.resizable(options);
  }, []);

  return {
    enable,
    disable,
    updateDragOptions,
    updateResizeOptions,
  };
};

interface ElementRefs {
  setBrickRef: (id: string, node: HTMLElement | null) => void;
  getBrickRef: (id: string) => HTMLElement | undefined;
}

const useBricksRefs = (): ElementRefs => {
  const elementRefs = useRef(new Map<string, HTMLElement>());

  const setBrickRef = useCallback((id: string, node: HTMLElement | null) => {
    if (node) {
      elementRefs.current.set(id, node);
    } else {
      elementRefs.current.delete(id);
    }
  }, []);

  const getBrickRef = useCallback((id: string) => {
    const existing = elementRefs.current.get(id);
    if (existing) {
      return existing;
    }
    const node = document.getElementById(id);
    if (node) {
      elementRefs.current.set(id, node);
    }
    return node ?? undefined;
  }, []);

  return { setBrickRef, getBrickRef };
};

import interact from "interactjs";
import { useEffect, useRef, type RefObject } from "react";
import type { RestrictOptions } from "@interactjs/modifiers/restrict/pointer";
import type { DraggableOptions } from "@interactjs/actions/drag/plugin";
import type { ResizableOptions } from "@interactjs/actions/resize/plugin";
import { useGetBrick, usePreviewMode, useSelectedGroup } from "./use-editor";
import type { Brick } from "@upstart.gg/sdk/shared/bricks";
import type { BrickConstraints } from "@upstart.gg/sdk/shared/brick-manifest";
import { defaultProps, manifests } from "@upstart.gg/sdk/bricks/manifests/all-manifests";
import invariant from "@upstart.gg/sdk/shared/utils/invariant";
import {
  getGridPosition,
  getBrickCoordsInPage,
  getSectionAtPosition,
  getDropPosition,
} from "~/shared/utils/layout-utils";
import { useBricksRefs } from "./use-bricks-refs";
import type { GridConfig } from "~/shared/hooks/use-grid-config";
import { min } from "date-fns";

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
  dropCallbacks?: DropCallbacks;
  resizeCallbacks: ResizeCallbacks;
  gridConfig: GridConfig;
}

interface SnapToGridConfig {
  colWidth: number;
  rowHeight: number;
  paddingX?: number;
  paddingY?: number;
}

function snapPositionToGrid({
  colWidth, // Width of each column
  rowHeight, // Fixed height of rows
}: SnapToGridConfig) {
  return function (x: number, y: number) {
    return {
      x: Math.round(x / colWidth) * colWidth,
      y: Math.round(y / rowHeight) * rowHeight,
    };
  };
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
  {
    gridConfig,
    dragOptions = {},
    resizeOptions = {},
    dragCallbacks,
    resizeCallbacks,
    dropCallbacks = {},
  }: UseInteractOptions,
) => {
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

          // Get initial position relative to container
          const initialPos = getBrickCoordsInPage(target, container);

          // Now set up the element for dragging
          target.dataset.tempX = initialPos.x.toString();
          target.dataset.tempY = initialPos.y.toString();
          target.dataset.originalStylePos =
            target.style.position && target.style.position !== "" ? target.style.position : "relative";
          target.dataset.originalStyleZIndex = target.style.zIndex;
          target.dataset.wasDragged = "false";

          Object.assign(target.style, {
            position: "fixed",
            top: `${initialPos.y}px`,
            left: `${initialPos.x}px`,
            width: `${initialPos.w}px`,
            height: `${initialPos.h}px`,
            zIndex: "999999",
          });
        },

        end: (event: Interact.InteractEvent) => {
          console.log("useEditablePage:listeners:end()", event);

          const target = event.target as HTMLElement;
          const updatedPositions: Parameters<DragCallbacks["onDragEnd"]>[0] = [];
          const elements = selectedGroup ? selectedGroup.map(getBrickRef) : [target];
          const section = getSectionAtPosition(event.client.x, event.client.y);

          invariant(section, "Section not found");

          for (const element of elements) {
            const brick = getBrick(element.id);
            if (brick) {
              updatedPositions.push({
                brick,
                gridPosition: getGridPosition(element, gridConfig, section),
                sectionId: section.id,
              });
            }

            // reset the styles
            requestAnimationFrame(() => {
              Object.assign(element.style, {
                transform: "none",
                transition: "none",
                position: target.dataset.originalStylePos ?? "relative",
                zIndex: target.dataset.originalStyleZIndex ?? "",
                top: "",
                left: "",
                width: "auto",
                height: "auto",
              });
            });
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

        move: (event: Interact.InteractEvent) => {
          const target = event.target as HTMLElement;
          target.dataset.wasDragged = "true";

          requestAnimationFrame(() => {
            target.classList.add("moving");
          });

          const elements = selectedGroup ? selectedGroup.map(getBrickRef) : [target];
          elements.forEach((element) => {
            if (!element) return;
            const x = parseFloat(element.dataset.tempX || "0") + event.dx;
            const y = parseFloat(element.dataset.tempY || "0") + event.dy;
            updateElementTransform(element, x, y);
          });
        },
      },
      ...dragOptions,
    });

    interactable.current.resizable({
      // inertia: true,
      ignoreFrom: ".resize-handle-disabled",
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
          const gridPos = getGridPosition(target, gridConfig);

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
          targets: [interact.snappers.grid({ width: gridConfig.colWidth, height: gridConfig.rowHeight })],
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

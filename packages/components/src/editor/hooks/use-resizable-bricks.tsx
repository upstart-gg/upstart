import interact from "interactjs";
import { useCallback, useEffect, useRef, useState } from "react";
import { getBrickDimensions, getBrickPosition, getClosestSection } from "~/shared/utils/layout-utils";
import { useDraftHelpers, useGetBrick, useGridConfig, usePreviewMode } from "./use-editor";
import invariant from "@upstart.gg/sdk/shared/utils/invariant";
import { defaultProps, manifests } from "@upstart.gg/sdk/bricks/manifests/all-manifests";

const bricksSelectorOrRef = "[data-brick]:not(.container-child):not([data-no-drag='true'])";

export function useResizableBricks() {
  const interactable = useRef<Interact.Interactable | null>(null);
  const previewMode = usePreviewMode();
  const gridConfig = useGridConfig();
  const getBrick = useGetBrick();
  const { updateBrickProps } = useDraftHelpers();
  const [resizing, setResizing] = useState(false);

  const snapSizeToGrid = useCallback(() => {
    return function (x: number, y: number, { element }: Interact.Interaction) {
      invariant(element, "Element not found");
      return interact.snappers.grid({ width: gridConfig.colWidth, height: gridConfig.rowHeight });
    };
  }, [gridConfig]);

  useEffect(() => {
    interactable.current = interact(bricksSelectorOrRef, {
      styleCursor: false,
      // Prevent default browser behavior
      preventDefault: "always",
    });
    interactable.current.on(
      "click",
      function (event) {
        event.stopImmediatePropagation();
      },
      true /* useCapture */,
    );
    interactable.current.resizable({
      // inertia: true,
      ignoreFrom: ".resize-handle-disabled, [data-ui-options-bar], [data-ui-drag-handle]",
      listeners: {
        start: (event) => {
          console.log("resize start");
          // Additional event prevention
          event.preventDefault();
          event.stopPropagation();
          setResizing(true);
          const target = event.target as HTMLElement;
          target.dataset.tempX = "0";
          target.dataset.tempY = "0";

          const gridDimensions = getBrickDimensions(target, gridConfig);

          console.log("INITIAL GRID POS", gridDimensions);
        },
        move: (event) => {
          // Prevent event propagation
          event.preventDefault();
          event.stopPropagation();

          const target = event.target as HTMLElement;

          let { tempX, tempY } = target.dataset;
          tempX = parseFloat(tempX ?? "0") + event.deltaRect.left;
          tempY = parseFloat(tempY ?? "0") + event.deltaRect.top;

          const newStyle = {
            width: `${event.rect.width}px`,
            height: `${event.rect.height}px`,
            minHeight: "auto",
            // transform: `translate(${tempX}px, ${tempY}px)`,
          };

          Object.assign(target.dataset, { tempX, tempY });

          requestAnimationFrame(() => {
            target.classList.add("moving");
            Object.assign(target.style, newStyle);
          });
        },
        end: (event) => {
          // Prevent event propagation
          event.preventDefault();
          event.stopPropagation();
          setResizing(false);
          console.log("resize end", event);
          const target = event.target as HTMLElement;
          const gridDimensions = getBrickDimensions(target, gridConfig);

          updateBrickProps(target.id, {
            widthInColUnits: gridDimensions.w,
            heightInRowUnits: gridDimensions.h,
          });

          console.log("FINAL GRID POS", gridDimensions);

          requestAnimationFrame(() => {
            Object.assign(target.style, {
              width: "",
              height: "",
              minHeight: "",
              transform: "none",
            });
            target.classList.remove("moving");
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
      ],

      edges: {
        top: true,
        left: true,
        bottom: true,
        right: true,
      },
    });
  });

  return {
    resizing,
  };
}

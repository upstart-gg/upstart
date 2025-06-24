import interact from "interactjs";
import { useCallback, useEffect, useRef, useState } from "react";
import { getClosestSection } from "~/shared/utils/layout-utils";
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

  // Memoize the resize handlers to prevent unnecessary re-renders
  const handleResizeStart = useCallback((event: Interact.ResizeEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setResizing(true);
  }, []);

  const handleResizeMove = useCallback((event: Interact.ResizeEvent) => {
    event.preventDefault();
    event.stopPropagation();

    const target = event.target as HTMLElement;

    if (!event.deltaRect) {
      return; // No change in size, exit early
    }

    // Apply the visual changes directly using the rect values from interact.js
    // interact.js handles all the position calculations internally
    const newStyle = {
      width: `${event.rect.width}px`,
      height: `${event.rect.height}px`,
      minHeight: "auto",
      transform: `translate(${event.deltaRect.left}px, ${event.deltaRect.top}px)`,
    };

    requestAnimationFrame(() => {
      target.classList.add("moving");
      Object.assign(target.style, newStyle);
    });
  }, []);

  const handleResizeEnd = useCallback(
    (event: Interact.ResizeEvent) => {
      event.preventDefault();
      event.stopPropagation();
      setResizing(false);
      const target = event.target as HTMLElement;

      // Update with correct property names - use width/height instead of fixedWidth/fixedHeight
      updateBrickProps(target.id, {
        width: `${event.rect.width}px`,
        height: `${event.rect.height}px`,
      });

      requestAnimationFrame(() => {
        Object.assign(target.style, {
          width: "",
          height: "",
          minHeight: "",
          transform: "",
        });
        target.classList.remove("moving");
      });
    },
    [updateBrickProps],
  );

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
        start: handleResizeStart,
        move: handleResizeMove,
        end: handleResizeEnd,
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
          targets: [snapSizeToGrid],
        }),
      ],

      edges: {
        top: true,
        left: true,
        bottom: true,
        right: true,
      },
    });

    // Cleanup function
    return () => {
      if (interactable.current) {
        interactable.current.unset();
        interactable.current = null;
      }
    };
  }, [
    previewMode,
    gridConfig,
    getBrick,
    snapSizeToGrid,
    handleResizeEnd,
    handleResizeMove,
    handleResizeStart,
  ]); // Add proper dependencies

  return {
    resizing,
  };
}

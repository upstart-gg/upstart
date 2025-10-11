import { useCallback, useEffect, useRef } from "react";
import interact from "interactjs";
import { manifests } from "@upstart.gg/sdk/bricks/manifests/index";
import { usePreviewMode } from "./use-editor";

export interface ResizeEvent {
  target: HTMLElement;
  rect: {
    width: number;
    height: number;
  };
  deltaRect: {
    left: number;
    top: number;
    width: number;
    height: number;
  };
  edges: {
    left: boolean;
    right: boolean;
    bottom: boolean;
    top: boolean;
  };
  activeDirection?: string;
}

export interface UseResizableOptions {
  /**
   * Which directions are enabled for resizing
   */
  enabledDirections?: {
    n?: boolean;
    s?: boolean;
    e?: boolean;
    w?: boolean;
    ne?: boolean;
    nw?: boolean;
    se?: boolean;
    sw?: boolean;
  };

  /**
   * Size constraints
   */
  restrictSize?: {
    min?: { width: number; height: number };
    max?: { width: number; height: number };
  };

  /**
   * Grid snapping configuration
   */
  gridSnap: {
    width: number;
    height: number;
    enabled?: boolean;
    offset?: { x: number; y: number };
    range?: number;
  };

  /**
   * Event listeners
   */
  onResizeStart?: (event: ResizeEvent) => void;
  onResize?: (event: ResizeEvent) => void;
  onResizeEnd?: (event: ResizeEvent) => void;

  /**
   * Whether the hook is enabled
   */
  enabled?: boolean;
}

/**
 * Custom hook to make elements resizable using interact.js
 */
export function useResizable(cssQuery: string, options: UseResizableOptions): void {
  const interactablesRef = useRef<Set<Interact.Interactable>>(new Set());
  const observerRef = useRef<MutationObserver | null>(null);
  const previewMode = usePreviewMode();
  const { enabledDirections, gridSnap, onResizeStart, onResize, onResizeEnd, enabled = true } = options;

  // Extract active direction from handle element
  const getActiveDirection = useCallback((handle: HTMLElement | null): string => {
    if (!handle?.classList.contains("resizable-handle")) return "";

    const directionClass = Array.from(handle.classList).find((cls) => cls.startsWith("resizable-handle-"));

    return directionClass ? directionClass.replace("resizable-handle-", "") : "";
  }, []);

  // Create resize event object
  const createResizeEvent = useCallback(
    (
      target: HTMLElement,
      rect: { width: number; height: number },
      deltaRect: { left: number; top: number; width: number; height: number },
      edges: { left: boolean; right: boolean; bottom: boolean; top: boolean },
      activeHandle?: HTMLElement | null,
    ): ResizeEvent => ({
      target,
      rect,
      deltaRect,
      edges,
      activeDirection: getActiveDirection(activeHandle || null),
    }),
    [getActiveDirection],
  );

  // Initialize resizable elements
  const initializeResizable = useCallback(() => {
    if (!enabled) return;

    // Clean up existing interactables
    interactablesRef.current.forEach((interactable) => interactable.unset());
    interactablesRef.current.clear();

    // Find and configure elements
    const elements = document.querySelectorAll(cssQuery);

    elements.forEach((element) => {
      const htmlElement = element as HTMLElement;

      // Check if element has resize handles
      const hasHandles = htmlElement.querySelector(".resizable-handle");
      if (!hasHandles) return;

      const interactable = interact(htmlElement, {
        preventDefault: "always",
      }).resizable({
        edges: {
          top: ".resizable-handle-n, .resizable-handle-ne, .resizable-handle-nw",
          right: ".resizable-handle-e, .resizable-handle-ne, .resizable-handle-se",
          bottom: ".resizable-handle-s, .resizable-handle-se, .resizable-handle-sw",
          left: ".resizable-handle-w, .resizable-handle-nw, .resizable-handle-sw",
        },
        listeners: {
          start(event) {
            const target = event.target as HTMLElement;
            const rect = target.getBoundingClientRect();
            const activeHandle = event.interaction.downEvent?.target as HTMLElement;

            target.classList.toggle("resizing", true);

            setElementSize(target, rect.width, rect.height, event);

            const resizeEvent = createResizeEvent(
              target,
              { width: rect.width, height: rect.height },
              { left: 0, top: 0, width: 0, height: 0 },
              event.edges,
              activeHandle,
            );

            onResizeStart?.(resizeEvent);
          },

          move(event) {
            const target = event.target as HTMLElement;
            let { width, height } = event.rect;
            // log target element and its styles
            const manifest = manifests[target.dataset.brickType || "unknown"] || {};

            if (manifest.minWidth?.[previewMode]) {
              width = Math.max(width, manifest.minWidth[previewMode]);
            }
            if (manifest.minHeight?.[previewMode]) {
              height = Math.max(height, manifest.minHeight[previewMode]);
            }
            if (manifest.maxWidth?.[previewMode]) {
              width = Math.min(width, manifest.maxWidth[previewMode]);
            }
            if (manifest.maxHeight?.[previewMode]) {
              height = Math.min(height, manifest.maxHeight[previewMode]);
            }

            setElementSize(target, width, height, event);

            // Handle position adjustments for top/left edges
            if (event.edges.left) {
              // target.style.left = `${parseFloat(target.style.left || "0") + event.deltaRect.left}px`;
              // target.style.marginRight = `${parseFloat(target.style.left || "0") + event.deltaRect.left}px`;
            }
            if (event.edges.right) {
              // target.style.right = `${parseFloat(target.style.right || "0") - event.deltaRect.right}px`;
              // target.style.marginLeft = `${parseFloat(target.style.right || "0") - event.deltaRect.right}px`;
            }
            if (event.edges.top) {
              // target.style.top = `${parseFloat(target.style.top || "0") + event.deltaRect.top}px`;
              // target.style.marginBottom = `${parseFloat(target.style.top || "0") + event.deltaRect.top}px`;
            }
            if (event.edges.bottom) {
              // target.style.bottom = `${parseFloat(target.style.bottom || "0") - event.deltaRect.bottom}px`;
              // target.style.marginTop = `${parseFloat(target.style.bottom || "0") - event.deltaRect.bottom}px`;
            }

            const activeHandle = event.interaction.downEvent?.target as HTMLElement;
            const resizeEvent = createResizeEvent(
              target,
              { width, height },
              event.deltaRect,
              event.edges,
              activeHandle,
            );

            onResize?.(resizeEvent);
          },

          end(event) {
            event.stopPropagation();

            const target = event.target as HTMLElement;
            const rect = target.getBoundingClientRect();
            const activeHandle = event.interaction.downEvent?.target as HTMLElement;

            target.classList.toggle("resizing", false);

            const resizeEvent = createResizeEvent(
              target,
              { width: rect.width, height: rect.height },
              event.deltaRect,
              event.edges,
              activeHandle,
            );

            onResizeEnd?.(resizeEvent);
          },
        },
        modifiers: [
          interact.modifiers.restrictSize({
            // @ts-ignore
            min: (x, y, event) => {
              const element = event.element as HTMLElement;
              const brickType = element.dataset.brickType;
              if (!brickType) {
                // Element does not have a brickType dataset attribute, using default min size.
                return { width: gridSnap.width, height: gridSnap.height };
              }
              const manifest = manifests[brickType];
              const minWidth = manifest.minWidth?.[previewMode] ?? gridSnap.width;
              const minHeight = manifest.minHeight?.[previewMode] ?? gridSnap.height;
              return { width: minWidth, height: minHeight };
            },
            // @ts-ignore
            max: (x, y, event) => {
              const element = event.element as HTMLElement;
              const parent = element.parentElement as HTMLElement;
              // ParentHeight without padding
              const parentHeight =
                parent.clientHeight -
                parseFloat(getComputedStyle(parent).paddingTop) -
                parseFloat(getComputedStyle(parent).paddingBottom);
              const brickType = element.dataset.brickType;
              if (!brickType) {
                // Element does not have a brickType dataset attribute, using default max size.
                return { width: Infinity, height: parentHeight };
              }
              const manifest = manifests[brickType];
              const maxWidth = manifest.maxWidth?.[previewMode] ?? Infinity;
              const maxHeight = manifest.maxHeight?.[previewMode] ?? Infinity; // Using Infinity allows resizing higher than the section height
              // const maxHeight = manifest.maxHeight?.[previewMode] ?? parentHeight;
              return { width: maxWidth, height: maxHeight };
            },
          }),
          ...(gridSnap?.enabled !== false && gridSnap
            ? [
                interact.modifiers.snapSize({
                  endOnly: true,
                  targets: [
                    interact.snappers.grid({
                      width: gridSnap.width,
                      height: gridSnap.height,
                      offset: gridSnap.offset || { x: 0, y: 0 },
                      range: gridSnap.range || Infinity,
                    }),
                  ],
                }),
              ]
            : []),
        ].filter(Boolean),
      });

      // DO NOT REMOVE
      // IMPORTANT: This prevents the default click event from propagating and
      // causing selection of other elements like the upper section or container.
      interactable.on("resizeend", function () {
        window.addEventListener("click", (ev: MouseEvent) => ev.stopImmediatePropagation(), {
          capture: true,
          once: true,
        });
      });
      // END OF DO NOT REMOVE

      interactablesRef.current.add(interactable);
    });
  }, [enabled, cssQuery, previewMode, gridSnap, onResizeStart, onResize, onResizeEnd, createResizeEvent]);

  // Set up mutation observer for dynamic content
  const setupMutationObserver = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new MutationObserver((mutations) => {
      const hasRelevantChanges = mutations.some((mutation) => {
        if (mutation.type !== "childList") return false;

        const checkNodes = (nodes: NodeList) =>
          Array.from(nodes).some(
            (node) =>
              node.nodeType === Node.ELEMENT_NODE &&
              ((node as Element).matches?.(cssQuery) || (node as Element).querySelector?.(cssQuery)),
          );

        return checkNodes(mutation.addedNodes) || checkNodes(mutation.removedNodes);
      });

      if (hasRelevantChanges) {
        setTimeout(initializeResizable, 100);
      }
    });

    observerRef.current.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }, [cssQuery, initializeResizable]);

  // Main effect
  useEffect(() => {
    if (enabled) {
      initializeResizable();
      setupMutationObserver();
    } else {
      // Clean up when disabled
      interactablesRef.current.forEach((interactable) => interactable.unset());
      interactablesRef.current.clear();

      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    }

    return () => {
      // Cleanup on unmount
      interactablesRef.current.forEach((interactable) => interactable.unset());
      interactablesRef.current.clear();

      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [enabled, initializeResizable, setupMutationObserver]);
}

// helper to Set element dimensions
function setElementSize(element: HTMLElement, width: number, height: number, event: ResizeEvent) {
  // element.style.minHeight = `${height}px`;

  let { x = 0, y = 0 } = element.dataset;

  // Parse existing transform values
  x = (parseFloat(`${x}`) || 0) + event.deltaRect.left;
  y = (parseFloat(`${y}`) || 0) + event.deltaRect.top;

  // Update position to maintain the correct anchor point
  requestAnimationFrame(() => {
    element.style.width = `${width}px`;
    element.style.height = `${height}px`;

    // disable flex-grow temporarily to allow resize
    element.style.setProperty("flex-grow", "0");
    element.style.transform = `translate(${x}px, ${y}px)`;
  });
}

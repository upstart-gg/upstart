import { useCallback, useEffect, useRef } from "react";
import interact from "interactjs";
import { manifests } from "@upstart.gg/sdk/shared/bricks/manifests/all-manifests";
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
  gridSnap?: {
    width: number;
    height: number;
    enabled?: boolean;
    offset?: { x: number; y: number };
    range?: number;
  };

  /**
   * Whether to preserve aspect ratio during resize
   */
  preserveAspectRatio?: boolean;

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
export function useResizable(cssQuery: string, options: UseResizableOptions = {}): void {
  const interactablesRef = useRef<Set<Interact.Interactable>>(new Set());
  const observerRef = useRef<MutationObserver | null>(null);
  const previewMode = usePreviewMode();

  const {
    enabledDirections,
    gridSnap,
    preserveAspectRatio = false,
    onResizeStart,
    onResize,
    onResizeEnd,
    enabled = true,
  } = options;

  // Extract active direction from handle element
  const getActiveDirection = useCallback((handle: HTMLElement | null): string => {
    if (!handle?.classList.contains("resizable-handle")) return "";

    const directionClass = Array.from(handle.classList).find((cls) => cls.startsWith("resizable-handle-"));

    return directionClass ? directionClass.replace("resizable-handle-", "") : "";
  }, []);

  // Set element dimensions
  const setElementSize = useCallback((element: HTMLElement, width: number, height: number) => {
    element.style.width = `${width}px`;
    element.style.height = `${height}px`;
    element.style.minWidth = `${width}px`;
    element.style.minHeight = `${height}px`;
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

      const interactable = interact(htmlElement).resizable({
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

            setElementSize(target, rect.width, rect.height);

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

            // Handle aspect ratio preservation
            if (preserveAspectRatio) {
              const rect = target.getBoundingClientRect();
              const aspectRatio = rect.width / rect.height;

              if (event.edges.right || event.edges.left) {
                height = width / aspectRatio;
              } else if (event.edges.top || event.edges.bottom) {
                width = height * aspectRatio;
              }
            }

            // log target element and its styles
            console.log("Resizing target:", target.dataset.brickType);
            const manifest = manifests[target.dataset.brickType || "unknown"] || {};

            if (manifest.minWidth) {
              width = Math.max(width, manifest.minWidth[previewMode]);
            }
            if (manifest.minHeight) {
              height = Math.max(height, manifest.minHeight[previewMode]);
            }
            if (manifest.maxWidth) {
              width = Math.min(width, manifest.maxWidth[previewMode]);
            }
            if (manifest.maxHeight) {
              height = Math.min(height, manifest.maxHeight[previewMode]);
            }

            setElementSize(target, width, height);

            // Handle position adjustments for top/left edges
            if (event.edges.left) {
              target.style.left = `${parseFloat(target.style.left || "0") + event.deltaRect.left}px`;
              target.style.marginRight = `${parseFloat(target.style.left || "0") + event.deltaRect.left}px`;
            }
            if (event.edges.top) {
              target.style.top = `${parseFloat(target.style.top || "0") + event.deltaRect.top}px`;
              target.style.marginBottom = `${parseFloat(target.style.top || "0") + event.deltaRect.top}px`;
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
            const target = event.target as HTMLElement;
            const rect = target.getBoundingClientRect();
            const activeHandle = event.interaction.downEvent?.target as HTMLElement;

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
              const manifest = manifests[element.dataset.brickType || "unknown"] || {};
              const minWidth = manifest.minWidth?.[previewMode] ?? 50;
              const minHeight = manifest.minHeight?.[previewMode] ?? 50;
              return { width: minWidth, height: minHeight };
            },
            // @ts-ignore
            max: (x, y, event) => {
              const element = event.element as HTMLElement;
              const manifest = manifests[element.dataset.brickType || "unknown"] || {};
              const maxWidth = manifest.maxWidth?.[previewMode] ?? 10000;
              const maxHeight = manifest.maxHeight?.[previewMode] ?? 10000;
              return { width: maxWidth, height: maxHeight };
            },
          }),
          interact.modifiers.restrictSize({ max: "parent" }),
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

      interactablesRef.current.add(interactable);
    });
  }, [
    enabled,
    cssQuery,
    preserveAspectRatio,
    previewMode,
    gridSnap,
    onResizeStart,
    onResize,
    onResizeEnd,
    setElementSize,
    createResizeEvent,
  ]);

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

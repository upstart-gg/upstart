import interact from "interactjs";
import { useCallback, useEffect, useRef, type RefObject } from "react";
import type { RestrictOptions } from "@interactjs/modifiers/restrict/pointer";
import type { DraggableOptions } from "@interactjs/actions/drag/plugin";
import type { ResizableOptions } from "@interactjs/actions/resize/plugin";

interface DragCallbacks {
  onDragStart?: (event: Interact.InteractEvent) => void;
  onDragMove?: (event: Interact.InteractEvent, position: { x: number; y: number }) => void;
  onDragEnd?: (event: Interact.InteractEvent, position: { x: number; y: number }) => void;
}

interface ResizeCallbacks {
  onResizeStart?: (event: Interact.InteractEvent) => void;
  onResizeMove?: (
    event: Interact.InteractEvent,
    size: { width: number; height: number; x: number; y: number },
  ) => void;
  onResizeEnd?: (
    event: Interact.InteractEvent,
    size: { width: number; height: number; x: number; y: number },
  ) => void;
}

interface UseInteractOptions {
  dragEnabled?: boolean;
  resizeEnabled?: boolean;
  dragOptions?: Partial<DraggableOptions>;
  resizeOptions?: Partial<ResizableOptions>;
  dragRestrict?: Partial<RestrictOptions>;
  dragCallbacks?: DragCallbacks;
  resizeCallbacks?: ResizeCallbacks;
}

interface InteractMethods {
  enable: () => void;
  disable: () => void;
  updateDragOptions: (options: Parameters<Interact.Interactable["draggable"]>[0]) => void;
  updateResizeOptions: (options: Parameters<Interact.Interactable["resizable"]>[0]) => void;
}

export const useEditableBrick = (
  ref: RefObject<HTMLElement>,
  {
    dragEnabled = true,
    resizeEnabled = false,
    dragOptions = {},
    dragRestrict = {
      restriction: "parent",
    },
    resizeOptions = {},
    dragCallbacks = {},
    resizeCallbacks = {},
  }: UseInteractOptions = {},
): InteractMethods => {
  // Helper to get position from event
  const getPosition = useCallback((event: Interact.InteractEvent) => {
    const target = event.target as HTMLElement;
    const x = parseFloat(target.getAttribute("data-x") || "0") + (event.dx || 0);
    const y = parseFloat(target.getAttribute("data-y") || "0") + (event.dy || 0);
    return { x, y };
  }, []);

  // Helper to get size from event
  const getSize = useCallback((event: Interact.InteractEvent) => {
    const target = event.target as HTMLElement;
    const rect = event.rect || { width: 0, height: 0 };
    const x = parseFloat(target.getAttribute("data-x") || "0") + (event.delta?.x || 0);
    const y = parseFloat(target.getAttribute("data-y") || "0") + (event.delta?.y || 0);
    return {
      width: rect.width,
      height: rect.height,
      x,
      y,
    };
  }, []);

  // Update element transform
  const updateElementTransform = useCallback((target: HTMLElement, x: number, y: number) => {
    target.style.transform = `translate(${x}px, ${y}px)`;
    target.setAttribute("data-x", x.toString());
    target.setAttribute("data-y", y.toString());
  }, []);

  // Update element size
  const updateElementSize = useCallback(
    (
      target: HTMLElement,
      { width, height, x, y }: { width: number; height: number; x: number; y: number },
    ) => {
      target.style.width = `${width}px`;
      target.style.height = `${height}px`;
      updateElementTransform(target, x, y);
      target.setAttribute("data-width", width.toString());
      target.setAttribute("data-height", height.toString());
    },
    [updateElementTransform],
  );

  const interactable = useRef<Interact.Interactable | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    interactable.current = interact(ref.current);

    if (dragEnabled) {
      interactable.current.draggable({
        hold: 100,
        inertia: true,
        autoScroll: true,
        modifiers: [interact.modifiers.restrictRect(dragRestrict)],
        listeners: {
          start: (event) => {
            dragCallbacks.onDragStart?.(event);
          },
          move: (event) => {
            const position = getPosition(event);
            updateElementTransform(event.target as HTMLElement, position.x, position.y);
            dragCallbacks.onDragMove?.(event, position);
          },
          end: (event) => {
            const position = getPosition(event);
            dragCallbacks.onDragEnd?.(event, position);
          },
        },
        ...dragOptions,
        // listeners: {
        //   move: (event: Interact.InteractEvent) => {
        //     const target = event.target as HTMLElement;
        //     const x = parseFloat(target.getAttribute("data-x") || "0") + event.dx;
        //     const y = parseFloat(target.getAttribute("data-y") || "0") + event.dy;
        //     target.style.transform = `translate(${x}px, ${y}px)`;
        //     // todo: check if setting attribute is necessary
        //     target.dataset.x = x.toString();
        //     target.dataset.y = y.toString();
        //     target.setAttribute("data-x", x.toString());
        //     target.setAttribute("data-y", y.toString());
        //   },
        // },
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
            const size = getSize(event);
            updateElementSize(event.target as HTMLElement, size);
            resizeCallbacks.onResizeMove?.(event, size);
          },
          end: (event) => {
            const size = getSize(event);
            resizeCallbacks.onResizeEnd?.(event, size);
          },
        },
        modifiers: [
          interact.modifiers.restrictEdges({
            outer: "parent",
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
    ref,
    dragCallbacks,
    resizeCallbacks,
    dragEnabled,
    dragOptions,
    resizeOptions,
    dragRestrict,
    getPosition,
    getSize,
    resizeEnabled,
    updateElementTransform,
    updateElementSize,
  ]);

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
  setRef: (id: string, node: HTMLElement | null) => void;
  getRef: (id: string) => HTMLElement | undefined;
}

export const useElementRefs = (): ElementRefs => {
  const elementRefs = useRef(new Map<string, HTMLElement>());

  const setRef = useCallback((id: string, node: HTMLElement | null) => {
    if (node) {
      elementRefs.current.set(id, node);
    } else {
      elementRefs.current.delete(id);
    }
  }, []);

  const getRef = useCallback((id: string) => {
    return elementRefs.current.get(id);
  }, []);

  return { setRef, getRef };
};

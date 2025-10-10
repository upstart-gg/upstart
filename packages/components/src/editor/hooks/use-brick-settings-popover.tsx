import { useState, useEffect, useRef, type ReactNode, useCallback, type FC } from "react";
import {
  useFloating,
  autoUpdate,
  useClientPoint,
  offset,
  flip,
  shift,
  arrow,
  FloatingPortal,
  FloatingArrow,
  useInteractions,
} from "@upstart.gg/style-system/system";

import { invariant } from "@upstart.gg/sdk/utils";
import { useHotkeys } from "react-hotkeys-hook";
import { useEditorHelpers } from "./use-editor";
// Types
interface PopoverOptions {
  Component: FC<{ brickId: string; group: string }>;
  selector: string;
  placement?: "top" | "right" | "bottom" | "left";
  offsetDistance?: number;
  dataAttribute?: string;
  zIndex?: number;
}

interface PopoverState {
  isOpen: boolean;
  currentTrigger: HTMLElement | null;
  offset?: number;
}

/**
 * useSelectorPopover - Hook that attaches popover behavior to elements matching a selector
 */
export const useBrickSettingsPopover = ({
  Component,
  selector,
  placement = "top",
  zIndex = 99999,
}: PopoverOptions) => {
  // State for popover visibility and current trigger element
  const [state, setState] = useState<PopoverState>({
    isOpen: false,
    currentTrigger: null,
  });

  // Refs
  const arrowRef = useRef(null);
  const observerRef = useRef<MutationObserver | null>(null);
  const registeredElements = useRef<Set<HTMLElement>>(new Set());

  const { setSelectedBrickId } = useEditorHelpers();

  // Set up floating UI
  const { refs, floatingStyles, context, isPositioned, update } = useFloating({
    open: state.isOpen,
    onOpenChange: (open) => {
      setState((prev) => ({ ...prev, isOpen: open }));
    },
    elements: {
      reference: state.currentTrigger,
    },
    // placement,
    middleware: [
      offset({ mainAxis: state.offset ?? 16, crossAxis: 60, alignmentAxis: 20 }, [
        state.currentTrigger,
        state.offset,
      ]),
      shift({ padding: 10 }),
      arrow({ element: arrowRef }),
    ],
    whileElementsMounted: autoUpdate,
  });

  useHotkeys("esc", closePopover);

  // Helper for closing the popover
  function closePopover() {
    setState((prev) => ({ ...prev, isOpen: false }));
    setSelectedBrickId();
  }

  // Helper for opening the popover
  const openPopover = (event: MouseEvent | FocusEvent) => {
    const element = (event.target as HTMLElement | null)?.closest<HTMLElement>(selector);
    const parentBrick = element?.closest<HTMLElement>("[data-brick-id]");

    if (parentBrick?.dataset.wasDragged === "true") {
      console.debug("Ignoring click event on dragged brick");
      return;
    }

    invariant(element, "Could not find element matching selector");
    setState({
      isOpen: true,
      currentTrigger: element,
    });

    if (element.dataset.brickMenuOffset) {
      const offset = parseInt(element.dataset.brickMenuOffset);
      setState((prev) => ({ ...prev, offset }));
      update();
    }

    setSelectedBrickId(parentBrick?.id);
  };

  // Attach event listeners to an element
  const attachEventListeners = (element: HTMLElement) => {
    if (registeredElements.current.has(element)) return;
    element.addEventListener("click", openPopover, true);
    // Add to registered set
    registeredElements.current.add(element);
  };

  // Find and register all matching elements
  const registerMatchingElements = () => {
    document.querySelectorAll<HTMLElement>(selector).forEach((el) => {
      attachEventListeners(el);
      // Object.assign(el, refProps);
    });
  };

  // Global click handler to close popover when clicking outside
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const handleGlobalClick = useCallback(
    (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Don't close if clicking on the popover or the trigger
      if (
        refs.floating.current?.contains(target) ||
        state.currentTrigger?.contains(target) ||
        target?.closest('[data-ui], [role="dialog"]') ||
        !target.closest("#page-container")
      ) {
        return;
      }
      closePopover();
    },
    [state],
  );

  // Set up observers and event listeners when component mounts
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    // Initial registration
    registerMatchingElements();

    // Set up mutation observer to catch dynamically added elements
    observerRef.current = new MutationObserver((mutations) => {
      let shouldScan = false;

      mutations.forEach((mutation) => {
        if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
          shouldScan = true;
        }
      });

      if (shouldScan) {
        registerMatchingElements();
      }
    });

    // Start observing
    observerRef.current.observe(document.body, {
      childList: true,
      subtree: true,
    });

    document.addEventListener("click", handleGlobalClick, true);

    // Cleanup
    return () => {
      observerRef.current?.disconnect();
      document.removeEventListener("click", handleGlobalClick, true);

      // Clean up all event listeners
      registeredElements.current.forEach((element) => {
        element.removeEventListener("click", openPopover, true);
      });
    };
  }, []); // Re-run only if the selector changes

  const brickId = state.currentTrigger?.closest<HTMLElement>("[data-brick-id]")?.id;
  const group = state.currentTrigger?.dataset.brickGroup;
  const container = document.querySelector<HTMLElement>("#page-container");

  // The popover element to render
  const popoverElement =
    state.isOpen && state.currentTrigger && brickId && group ? (
      <FloatingPortal root={container}>
        <div
          ref={refs.setFloating}
          className="shadow-xl rounded-md bg-white border border-gray-200"
          data-ui
          style={{
            ...floatingStyles,
            zIndex,
            maxWidth: "350px",
          }}
        >
          <FloatingArrow ref={arrowRef} context={context} fill="#f9fafb" stroke="#e5e7eb" strokeWidth={1} />
          <Component brickId={brickId} group={group} />
        </div>
      </FloatingPortal>
    ) : null;

  return {
    popoverElement,
    isOpen: state.isOpen,
    currentTrigger: state.currentTrigger,
  };
};

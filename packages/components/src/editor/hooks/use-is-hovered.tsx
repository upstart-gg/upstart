import { useRef, useState, useEffect, startTransition } from "react";

interface UseIsHoveredOptions {
  tolerance?: number;
  deepCheck?: boolean;
}

interface UseIsHoveredReturn<T extends HTMLElement> {
  ref: React.RefObject<T | null>;
  isHovered: boolean;
}

function useIsHovered<T extends HTMLElement = HTMLDivElement>(
  options: UseIsHoveredOptions = {},
): UseIsHoveredReturn<T> {
  const { tolerance = 0, deepCheck = false } = options;
  const ref = useRef<T>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const { clientX, clientY } = event;

      // Calculate if mouse is within tolerance area
      const withinBounds =
        clientX >= rect.left - tolerance &&
        clientX <= rect.right + tolerance &&
        clientY >= rect.top - tolerance &&
        clientY <= rect.bottom + tolerance;

      if (!withinBounds) {
        startTransition(() => {
          setIsHovered(false);
        });
        return;
      }

      // If deepCheck is enabled, verify the element at mouse position is the ref'd element or its child
      if (deepCheck) {
        const elementAtPoint = document.elementFromPoint(clientX, clientY);
        const isActuallyHovered = elementAtPoint === element || element.contains(elementAtPoint);
        startTransition(() => {
          setIsHovered(isActuallyHovered);
        });
      } else {
        startTransition(() => {
          setIsHovered(true);
        });
      }
    };

    const handleMouseLeave = () => {
      startTransition(() => {
        setIsHovered(false);
      });
    };

    const ctrl = new AbortController();

    // Add listeners to document to track mouse movement globally
    document.addEventListener("mousemove", handleMouseMove, { signal: ctrl.signal });
    element.addEventListener("mouseleave", handleMouseLeave, { signal: ctrl.signal });

    return () => {
      ctrl.abort();
    };
  }, [tolerance, deepCheck]);

  return { ref, isHovered };
}

export default useIsHovered;

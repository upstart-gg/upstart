import { useRef, useState, useEffect } from "react";

interface UseIsHoveredOptions {
  tolerance?: number;
}

interface UseIsHoveredReturn<T extends HTMLElement> {
  ref: React.RefObject<T>;
  isHovered: boolean;
}

function useIsHovered<T extends HTMLElement = HTMLDivElement>(
  options: UseIsHoveredOptions = {},
): UseIsHoveredReturn<T> {
  const { tolerance = 0 } = options;
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

      setIsHovered(withinBounds);
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
    };

    // Add listeners to document to track mouse movement globally
    document.addEventListener("mousemove", handleMouseMove);
    element.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [tolerance]);

  return { ref, isHovered };
}

export default useIsHovered;

// Usage example:
/*
function MyComponent() {
  const { ref, isHovered } = useIsHovered<HTMLDivElement>({ tolerance: 20 });

  return (
    <div
      ref={ref}
      style={{
        width: 200,
        height: 100,
        backgroundColor: isHovered ? 'lightblue' : 'lightgray',
        border: '2px solid black',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {isHovered ? 'Hovered (with 20px tolerance)' : 'Not hovered'}
    </div>
  );
}
*/

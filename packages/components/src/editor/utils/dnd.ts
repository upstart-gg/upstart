import type { DraggableStateSnapshot, DraggableStyle } from "@hello-pangea/dnd";
import type { CSSProperties } from "react";

export function getDraggableStyle(style: DraggableStyle, snapshot: DraggableStateSnapshot): CSSProperties {
  if (!snapshot.isDropAnimating) {
    return style;
  }
  return {
    ...style,
    // cannot be 0, but make it super tiny
    transitionDuration: `0.001s`,
  };
}

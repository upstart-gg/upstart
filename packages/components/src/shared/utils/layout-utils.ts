import { LAYOUT_COLS, LAYOUT_ROW_HEIGHT } from "@upstart.gg/sdk/layout-constants";
import type { Brick } from "@upstart.gg/sdk/shared/bricks";
import type { Resolution } from "@upstart.gg/sdk/shared/responsive";
import type { BrickManifest } from "@upstart.gg/sdk/shared/brick-manifest";
import type { GridConfig } from "../hooks/use-grid-config";
import invariant from "@upstart.gg/sdk/shared/utils/invariant";
import type { FullRect } from "@interactjs/types/index";

const DROP_INDICATOR_WIDTH = 4;

export function getClosestSection(element: Element) {
  return element.closest<HTMLElement>('[data-element-kind="section"]')!;
}

export function getBrickPosition(
  element: HTMLElement,
  previewMode: Resolution,
  relatedContainer?: HTMLElement,
) {
  // Get element's initial position (getBoundingClientRect gives position relative to viewport)
  const rect = element.getBoundingClientRect();
  relatedContainer ??= getClosestSection(element);

  invariant(relatedContainer, "No related container found");

  const container = relatedContainer.getBoundingClientRect();

  // Calculate actual position relative to container
  const actualX = rect.left - container.left;
  const actualY = rect.top - container.top;

  // get horizontal padding of the section
  const padX = parseFloat(window.getComputedStyle(relatedContainer).paddingLeft);
  const config = getGridConfig(relatedContainer, previewMode);

  // Calculate grid position
  const gridX = Math.round((actualX - padX) / config.colWidth);
  const gridY = Math.round(actualY / config.rowHeight);

  const w = Math.min(Math.ceil(rect.width / config.colWidth), LAYOUT_COLS[previewMode]);
  const h = Math.ceil(rect.height / config.rowHeight);

  const x = Math.max(0, gridX);
  const y = Math.max(0, gridY);

  return {
    x,
    y,
    w,
    h,
  };
}

export function getGridConfig(sectionElement: HTMLElement, previewMode: Resolution) {
  const colWidth = Math.round(sectionElement.clientWidth / LAYOUT_COLS[previewMode]);
  const rowHeight = LAYOUT_ROW_HEIGHT;
  return { colWidth, rowHeight };
}

export function getDropPosition(event: Interact.DropEvent, gridConfig: GridConfig) {
  const grid = event.target as HTMLElement;
  const gridRect = grid.getBoundingClientRect();

  // Calculate position relative to grid
  const rect = {
    left: event.dragEvent.clientX - gridRect.left,
    top: event.dragEvent.clientY - gridRect.top,
  };

  // Calculate grid position
  const col = Math.round((rect.left - gridConfig.colWidth / 2) / gridConfig.colWidth);
  const row = Math.round((rect.top - gridConfig.rowHeight / 2) / gridConfig.rowHeight);

  return {
    x: Math.max(1, col),
    y: Math.max(1, row),
  };
}

/**
 */
export function getSectionElementAtPosition(x: number, y: number) {
  const elements = document.elementsFromPoint(x, y) as HTMLElement[];
  return elements.find((el) => el.tagName === "SECTION" && el.dataset.elementKind === "section") as
    | HTMLElement
    | undefined;
}

// TODO: check if this works with the new layout system
export function getBrickElementAtPosition(x: number, y: number) {
  const brick = document
    .elementsFromPoint(x, y)
    .find((el) => (el as HTMLElement).dataset?.brickId)
    ?.closest<HTMLElement>("[data-brick]");
  return brick;
}

export function getBricksHovered(brickId: string, rect: FullRect, section: HTMLElement) {
  // return all bricks that intersect with the rect (all surface!)
  const hoveredElements: HTMLElement[] = [];
  const elementsToCheck = Array.from(
    section.querySelectorAll<HTMLElement>('[data-element-kind="brick"]'),
  ).filter((el) => el.id !== brickId);

  for (const element of elementsToCheck) {
    // Get element boundaries
    const elementRect = element.getBoundingClientRect();
    // Check for intersection
    if (
      rect.right >= elementRect.left &&
      rect.left <= elementRect.right &&
      rect.bottom >= elementRect.top &&
      rect.top <= elementRect.bottom
    ) {
      hoveredElements.push(element);
    }
  }
  return hoveredElements;
}

/**
 * Given a dragged Rect and a list of hovered elements, this function will return the
 * position where the dragged element should be dropped.
 * It should return something that can be used with insertAdjacentHTML
 * to insert the element at the right position.
 *
 * type FullRect = {
    top: number;
    left: number;
    bottom: number;
    right: number;
    width: number;
    height: number;
  }
 */

/**
 * Given a dragged Rect and a list of hovered elements, this function will return the
 * position where the dragged element should be dropped.
 * It only allows dropping inside elements with data-dropzone="true".
 *
 * type FullRect = {
    top: number;
    left: number;
    bottom: number;
    right: number;
    width: number;
    height: number;
  }
 */
export function getDropInstructions(
  rect: FullRect,
  hoveredElements: HTMLElement[],
): {
  dropTarget: HTMLElement | null;
  position: InsertPosition;
} {
  // If no elements are hovered, return null
  if (!hoveredElements.length) {
    return { dropTarget: null, position: "beforeend" };
  }

  // No need to filter elements here - we'll check for data-dropzone only when inserting INSIDE
  // Sort hovered elements by their position in the DOM
  // This is to ensure consistent behavior when multiple elements are hovered
  const sortedElements = [...hoveredElements].sort((a, b) => {
    const aRect = a.getBoundingClientRect();
    const bRect = b.getBoundingClientRect();

    // First compare vertical position
    if (Math.abs(aRect.top - bRect.top) > 10) {
      return aRect.top - bRect.top;
    }

    // If vertically aligned, compare horizontal position
    return aRect.left - bRect.left;
  });

  // Get the most relevant hovered element
  const targetElement = sortedElements[0];
  const targetRect = targetElement.getBoundingClientRect();

  // Calculate the center point of the dragged element
  const dragCenterY = rect.top + rect.height / 2;
  const dragCenterX = rect.left + rect.width / 2;

  // Determine if we should insert before, after, or inside the target element

  // Check for nesting (if dragged element is mostly inside the target)
  const isInsideHorizontally = dragCenterX > targetRect.left && dragCenterX < targetRect.right;
  const isInsideVertically = dragCenterY > targetRect.top && dragCenterY < targetRect.bottom;

  if (isInsideHorizontally && isInsideVertically) {
    // Only allow inserting INSIDE if target has data-dropzone="true"
    if (targetElement.dataset.dropzone === "true") {
      // If we're inside, check if we're closer to the top or bottom half
      const isInTopHalf = dragCenterY < (targetRect.top + targetRect.bottom) / 2;

      if (isInTopHalf) {
        return { dropTarget: targetElement, position: "afterbegin" };
      } else {
        return { dropTarget: targetElement, position: "beforeend" };
      }
    } else {
      // If not a dropzone but we're inside, decide whether to place before or after
      // based on whether we're in the top/bottom or left/right half

      // If the element is taller than it is wide, use vertical position to decide
      if (targetRect.height > targetRect.width) {
        const isInTopHalf = dragCenterY < (targetRect.top + targetRect.bottom) / 2;
        if (isInTopHalf) {
          return { dropTarget: targetElement, position: "beforebegin" };
        } else {
          return { dropTarget: targetElement, position: "afterend" };
        }
      }
      // Otherwise use horizontal position
      else {
        const isInLeftHalf = dragCenterX < (targetRect.left + targetRect.right) / 2;
        if (isInLeftHalf) {
          return { dropTarget: targetElement, position: "beforebegin" };
        } else {
          return { dropTarget: targetElement, position: "afterend" };
        }
      }
    }
  }

  // If not inside, check if we're above or below (these positions work regardless of dropzone status)
  const isAbove = dragCenterY < targetRect.top;

  if (isAbove) {
    return { dropTarget: targetElement, position: "beforebegin" };
  } else {
    return { dropTarget: targetElement, position: "afterend" };
  }
}

function createDropIndicator() {
  let indicator = document.getElementById("drop-indicator");
  if (!indicator) {
    indicator = document.createElement("div");
    indicator.id = "drop-indicator";
    indicator.style.transition = "all 0.15s ease-out";
    indicator.style.position = "absolute";
    indicator.style.zIndex = "9999";
    indicator.style.borderRadius = "9999px";
    indicator.style.pointerEvents = "none"; // So it doesn't interfere with drop events
  }
  return indicator;
}
/**
 * Creates and updates a visual drop indicator based on drop instructions
 */
export function showDropIndicator(dropInstructions: {
  dropTarget: HTMLElement | null;
  position: InsertPosition;
}) {
  // Remove any existing indicator first
  const { dropTarget, position } = dropInstructions;
  const indicator = createDropIndicator();

  // If no target element, don't show an indicator
  if (!dropTarget) return;

  // Create the indicator element

  // Get the computed style to check for flex properties
  const targetStyle = window.getComputedStyle(dropTarget);
  const parentElement = dropTarget.parentElement;
  const isInHorizontalFlex =
    parentElement &&
    window.getComputedStyle(parentElement).display === "flex" &&
    ["row", "row-reverse"].includes(window.getComputedStyle(parentElement).flexDirection);

  const targetRect = dropTarget.getBoundingClientRect();

  // Adjust indicator style based on parent layout and position
  if (isInHorizontalFlex && (position === "beforebegin" || position === "afterend")) {
    // For horizontal flex containers, show vertical indicators between items
    indicator.style.width = `${DROP_INDICATOR_WIDTH}px`;
    indicator.style.height = `${targetRect.height}px`;
    indicator.style.backgroundColor = "var(--violet-a8)";

    if (position === "beforebegin") {
      indicator.style.left = `${targetRect.left - 2}px`;
      indicator.style.top = `${targetRect.top}px`;
    } else {
      // afterend
      indicator.style.left = `${targetRect.right}px`;
      indicator.style.top = `${targetRect.top}px`;
    }
  } else {
    // Original behavior for vertical layouts or nested positions
    switch (position) {
      case "beforebegin": // Insert before the element
        indicator.style.height = `${DROP_INDICATOR_WIDTH}px`;
        indicator.style.width = `${targetRect.width}px`;
        indicator.style.backgroundColor = "var(--violet-a8)";
        indicator.style.top = `${targetRect.top - 2}px`;
        indicator.style.left = `${targetRect.left}px`;
        break;

      case "afterend": // Insert after the element
        indicator.style.height = `${DROP_INDICATOR_WIDTH}px`;
        indicator.style.width = `${targetRect.width}px`;
        indicator.style.backgroundColor = "var(--violet-a8)";
        indicator.style.top = `${targetRect.bottom}px`;
        indicator.style.left = `${targetRect.left}px`;
        break;

      case "afterbegin": // Insert as first child
        // Check if target is a horizontal flex container
        // biome-ignore lint/correctness/noSwitchDeclarations: <explanation>
        const isTargetHorizontalFlex =
          targetStyle.display === "flex" && ["row", "row-reverse"].includes(targetStyle.flexDirection);

        if (isTargetHorizontalFlex) {
          // Vertical indicator at the start of the flex container
          indicator.style.width = `${DROP_INDICATOR_WIDTH}px`;
          indicator.style.height = `${targetRect.height - 10}px`;
          indicator.style.backgroundColor = "var(--orange-a8)";
          indicator.style.top = `${targetRect.top + 5}px`;

          // Account for flex-direction
          if (targetStyle.flexDirection === "row") {
            indicator.style.left = `${targetRect.left + 5}px`;
          } else {
            indicator.style.left = `${targetRect.right - 8}px`;
          }
        } else {
          // Original horizontal indicator
          indicator.style.height = `${DROP_INDICATOR_WIDTH}px`;
          indicator.style.width = `${targetRect.width - 20}px`;
          indicator.style.backgroundColor = "var(--orange-a8)";
          indicator.style.top = `${targetRect.top + 5}px`;
          indicator.style.left = `${targetRect.left + 10}px`;
        }
        break;

      case "beforeend": // Insert as last child
        // Check if target is a horizontal flex container
        // biome-ignore lint/correctness/noSwitchDeclarations: <explanation>
        const isTargetHorizFlex =
          targetStyle.display === "flex" && ["row", "row-reverse"].includes(targetStyle.flexDirection);

        if (isTargetHorizFlex) {
          // Vertical indicator at the end of the flex container
          indicator.style.width = `${DROP_INDICATOR_WIDTH}px`;
          indicator.style.height = `${targetRect.height - 10}px`;
          indicator.style.backgroundColor = "var(--orange-a8)";
          indicator.style.top = `${targetRect.top + 5}px`;

          // Account for flex-direction
          if (targetStyle.flexDirection === "row") {
            indicator.style.left = `${targetRect.right - 8}px`;
          } else {
            indicator.style.left = `${targetRect.left + 5}px`;
          }
        } else {
          // Original horizontal indicator
          indicator.style.height = `${DROP_INDICATOR_WIDTH}px`;
          indicator.style.width = `${targetRect.width - 20}px`;
          indicator.style.backgroundColor = "var(--orange-a8)";
          indicator.style.top = `${targetRect.bottom - 5}px`;
          indicator.style.left = `${targetRect.left + 10}px`;
        }
        break;
    }
  }

  // Add to DOM
  document.body.appendChild(indicator);
}

/**
 * Removes the drop indicator from the DOM
 */
export function removeDropIndicator() {
  const existingIndicator = document.getElementById("drop-indicator");
  if (existingIndicator) {
    existingIndicator.remove();
  }
}

/**
 *  Todo
 */
export function getBrickResizeOptions(brick: Brick, manifest: BrickManifest, currentBp: Resolution) {
  const { maxHeight, maxWidth, minHeight, minWidth } = manifest;
  return {
    canGrowVertical: true,
    canGrowHorizontal: true,
    canShrinkVertical: true,
    canShrinkHorizontal: true,
  };
}

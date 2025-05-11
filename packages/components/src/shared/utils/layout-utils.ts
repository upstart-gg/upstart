import { LAYOUT_COLS, LAYOUT_ROW_HEIGHT } from "@upstart.gg/sdk/layout-constants";
import type { Brick } from "@upstart.gg/sdk/shared/bricks";
import type { Resolution } from "@upstart.gg/sdk/shared/responsive";
import type { BrickConstraints, BrickManifest } from "@upstart.gg/sdk/shared/brick-manifest";
import type { GridConfig } from "../hooks/use-grid-config";
import invariant from "@upstart.gg/sdk/shared/utils/invariant";

const defaultsPreferred = {
  mobile: {
    width: LAYOUT_COLS.mobile / 2,
    height: Math.round(LAYOUT_COLS.mobile / 4),
  },
  desktop: {
    width: LAYOUT_COLS.desktop / 3,
    height: LAYOUT_COLS.desktop / 3,
  },
};
// TODO: check if this works with the new layout system
export function getBrickIdAtPosition(x: number, y: number): string | undefined {
  const brick = document
    .elementsFromPoint(x, y)
    .find((el) => (el as HTMLElement).dataset?.brickId)
    ?.closest<HTMLElement>("[data-brick]");
  return brick?.dataset?.brickId;
}

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

  console.log("getBrickPosition", {
    gridX,
    gridY,
    rect,
    w,
    h,
    x,
    y,
    actualX,
    actualY,
    padX,
    colWidth: config.colWidth,
    rowHeight: config.rowHeight,
  });

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
export function getSectionAtPosition(x: number, y: number) {
  const elements = document.elementsFromPoint(x, y) as HTMLElement[];
  return elements.find((el) => el.tagName === "SECTION" && el.dataset.elementKind === "section") as
    | HTMLElement
    | undefined;
}

export function getElementCenterPoint(element: HTMLElement) {
  const rect = element.getBoundingClientRect();
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  };
}

type CollisionSide = "left" | "right" | "top" | "bottom";
type Collision = { brick: Brick; sides: CollisionSide[]; distance: number };

type GetDropOverGhostPositionParams = {
  /**
   * The current brick being dragged
   */
  brick: Brick;
  /**
   * The list of all bricks in the layout
   */
  bricks: Brick[];
  /**
   * The current breakpoint ("mobile" | "desktop")
   */
  currentBp?: Resolution;
  /**
   * The drop position (column-based)
   */
  dropPosition: { y: number; x: number };
};

function getCollisionSides(
  draggedRect: { x: number; y: number; w: number; h: number },
  brickOnLayout: { x: number; y: number; w: number; h: number },
): CollisionSide[] {
  if (
    !(
      draggedRect.x < brickOnLayout.x + brickOnLayout.w &&
      draggedRect.x + draggedRect.w > brickOnLayout.x &&
      draggedRect.y < brickOnLayout.y + brickOnLayout.h &&
      draggedRect.y + draggedRect.h > brickOnLayout.y
    )
  ) {
    return [];
  }

  const collisionSides: CollisionSide[] = [];

  // Check each side for collision
  if (draggedRect.y + draggedRect.h >= brickOnLayout.y && draggedRect.y < brickOnLayout.y) {
    collisionSides.push("top");
  }

  if (
    draggedRect.y <= brickOnLayout.y + brickOnLayout.h &&
    draggedRect.y + draggedRect.h > brickOnLayout.y + brickOnLayout.h
  ) {
    collisionSides.push("bottom");
  }

  if (draggedRect.x + draggedRect.w >= brickOnLayout.x && draggedRect.x < brickOnLayout.x) {
    collisionSides.push("left");
  }

  if (
    draggedRect.x <= brickOnLayout.x + brickOnLayout.w &&
    draggedRect.x + draggedRect.w > brickOnLayout.x + brickOnLayout.w
  ) {
    collisionSides.push("right");
  }

  return collisionSides;
}

/**
 * Returns the coords of an element relative to the #page-container
 */
export function getBrickCoordsInPage(element: HTMLElement) {
  const rect = element.getBoundingClientRect();
  return {
    x: rect.left,
    y: rect.top,
    w: rect.width,
    h: rect.height,
  };
}

export function getDropOverGhostPosition({
  brick,
  bricks,
  currentBp = "desktop",
  dropPosition,
}: GetDropOverGhostPositionParams) {
  return {};
}

export function getBrickResizeOptions(brick: Brick, manifest: BrickManifest, currentBp: Resolution) {
  const { maxHeight, maxWidth, minHeight, minWidth } = manifest;
  return {
    canGrowVertical: true,
    canGrowHorizontal: true,
    canShrinkVertical: true,
    canShrinkHorizontal: true,
  };
}

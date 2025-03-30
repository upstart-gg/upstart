import { LAYOUT_COLS, LAYOUT_ROW_HEIGHT } from "@upstart.gg/sdk/layout-constants";
import type { Brick } from "@upstart.gg/sdk/shared/bricks";
import type { ResponsiveMode } from "@upstart.gg/sdk/shared/responsive";
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

export function getClosestSection(element: Element) {
  return element.closest<HTMLElement>('[data-element-kind="section"]')!;
}

export function getBrickPosition(
  element: HTMLElement,
  previewMode: ResponsiveMode,
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

export function getGridConfig(sectionElement: HTMLElement, previewMode: ResponsiveMode) {
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
 * Adjust the bricks "mobile" position based on the "desktop" position by:
 * - Setting each brick to 100% width
 * - Guess the order based on the desktop position
 * - Respecting the optional "manualHeight" that could be already set on the brick's mobile position
 * - Add a blank row between each brick
 */
export function adjustMobileLayout(layout: Brick[]): Brick[] {
  // Sort bricks by desktop position (top to bottom, left to right)
  const sortedBricks = [...layout].sort((a, b) => {
    const posA = a.position.desktop;
    const posB = b.position.desktop;
    if (posA.y === posB.y) return posA.x - posB.x;
    return posA.y - posB.y;
  });

  let currentY = 0;
  const spacing = 1; // Add 1 unit spacing between bricks

  return sortedBricks.map((brick) => {
    const newBrick = { ...brick };
    const mobilePosition = brick.position.mobile;

    // Set new mobile position
    newBrick.position = {
      ...brick.position,
      mobile: {
        ...mobilePosition,
        x: 0,
        y: currentY,
        w: LAYOUT_COLS.mobile,
        h: mobilePosition.manualHeight || mobilePosition.h,
      },
    };

    // Update currentY for next brick
    currentY += newBrick.position.mobile.h + spacing;

    return newBrick;
  });
}

export function canDropOnLayout(
  bricks: Brick[],
  currentBp: ResponsiveMode,
  dropPosition: { y: number; x: number },
  constraints: BrickConstraints,
): { y: number; x: number; w: number; h: number; forbidden?: boolean; parent?: Brick } | false {
  // Helper function to check if a position is valid
  function isPositionValid(x: number, y: number, width: number): boolean {
    // Check if position is within grid bounds
    if (x < 0 || x + width > LAYOUT_COLS[currentBp] || y < 0) {
      console.log("out of bounds, x = %d, y = %d, width = %d, max = %d", x, y, width, LAYOUT_COLS[currentBp]);
      return false;
    }

    return true;
  }

  // Ensure minimum width respects breakpoint constraints
  const effectiveMinWidth = Math.max(constraints.minWidth?.[currentBp] ?? 0, 1);

  // Possible width depending on x position
  const possibleMaxWidth = LAYOUT_COLS[currentBp] - dropPosition.x;

  // Calculate the width to use - try preferred first, fall back to minimum
  const width = Math.min(constraints.defaultWidth?.[currentBp] ?? effectiveMinWidth, possibleMaxWidth);

  // Calculate the height to use
  const height = constraints.defaultHeight?.[currentBp] || defaultsPreferred[currentBp].height;

  // Check if the drop position is valid
  if (isPositionValid(dropPosition.x, dropPosition.y, width)) {
    const brickAtPos = getBrickAtPosition(dropPosition.x, dropPosition.y, bricks, currentBp);
    return {
      x: dropPosition.x,
      y: dropPosition.y,
      w: width,
      h: height,
      parent: brickAtPos?.isContainer ? brickAtPos : undefined,
    };
  }

  // If the position is invalid, return false
  return false;
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

/**
 * Returns the brick at the given position
 */
export function getBrickAtPosition(
  x: number,
  y: number,
  bricks: Brick[],
  currentBp: ResponsiveMode = "desktop",
): Brick | undefined {
  return bricks.find((brick) => {
    const pos = brick.position[currentBp];
    return x >= pos.x && x < pos.x + pos.w && y >= pos.y && y < pos.y + pos.h;
  });
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
  currentBp?: ResponsiveMode;
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

// Helper function to check if a position is valid
function canTakeFullSpace(
  currentBp: ResponsiveMode,
  brick: Brick,
  existingBricks: Brick[],
  x: number,
  y: number,
  width: number,
  height: number,
): boolean {
  // Check if position is within grid bounds
  if (x < 0 || x + width > LAYOUT_COLS[currentBp] || y < 0) {
    return false;
  }

  // Check for collisions with existing bricks
  return !existingBricks.some((brickObj) => {
    const brickPos = brickObj.position[currentBp];
    const horizontalOverlap = x < brickPos.x + brickPos.w && x + width > brickPos.x;
    const verticalOverlap = y < brickPos.y + brickPos.h && y + height > brickPos.y;
    return (
      horizontalOverlap &&
      verticalOverlap &&
      // Don't consider the brick itself
      brickObj.id !== brick.id
    );
  });
}

type DetectCollisionsParams = Omit<GetDropOverGhostPositionParams, "dropPosition"> & {
  dropPosition?: { x: number; y: number };
};

export function detectCollisions({
  brick,
  bricks,
  currentBp = "desktop",
  dropPosition,
}: DetectCollisionsParams) {
  const draggedRect = {
    x: dropPosition?.x ?? brick.position[currentBp].x,
    y: dropPosition?.y ?? brick.position[currentBp].y,
    w: brick.position[currentBp].w,
    h: brick.position[currentBp].h,
  };

  const colisions: Collision[] = [];

  bricks.forEach((b) => {
    if (b.id === brick.id) return;

    const sides = getCollisionSides(draggedRect, b.position[currentBp]);
    if (!sides.length) return;

    const distance = Math.min(
      Math.abs(draggedRect.x - b.position[currentBp].x),
      Math.abs(draggedRect.y - b.position[currentBp].y),
    );

    colisions.push({ brick: b, sides, distance });
  });

  return colisions;
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
  const draggedRect = {
    x: dropPosition.x,
    y: dropPosition.y,
    w: brick.position[currentBp].w,
    h: brick.position[currentBp].h,
  };

  const colisions = detectCollisions({ brick, bricks, currentBp, dropPosition });

  // There is a collision, mark it as forbidden
  const forbidden =
    canTakeFullSpace(
      currentBp,
      brick,
      bricks,
      dropPosition.x,
      dropPosition.y,
      brick.position[currentBp].w,
      brick.position[currentBp].h,
    ) === false;

  // return the ghost brick position
  return {
    ...draggedRect,
    forbidden,
    colisions,
  };
}

export function getBrickResizeOptions(brick: Brick, manifest: BrickManifest, currentBp: ResponsiveMode) {
  const { maxHeight, maxWidth, minHeight, minWidth } = manifest;
  return {
    canGrowVertical: (maxHeight?.[currentBp] ?? Infinity) > brick.position[currentBp].h,
    canGrowHorizontal: (maxWidth?.[currentBp] ?? Infinity) > brick.position[currentBp].w,
    canShrinkVertical: (minHeight?.[currentBp] ?? 0) < brick.position[currentBp].h,
    canShrinkHorizontal: (minWidth?.[currentBp] ?? 0) < brick.position[currentBp].w,
  };
}

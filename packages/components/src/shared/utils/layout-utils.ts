import { LAYOUT_COLS, LAYOUT_ROW_HEIGHT } from "@upstart.gg/sdk/layout-constants";
import type { Brick } from "@upstart.gg/sdk/shared/bricks";
import type { ResponsiveMode } from "@upstart.gg/sdk/shared/responsive";
import type { BrickConstraints } from "@upstart.gg/sdk/shared/brick-manifest";

const OVERFLOWING_TOLREANCE = LAYOUT_ROW_HEIGHT;

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

function isOverflowing(element: HTMLElement) {
  const overflowing = element.scrollHeight - OVERFLOWING_TOLREANCE > element.clientHeight;
  return overflowing;
}

function getIdealHeight(element: HTMLElement) {
  return Math.ceil(element.scrollHeight / LAYOUT_ROW_HEIGHT);
}

/**
 * Returns the new height (in rows unit) of the brick based on if it's overflowing
 * or false if it should not be adjusted
 */
export function shouldAdjustBrickHeightBecauseOverflow(brickId: string) {
  const element = document.getElementById(brickId);
  if (!element) {
    console.warn("shouldAdjustBrickHeightBecauseOverflow: Element not found!");
    return false;
  }
  if (isOverflowing(element)) {
    console.debug(
      "Brick %s is overflowing. Scrollheight = %d, clientHeight = %d, tolerance = %d",
      brickId,
      element.scrollHeight,
      element.clientHeight,
      OVERFLOWING_TOLREANCE,
    );
    return getIdealHeight(element);
  }

  return false;
}
/**
 * Represents position adjustments needed for a brick
 */
type BrickAdjustment = {
  id: string;
  h?: number;
  y?: number;
  fromH?: number;
  fromY?: number;
};

/**
 * This will adjust the height of all bricks that are overflowing
 * and also adjust the position (brick.position.desktop.y) so that the bricks do not overlap.
 *
 * @param bricks - Array of bricks to check for adjustments
 * @returns An object with brick IDs as keys and their needed adjustments as values
 */
export function getNeededBricksAdjustments(bricks: Brick[]): Record<string, BrickAdjustment> {
  let minRow = 0;
  // Use an object to collect adjustments by brick ID
  const adjustmentsByBrickId: Record<string, BrickAdjustment> = {};

  bricks.forEach((brick) => {
    let needsAdjustment = false;

    // Initialize adjustment object if needed
    if (!adjustmentsByBrickId[brick.id]) {
      adjustmentsByBrickId[brick.id] = { id: brick.id };
    }

    // Check for height adjustment
    const newHeight = shouldAdjustBrickHeightBecauseOverflow(brick.id);
    if (newHeight) {
      console.debug(
        "Brick %s (%s) needs height adjustment from %d to %d",
        brick.id,
        brick.type,
        brick.position.desktop.h,
        newHeight,
      );
      adjustmentsByBrickId[brick.id].h = newHeight;
      adjustmentsByBrickId[brick.id].fromH = brick.position.desktop.h;
      needsAdjustment = true;
    }

    // Check for position adjustment
    if (brick.position.desktop.y < minRow && detectCollisions({ brick, bricks }).length > 0) {
      console.debug(
        "Brick %s (%s) needs position adjustment from %d to %d (%d < %d)",
        brick.id,
        brick.type,
        brick.position.desktop.y,
        minRow,
        brick.position.desktop.y,
        minRow,
      );
      adjustmentsByBrickId[brick.id].y = minRow;
      adjustmentsByBrickId[brick.id].fromY = brick.position.desktop.y;
      needsAdjustment = true;
    }

    // Update minimum row for next brick
    minRow = Math.max(brick.position.desktop.y + brick.position.desktop.h, minRow);

    // Remove this brick if no adjustments are needed
    if (!needsAdjustment) {
      delete adjustmentsByBrickId[brick.id];
    }
  });

  return adjustmentsByBrickId;
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

export function getBricksOverlap(
  draggingBrick: Brick,
  draggingNewPos: { x: number; y: number },
  dropOverBrick: Brick,
  bp: ResponsiveMode = "desktop",
) {
  // Extract and convert coordinates to numbers
  const drag = draggingBrick.position[bp];
  const drop = dropOverBrick.position[bp];

  const dragX = Number(draggingNewPos.x);
  const dragY = Number(draggingNewPos.y);
  const dragW = Number(drag.w);
  const dragH = Number(drag.h);

  const dropX = Number(drop.x);
  const dropY = Number(drop.y);
  const dropW = Number(drop.w);
  const dropH = Number(drop.h);

  // Guard against a drop brick with zero area
  if (dropW === 0 || dropH === 0) return 0;

  // Calculate right and bottom edges
  const dragRight = dragX + dragW;
  const dragBottom = dragY + dragH;
  const dropRight = dropX + dropW;
  const dropBottom = dropY + dropH;

  // Calculate the overlap dimensions
  const xOverlap = Math.max(0, Math.min(dragRight, dropRight) - Math.max(dragX, dropX));
  const yOverlap = Math.max(0, Math.min(dragBottom, dropBottom) - Math.max(dragY, dropY));

  // Calculate areas
  const overlapArea = xOverlap * yOverlap;
  const dropOverArea = dropW * dropH;

  return overlapArea / dropOverArea;
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

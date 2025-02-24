import { LAYOUT_COLS } from "@upstart.gg/sdk/layout-constants";
import type { Brick } from "@upstart.gg/sdk/shared/bricks";
import type { ResponsiveMode } from "@upstart.gg/sdk/shared/responsive";

type Position = Brick["position"][ResponsiveMode];

type BrickWithIndex = {
  brick: Brick;
  index: number;
};

// Helper to compare positions
function positionsEqual(pos1: Position, pos2: Position): boolean {
  return pos1.x === pos2.x && pos1.y === pos2.y && pos1.w === pos2.w && pos1.h === pos2.h;
}

/**
 * Gets the position for the current breakpoint
 */
function getPosition(brick: Brick, breakpoint: ResponsiveMode): Position {
  return brick.position[breakpoint];
}

/**
 * Checks if two bricks are colliding/overlapping
 */
function detectCollision(brick1: Brick, brick2: Brick, breakpoint: ResponsiveMode = "desktop"): boolean {
  const pos1 = getPosition(brick1, breakpoint);
  const pos2 = getPosition(brick2, breakpoint);

  return !(
    (
      pos1.x >= pos2.x + pos2.w || // brick1 is right of brick2
      pos1.x + pos1.w <= pos2.x || // brick1 is left of brick2
      pos1.y >= pos2.y + pos2.h || // brick1 is below brick2
      pos1.y + pos1.h <= pos2.y
    ) // brick1 is above brick2
  );
}

/**
 * Helper function to determine if a brick overlaps with any brick in an array
 */
function hasAnyCollision(brick: Brick, bricks: Brick[], breakpoint: ResponsiveMode = "desktop"): boolean {
  return bricks.some((otherBrick) => brick !== otherBrick && detectCollision(brick, otherBrick, breakpoint));
}

/**
 * Utility to get the bounding box of a collection of bricks
 */
function getBoundingBox(bricks: Brick[], breakpoint: ResponsiveMode = "desktop"): Position {
  if (bricks.length === 0) {
    return { x: 0, y: 0, w: 0, h: 0 };
  }

  const positions = bricks.map((brick) => getPosition(brick, breakpoint));

  const minX = Math.min(...positions.map((pos) => pos.x));
  const minY = Math.min(...positions.map((pos) => pos.y));
  const maxX = Math.max(...positions.map((pos) => pos.x + pos.w));
  const maxY = Math.max(...positions.map((pos) => pos.y + pos.h));

  return {
    x: minX,
    y: minY,
    w: maxX - minX,
    h: maxY - minY,
  };
}

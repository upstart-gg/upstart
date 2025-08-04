import { LAYOUT_COLS, LAYOUT_ROW_HEIGHT } from "@upstart.gg/sdk/layout-constants";
import type { Resolution } from "@upstart.gg/sdk/shared/responsive";
import type { BrickManifest } from "@upstart.gg/sdk/shared/brick-manifest";
import invariant from "@upstart.gg/sdk/shared/utils/invariant";

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

  const w = Math.min(Math.ceil(rect.width / config.colWidth), LAYOUT_COLS);
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
  const colWidth = Math.round(sectionElement.clientWidth / LAYOUT_COLS);
  const rowHeight = LAYOUT_ROW_HEIGHT;
  return { colWidth, rowHeight };
}

/**
 *  This function does not actually check min/max size constraints but only take the "resizable" property into account.
 */
export function getBrickResizeOptions(manifest: BrickManifest) {
  const { resizable } = manifest;
  return {
    canGrowVertical: resizable === true || resizable === "vertical",
    canGrowHorizontal: resizable === true || resizable === "horizontal",
    canShrinkVertical: resizable === true || resizable === "vertical",
    canShrinkHorizontal: resizable === true || resizable === "horizontal",
  };
}

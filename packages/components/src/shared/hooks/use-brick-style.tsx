import { tx, apply, css } from "@upstart.gg/style-system/twind";
import type { Brick, Section } from "@upstart.gg/sdk/shared/bricks";
import { LAYOUT_ROW_HEIGHT } from "@upstart.gg/sdk/shared/layout-constants";
import {
  getBackgroundStyles,
  getBasicAlignmentStyles,
  getBorderStyles,
  getEffectsStyles,
  getFlexStyles,
  type BrickStyleProps,
} from "../styles/helpers";

type UseBrickStyleWrapperProps = {
  brick: Brick;
  editable?: boolean;
  className?: string;
  selected?: boolean;
};

/**
 * The classNames for the brick
 */
export function useBrickStyle(props: BrickStyleProps) {
  // This is the inner brick style. As the wrapper uses "display: flex",
  // we use flex-1 to make the inner brick fill the space.
  return tx(apply("flex-1"), [
    apply(props.className),
    props.layout?.padding,
    props.text?.color,
    props.text?.size,
    props.text?.color,
    // props.textAlign,
    getFlexStyles(props),
  ]);
}

export function useBrickWrapperStyle({ brick, editable, className, selected }: UseBrickStyleWrapperProps) {
  const { props, position } = brick;
  const isContainerChild = brick.parentId !== undefined;

  return tx(
    apply(className),
    // no transition otherwise it will slow down the drag
    "brick group/brick flex relative",

    // container children expand to fill the space
    isContainerChild && "container-child flex-1",

    getBrickWrapperEditorStyles(editable === true, !!brick.isContainer, isContainerChild, selected),

    // Position of the wrapper
    //
    // Note:  for container children, we don't set it as they are not positioned
    //        relatively to the page grid but to the container
    //
    // Warning: those 2 rules blocks are pretty sensible!
    !isContainerChild &&
      `@desktop:(
        col-start-${position.desktop.x + 1}
        col-span-${position.desktop.w}
        row-start-${position.desktop.y + 1}
        row-span-${position.desktop.h}
        h-auto
      )
      @mobile:(
        col-start-${position.mobile.x + 1}
        col-span-${position.mobile.w}
        row-start-${position.mobile.y + 1}
        row-span-${position.mobile.manualHeight ?? position.mobile.h}
        ${position.mobile.manualHeight ? `h-[${position.mobile.manualHeight * LAYOUT_ROW_HEIGHT}px]` : ""}
      )`,

    // Border
    getBorderStyles(brick.props as BrickStyleProps),
    // Background
    getBackgroundStyles(brick.props as BrickStyleProps),
    // Effects
    getEffectsStyles(brick.props as BrickStyleProps),
    // Flex
    getFlexStyles(props as BrickStyleProps),
    // Basic alignment
    getBasicAlignmentStyles(props as BrickStyleProps),
    // z-index
    // (brick.props.z as string) && `z-[${brick.props.z}]`,
  );
}

function getBrickWrapperEditorStyles(
  editable: boolean,
  isContainer: boolean,
  isContainerChild: boolean,
  selected?: boolean,
) {
  if (!editable) {
    return null;
  }
  return [
    "select-none hover:z-[9999] transition-colors delay-300 duration-[500] rounded-sm outline outline-4 outline-transparent -outline-offset-4",
    selected && "outline outline-4 outline-upstart-500 shadow-xl shadow-upstart-500/20",
    !selected && !isContainerChild && !isContainer && "hover:(outline-upstart-500/60)",
    !selected && !isContainerChild && isContainer && "hover:(outline-dotted outline-upstart-500/30)",
    !selected && isContainerChild && "hover:(outline-upstart-500/40)",
    css({
      "&.selected-group": {
        outline: "2px dotted var(--violet-8) !important",
      },
    }),
  ];
}

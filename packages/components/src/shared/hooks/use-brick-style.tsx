import { tx, apply, css } from "@upstart.gg/style-system/twind";
import type { commonProps, allStyleProps } from "@upstart.gg/sdk/bricks/props/all";
import type { Static } from "@sinclair/typebox";
import type { Brick } from "@upstart.gg/sdk/shared/bricks";
import { propToStyle } from "@upstart.gg/sdk/shared/themes/color-system";
import { LAYOUT_ROW_HEIGHT } from "@upstart.gg/sdk/shared/layout-constants";
import { manifests } from "@upstart.gg/sdk/bricks/manifests/all-manifests";
import { Value } from "@sinclair/typebox/value";

type AllStyleProps = Partial<Static<typeof allStyleProps>> & Partial<Static<typeof commonProps>>;

type UseBrickStyleWrapperProps = {
  brick: Brick;
  editable?: boolean;
  className?: string;
  selected?: boolean;
};

type UseBrickStyleProps = AllStyleProps & {
  mobileOverride: AllStyleProps | undefined;
};

/**
 * The classNames for the brick
 * @param manifest `
 */
export function useBrickStyle({ mobileOverride, ...props }: UseBrickStyleProps) {
  // This is the inner brick style. As the wrapper uses "display: flex",
  // we use flex-1 to make the inner brick fill the space.
  return tx(apply("flex-1"), [
    props.className && apply(props.className),
    props.layout?.padding,
    props.text?.color,
    props.text?.size,
    props.text?.color,
    // props.textAlign,
    getFlexStyles(props, mobileOverride),
  ]);
}

export function useBrickWrapperStyle({ brick, editable, className, selected }: UseBrickStyleWrapperProps) {
  const { mobileOverride, position } = brick;
  const isContainerChild = brick.parentId !== undefined;
  const props = { ...Value.Create(manifests[brick.type]).props, ...brick.props };

  return tx(
    apply(className),
    // no transition otherwise it will slow down the drag
    "brick group/brick flex relative",

    // container children expand to fill the space
    isContainerChild && "container-child flex-1",

    getEditorStyles(editable === true, !!brick.isContainer, isContainerChild, selected),

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
    getBorderStyles(brick),
    // Background
    getBackgroundStyles(brick),
    // Effects
    getEffectsStyles(brick),
    // Flex
    getFlexStyles(props, mobileOverride),

    // Basic alignment
    getBasicAlignmentStyles(props),
    // z-index
    // (brick.props.z as string) && `z-[${brick.props.z}]`,
  );
}

function getEditorStyles(
  editable: boolean,
  isContainer: boolean,
  isContainerChild: boolean,
  selected?: boolean,
) {
  if (!editable) {
    return null;
  }
  return [
    "select-none hover:z-[9999] transition-[opcacity,colors] duration-200 rounded-sm",
    selected && "outline outline-4 outline-upstart-500 shadow-xl shadow-upstart-500/20",
    !selected && !isContainerChild && !isContainer && "hover:(outline outline-4 outline-upstart-500/60)",
    !selected &&
      !isContainerChild &&
      isContainer &&
      "hover:(outline-dashed outline-4 outline-upstart-500/60)",
    !selected && isContainerChild && "hover:(outline outline-4 outline-upstart-500/40)",
    css({
      "&.selected-group": {
        outline: "2px dotted var(--violet-8) !important",
      },
    }),
  ];
}

function getBackgroundStyles({ props }: Brick) {
  if ("background" in props) {
    return [
      propToStyle(props.background?.color, "backgroundColor"),
      props.background?.image &&
        css({
          backgroundImage: `url(${props.background.image})`,
          backgroundSize: props.background.size ?? "auto",
          backgroundRepeat: props.background.repeat ?? "no-repeat",
        }),
    ];
  }
}

function getEffectsStyles({ props }: Brick) {
  if ("effects" in props) {
    return [propToStyle(props.effects?.opacity, "opacity"), props.effects?.shadow];
  }
}

function getBorderStyles({ props }: Brick) {
  if ("border" in props) {
    return [
      propToStyle(props.border?.color, "borderColor"),
      props.border?.radius,
      props.border?.style,
      props.border?.width,
    ];
  }
}

function getBasicAlignmentStyles(props: AllStyleProps) {
  if ("align" in props) {
    return [props.align?.vertical, props.align?.horizontal];
  }
}

/**
 * Flexbox handles alignment using a main axis and a cross axis.
 * We want to map the alignment to the flexbox properties.
 */
function getFlexStyles(props: AllStyleProps, mobileOverride: UseBrickStyleProps["mobileOverride"]) {
  if (mobileOverride && "flex" in mobileOverride) {
    return `@desktop:(
      ${props.flex?.direction ?? ""}
      ${props.flex?.justifyContent ?? ""}
      ${props.flex?.alignItems ?? ""}
      ${props.flex?.wrap ?? ""}
      ${props.flex?.gap ?? ""}
    )
    @mobile:(
      ${mobileOverride.flex?.direction ?? props.flex?.direction ?? ""}
      ${mobileOverride.flex?.justifyContent ?? props.flex?.justifyContent ?? ""}
      ${mobileOverride.flex?.alignItems ?? props.flex?.alignItems ?? ""}
      ${mobileOverride.flex?.wrap ?? props.flex?.wrap ?? ""}
      ${mobileOverride.flex?.gap ?? props.flex?.gap ?? ""}
    )`;
  }
  return [
    props.flex?.direction,
    props.flex?.justifyContent,
    props.flex?.alignItems,
    props.flex?.wrap,
    props.flex?.gap,
  ];
}

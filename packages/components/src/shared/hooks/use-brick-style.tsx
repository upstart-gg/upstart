import { tx, apply, css } from "@upstart.gg/style-system/twind";
import type { commonStyleProps, textStyleProps, flexProps } from "@upstart.gg/sdk/bricks/props/style-props";
import type { commonProps } from "@upstart.gg/sdk/bricks/props/common";
import type { Static } from "@sinclair/typebox";
import type { Brick } from "@upstart.gg/sdk/shared/bricks";
import { propToStyle } from "@upstart.gg/sdk/shared/themes/color-system";
import { LAYOUT_ROW_HEIGHT } from "@upstart.gg/sdk/shared/layout-constants";

type AllStyleProps = Partial<Static<typeof commonStyleProps>> &
  Partial<Static<typeof textStyleProps>> &
  Partial<Static<typeof commonProps>> &
  Partial<Static<typeof flexProps>>;

type UseBrickStyleWrapperProps = {
  brickProps: AllStyleProps;
  mobileOverride: Partial<AllStyleProps>;
  position: Brick["position"];
  editable: boolean;
  className?: string;
  isContainerChild?: boolean;
  selected?: boolean;
};

type UseBrickStyleProps = AllStyleProps & {
  mobileOverride: AllStyleProps;
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
    props.color ? `text-${props.color}` : null,
    props.fontSize,
    props.fontWeight,
    props.textAlign,
    // props.flex?.direction,
    // props.flex?.wrap,
    // props.flex?.gap ? `${props.flex.gap}` : null,
    getFlexStyles(props, mobileOverride),
  ]);
}

export function useBrickWrapperStyle({
  brickProps,
  mobileOverride,
  position,
  editable,
  className,
  isContainerChild,
  selected,
}: UseBrickStyleWrapperProps) {
  return tx(
    apply(className),
    // no transition otherwise it will slow down the drag
    "brick group/brick flex relative",

    // container children expand to fill the space
    isContainerChild && "container-child flex-1",
    editable && selected && "!outline !outline-dashed !outline-orange-200",
    editable &&
      !selected &&
      isContainerChild &&
      "hover:outline !hover:outline-dashed !hover:outline-upstart-400/30",

    // Selected group
    editable &&
      css({
        "&.selected-group": {
          outline: "2px dotted var(--violet-8) !important",
        },
      }),
    // "overflow-hidden",

    {
      "select-none hover:z-[9999]": editable,
    },

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
    propToStyle(brickProps.border?.color, "borderColor"),
    brickProps.border?.radius,
    brickProps.border?.style,
    brickProps.border?.width,

    // Background
    propToStyle(brickProps.background?.color, "background-color"),
    brickProps.background?.image &&
      css({
        backgroundImage: `url(${brickProps.background.image})`,
        backgroundSize: brickProps.background.size ?? "auto",
        backgroundRepeat: brickProps.background.repeat ?? "no-repeat",
      }),

    // Opacity
    propToStyle(brickProps.effects?.opacity, "opacity"),

    // shadow
    brickProps.effects?.shadow,

    getFlexStyles(brickProps, mobileOverride),
    // z-index
    // (brick.props.z as string) && `z-[${brick.props.z}]`,
  );
}

/**
 * Flexbox handles alignment using a main axis and a cross axis.
 * We want to map the alignment to the flexbox properties.
 */
function getFlexStyles(props: AllStyleProps, mobileOverride: Partial<AllStyleProps>) {
  if (mobileOverride?.flex) {
    return `@desktop:(
      ${props.flex?.direction ?? ""}
      ${props.flex?.justifyContent ?? ""}
      ${props.flex?.alignItems ?? ""}
      ${props.flex?.wrap ?? ""}
      ${props.flex?.gap ?? ""}
    )
    @mobile:(
      ${mobileOverride.flex?.direction ?? props.flex?.direction ?? ""}
      ${mobileOverride.flex.justifyContent ?? props.flex?.justifyContent ?? ""}
      ${mobileOverride.flex.alignItems ?? props.flex?.alignItems ?? ""}
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

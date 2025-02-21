import { tx, apply, css } from "@upstart.gg/style-system/twind";
import type {
  commonStyleProps,
  textStyleProps,
  flexProps,
  alignFlexProps,
} from "@upstart.gg/sdk/bricks/props/style-props";
import type { commonProps } from "@upstart.gg/sdk/bricks/props/common";
import type { Static } from "@sinclair/typebox";
import type { Brick } from "@upstart.gg/sdk/shared/bricks";
import { propToStyle } from "@upstart.gg/sdk/shared/themes/color-system";
import { LAYOUT_ROW_HEIGHT } from "@upstart.gg/sdk/shared/layout-constants";

type AllStyleProps = Partial<Static<typeof commonStyleProps>> &
  Partial<Static<typeof textStyleProps>> &
  Partial<Static<typeof commonProps>> &
  Partial<Static<typeof alignFlexProps>> &
  Partial<Static<typeof flexProps>>;

/**
 * The classNames for the brick
 * @param manifest `
 */
export function useBrickStyle(props: AllStyleProps) {
  // This is the inner brick style. As the wrapper uses "display: flex",
  // we use flex-1 to make the inner brick fill the space.
  return tx("flex-1", [
    props.className && apply(props.className),
    props.layout?.padding,
    props.color ? `text-${props.color}` : null,
    props.fontSize,
    props.fontWeight,
    props.textAlign,
    props.flex?.direction,
    props.flex?.wrap,
    props.flex?.gap ? `${props.flex.gap}` : null,
    getAlignmentStyle(props),
  ]);
}

type UseBrickWrapperStyleProps = {
  props: AllStyleProps;
  mobileProps?: AllStyleProps;
  position: Brick["position"];
  editable: boolean;
  className?: string;
  isContainerChild?: boolean;
  selected?: boolean;
};

export function useBrickWrapperStyle({
  props,
  position,
  editable,
  className,
  isContainerChild,
  selected,
}: UseBrickWrapperStyleProps) {
  return tx(
    apply(className),
    // no transition otherwise it will slow down the drag
    "brick group/brick flex relative",

    isContainerChild && "container-child",
    editable && selected && "!outline !outline-dashed !outline-orange-200",
    editable &&
      !selected &&
      isContainerChild &&
      "hover:outline !hover:outline-dashed !hover:outline-upstart-400/30",

    // "overflow-hidden",

    {
      "select-none hover:z-[9999]": editable,
    },

    // container children expand to fill the space
    isContainerChild && "flex-1",

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

    editable &&
      css({
        "&.selected-group": {
          outline: "2px dotted var(--violet-8) !important",
        },
      }),

    // Border
    propToStyle(props.border?.color, "borderColor"),
    props.border?.radius,
    props.border?.style,
    props.border?.width,

    // Background
    propToStyle(props.background?.color, "background-color"),
    props.background?.image &&
      css({
        backgroundImage: `url(${props.background.image})`,
        backgroundSize: props.background.size ?? "auto",
        backgroundRepeat: props.background.repeat ?? "no-repeat",
      }),

    // Opacity
    propToStyle(props.effects?.opacity, "opacity"),

    // shadow
    props.effects?.shadow,

    getAlignmentStyle(props),
    // z-index
    // (brick.props.z as string) && `z-[${brick.props.z}]`,
  );
}

/**
 * Flexbox handles alignment using a main axis and a cross axis.
 * We want to map the alignment to the flexbox properties.
 */
function getAlignmentStyle(props: AllStyleProps) {
  if (!props.align) {
    return;
  }
  if (props.flex?.direction === "flex-col") {
    return `justify-${props.align.vertical} items-${props.align.horizontal}`;
  }
  return `justify-${props.align.horizontal} items-${props.align.vertical}`;
}

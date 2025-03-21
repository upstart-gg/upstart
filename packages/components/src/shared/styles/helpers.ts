import { css, tx } from "@upstart.gg/style-system/twind";
import { propToStyle } from "@upstart.gg/sdk/shared/themes/color-system";
import type {
  BackgroundSettings,
  BackgroundColorSettings,
} from "@upstart.gg/sdk/shared/bricks/props/background";
import type {
  OpacitySettings,
  ShadowSettings,
  TextShadowSettings,
} from "@upstart.gg/sdk/shared/bricks/props/effects";
import type { BorderSettings } from "@upstart.gg/sdk/shared/bricks/props/border";
import type { FixedPositionedSettings, PositionSettings } from "@upstart.gg/sdk/shared/bricks/props/position";
import type { PaddingSettings } from "@upstart.gg/sdk/shared/bricks/props/padding";
import type { AlignBasicSettings } from "@upstart.gg/sdk/shared/bricks/props/align";
import type { ColorSettings } from "@upstart.gg/sdk/shared/bricks/props/text";
import type { FlexSettings } from "@upstart.gg/sdk/shared/bricks/props/container";

export function getBackgroundStyles(props: BackgroundSettings) {
  return [
    props.color && propToStyle(props.color, "backgroundColor"),
    props.image &&
      css({
        backgroundImage: `url(${props.image})`,
        backgroundSize: props.size ?? "auto",
        backgroundRepeat: props.repeat ?? "no-repeat",
      }),
  ];
}

export function getBackgroundColorStyles(value: BackgroundColorSettings) {
  return propToStyle(value, "backgroundColor");
}

export function getColorStyles(value: ColorSettings) {
  return propToStyle(value, "color");
}

export function getOpacityStyles(opacity: OpacitySettings) {
  return propToStyle(opacity, "opacity");
}

export function getShadowStyles(value: ShadowSettings) {
  return value;
}
export function getPaddingStyles(value: PaddingSettings) {
  return value;
}

export function getTextShadowStyles(value: TextShadowSettings) {
  return value;
}

function getPositionStyles(value: PositionSettings) {
  switch (value) {
    case "fixed":
      return tx("fixed top-inherit left-auto right-auto self-start w-fill");
    case "sticky":
      return "sticky top-inherit left-auto right-auto self-start";
    default:
      return null;
  }
}

export function getFixedPositionedStyles(value: FixedPositionedSettings) {
  if (!value) {
    return null;
  }
  return tx("fixed top-inherit left-auto right-auto self-start w-fill z-[99999]");
}

export function getBorderStyles(props?: Partial<BorderSettings>) {
  if (!props) {
    return null;
  }
  const {
    width = "border-0",
    side = ["all"],
    color = "border-transparent",
    style = "border-solid",
    radius = "rounded-none",
  } = props;
  let borderProcessedClass = "";

  const originalWith = width.includes("-") ? width.split("-")[1] : null;

  if (!props.side?.includes("all")) {
    borderProcessedClass = side
      .map((side) => {
        return `${side}${originalWith ? `-${originalWith}` : ""}`;
      })
      .join(" ");
  } else {
    borderProcessedClass = width;
  }

  return [propToStyle(color, "borderColor"), radius, style, borderProcessedClass];
}

export function getBasicAlignmentStyles(props: AlignBasicSettings) {
  return [props.vertical, props.horizontal];
}

/**
 * Flexbox handles alignment using a main axis and a cross axis.
 * We want to map the alignment to the flexbox properties.
 */
export function getFlexStyles(props: FlexSettings, mobileProps?: FlexSettings) {
  if (mobileProps) {
    return `@desktop:(
      ${props.direction ?? ""}
      ${props.justifyContent ?? ""}
      ${props.alignItems ?? ""}
      ${props.wrap ?? ""}
      ${props.gap ?? ""}
    )
    @mobile:(
      ${mobileProps.direction ?? props.direction ?? ""}
      ${mobileProps.justifyContent ?? props.justifyContent ?? ""}
      ${mobileProps.alignItems ?? props.alignItems ?? ""}
      ${mobileProps.wrap ?? props.wrap ?? ""}
      ${mobileProps.gap ?? props.gap ?? ""}
    )`;
  }
  return [props.direction, props.justifyContent, props.alignItems, props.wrap, props.gap];
}

export const brickStylesHelpersMap = {
  "#styles:backgroundColor": getBackgroundColorStyles,
  "#styles:background": getBackgroundStyles,
  "#styles:padding": getPaddingStyles,
  "#styles:color": getColorStyles,
  "#styles:basicAlign": getBasicAlignmentStyles,
  "#styles:border": getBorderStyles,
  "#styles:flex": getFlexStyles,

  // "#styles:shadow": getShadowStyles,
  "#styles:textShadow": getTextShadowStyles,
  "#styles:opacity": getOpacityStyles,
};
export const brickWrapperStylesHelpersMap = {
  "#styles:shadow": getShadowStyles,
  "#styles:fixedPositioned": getFixedPositionedStyles,
};

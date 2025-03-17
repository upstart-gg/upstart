import { css } from "@upstart.gg/style-system/twind";
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

export function getBorderStyles(props?: BorderSettings) {
  if (!props) {
    return null;
  }
  return [propToStyle(props.color, "borderColor"), props.radius, props.style, props.width];
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

export const stylesHelpersMap = {
  "#styles:backgroundColor": getBackgroundColorStyles,
  "#styles:background": getBackgroundStyles,
  "#styles:padding": getPaddingStyles,
  "#styles:color": getColorStyles,
  "#styles:basicAlign": getBasicAlignmentStyles,
  "#styles:border": getBorderStyles,
  "#styles:flex": getFlexStyles,
  "#styles:shadow": getShadowStyles,
  "#styles:textShadow": getTextShadowStyles,
  "#styles:opacity": getOpacityStyles,
};

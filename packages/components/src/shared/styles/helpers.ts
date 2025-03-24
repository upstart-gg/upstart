import { css, tx } from "@upstart.gg/style-system/twind";
import { propToClass, propToStyle } from "@upstart.gg/sdk/shared/themes/color-system";
import type {
  BackgroundSettings,
  BackgroundColorSettings,
} from "@upstart.gg/sdk/shared/bricks/props/background";
import type { OpacitySettings } from "@upstart.gg/sdk/shared/bricks/props/effects";
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

function getBackgroundColorStyles(value: BackgroundColorSettings, mobileValue?: BackgroundColorSettings) {
  if (!mobileValue) {
    return propToClass(value, "bg");
  }
  return `@desktop:(${propToClass(value, "bg-color")}) @mobile:(${propToClass(mobileValue, "bg-color")})`;
}

function getColorStyles(value: ColorSettings, mobileValue?: ColorSettings) {
  // if (!mobileValue) {
  //   return propToClass(value, "text");
  // }
  // return `@desktop:(${propToClass(value, "text")}) @mobile:(${propToClass(mobileValue, "text")})`;
  return propToStyle(value, "color");
}

function getOpacityStyles(opacity: OpacitySettings) {
  return propToStyle(opacity, "opacity");
}

function getPaddingStyles(value: PaddingSettings, mobileValue?: PaddingSettings) {
  if (!mobileValue) {
    return value;
  }
  return `@desktop:(${value ?? mobileValue}) @mobile:(${mobileValue})`;
}

function simpleClassHandler(value: string, mobileValue?: string) {
  if (!mobileValue) {
    return value;
  }
  return `@desktop:(${value ?? mobileValue}) @mobile:(${mobileValue})`;
}

function getFixedPositionedStyles(value: FixedPositionedSettings) {
  if (!value) {
    return null;
  }
  return tx("fixed top-inherit left-auto right-auto self-start w-fill z-[99999] isolate");
}

function getBorderStyles(props?: Partial<BorderSettings>) {
  if (!props) {
    return null;
  }
  const { width = "border-0", side = [], color = "border-transparent", style = "border-solid" } = props;
  let borderProcessedClass = "";

  const originalWith = width.includes("-") ? width.split("-")[1] : null;

  if (side?.length) {
    borderProcessedClass = side
      .map((side) => {
        return `${side}${originalWith ? `-${originalWith}` : ""}`;
      })
      .join(" ");
  } else {
    borderProcessedClass = width;
  }

  return [propToStyle(color, "borderColor"), style, borderProcessedClass];
}

export function getBasicAlignmentStyles(props: AlignBasicSettings, mobileProps?: AlignBasicSettings) {
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
  "#styles:textShadow": simpleClassHandler,
  "#styles:opacity": getOpacityStyles,
  "#styles:objectFit": simpleClassHandler,
  "#styles:objectPosition": simpleClassHandler,
};
export const brickWrapperStylesHelpersMap = {
  "#styles:rounding": simpleClassHandler,
  "#styles:shadow": simpleClassHandler,
  "#styles:fixedPositioned": getFixedPositionedStyles,
};

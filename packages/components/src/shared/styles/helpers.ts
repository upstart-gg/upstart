import type { AlignBasicSettings } from "@upstart.gg/sdk/shared/bricks/props/align";
import type {
  BackgroundColorSettings,
  BackgroundSettings,
} from "@upstart.gg/sdk/shared/bricks/props/background";
import type { ColorSettings } from "@upstart.gg/sdk/shared/bricks/props/color";
import type { OpacitySettings } from "@upstart.gg/sdk/shared/bricks/props/effects";
import type { GapBasicSettings } from "@upstart.gg/sdk/shared/bricks/props/gap";
import type { FixedPositionedSettings } from "@upstart.gg/sdk/shared/bricks/props/position";
import { propToClass, propToStyle } from "@upstart.gg/sdk/shared/themes/color-system";
import { css } from "@upstart.gg/style-system/twind";
import type { TSchema } from "@sinclair/typebox";

export function getBackgroundStyles(props?: BackgroundSettings) {
  if (!props) {
    return null;
  }
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

export function getGapStyles(value: string, mobileValue?: string) {
  if (!mobileValue) {
    return css({
      gap: value,
    });
  }
  return `@desktop:(${css({ gap: value })}) @mobile:(${css({ gap: mobileValue })})`;
}

function getBackgroundColorStyles(value: BackgroundColorSettings, mobileValue?: BackgroundColorSettings) {
  if (!mobileValue) {
    return propToClass(value, "bg");
  }
  return `@desktop:(${propToClass(value, "bg-color")}) @mobile:(${propToClass(mobileValue, "bg-color")})`;
}

function getColorStyles(value: ColorSettings, mobileValue?: ColorSettings) {
  return propToStyle(value, "color");
}

function getOpacityStyles(opacity: OpacitySettings) {
  return propToStyle(opacity, "opacity");
}

export function simpleClassHandler(value: string, mobileValue?: string) {
  if (!mobileValue) {
    return value;
  }
  if (value && mobileValue) {
    return `@desktop:(${value}) @mobile:(${mobileValue})`;
  }
  if (mobileValue) {
    return `@mobile:(${mobileValue})`;
  }
}

function getFixedPositionedStyles(value: FixedPositionedSettings) {
  if (!value) {
    return null;
  }
  return "sticky top-0 left-0 right-0 self-start w-fill z-[99999] isolate";
}

export function getBasicAlignmentStyles(
  props?: AlignBasicSettings,
  mobileProps?: AlignBasicSettings,
  schema?: TSchema,
) {
  if (!props || !schema) {
    return null;
  }
  if (schema["ui:flex-mode"] === "column") {
    return [
      props.vertical ? `justify-${props.vertical}` : null,
      props.horizontal ? `items-${props.horizontal}` : null,
    ];
  }
  return [
    props.horizontal ? `justify-${props.horizontal}` : null,
    props.vertical ? `items-${props.vertical}` : null,
  ];
}

export function getBasicGapStyles(props?: GapBasicSettings, mobileProps?: GapBasicSettings) {
  return props;
}

// function getContainerLayoutStyles(props?: ContainerLayoutSettings, mobileProps?: ContainerLayoutSettings) {
//   return props?.type === "grid" ? getGridStyles(props, mobileProps) : getFlexStyles(props, mobileProps);
// }

function getGrowHorizontallyStyles(props?: boolean, mobileProps?: boolean) {
  return props ? "grow" : null;
}

export const brickStylesHelpersMap = {
  "styles:color": getColorStyles,
  "styles:basicAlign": getBasicAlignmentStyles,
  "styles:basicGap": getBasicGapStyles,
  "styles:textShadow": simpleClassHandler,
  "styles:opacity": getOpacityStyles,
  "styles:objectFit": simpleClassHandler,
  "styles:objectPosition": simpleClassHandler,
  "styles:heroSize": simpleClassHandler,
  "styles:fontSize": simpleClassHandler,
  "styles:padding": simpleClassHandler, // test
  "styles:gap": getGapStyles,
  "styles:border": simpleClassHandler,
  "styles:gradientDirection": simpleClassHandler,
  "styles:backgroundColor": getBackgroundColorStyles,
  "styles:background": getBackgroundStyles,
  "styles:shadow": simpleClassHandler,
  "styles:rounding": simpleClassHandler,
  "styles:direction": simpleClassHandler,
};

export const brickWrapperStylesHelpersMap = {
  "styles:alignItems": simpleClassHandler,
  "styles:justifyContent": simpleClassHandler,
  "styles:fixedPositioned": getFixedPositionedStyles,
  "styles:alignSelf": simpleClassHandler,
  "styles:growHorizontally": getGrowHorizontallyStyles,
};

// Return the upper path without the last part (the property name)
export function extractStylePath(path: string) {
  if (!path.includes(".")) {
    return path;
  }
  return path.split(".").slice(0, -1).join(".");
}

import { propToClass, propToStyle } from "@upstart.gg/sdk/shared/themes/color-system";
import type {
  BackgroundSettings,
  BackgroundColorSettings,
} from "@upstart.gg/sdk/shared/bricks/props/background";
import type { OpacitySettings } from "@upstart.gg/sdk/shared/bricks/props/effects";
import type { BorderSettings } from "@upstart.gg/sdk/shared/bricks/props/border";
import type { FixedPositionedSettings } from "@upstart.gg/sdk/shared/bricks/props/position";
import type { AlignBasicSettings } from "@upstart.gg/sdk/shared/bricks/props/align";
import type { GapBasicSettings } from "@upstart.gg/sdk/shared/bricks/props/gap";
import type { ColorSettings } from "@upstart.gg/sdk/shared/bricks/props/color";
import { css } from "@upstart.gg/style-system/twind";

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
  // if (!mobileValue) {
  //   return propToClass(value, "text");
  // }
  // return `@desktop:(${propToClass(value, "text")}) @mobile:(${propToClass(mobileValue, "text")})`;
  return propToStyle(value, "color");
}

function getOpacityStyles(opacity: OpacitySettings) {
  return propToStyle(opacity, "opacity");
}

// function getPaddingStyles(value: PaddingSettings, mobileValue?: PaddingSettings) {
//   if (!mobileValue) {
//     return value;
//   }
//   return `@desktop:(${value ?? mobileValue}) @mobile:(${mobileValue})`;
// }

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
  // return `@desktop:(${value ?? mobileValue}) @mobile:(${mobileValue})`;
}

function getFixedPositionedStyles(value: FixedPositionedSettings) {
  if (!value) {
    return null;
  }
  return "sticky top-0 left-0 right-0 self-start w-fill z-[99999] isolate";
}

function getBorderStyles(props?: Partial<BorderSettings>) {
  if (!props) {
    return null;
  }
  const {
    width = "border-0",
    sides = [],
    color,
    // color = "border-transparent",
    style = "border-solid",
    rounding = "",
  } = props;
  let borderProcessedClass = "";

  const originalWith = width.includes("-") ? width.split("-")[1] : null;

  if (sides?.length) {
    borderProcessedClass = sides
      .map((side) => {
        return `${side}${originalWith ? `-${originalWith}` : ""}`;
      })
      .join(" ");
  } else {
    borderProcessedClass = width;
  }

  return [propToStyle(color, "borderColor"), style, borderProcessedClass, rounding];
}

export function getBasicAlignmentStyles(props?: AlignBasicSettings, mobileProps?: AlignBasicSettings) {
  return [props?.vertical, props?.horizontal];
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

  // new test
  // "styles:backgroundColor": getBackgroundColorStyles,
  // "styles:background": getBackgroundStyles,
  // "styles:border": getBorderStyles,
  "styles:padding": simpleClassHandler, // test
  "styles:gap": getGapStyles,
  "styles:border": getBorderStyles,
  "styles:gradientDirection": simpleClassHandler,
  "styles:backgroundColor": getBackgroundColorStyles,
  "styles:background": getBackgroundStyles,
  // "styles:rounding": simpleClassHandler,
};

export const brickWrapperStylesHelpersMap = {
  // "styles:padding": simpleClassHandler, // test

  "styles:shadow": simpleClassHandler,
  // "styles:rounding": simpleClassHandler,
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

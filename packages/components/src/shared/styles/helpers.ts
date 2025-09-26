import type {
  BackgroundColorSettings,
  BackgroundSettings,
} from "@upstart.gg/sdk/shared/bricks/props/background";
import type { ColorSettings } from "@upstart.gg/sdk/shared/bricks/props/color";
import type { OpacitySettings } from "@upstart.gg/sdk/shared/bricks/props/effects";
import { colorPresets, type ColorPreset } from "@upstart.gg/sdk/shared/bricks/props/color-preset";
import type { FixedPositionedSettings } from "@upstart.gg/sdk/shared/bricks/props/position";
import { propToClass, propToStyle } from "@upstart.gg/sdk/shared/themes/color-system";
import { css } from "@upstart.gg/style-system/twind";
import type { TSchema } from "@sinclair/typebox";

export function getBackgroundStyles(props?: BackgroundSettings) {
  if (!props?.image) {
    return null;
  }
  return [
    css({
      backgroundImage: `url(${props.image})`,
      backgroundSize: props.size ?? "auto",
      backgroundRepeat: props.repeat ?? "no-repeat",
    }),
  ];
}

function simplePropertyHandler(cssProp: string) {
  return function (value: string, mobileValue?: string) {
    if (!value) {
      return null;
    }
    if (!mobileValue) {
      // @ts-ignore
      return css({
        [cssProp]: value,
      });
    }
    // @ts-ignore
    return `@desktop:(${css({ [cssProp]: value })}) @mobile:(${css({ [cssProp]: mobileValue })})`;
  };
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

export function simpleClassHandler(value: string, mobileValue?: string, schema?: TSchema) {
  if (schema?.["ui:desktop-only"]) {
    return `@desktop:(${value})`;
  }
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

export function simpleClassHandleObject(
  value: Record<string, unknown>,
  mobileValue?: Record<string, unknown>,
  schema?: TSchema,
) {
  if (schema?.["ui:desktop-only"]) {
    return `@desktop:(${Object.values(value).join(" ")})`;
  }
  if (value && !mobileValue) {
    return Object.values(value);
  }
  if (value && mobileValue) {
    return `@desktop:(${Object.values(value).join(" ")}) @mobile:(${Object.values(mobileValue).join(" ")})`;
  }
  if (mobileValue) {
    return `@mobile:(${Object.values(mobileValue).join(" ")})`;
  }
}

function getFixedPositionedStyles(value: FixedPositionedSettings) {
  if (!value) {
    return null;
  }
  return "sticky top-0 left-0 right-0 self-start w-fill z-[99999] isolate";
}

// function getContainerLayoutStyles(props?: ContainerLayoutSettings, mobileProps?: ContainerLayoutSettings) {
//   return props?.type === "grid" ? getGridStyles(props, mobileProps) : getFlexStyles(props, mobileProps);
// }

function getGrowStyles(props?: boolean, mobileProps?: boolean, schema?: TSchema) {
  if (schema?.["ui:desktop-only"]) {
    return `@desktop:(flex-grow)`;
  }
  if (props && mobileProps) {
    return `flex-grow`;
  }
  if (!mobileProps) {
    return props ? "@desktop:(flex-grow)" : null;
  }
  if (mobileProps) {
    return `@mobile:(flex-grow) @desktop:(grow-0)`;
  }
}

function getWrapStyles(value: boolean, mobileValue?: boolean, schema?: TSchema) {
  if (schema?.["ui:desktop-only"]) {
    return `@desktop:(${value ? "flex-wrap" : "flex-nowrap"})`;
  }
  if (!mobileValue) {
    return value ? "flex-wrap" : "flex-nowrap";
  }
  if (value && mobileValue) {
    return `@desktop:(flex-wrap) @mobile:(flex-wrap)`;
  }
  if (mobileValue) {
    return `@mobile:(flex-wrap) @desktop:(flex-nowrap)`;
  }
}

function getColorPresetStyles(value: ColorPreset, mobileValue?: ColorPreset, schema?: TSchema) {
  const presets = (schema?.["ui:presets"] ?? colorPresets) as typeof colorPresets;
  if (schema?.["ui:desktop-only"]) {
    return `@desktop:(${presets[value]?.className})`;
  }
  if (!mobileValue) {
    return presets[value]?.className;
  }
  if (value && mobileValue) {
    return `@desktop:(${presets[value]?.className}) @mobile:(${presets[mobileValue]?.className})`;
  }
  if (mobileValue) {
    return `@mobile:(${presets[mobileValue]?.className})`;
  }
}

export const pageStylesHelpersMap = {
  "presets:color": getColorPresetStyles,
  "styles:gradientDirection": simpleClassHandler,
};

export const brickStylesHelpersMap = {
  "styles:color": getColorStyles,
  "styles:textShadow": simpleClassHandler,
  "styles:opacity": getOpacityStyles,
  "styles:objectFit": simpleClassHandler,
  "styles:objectPosition": simpleClassHandler,
  "styles:heroSize": simpleClassHandler,
  "styles:fontSize": simpleClassHandler,
  "styles:wrap": getWrapStyles,
  "styles:padding": simplePropertyHandler("padding"), // test
  "styles:verticalMargin": simplePropertyHandler("margin-block"), // test
  "styles:gap": getGapStyles,

  "styles:gradientDirection": simpleClassHandler,
  "styles:backgroundColor": getBackgroundColorStyles,
  "styles:background": getBackgroundStyles,

  "presets:color": getColorPresetStyles,
  "styles:borderColor": simpleClassHandler,

  "styles:rounding": simpleClassHandler,
  "styles:direction": simpleClassHandler,
  // test putting here
  "styles:alignItems": simpleClassHandler,
  "styles:justifyContent": simpleClassHandler,
  "styles:border": simpleClassHandleObject,

  // "styles:rounding": simpleClassHandler,
  "styles:shadow": simpleClassHandler,
};

export const brickWrapperStylesHelpersMap = {
  "styles:direction": simpleClassHandler,
  "styles:rounding": simpleClassHandler,
  "styles:justifyContent": simpleClassHandler,
  "styles:alignItems": simpleClassHandler,
  "styles:fixedPositioned": getFixedPositionedStyles,
  "styles:alignSelf": simpleClassHandler,
  "styles:grow": getGrowStyles,
};

// Return the upper path without the last part (the property name)
export function extractStylePath(path: string) {
  if (!path.includes(".")) {
    return path;
  }
  return path.split(".").slice(0, -1).join(".");
}

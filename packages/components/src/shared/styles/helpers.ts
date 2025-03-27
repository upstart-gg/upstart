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
import type { ContainerLayoutSettings, FlexSettings } from "@upstart.gg/sdk/shared/bricks/props/container";

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
  const {
    width = "border-0",
    side = [],
    color = "border-transparent",
    style = "border-solid",
    rounding = "",
  } = props;
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

  return [propToStyle(color, "borderColor"), style, borderProcessedClass, rounding];
}

export function getBasicAlignmentStyles(props: AlignBasicSettings, mobileProps?: AlignBasicSettings) {
  return [props.vertical, props.horizontal];
}

function getContainerLayoutStyles(props?: ContainerLayoutSettings, mobileProps?: ContainerLayoutSettings) {
  return [
    getGapStyles(props, mobileProps),
    ...getFlexStyles(props, mobileProps),
    ...getGridStyles(props, mobileProps),
  ];
}

function getGapStyles(props?: ContainerLayoutSettings, mobileProps?: ContainerLayoutSettings) {
  if (!props) {
    return null;
  }
  if (mobileProps) {
    return `@desktop:(
      ${props.gap}
    )
    @mobile:(
      ${mobileProps.gap}
    )`;
  }
  return props.gap;
}

/**
 * Flexbox handles alignment using a main axis and a cross axis.
 * We want to map the alignment to the flexbox properties.
 */
function getFlexStyles(props?: ContainerLayoutSettings, mobileProps?: ContainerLayoutSettings) {
  if (!props) {
    return [];
  }
  if (mobileProps) {
    const mobileWrap = mobileProps.wrap ?? props.wrap;
    const mobileFillSpace = mobileProps.fillSpace ?? props.fillSpace;
    return `@desktop:(
      ${props.type ?? ""}
      ${props.direction ?? ""}
      ${props.justifyContent ?? ""}
      ${props.alignItems ?? ""}
      ${props.wrap ? "flex-wrap" : ""}
      ${props.fillSpace ? "[&>*]:flex-1" : ""}
    )
    @mobile:(
      ${mobileProps.type ?? props.type ?? ""}
      ${mobileProps.direction ?? props.direction ?? ""}
      ${mobileProps.justifyContent ?? props.justifyContent ?? ""}
      ${mobileProps.alignItems ?? props.alignItems ?? ""}
      ${mobileWrap ? "flex-wrap" : ""}
      ${mobileFillSpace ? "[&>*]:flex-1" : ""}
    )`;
  }
  return [
    props.type,
    props.direction,
    props.justifyContent,
    props.alignItems,
    props.wrap && "flex-wrap",
    props.fillSpace && "[&>*]:flex-1",
  ];
}

function getGridStyles(props?: ContainerLayoutSettings, mobileProps?: ContainerLayoutSettings) {
  if (!props || (props.type !== "grid" && mobileProps?.type !== "grid")) {
    return [];
  }
  if (mobileProps) {
    const mobileCols = mobileProps.columns ?? props.columns;
    return `@desktop:(
      ${props.type}
      ${props.columns ? `grid-cols-${props.columns}` : ""}
    )
    @mobile:(
      ${mobileProps.type}
      ${mobileCols ? `grid-cols-${mobileCols}` : ""}
    )`;
  }
  return [props.type, props.columns ? `grid-cols-${props.columns}` : "auto-cols-fr grid-flow-col"];
}

export const brickStylesHelpersMap = {
  "#styles:color": getColorStyles,
  "#styles:basicAlign": getBasicAlignmentStyles,
  "#styles:containerLayout": getContainerLayoutStyles,
  "#styles:textShadow": simpleClassHandler,
  "#styles:opacity": getOpacityStyles,
  "#styles:objectFit": simpleClassHandler,
  "#styles:objectPosition": simpleClassHandler,

  "#styles:heroSize": simpleClassHandler,
};

export const brickWrapperStylesHelpersMap = {
  "#styles:border": getBorderStyles,
  "#styles:padding": getPaddingStyles, // test
  "#styles:backgroundColor": getBackgroundColorStyles,
  "#styles:background": getBackgroundStyles,
  "#styles:shadow": simpleClassHandler,
  // "#styles:rounding": simpleClassHandler,
  "#styles:fixedPositioned": getFixedPositionedStyles,
};

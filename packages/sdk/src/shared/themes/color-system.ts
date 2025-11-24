import chroma from "chroma-js";
import type { Theme } from "./theme";
import { kebabCase } from "lodash-es";
import { css } from "@upstart.gg/style-system/twind";

export type ColorType = keyof Theme["colors"];
export type ElementColorType = "page-background" | "background" | "text" | "border" | "shadow";

export const baseColors: Record<ColorType, string> = {
  primary: "Primary color",
  secondary: "Secondary color",
  accent: "Accent color",
  neutral: "Neutral color",
  base100: "Base color",
  base200: "Base (level 2)",
  base300: "Base (level 3)",
  info: "Info color",
  success: "Success color",
  warning: "Warning color",
  error: "Error color",
};

export const shadeNumbers = [900, 800, 700, 600, 500, 400, 300, 200, 100, 50] as const;
type ShadeNumber = (typeof shadeNumbers)[number];

const semanticAliases: Partial<Record<ShadeNumber, string>> = {
  100: "subtle",
  300: "light",
  700: "dark",
};

export type ElementColor = string;

export function getColorsSuggestions(baseHueOrColor: number | string, theme: Theme) {
  return [];
}

export function isStandardColor(color: unknown): boolean {
  if (typeof color !== "string") {
    return false;
  }
  return (
    color.startsWith("oklch") ||
    color.startsWith("oklab") ||
    color.startsWith("rgb") ||
    color.startsWith("hsl") ||
    color.startsWith("#") ||
    color.startsWith("var(--")
  );
}

export function propToStyle(prop: string | number | undefined, cssAttr: string) {
  if (typeof prop === "undefined") {
    return undefined;
  }
  // @ts-ignore
  return isStandardColor(prop) || typeof prop === "number" ? css({ [cssAttr as string]: prop }) : prop;
}

export function getContrastingTextColor(
  backgroundColor: string | chroma.Color,
  contrastThreshold = 3.5,
): string {
  // Convert the background color to a chroma color object
  const bgColor = chroma(backgroundColor);

  // Get potential text colors
  const white = "#ffffff";
  const black = "#000000";

  // Calculate contrast ratios
  const contrastWithWhite = chroma.contrast(bgColor, white);
  const contrastWithBlack = chroma.contrast(bgColor, black);

  // If both options meet the contrast threshold, return the one with better contrast
  if (contrastWithWhite >= contrastThreshold && contrastWithBlack >= contrastThreshold) {
    return white;
    // return contrastWithWhite >= contrastWithBlack ? white : black;
  }

  // If only one meets the threshold, use that one
  if (contrastWithWhite >= contrastThreshold) {
    return white;
  }

  if (contrastWithBlack >= contrastThreshold) {
    return black;
  }

  // If neither meets the threshold, return the one with better contrast
  // (though it may not meet accessibility standards)
  return contrastWithWhite >= contrastWithBlack ? white : black;
}
export function propToClass(value: string | number | undefined, classPrefix: string) {
  if (typeof value === "undefined") {
    return undefined;
  }
  return isStandardColor(value) || typeof value === "number" ? `${classPrefix}-[${value}]` : value;
}

export function generateColorsVars(theme: Theme) {
  const shades: Record<string, string> = {};
  const colorNames = Object.keys(baseColors) as ColorType[];

  colorNames.forEach((_colorName) => {
    const color = theme.colors[_colorName];
    const colorName = kebabCase(_colorName);
    // Add the original color as the default (without number suffix)
    shades[`color-${colorName}`] = color;
    // Alias it to 500
    shades[`color-${colorName}-500`] = color;

    // Generate base color content
    const contentColor = getContrastingTextColor(color);
    shades[`color-${colorName}-content`] = contentColor;
    shades[`color-${colorName}-500-content`] = contentColor;

    const baseColor = chroma(color);
    const darkest = baseColor.darken(2.5);
    const lightest = baseColor.brighten(3.5);

    const colorScale = chroma.scale([lightest, baseColor, darkest]).domain([50, 500, 900]).mode("oklch");

    // Generate shades for other colors than base colors
    if (!colorName.startsWith("base")) {
      shadeNumbers.forEach((shade) => {
        if (shade === 500) {
          return;
        }
        const varName = `color-${colorName}-${shade}`;

        // Gen color for the specific shade
        const shadedColor = colorScale(shade);
        shades[varName] = shadedColor.css("oklch");

        // Gen content color for this same shade
        const contentColor = getContrastingTextColor(shadedColor);
        shades[`color-${colorName}-${shade}-content`] = contentColor;

        if (semanticAliases[shade]) {
          shades[`color-${colorName}-${semanticAliases[shade]}`] = shades[varName];
          shades[`color-${colorName}-${semanticAliases[shade]}-content`] = contentColor;
        }
      });
    }
  });

  return shades;
}

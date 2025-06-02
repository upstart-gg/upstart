import chroma from "chroma-js";
import type { Theme } from "../theme";
export { default as chroma } from "chroma-js";
import { kebabCase } from "lodash-es";
import { css } from "@upstart.gg/style-system/twind";

export type ColorType = keyof Theme["colors"];
export type ElementColorType = "page-background" | "background" | "text" | "border" | "shadow";

export const baseColorsLabels: Record<ColorType, string> = {
  primary: "Primary",
  secondary: "Secondary",
  accent: "Accent",
  neutral: "Neutral",
  base100: "Base (level 1)",
  base200: "Base (level 2)",
  base300: "Base (level 3)",
  baseContent: "Base content",
  primaryContent: "Primary content",
  secondaryContent: "Secondary content",
  accentContent: "Accent content",
  neutralContent: "Neutral content",
};

export const shadeNumbers = [900, 800, 700, 600, 500, 400, 300, 200, 100, 50] as const;
type ShadeNumber = (typeof shadeNumbers)[number];

const semanticAliases: Partial<Record<ShadeNumber, string>> = {
  100: "subtle",
  300: "light",
  700: "bold",
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

export function getContrastingTextColor(backgroundColor: string, contrastThreshold = 4.5): string {
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
    return contrastWithWhite >= contrastWithBlack ? white : black;
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

  Object.entries(theme.colors).forEach(([colorName, color]) => {
    // Add the original color as the default (without number suffix)
    shades[`color-${kebabCase(colorName)}`] = color;

    // Handle base colors separately (they already have shades)
    if (colorName.startsWith("base")) {
      return;
    }

    const darkest = chroma(color).darken(2.5);
    const lightest = chroma(color).brighten(3.5);

    const colorScale = chroma.scale([lightest, color, darkest]).domain([50, 500, 900]).mode("lab"); // Use LAB color space for better perceptual scaling

    shadeNumbers.forEach((shade) => {
      const varName = `color-${kebabCase(colorName)}-${shade}`;
      const shadedColor = colorScale(shade).oklch();
      shades[varName] = `oklch(${shadedColor.join(" ")})`;
      if (semanticAliases[shade]) {
        shades[`color-${kebabCase(colorName)}-${semanticAliases[shade]}`] = shades[varName];
      }
    });
  });

  console.log("theme", theme.colors, shades);

  return shades;
}

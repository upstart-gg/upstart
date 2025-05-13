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

interface ContrastRequirements {
  minContrast: number; // WCAG requirements: 4.5 for normal text, 3 for large text
  preferredContrast: number;
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

const textContrastRequirements: ContrastRequirements = { minContrast: 4, preferredContrast: 7 };

export function getTextContrastedColor(element: HTMLElement) {
  // Get all elements that are background of the element
  const styles = window.getComputedStyle(element);
  const { backgroundColor, backgroundImage } = styles;
  let resolved = chroma(backgroundColor);

  // If resolved color is transparent, get underlying elemments
  if (resolved.alpha() < 0.7) {
    // Try to check if there are gradients
    if (backgroundImage !== "none") {
      // extract possible rgb() or hsl() values from gradient
      const gradientColors = backgroundImage.match(/(rgb|hsl)\(.*?\)/g);
      if (gradientColors) {
        for (const color of gradientColors) {
          // override resolved color with the darkest color from gradient
          const tmp = chroma(color);
          if (tmp.luminance() < resolved.luminance() || !resolved.luminance()) {
            resolved = tmp;
          }
        }
      }
    }
    if (resolved.alpha() < 0.7) {
      const parent = element.parentElement;
      if (parent) {
        return getTextContrastedColor(parent);
      }
    }
  }

  const blackContrast = chroma.contrast(resolved, "#000000");
  const whiteContrast = chroma.contrast(resolved, "#FFFFFF");

  if (
    whiteContrast >= textContrastRequirements.minContrast ||
    blackContrast >= textContrastRequirements.minContrast
  ) {
    return whiteContrast > blackContrast || blackContrast - whiteContrast < 2 ? "#FFFFFF" : "#000000";
  }
  // // If neither provides enough contrast, adjust the better one
  // fallback to black
  return "#000000";
}

export function propToStyle(prop: string | number | undefined, cssAttr: string) {
  if (typeof prop === "undefined") {
    return undefined;
  }
  // @ts-ignore
  return isStandardColor(prop) || typeof prop === "number" ? css({ [cssAttr as string]: prop }) : prop;
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

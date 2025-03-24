import chroma from "chroma-js";
import type { Theme } from "../theme";
export { default as chroma } from "chroma-js";
import { colors, css, tx } from "@upstart.gg/style-system/twind";

export type ColorType = "primary" | "secondary" | "accent" | "neutral";
export type ElementColorType = "page-background" | "background" | "text" | "border" | "shadow";

export type HarmonyType = "complementary" | "analogous" | "triadic" | "split-complementary" | "tetradic";

export const colorAdjustments = ["pastel", "soft", "default", "bold", "vibrant", "muted", "deep"] as const;
export const colorAdjustmentsLuminous = ["pastel", "soft", "default", "bold", "vibrant"] as const;
export const colorAdjustmentsSubdued = ["muted", "deep"] as const;

export type ColorAdjustment = (typeof colorAdjustments)[number];

export const shades = ["900", "800", "700", "600", "500", "400", "300", "200", "100", "50"] as const;
type Shade = (typeof shades)[number];

export type ElementColor = string;

// Extended constraints to handle different color styles
interface ColorConstraints {
  lightness: number;
  saturation: number;
}

export const getHarmoniousHues = (baseHue: number, harmonyType: HarmonyType) => {
  switch (harmonyType) {
    case "complementary":
      return [baseHue, (baseHue + 180) % 360];
    case "analogous":
      return [(baseHue - 30 + 360) % 360, baseHue, (baseHue + 30) % 360];
    case "triadic":
      return [baseHue, (baseHue + 120) % 360, (baseHue + 240) % 360];
    case "split-complementary":
      return [baseHue, (baseHue + 150) % 360, (baseHue + 210) % 360];
    case "tetradic":
      return [baseHue, (baseHue + 90) % 360, (baseHue + 180) % 360, (baseHue + 270) % 360];
  }
};

export function getColorsSuggestions(baseHueOrColor: number | string, theme: Theme) {
  const baseHue = typeof baseHueOrColor === "string" ? chroma(baseHueOrColor).get("hsl.h") : baseHueOrColor;
  const themeColors = Object.values(theme.colors).map((color) => chroma(color).get("hsl.h"));
  const excluded = [...themeColors, baseHue];

  return Array.from(
    new Set([
      ...getHarmoniousHues(baseHue, "complementary"),
      ...getHarmoniousHues(baseHue, "analogous"),
      ...getHarmoniousHues(baseHue, "triadic"),
      ...getHarmoniousHues(baseHue, "tetradic"),
      ...getHarmoniousHues(baseHue, "split-complementary"),
    ]),
  )
    .sort()
    .filter((hue) => excluded.includes(hue) === false) // limit to 8
    .slice(0, 8);
}

export const generateShades = (baseColor: string) => {
  // Convert base color to Oklab
  const baseOklab = chroma(baseColor).oklab();
  const [baseL, baseA, baseB] = baseOklab;

  // Calculate chroma (saturation) of base color
  const baseChroma = Math.sqrt(baseA * baseA + baseB * baseB);

  // Calculate hue angle in radians
  const baseHue = Math.atan2(baseB, baseA);

  // Define adjustments for each shade
  // Format: [lightness adjustment, chroma multiplier]
  const adjustments: Record<string, [number, number]> = {
    50: [+0.52, 0.1], // Much lighter, much less saturated
    100: [+0.45, 0.2], // Very light, less saturated
    200: [+0.35, 0.35], // Lighter, slightly less saturated
    300: [+0.2, 0.8], // Light, slightly less saturated
    400: [+0.1, 0.8], // Slightly light, nearly same saturation
    500: [0, 1.0], // Base color
    600: [-0.05, 1.1], // Slightly dark, slightly more saturated
    700: [-0.1, 1.2], // Dark, more saturated
    800: [-0.15, 1.3], // Very dark, more saturated
    900: [-0.2, 1.4], // Much darker, most saturated
  };

  // Create shades object
  const shades: Record<string, string> = {};
  const usedColors = new Set<string>();

  // Generate each shade
  Object.entries(adjustments).forEach(([shade, [lAdjust, chromaMultiplier]]) => {
    try {
      // Adjust lightness with bounds checking
      const newL = Math.max(0.01, Math.min(0.99, baseL + lAdjust));

      // Adjust chroma (saturation)
      const newChroma = baseChroma * chromaMultiplier;

      // Convert back to a,b coordinates
      const newA = newChroma * Math.cos(baseHue);
      const newB = newChroma * Math.sin(baseHue);

      // Generate the new color
      const newColor = chroma.oklab(newL, newA, newB).hex();
      const shadeInt = parseInt(shade, 10);

      // Ensure we don't have duplicates
      if (usedColors.has(newColor)) {
        // If duplicate, try adjusting slightly
        const tweakedL = newL + (shadeInt > 500 ? -0.02 : +0.02);
        const tweakedChroma = newChroma * (shadeInt > 500 ? 1.05 : 0.95);
        const tweakedA = tweakedChroma * Math.cos(baseHue);
        const tweakedB = tweakedChroma * Math.sin(baseHue);
        shades[shade] = chroma.oklab(tweakedL, tweakedA, tweakedB).hex();
      } else {
        shades[shade] = newColor;
      }

      usedColors.add(shades[shade]);
    } catch (error) {
      console.error(`Error generating shade ${shade}:`, error);
      shades[shade] = baseColor; // Fallback to base color
    }
  });

  // Verification step - ensure all colors are unique
  const uniqueColors = new Set(Object.values(shades));
  if (uniqueColors.size !== Object.keys(adjustments).length) {
    // Additional adjustment if still having duplicates
    Object.entries(shades).forEach(([shade, color], index) => {
      if (index > 0 && shades[Object.keys(shades)[index - 1]] === color) {
        const [lAdjust, chromaMultiplier] = adjustments[shade];

        // Try a more aggressive adjustment
        const newL = baseL + lAdjust * 1.2;
        const newChroma = baseChroma * (chromaMultiplier * 1.1);
        const newA = newChroma * Math.cos(baseHue);
        const newB = newChroma * Math.sin(baseHue);

        shades[shade] = chroma.oklab(newL, newA, newB).hex();
      }
    });
  }

  return shades;
};

interface ContrastRequirements {
  minContrast: number; // WCAG requirements: 4.5 for normal text, 3 for large text
  preferredContrast: number;
}

export function isStandardColor(color: unknown): boolean {
  if (typeof color !== "string") {
    return false;
  }
  return (
    color.startsWith("rgb") || color.startsWith("hsl") || color.startsWith("#") || color.startsWith("var(--")
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

  console.log({ blackContrast, whiteContrast });

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
  return isStandardColor(prop) || typeof prop === "number" ? css({ [cssAttr as string]: prop }) : tx(prop);
}

export function propToClass(value: string | number | undefined, classPrefix: string) {
  if (typeof value === "undefined") {
    return undefined;
  }
  return isStandardColor(value) || typeof value === "number" ? `${classPrefix}-[${value}]` : value;
}

export function generateColorsVars(theme: Theme) {
  const shades = Object.entries(theme.colors).reduce(
    (acc, [colorName, color]) => {
      acc[`color-${colorName}`] = color;
      for (const [key, value] of Object.entries(generateShades(color))) {
        acc[`color-${colorName}-${key}`] = value;
        for (const [tonalKey, val] of Object.entries(generateTextColors(value))) {
          if (tonalKey === "base") {
            acc[`text-${colorName}-${key}`] = val;
          } else {
            acc[`text-${colorName}-${key}-${tonalKey}`] = val;
          }
        }
      }
      return acc;
    },
    {} as Record<string, string>,
  );
  shades["color-gray-50"] = colors.gray[50];
  shades["color-gray-100"] = colors.gray[100];
  shades["color-gray-200"] = colors.gray[200];
  shades["color-gray-300"] = colors.gray[300];
  shades["color-gray-400"] = colors.gray[400];
  shades["color-gray-500"] = colors.gray[500];
  shades["color-gray-600"] = colors.gray[600];
  shades["color-gray-700"] = colors.gray[700];
  shades["color-gray-800"] = colors.gray[800];
  shades["color-gray-900"] = colors.gray[900];
  return shades;
}

interface TextColors {
  base: string; // High contrast (black/white)
  subtle: string; // Lower contrast
  strong: string; // Maximum contrast
  tonal: string; // Same hue, different shade
  "tonal-subtle": string; // Lower contrast, same hue
  "tonal-strong": string; // Higher contrast, same hue
}

export const generateTextColors = (
  backgroundColor: string,
  requirements: ContrastRequirements = { minContrast: 4.5, preferredContrast: 7 },
): TextColors => {
  try {
    const bgColor = chroma(backgroundColor);
    const bgLuminance = bgColor.luminance();
    const [hue, saturation, lightness] = bgColor.hsl();

    // Generate neutral colors
    const neutralBase = bgLuminance > 0.5 ? "#000000" : "#FFFFFF";
    const neutralColors = {
      base: neutralBase,
      subtle: chroma.mix(backgroundColor, neutralBase, 0.4).hex(),
      strong: chroma.mix(backgroundColor, neutralBase, 0.9).hex(),
    };

    // Generate tonal colors
    const generateTonalWithContrast = (targetLight: number): string => {
      let currentSat = saturation;
      let color = chroma.hsl(hue, currentSat, targetLight);

      // Adjust saturation if needed to meet contrast
      while (chroma.contrast(backgroundColor, color) < requirements.minContrast && currentSat < 1) {
        currentSat = Math.min(1, currentSat + 0.1);
        color = chroma.hsl(hue, currentSat, targetLight);
      }

      return color.hex();
    };

    const tonalLight = generateTonalWithContrast(Math.min(0.95, lightness + 0.4));
    const tonalDark = generateTonalWithContrast(Math.max(0.05, lightness - 0.4));

    // Choose base tonal color based on better contrast
    const tonalLightContrast = chroma.contrast(backgroundColor, tonalLight);
    const tonalDarkContrast = chroma.contrast(backgroundColor, tonalDark);
    const tonalBase = tonalLightContrast > tonalDarkContrast ? tonalLight : tonalDark;

    const tonalColors = {
      tonal: tonalBase,
      "tonal-subtle":
        bgLuminance > 0.5
          ? generateTonalWithContrast(Math.max(0.1, lightness - 0.2))
          : generateTonalWithContrast(Math.min(0.9, lightness + 0.2)),
      "tonal-strong":
        bgLuminance > 0.5
          ? generateTonalWithContrast(Math.max(0.05, lightness - 0.6))
          : generateTonalWithContrast(Math.min(0.95, lightness + 0.6)),
    };

    return {
      ...neutralColors,
      ...tonalColors,
    };
  } catch (e) {
    console.warn("Invalid color provided:", backgroundColor);
    return {
      base: "#000000",
      subtle: "#000000",
      strong: "#000000",
      tonal: "#000000",
      "tonal-subtle": "#000000",
      "tonal-strong": "#000000",
    };
  }
};

export const colorFamilies = {
  Reds: [
    { name: "Red", base: 0, description: "Pure red" },
    { name: "Vermilion", base: 5, description: "Bright red-orange" },
    { name: "Scarlet", base: 10, description: "Bright orange-red" },
    { name: "Carmine", base: 345, description: "Deep red with purple" },
    { name: "Ruby", base: 350, description: "Deep, rich red" },
    { name: "Cherry", base: 355, description: "Deep red with slight blue" },
  ],

  Pinks: [
    { name: "Coral", base: 15, description: "Orange-pink" },
    { name: "Rose", base: 330, description: "Deep pink" },
    { name: "Hot Pink", base: 335, description: "Vivid pink" },
    { name: "Pink", base: 340, description: "True pink" },
    { name: "Rose Gold", base: 345, description: "Metallic pink" },
    { name: "Fuchsia", base: 320, description: "Vivid purple-pink" },
    { name: "Magenta", base: 300, description: "Pure magenta" },
  ],

  Purples: [
    { name: "Purple", base: 270, description: "True purple" },
    { name: "Lavender", base: 275, description: "Light purple" },
    { name: "Violet", base: 280, description: "Blue-purple" },
    { name: "Mauve", base: 285, description: "Muted purple" },
    { name: "Plum", base: 290, description: "Deep purple" },
    { name: "Orchid", base: 295, description: "Light violet-purple" },
  ],

  Blues: [
    { name: "Arctic", base: 200, description: "Icy blue" },
    { name: "Cerulean", base: 205, description: "Sky-ocean blue" },
    { name: "Blue", base: 210, description: "True blue" },
    { name: "Cobalt", base: 215, description: "Pure deep blue" },
    { name: "Navy", base: 220, description: "Dark blue" },
    { name: "Indigo", base: 230, description: "Deep blue-purple" },
  ],

  Cyans: [
    { name: "Aquamarine", base: 160, description: "Light blue-green" },
    { name: "Teal", base: 170, description: "Dark blue-green" },
    { name: "Turquoise", base: 175, description: "Blue-green" },
    { name: "Cyan", base: 180, description: "Pure cyan" },
    { name: "Ocean", base: 185, description: "Deep water blue" },
    { name: "Aqua", base: 190, description: "Light blue-green" },
  ],

  Greens: [
    { name: "Lime", base: 90, description: "Yellow-tinted green" },
    { name: "Olive", base: 110, description: "Yellow-green" },
    { name: "Green", base: 120, description: "True green" },
    { name: "Jade", base: 130, description: "Rich medium green" },
    { name: "Sage", base: 135, description: "Muted green" },
    { name: "Emerald", base: 140, description: "Bright green" },
    { name: "Forest", base: 150, description: "Dark green" },
    { name: "Mint", base: 160, description: "Light cool green" },
  ],

  Yellows: [
    { name: "Honey", base: 43, description: "Warm yellow" },
    { name: "Gold", base: 45, description: "Yellow-orange" },
    { name: "Banana", base: 52, description: "Warm light yellow" },
    { name: "Butter", base: 55, description: "Soft yellow" },
    { name: "Lemon", base: 58, description: "Light yellow" },
    { name: "Yellow", base: 60, description: "True yellow" },
  ],

  Oranges: [
    { name: "Rust", base: 20, description: "Dark orange-brown" },
    { name: "Tangerine", base: 25, description: "Bright orange" },
    { name: "Orange", base: 30, description: "True orange" },
    { name: "Marigold", base: 35, description: "Deep yellow-orange" },
  ],

  Browns: [
    { name: "Sienna", base: 20, description: "Reddish brown" },
    { name: "Cedar", base: 22, description: "Red-tinted brown" },
    { name: "Brown", base: 25, description: "True brown" },
    { name: "Sepia", base: 30, description: "Warm dark brown" },
    { name: "Tan", base: 34, description: "Light brown" },
    { name: "Khaki", base: 37, description: "Yellow-brown" },
  ],

  Grays: [
    { name: "Charcoal", base: 200, description: "Dark gray", lowSaturation: true },
    { name: "Silver", base: 210, description: "Light metallic gray", lowSaturation: true },
    { name: "Slate", base: 215, description: "Blue-gray", lowSaturation: true },
    { name: "Gray", base: 220, description: "True gray", lowSaturation: true },
    { name: "Steel", base: 225, description: "Cool gray", lowSaturation: true },
  ],
} as const;

// Define constraints for each color style
export const colorAdjustmentBaseValues: Record<ColorAdjustment, Record<ColorType, ColorConstraints>> = {
  // Default style - Your original values
  default: {
    primary: {
      saturation: 65,
      lightness: 50,
    },
    secondary: {
      saturation: 65,
      lightness: 50,
    },
    accent: {
      saturation: 65,
      lightness: 50,
    },
    neutral: {
      saturation: 10,
      lightness: 50,
    },
  },

  // Pastel style - Higher lightness, lower saturation
  pastel: {
    primary: {
      saturation: 55, // Reduced saturation
      lightness: 68, // Increased lightness
    },
    secondary: {
      saturation: 55, // Reduced saturation
      lightness: 68, // Increased lightness
    },
    accent: {
      saturation: 55, // Reduced saturation
      lightness: 68, // Increased lightness
    },
    neutral: {
      saturation: 5, // Very low saturation
      lightness: 68, // High lightness
    },
  },

  soft: {
    primary: {
      saturation: 45,
      lightness: 60,
    },
    secondary: {
      saturation: 45,
      lightness: 60,
    },
    accent: {
      saturation: 45,
      lightness: 60,
    },
    neutral: {
      saturation: 8,
      lightness: 60,
    },
  },

  bold: {
    primary: {
      saturation: 70,
      lightness: 45,
    },
    secondary: {
      saturation: 70,
      lightness: 45,
    },
    accent: {
      saturation: 70,
      lightness: 45,
    },
    neutral: {
      saturation: 12,
      lightness: 45,
    },
  },

  deep: {
    primary: {
      saturation: 60,
      lightness: 40,
    },
    secondary: {
      saturation: 60,
      lightness: 40,
    },
    accent: {
      saturation: 60,
      lightness: 40,
    },
    neutral: {
      saturation: 10,
      lightness: 40,
    },
  },

  // Vibrant style - Higher saturation, maintained lightness
  vibrant: {
    primary: {
      saturation: 75,
      lightness: 55,
    },
    secondary: {
      saturation: 75,
      lightness: 55,
    },
    accent: {
      saturation: 75,
      lightness: 55,
    },
    neutral: {
      saturation: 15,
      lightness: 55,
    },
  },

  // Muted style - Lower saturation, slightly darker
  muted: {
    primary: {
      saturation: 37,
      lightness: 48,
    },
    secondary: {
      saturation: 37,
      lightness: 48,
    },
    accent: {
      saturation: 37,
      lightness: 48,
    },
    neutral: {
      saturation: 8,
      lightness: 48,
    },
  },
} as const;

/**
 * Color Variants
 * Different visual variants for color application
 */
export type ColorVariant =
  | "surface" // Light, background-focused (50-200)
  | "filled" // Solid color (500-700)
  | "soft" // Subtle, gentle (100-300)
  | "ghost" // Transparent with colored content
  | "outlined" // Bordered
  | "faded" // Very light (50-100)
  | "glazed" // Semi-transparent
  | "solid"; // Full solid color (400-600)

interface VariantConfig {
  background: {
    base: Shade | "transparent";
    hover: Shade | "transparent";
    active: Shade | "transparent";
    disabled: Shade | "transparent";
  };
  content: {
    useContrast: boolean; // Whether to use contrasting colors
    useTonal: boolean; // Whether to use same-hue colors
  };
  description: string;
  usage: string[];
}

const variantConfigs: Record<ColorVariant, VariantConfig> = {
  surface: {
    background: {
      base: "50",
      hover: "100",
      active: "200",
      disabled: "50",
    },
    content: {
      useContrast: true,
      useTonal: false,
    },
    description: "Light backgrounds for large surfaces and containers",
    usage: ["Page backgrounds", "Cards", "Containers", "Panels", "Sidebars"],
  },

  filled: {
    background: {
      base: "600",
      hover: "700",
      active: "800",
      disabled: "400",
    },
    content: {
      useContrast: true,
      useTonal: false,
    },
    description: "Solid colored backgrounds with contrasting content",
    usage: [
      "Primary buttons",
      "Call-to-action elements",
      "Selected states",
      "Important UI elements",
      "Navigation items",
    ],
  },

  soft: {
    background: {
      base: "100",
      hover: "200",
      active: "300",
      disabled: "50",
    },
    content: {
      useContrast: false,
      useTonal: true,
    },
    description: "Subtle, gentle color application for secondary elements",
    usage: ["Secondary buttons", "Background highlights", "Selected items", "Tags", "Chips"],
  },

  ghost: {
    background: {
      base: "transparent",
      hover: "50",
      active: "100",
      disabled: "transparent",
    },
    content: {
      useContrast: false,
      useTonal: true,
    },
    description: "Transparent background with colored content",
    usage: ["Text buttons", "Links", "Menu items", "Low-emphasis actions", "Inline elements"],
  },

  outlined: {
    background: {
      base: "transparent",
      hover: "50",
      active: "100",
      disabled: "transparent",
    },
    content: {
      useContrast: false,
      useTonal: true,
    },
    description: "Bordered elements with optional light background on interaction",
    usage: ["Secondary buttons", "Selectable cards", "Input fields", "Dropdown triggers", "Menu items"],
  },

  faded: {
    background: {
      base: "50",
      hover: "100",
      active: "100",
      disabled: "50",
    },
    content: {
      useContrast: false,
      useTonal: true,
    },
    description: "Very light, subtle color application",
    usage: [
      "Background accents",
      "Disabled states",
      "Inactive elements",
      "Secondary information",
      "Subtle indicators",
    ],
  },

  glazed: {
    background: {
      base: "100",
      hover: "200",
      active: "300",
      disabled: "50",
    },
    content: {
      useContrast: true,
      useTonal: false,
    },
    description: "Semi-transparent color application with blur effect",
    usage: ["Modal backgrounds", "Overlay panels", "Floating elements", "Tooltips", "Context menus"],
  },

  solid: {
    background: {
      base: "500",
      hover: "600",
      active: "700",
      disabled: "300",
    },
    content: {
      useContrast: true,
      useTonal: false,
    },
    description: "Full solid color application with medium emphasis",
    usage: ["Headers", "Navigation bars", "Important sections", "Progress indicators", "Status indicators"],
  },
} as const;

export const generateVariantClasses = (variant: ColorVariant, colorType: ColorType) => {
  const config = variantConfigs[variant];
  return {
    base: {
      background: `bg-${colorType}-${config.background.base}`,
      content: config.content.useTonal
        ? `text-${colorType}-${config.background.base}-tonal`
        : `text-${colorType}-${config.background.base}-base`,
    },
    hover: {
      background: `hover:bg-${colorType}-${config.background.hover}`,
      content: config.content.useTonal
        ? `hover:text-${colorType}-${config.background.hover}-tonal`
        : `hover:text-${colorType}-${config.background.hover}-base`,
    },
    active: {
      background: `active:bg-${colorType}-${config.background.active}`,
      content: config.content.useTonal
        ? `active:text-${colorType}-${config.background.active}-tonal`
        : `active:text-${colorType}-${config.background.active}-base`,
    },
    disabled: {
      background: `bg-${colorType}-${config.background.disabled}`,
      content: config.content.useTonal
        ? `text-${colorType}-${config.background.disabled}-tonal`
        : `text-${colorType}-${config.background.disabled}-base`,
    },
  };
};

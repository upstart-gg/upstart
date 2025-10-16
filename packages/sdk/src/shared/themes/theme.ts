import { Type, type Static } from "@sinclair/typebox";
import chroma from "chroma-js";
import { colorPalette } from "@upstart.gg/style-system/colors";
import { StringEnum } from "../utils/string-enum";

export const fontStacks = [
  { value: "system-ui", label: "System UI" },
  { value: "transitional", label: "Transitional" },
  { value: "old-style", label: "Old style" },
  { value: "humanist", label: "Humanist" },
  { value: "geometric-humanist", label: "Geometric humanist" },
  { value: "classical-humanist", label: "Classical humanist" },
  { value: "neo-grotesque", label: "Neo-grotesque" },
  { value: "monospace-slab-serif", label: "Monospace slab serif" },
  { value: "monospace-code", label: "Monospace code" },
  { value: "industrial", label: "Industrial" },
  { value: "rounded-sans", label: "Rounded sans" },
  { value: "slab-serif", label: "Slab serif" },
  { value: "antique", label: "Antique" },
  { value: "didone", label: "Didone" },
  { value: "handwritten", label: "Handwritten" },
];

const genericFont = Type.Union([
  Type.Object({
    type: Type.Literal("stack"),
    family: StringEnum(
      fontStacks.map((f) => f.value),
      {
        title: "Font stack",
        description: "A generic font stack",
      },
    ),
  }),
  Type.Object({
    type: Type.Literal("theme"),
    family: Type.String({
      title: "Theme font",
      description: "A font defined in the theme",
    }),
  }),
  Type.Object({
    type: Type.Literal("google"),
    family: Type.String({
      title: "Google font",
      description: "A Google font family name, as listed on fonts.google.com",
    }),
  }),
]);

const headingFont = Type.Composite([genericFont], {
  title: "Headings font",
  description: "Used for titles and headings",
});

const bodyFont = Type.Composite([genericFont], {
  title: "Body font",
  description: "Used for paragraphs and body text",
});

export const themeSchema = Type.Object({
  id: Type.String({ title: "ID", description: "The unique identifier of the theme" }),
  name: Type.String({ title: "Name", description: "The name of the theme" }),
  description: Type.String({ title: "Description", description: "The description of the theme" }),
  tags: Type.Array(Type.String({ title: "Tag" }), { title: "Tags", description: "The tags of the theme" }),
  browserColorScheme: StringEnum(["light", "dark"], {
    title: "Browser scheme",
    description: "Color of browser-provided UI. Either 'light' or 'dark'",
  }),
  // Define the theme colors
  colors: Type.Object(
    {
      primary: Type.String({
        title: "Primary",
        description: "The brand's primary color.",
        "ai:instructions": "Use oklch() css notation.",
        examples: ["oklch(0.62 0.241 354.308)"],
      }),
      secondary: Type.String({
        title: "Secondary",
        description: "The brand's second most used color",
        "ai:instructions": "Use oklch() css notation.",
        examples: ["oklch(0.65 0.22 185)"],
      }),
      accent: Type.String({
        title: "Accent",
        description: "The brand's least used color",
        "ai:instructions": "Use oklch() css notation.",
        examples: ["oklch(0.82 0.18 85)"],
      }),
      neutral: Type.String({
        title: "Neutral",
        description: "The base neutral color",
        "ai:instructions": "Use oklch() css notation.",
        examples: ["oklch(0.38 0.08 280)"],
      }),
      info: Type.String({
        title: "Info",
        description: "Color used to convey information",
        "ai:instructions": "Use oklch() css notation.",
        examples: ["oklch(0.6 0.15 220)"],
      }),
      success: Type.String({
        title: "Success",
        description: "Color used to convey success",
        "ai:instructions": "Use oklch() css notation.",
        examples: ["oklch(0.7 0.2 130)"],
      }),
      warning: Type.String({
        title: "Warning",
        description: "Color used to convey warnings",
        "ai:instructions": "Use oklch() css notation.",
        examples: ["oklch(0.75 0.25 90)"],
      }),
      error: Type.String({
        title: "Error",
        description: "Color used to convey errors",
        "ai:instructions": "Use oklch() css notation.",
        examples: ["oklch(0.6 0.3 40)"],
      }),
      // Base colors
      base100: Type.String({
        title: "Base",
        description:
          "Base surface color of page, used for blank backgrounds. Should be white or near-white for light color-schemes, and black or near-black for dark color-schemes.",
        "ai:instructions": "Use oklch() css notation",
        examples: ["oklch(0.99 0.008 92)"],
      }),
      base200: Type.String({
        title: "Base 2",
        description:
          "Should be darker than base 100 but still light for light color-schemes, and lighter but still dark for dark color-schemes.",
        "ai:instructions": "Use oklch() css notation.",
        examples: ["oklch(0.97 0.01 85)"],
      }),
      base300: Type.String({
        title: "Base 3",
        description:
          "3rd base color, should be darker than base 200 for light color-schemes, and lighter than base 200 for dark color-schemes.",
        "ai:instructions": "Use oklch() css notation.",
        examples: ["oklch(0.95 0.02 80)"],
      }),
    },
    {
      title: "Theme base colors",
      description: "The base colors of the theme. Each theme must declare all these colors",
    },
  ),

  // Define the theme typography
  typography: Type.Object({
    base: Type.Number({
      title: "Base font size",
      description: "The base font size in pixels. It is safe to keep it as is.",
      "ai:instructions": "A safe value is 16.",
    }),
    heading: headingFont,
    body: bodyFont,
    alternatives: Type.Array(
      Type.Object({
        body: bodyFont,
        heading: headingFont,
      }),
      {
        title: "Alternative fonts",
        description: "Alternative fonts that can be suggested to the user. Takes the same shape",
      },
    ),
  }),
});

export type Theme = Static<typeof themeSchema>;
export const themesArray = Type.Array(themeSchema);

export type ThemesArray = Static<typeof themesArray>;
export type FontType = Theme["typography"]["body"];

export const defaultTheme: Theme = {
  id: "_default_",
  name: "default",
  description: "Default Upstart theme",
  tags: ["gradient", "vibrant", "modern", "creative", "dynamic", "artistic", "bold"],
  browserColorScheme: "light",
  colors: {
    base100: "#FFF", // Warm white background
    base200: "#F5F0E1", // Soft cream in hex
    base300: "#F0E3D2", // Light warm gray in hex
    primary: "#FF6F20", // A vibrant orange in hex
    secondary: "#00BFFF", // A bright cyan in hex
    accent: "#A4D65E", // A lively lime green in hex
    neutral: "#B0B0B0", // A balanced gray in hex
    info: "#2096FF", // A clear blue in hex
    success: "#28A745", // A solid green in hex
    warning: "#FFC107", // A warm amber in hex
    error: "#DC3545", // A strong red in hex
  },
  typography: {
    base: 16,
    heading: { type: "stack", family: "system-ui" },
    body: { type: "stack", family: "system-ui" },
    alternatives: [],
  },
};

export function isDefaultTheme(theme: Theme): boolean {
  return theme.id === defaultTheme.id;
}

/**
 * Process a theme, eventually fixing colors and translating them to oklch notations
 * @param theme
 */
export function processTheme(theme: Theme): Theme {
  return {
    ...theme,
    typography: {
      ...theme.typography,
      base: 16, // override any base size
    },
    colors: Object.entries(theme.colors).reduce(
      (acc, [key, value]) => {
        const fixedColor = fixOklchColor(value);
        return {
          // biome-ignore lint/performance/noAccumulatingSpread: <explanation>
          ...acc,
          [key]: fixedColor,
        };
      },
      {} as typeof theme.colors,
    ),
  };
}

function fixOklchColor(color: string) {
  const valid = chroma.valid(color);
  if (valid) {
    return color;
  }
  // Try to fix the color if it looks like oklch
  const oklchRegex = /ok(lch|lab)\(([^)]+)\)/;
  if (oklchRegex.test(color)) {
    const withoutComma = color.replace(/,/g, " ");
    if (chroma.valid(withoutComma)) {
      return withoutComma;
    }
  }
  // tailwind colors
  if (/^([a-z]+)-([0-9]+)$/.test(color)) {
    const [name, shade] = color.split("-");
    // @ts-ignore
    const twColor = colorPalette[name]?.[shade] as string | undefined;
    if (twColor) {
      return twColor;
    }
  }
  return color;
}

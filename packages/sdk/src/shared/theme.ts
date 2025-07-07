import { Type, type Static } from "@sinclair/typebox";
import chroma from "chroma-js";
import { colorPalette } from "@upstart.gg/style-system/colors";
import { StringEnum } from "./utils/string-enum";

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

const headingFont = Type.Object(
  {
    type: StringEnum(["stack", "theme", "google"], {
      title: "Type of font",
      description: "The type of font. Can be a font stack, a theme font or a Google font",
    }),
    family: Type.String({
      title: "Family",
      description: "The font family (eg. the name of the font)",
    }),
  },
  {
    title: "Headings font",
    description: "Used for titles and headings",
    additionalProperties: false,
  },
);

const bodyFont = Type.Object(
  {
    type: StringEnum(["stack", "theme", "google"], {
      title: "Type of font",
      description: "The type of font. Can be a font stack, a theme font or a Google font",
    }),
    family: Type.String({
      title: "Family",
      description: "The font family (eg. the name of the font)",
    }),
  },
  {
    title: "Body font",
    description: "Used for paragraphs and body text",
    additionalProperties: false,
  },
);

export const themeSchema = Type.Object(
  {
    id: Type.String({ title: "ID", description: "The unique identifier of the theme" }),
    name: Type.String({ title: "Name", description: "The name of the theme" }),
    description: Type.String({ title: "Description", description: "The description of the theme" }),
    tags: Type.Array(Type.String({ title: "Tag" }), { title: "Tags", description: "The tags of the theme" }),
    browserColorScheme: Type.String({
      title: "Browser scheme",
      description: "Color of browser-provided UI. Either 'light' or 'dark'",
    }),
    // Define the theme colors
    colors: Type.Object(
      {
        primary: Type.String({
          title: "Primary",
          description: "The brand's primary color.",
        }),
        primaryContent: Type.String({
          title: "Primary content",
          description: "Text color on primary background",
        }),
        secondary: Type.String({
          title: "Secondary",
          description: "The brand's second most used color",
        }),
        secondaryContent: Type.String({
          title: "Secondary content",
          description: "Text color on secondary background",
        }),
        accent: Type.String({
          title: "Accent",
          description: "The brand's least used color",
        }),
        accentContent: Type.String({
          title: "Accent content",
          description: "Text color on accent background",
        }),
        neutral: Type.String({
          title: "Neutral",
          description: "The base neutral color",
        }),
        neutralContent: Type.String({
          title: "Neutral content",
          description: "Text color on neutral background",
        }),
        base100: Type.String({
          title: "Base",
          description:
            "Base surface color of page, used for blank backgrounds. Should be white or near-white for light color-schemes, and black or near-black for dark color-schemes.",
        }),
        base200: Type.String({
          title: "Base 2",
          description:
            "Should be darker than base 1 but still light for light color-schemes, and lighter but still dark for dark color-schemes.",
        }),
        base300: Type.String({
          title: "Base 3",
          description:
            "3rd base color, should be darker than base 2 for light color-schemes, and lighter than base 2 for dark color-schemes.",
        }),
        baseContent: Type.String({
          title: "Base content",
          description: "Text color to use on base colors",
        }),
      },
      {
        title: "Theme base colors",
        description: "The base colors of the theme. Each theme must declare all these colors",
        "ai:instructions":
          "You can use CSS notations like rgb #hex, hsl() oklab() or any tailwind color like slate-500 or red-200",
        additionalProperties: false,
      },
    ),

    // Define the theme typography
    typography: Type.Object(
      {
        base: Type.Number({
          title: "Base font size",
          description: "The base font size in pixels. It is safe to keep it as is",
        }),
        heading: headingFont,
        body: bodyFont,
        alternatives: Type.Array(
          Type.Object(
            {
              body: bodyFont,
              heading: headingFont,
            },
            { additionalProperties: false },
          ),
          {
            title: "Alternative fonts",
            description: "Alternative fonts that can be suggested to the user. Takes the same shape",
          },
        ),
      },
      { additionalProperties: false },
    ),
  },
  {
    additionalProperties: false,
  },
);

export type Theme = Static<typeof themeSchema>;
export const themeArray = Type.Array(themeSchema);
export type ThemeArray = Static<typeof themeArray>;
export type FontType = Theme["typography"]["body"];

export const defaultTheme: Theme = {
  id: "_default_",
  name: "default",
  description: "Default Upstart theme",
  tags: ["gradient", "vibrant", "modern", "creative", "dynamic", "artistic", "bold"],
  browserColorScheme: "light",
  colors: {
    base100: "#FFF", // Warm white background
    base200: "oklch(0.99 0.008 92)", // Soft cream
    base300: "oklch(0.97 0.01 85)", // Light warm gray
    baseContent: "oklch(0.18 0.025 80)", // Rich dark brown-gray
    primary: "oklch(0.68 0.28 340)",
    primaryContent: "oklch(0.99 0.005 340)", // White text on primary
    secondary: "oklch(0.65 0.22 185)",
    secondaryContent: "oklch(0.98 0.005 185)", // White text on secondary
    accent: "oklch(0.82 0.18 85)",
    accentContent: "oklch(0.18 0.02 85)", // Dark text on accent
    neutral: "oklch(0.38 0.08 280)",
    neutralContent: "oklch(0.96 0.005 280)", // Light text on neutral
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

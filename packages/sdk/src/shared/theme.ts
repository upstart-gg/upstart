import { Type, type Static } from "@sinclair/typebox";
import { StringEnum } from "./utils/schema";

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
    default: {
      type: "stack",
      family: "system-ui",
    },
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
    default: {
      type: "stack",
      family: "system-ui",
    },
  },
);

export const themeSchema = Type.Object({
  id: Type.String({ title: "ID", description: "The unique identifier of the theme" }),
  name: Type.String({ title: "Name", description: "The name of the theme" }),
  description: Type.Optional(
    Type.String({ title: "Description", description: "The description of the theme" }),
  ),
  tags: Type.Optional(
    Type.Array(Type.String({ title: "Tag" }), { title: "Tags", description: "The tags of the theme" }),
  ),

  // Define the theme colors
  colors: Type.Object(
    {
      browserColorScheme: Type.String({
        title: "Browser scheme",
        description: "Color of browser-provided UI. Can be 'light' or 'dark'",
      }),
      primary: Type.String({
        title: "Primary color",
        description: "The brand's primary color.",
      }),
      primaryContent: Type.String({
        title: "Primary content",
        description: "Text color on primary background",
      }),
      secondary: Type.String({
        title: "Secondary color",
        description: "The brand's second most used color",
      }),
      secondaryContent: Type.String({
        title: "Secondary content",
        description: "Text color on secondary background",
      }),
      accent: Type.String({
        title: "Accent color",
        description: "The brand's least used color",
      }),
      accentContent: Type.String({
        title: "Accent content",
        description: "Text color on accent background",
      }),
      neutral: Type.String({
        title: "Neutral color",
        description: "The base neutral color",
      }),
      neutralContent: Type.String({
        title: "Neutral content",
        description: "Text color on neutral background",
      }),
      base100: Type.String({
        title: "Base color",
        description: "Base surface color of page, used for blank backgrounds. Should be very light.",
      }),
      base200: Type.String({
        title: "Base color 2",
        description:
          "Base color, darker shade, to create elevations. Should be darker than base100 but still light.",
      }),
      base300: Type.String({
        title: "Base color 3",
        description:
          "Base color, even more darker shade, to create elevations. Should be darker than base200 but still light.",
      }),
      baseContent: Type.String({
        title: "Base content",
        description: "Foreground content color to use on base colors",
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
      description: "The base font size in pixels. It is safe to keep it as is",
      default: 16,
    }),
    heading: headingFont,
    body: bodyFont,
    alternatives: Type.Optional(
      Type.Array(
        Type.Object({
          body: bodyFont,
          heading: headingFont,
        }),
        {
          title: "Alternative fonts",
          description: "Alternative fonts that can be suggested to the user. Takes the same shape",
        },
      ),
    ),
  }),
});

export type Theme = Static<typeof themeSchema>;
export const themeArray = Type.Array(themeSchema);
export type ThemeArray = Static<typeof themeArray>;
export type FontType = Theme["typography"]["body"];

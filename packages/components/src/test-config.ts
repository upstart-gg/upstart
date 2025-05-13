import { Type } from "@sinclair/typebox";
import { defineDataSources } from "@upstart.gg/sdk/datasources";
import { defineAttributes } from "@upstart.gg/sdk/attributes";
import { defineConfig } from "@upstart.gg/sdk/template";
import type { Theme } from "@upstart.gg/sdk/shared/theme";
import { type Brick, processBrick, processSections } from "@upstart.gg/sdk/shared/bricks";
import { preset } from "@upstart.gg/sdk/shared/bricks/props/preset";

// define your datasources
const datasources = defineDataSources({
  links: {
    provider: "internal-links",
    name: "Links",
    sampleData: [
      { title: "Enpage", url: "https://enpage.co" },
      { title: "Github", url: "https://github.com/upstart-gg/upstart" },
      { title: "Developers docs", url: "https://developers.enpage.co" },
    ],
  },
  tasks: {
    name: "Tasks",
    provider: "http-json",
    options: {
      url: "https://jsonplaceholder.typicode.com/todos?userId=1",
    },
    schema: Type.Array(
      Type.Object({
        id: Type.Number(),
        userId: Type.Number(),
        title: Type.String(),
        description: Type.Optional(Type.String()),
        completed: Type.Boolean(),
      }),
    ),
  },

  videos: {
    provider: "youtube-list",
    options: {
      channelId: "UCJbPGzawDH1njbqV-D5HqKw",
      maxResults: 10,
    },
    description: "List of videos from a Youtube playlist",
    name: "My Videos",
  },
});

const contentBricks: Brick[] = [
  {
    id: "b-hero",
    type: "container",
    props: {
      $children: [
        {
          id: "b-hero-1",
          type: "text",
          props: {
            content: "Some text #1",
            backgroundColor: "bg-primary",
            color: "text-primary-content",
          },
        },
        {
          id: "b-hero-2",
          type: "text",
          props: {
            content: "Some text #2",
            backgroundColor: "bg-secondary",
            color: "text-secondary-content",
          },
        },
        {
          id: "b-hero-3",
          type: "button",
          props: {
            variants: ["btn-primary", "btn-soft"],
            label: "My button",
          },
        },
      ] satisfies Brick[],
    },
  },
  {
    id: "b-hero-xyz",
    type: "text",
    props: {
      content: "Some specific content",
    },
  },
  {
    id: "b-hero-abc",
    type: "text",
    props: {
      content: "Some specific content 2",
    },
  },
  {
    id: "b-hero-4",
    type: "text",
    props: {
      textContent: "Footer text",
    },
  },
];

const homePageSections = processSections([
  {
    id: "header",
    label: "Header",
    order: 0,
    props: {
      preset: "bold-primary",
      // horizontalPadding: "10px",
    },
    bricks: [
      {
        id: "b-header",
        type: "navbar",
        props: {
          preset: "bold-primary",
          container: {},
          navigation: {},
          brand: {
            name: "Upstart",
          },
        },
      },
    ],
  },
  {
    id: "content",
    label: "Content",
    order: 1,
    props: {
      horizontalPadding: "20px",
      verticalPadding: "20px",
      minHeight: "500px",
      preset: "bold-primary",
      background: {
        color: "bg-secondary/20",
      },
    },
    bricks: contentBricks,
  },
  {
    id: "footer",
    label: "Footer",
    order: 2,
    props: {
      preset: "bold-primary",
      background: {
        color: "#CCCCCC",
      },
    },
    bricks: [],
  },
]);

const themes: Theme[] = [
  {
    id: "aurora",
    name: "Aurora",
    description: "Vibrant gradients with ethereal color transitions",
    tags: ["gradient", "vibrant", "modern", "creative", "dynamic", "artistic", "bold"],
    browserColorScheme: "light",
    // use oklch for all colors
    colors: {
      // Base colors (light backgrounds with subtle warmth)
      base100: "oklch(0.99 0.005 85)", // Warm white background
      base200: "oklch(0.97 0.008 85)", // Soft cream
      base300: "oklch(0.94 0.01 85)", // Light warm gray

      // Content colors (dark text)
      baseContent: "oklch(0.18 0.025 80)", // Rich dark brown-gray

      // Primary colors (vibrant pink/magenta)
      primary: "oklch(0.68 0.28 340)",
      primaryContent: "oklch(0.99 0.005 340)", // White text on primary

      // Secondary colors (electric teal)
      secondary: "oklch(0.65 0.22 185)",
      secondaryContent: "oklch(0.98 0.005 185)", // White text on secondary

      // Accent colors (sunny yellow-orange)
      accent: "oklch(0.82 0.18 85)",
      accentContent: "oklch(0.18 0.02 85)", // Dark text on accent

      // Neutral colors (cool violet-gray)
      neutral: "oklch(0.38 0.08 280)",
      neutralContent: "oklch(0.96 0.005 280)", // Light text on neutral
    },
    typography: {
      base: 16,
      heading: { type: "stack", family: "system-ui" },
      body: { type: "stack", family: "system-ui" },
      alternatives: [
        {
          heading: {
            type: "stack",
            family: "transitional",
          },
          body: {
            type: "stack",
            family: "humanist",
          },
        },
      ],
    },
  },
];

// define your attributes
const siteAttributes = defineAttributes({
  // mainButtonUrl: attr.url("Main Button URL", "https://facebook.com", {
  //   "ui:group": "other",
  //   "ui:group:title": "Other",
  // }),
  // customerId: attr.string("Customer ID", "", {
  //   "ui:group": "other",
  //   "ui:group:title": "Other",
  // }),
  // testUrl: attr.url("Test URL", "https://upstart.gg"),
});

export default defineConfig({
  manifest: {
    name: "Test site",
  },
  attributes: siteAttributes,
  attr: {
    $pageBackground: {
      color: "bg-base-200",
    },
  },
  pages: [
    {
      label: "Home",
      path: "/",
      sections: homePageSections,
      tags: ["nav"],
    },
    {
      label: "About",
      path: "/about",
      sections: homePageSections,
      tags: ["nav"],
    },
  ],
  themes,
  datasources,
});

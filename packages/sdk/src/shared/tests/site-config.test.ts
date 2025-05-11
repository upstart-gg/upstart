import { Type as ds, Type } from "@sinclair/typebox";
import { defineDataSources } from "../datasources";
import { defineAttributes, attr } from "../attributes";
import { processSections } from "../bricks";
import { defineConfig } from "../template";
import type { Theme } from "../theme";

// define your datasources
const datasources = defineDataSources({
  links: {
    provider: "internal-links",
    name: "Links",
    sampleData: [
      { title: "Upstart", url: "https://upstart.gg" },
      { title: "Github", url: "https://github.com/upstart-gg/upstart" },
      { title: "Developers docs", url: "https://developers.upstart.gg" },
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

const homePageSections = processSections([
  {
    id: "header",
    label: "Header",
    order: 0,
    props: {
      preset: "bold-accent",
      horizontalPadding: "20px",
      verticalPadding: "20px",
    },
    bricks: [
      {
        id: "brick-header",
        type: "header",
        props: {
          container: {
            backgroundColor: "bg-secondary-900",
          },
          brand: {
            name: "Upstart",
            color: "color-auto",
          },
        },
      },
      {
        id: "brick-nav",
        type: "container",
        props: {
          $children: [
            {
              type: "text",
              props: {
                content: "Some text #1",
                backgroundColor: "bg-green-100",
              },
            },
            {
              type: "text",
              props: {
                content: "Some text #2",
                backgroundColor: "bg-blue-100",
              },
            },
            {
              type: "text",
              props: {
                content: "Some text #3",
                backgroundColor: "bg-pink-100",
              },
            },
          ],
        },
      },
    ],
  },
  {
    id: "content",
    label: "Content",
    order: 1,
    props: {
      background: {
        color: "#FFDD55",
      },
      preset: "bold-accent",
    },
    bricks: [
      {
        id: "brick-hero",
        type: "text",
        props: {
          content: "Some specific content",
        },
      },
      {
        id: "brick-hero-2",
        type: "text",
        props: {
          content: "Some specific content 2",
        },
      },
    ],
  },
  {
    id: "footer",
    label: "Footer",
    order: 2,
    props: {
      preset: "bold-accent",
      background: {
        color: "#CCCCCC",
      },
    },
    bricks: [
      {
        id: "brick-footer",
        type: "text",
        props: {
          textContent: "Footer text",
        },
      },
    ],
  },
]);

const themes: Theme[] = [
  {
    id: "aurora",
    name: "Aurora",
    description: "Vibrant gradients with ethereal color transitions",
    tags: ["gradient", "vibrant", "modern", "creative", "dynamic", "artistic", "bold"],
    browserColorScheme: "light",
    colors: {
      primary: "#2F5ABF",
      secondary: "#50C5B7",
      accent: "#533A71",
      neutral: "#4b5563", // Grey
      neutralContent: "#F3F4F6", //
      base100: "#FFFFFF", // White
      base200: "#F3F4F6", // Grey
      base300: "#E5E7EB", // Grey
      primaryContent: "#FFFFFF", // White
      secondaryContent: "#FFFFFF", // White
      accentContent: "#FFFFFF", // White
      baseContent: "#111827", // Grey
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
  mainButtonUrl: attr.url("Main Button URL", "https://facebook.com", {
    "ui:group": "other",
    "ui:group:title": "Other",
  }),
  customerId: attr.string("Customer ID", "", {
    "ui:group": "other",
    "ui:group:title": "Other",
  }),
  testUrl: attr.url("Test URL", "https://upstart.gg"),
});

export default defineConfig({
  manifest: {
    name: "Upstart SDK Test",
  },
  attributes: siteAttributes,
  attr: {
    $pageBackground: {
      color: "#FFFFFF",
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

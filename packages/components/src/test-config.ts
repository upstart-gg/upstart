import { Type } from "@sinclair/typebox";
import { defineDataSources } from "@upstart.gg/sdk/datasources";
import { defineAttributes, attr } from "@upstart.gg/sdk/attributes";
import { defineConfig } from "@upstart.gg/sdk/page";
import type { Theme } from "@upstart.gg/sdk/shared/theme";
import { defineSections } from "@upstart.gg/sdk/shared/bricks";

// define your datasources
const datasources = defineDataSources({
  links: {
    provider: "internal-links",
    name: "Links",
    schema: Type.Array(
      Type.Object({
        title: Type.String(),
        url: Type.String({ format: "uri", pattern: "^https?://" }),
        icon: Type.Optional(Type.String()),
      }),
    ),
    sampleData: [
      { title: "Enpage", url: "https://enpage.co" },
      { title: "Github", url: "https://github.com/enpage/enpage" },
      { title: "Developers docs", url: "https://developers.enpage.co" },
    ],
  },
  tasks: {
    name: "Tasks",
    provider: "json",
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
  posts: {
    name: "Posts",
    provider: "facebook-posts",
    options: {
      limit: 5,
      refreshInterval: 60 * 60 * 1000,
    },
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

const homePageSections = defineSections([
  {
    id: "header",
    label: "Header",
    bricks: [
      {
        type: "image",
        props: {
          url: "https://placehold.co/400x200",
          alt: "Enpage",
        },
        position: {
          mobile: {
            x: 0,
            y: 0,
            w: "full",
            h: 3,
          },
          desktop: {
            x: 0,
            y: 0,
            w: "full",
            h: 3,
          },
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
    colors: {
      primary: "#FF9900",
      secondary: "#2dd4bf", // Teal
      accent: "#ec4899", // Pink
      neutral: "#4b5563", // Grey
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
  testBoolTrue: attr.boolean("Test Bool True", true, {
    "ui:group": "other",
    "ui:group:title": "Other",
  }),
  customerId: attr.string("Customer ID", "", {
    "ui:group": "other",
    "ui:group:title": "Other",
  }),
  testUrl: attr.url("Test URL", "https://enpage.co"),
});

export default defineConfig({
  attributes: siteAttributes,
  attr: {
    $textColor: "#fff",
    $pageBackground: {
      color: "#0B1016",
      image: "/earth-big.jpg",
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

import { Type as ds } from "@sinclair/typebox";
import { defineDataSources } from "../datasources";
import { defineAttributes, attr } from "../attributes";
import { defineBricks, createRow } from "../bricks";
import { defineConfig } from "../page";
import type { Theme } from "../theme";

// define your datasources
const datasources = defineDataSources({
  links: {
    provider: "custom",
    name: "Links",
    schema: ds.Array(
      ds.Object({
        title: ds.String(),
        url: ds.String({ format: "uri", pattern: "^https?://" }),
        icon: ds.Optional(ds.String()),
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
    schema: ds.Array(
      ds.Object({
        id: ds.Number(),
        userId: ds.Number(),
        title: ds.String(),
        completed: ds.Boolean(),
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

const homePageBricks = defineBricks([
  ...createRow([
    {
      type: "image",
      props: {
        src: "https://cdn.upstart.gg/internal/logo/upstart.svg",
        // className: "max-h-24",
      },
      position: {
        mobile: {
          x: 0,
          w: "full",
          h: 3,
        },
        desktop: {
          x: 0,
          w: "full",
          h: 3,
        },
      },
    },
  ]),
  ...createRow([
    {
      type: "text",
      props: {
        content: "Build your launch page",
        className: "text-center font-humanist",
      },
      // take the whole width on all devices
      position: {
        mobile: {
          x: 0,
          w: "full",
          h: 4,
        },
        desktop: {
          x: 0,
          y: 4,
          w: "full",
          h: 4,
        },
      },
    },
  ]),
  ...createRow([
    {
      type: "text",
      props: {
        textContent:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus ornare justo lectus, vel placerat arcu vulputate scelerisque. Donec eget eros pellentesque, facilisis massa id, aliquam nisl. Suspendisse auctor ipsum vitae volutpat cursus. Donec vehicula urna felis, feugiat iaculis metus luctus varius. Nam sed pretium nulla.",
      },
      position: {
        mobile: {
          x: 0,
          w: "full",
          h: 8,
        },
        desktop: {
          x: 0,
          w: "full",
          h: 3,
        },
      },
    },
  ]),
  ...createRow([
    {
      type: "text",
      props: { textContent: "Something" },
      position: {
        mobile: {
          x: "third",
          w: "full",
          h: 3,
        },
        desktop: {
          x: "third",
          w: "third",
          h: 3,
        },
      },
    },
    {
      type: "text",
      props: { textContent: "Else" },
      position: {
        mobile: {
          x: "twoThird",
          w: "full",
          h: 3,
        },
        desktop: {
          x: "twoThird",
          w: "third",
          h: 3,
        },
      },
    },
  ]),
]);

const themes: Theme[] = [
  {
    id: "aurora",
    name: "Aurora",
    description: "Vibrant gradients with ethereal color transitions",
    tags: ["gradient", "vibrant", "modern", "creative", "dynamic", "artistic", "bold"],

    colors: {
      primary: "#7c3aed", // Purple
      secondary: "#2dd4bf", // Teal
      // Cyan
      accent: "#ec4899", // Pink
      neutral: "#4b5563", // Grey
    },
    typography: {
      base: 16,
      heading: { type: "stack", family: "neo-grotesque" },
      body: { type: "stack", family: "geometric-humanist" },
    },
  },
];

// define your attributes
const attributes = defineAttributes({
  mainButtonUrl: attr.url("Main Button URL", "https://facebook.com"),
  testBoolTrue: attr.boolean("Test Bool True", true),
  customerId: attr.string("Customer ID"),
  testUrl: attr.url("Test URL", "https://enpage.co"),
});

export default defineConfig({
  attributes,
  pages: [
    {
      label: "Home",
      path: "/",
      bricks: homePageBricks,
      tags: [],
    },
  ],
  themes,
  datasources,
  manifest: {
    author: "John Doe",
    name: "Example Template",
    description: "Description of the template",
    homepage: "https://enpage.co",
  },
});

// @ts-check
import { Type } from "@sinclair/typebox";
import { defineDataSources } from "@upstart.gg/sdk/datasources";
import { defineAttributes, attr } from "@upstart.gg/sdk/attributes";
import { defineBricks, createRow } from "@upstart.gg/sdk/bricks";
import { defineConfig } from "@upstart.gg/sdk/page";
import { FirstBlock, SecondBlock } from "./test-comp";
import type { Theme } from "@upstart.gg/sdk/shared/theme";

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

const homePageBricks = defineBricks([
  ...createRow([
    {
      type: "container",
      props: {
        children: [
          { type: "text", props: { content: "Hello World #1" } },
          { type: "text", props: { content: "Hello World #2" } },
          { type: "text", props: { content: "Hello World #3" } },
        ],
      },
      position: {
        mobile: {
          x: 0,
          w: "full",
          h: 10,
        },
        desktop: {
          x: 0,
          w: "full",
          h: 16,
        },
      },
    },
  ]),
  ...createRow([
    {
      type: "hero",
      props: {
        content:
          "<h1 style='text-align:center'>Reach the stars.<br />Book your next trip<br />to Space.</h1>",
        // className:
        //   "capitalize flex font-bold text-[2.2rem] leading-[1] @desktop:text-7xl justify-center items-center text-center [text-shadow:_2px_2px_5px_rgb(0_0_0_/_40%)]",
      },
      position: {
        mobile: {
          x: 0,
          w: "full",
          h: 10,
        },
        desktop: {
          x: 0,
          forceY: 18,
          w: "half",
          h: 16,
        },
      },
    },
  ]),

  ...createRow([
    {
      type: "generic-component",
      props: {
        render: FirstBlock,
      },
      position: {
        mobile: {
          x: 0,
          forceY: 10,
          w: "full",
          h: 36,
        },
        desktop: {
          x: 2,
          forceY: 40,
          w: 15,
          h: 20,
        },
      },
    },
    {
      type: "generic-component",
      props: {
        render: SecondBlock,
      },
      position: {
        mobile: {
          x: 0,
          w: "full",
          forceY: 47,
          h: 36,
        },
        desktop: {
          x: 19,
          forceY: 40,
          w: 15,
          h: 20,
        },
      },
    },
  ]),
  ...createRow([
    {
      type: "text",
      props: {
        content:
          "&laquo; The lunar view of Earth changed my perspective forever.<br />An unforgettable experience &raquo;<br /><small>- John Doe</small>",
        className: "text-center text-3xl italic",
        format: "html",
      },
      position: {
        mobile: {
          x: 0,
          w: "full",
          forceY: 85,
          h: 8,
        },
        desktop: {
          x: 3,
          w: 28,
          h: 6,
          forceY: 62,
        },
      },
    },
  ]),
  ...createRow([
    {
      type: "text",
      props: {
        content: " ",
        justify: "text-center",
        format: "html",
      },
      position: {
        mobile: {
          x: 0,
          w: "full",
          forceY: 98,
          h: 1,
        },
        desktop: {
          x: 3,
          w: 28,
          h: 3,
          forceY: 68,
        },
      },
    },
  ]),
  // ]),
  // ...createRow([
  //   {
  //     type: "card",
  //     props: {
  //       // justify: "text-center",
  //       // format: "html",
  //       body: { content: "Card body" },
  //       title: { content: "Card title" },
  //       // footer: "Card footer",
  //     },
  //     position: {
  //       mobile: {
  //         x: 0,
  //         w: "full",
  //         h: 8,
  //       },
  //       desktop: {
  //         x: 0,
  //         w: "full",
  //         h: 3,
  //       },
  //     },
  //   },
  // ]),
  // ...createRow([
  //   {
  //     type: "text",
  //     props: {
  //       content: {
  //         text: "Build your launch page",
  //         richText: true,
  //       },
  //     },
  //     position: {
  //       mobile: {
  //         x: "third",
  //         w: "full",
  //         h: 3,
  //       },
  //       desktop: {
  //         x: "third",
  //         w: "third",
  //         h: 3,
  //       },
  //     },
  //   },
  //   {
  //     type: "text",
  //     props: {
  //       content: {
  //         text: "Build your launch page",
  //       },
  //     },
  //     position: {
  //       mobile: {
  //         x: "twoThird",
  //         w: "full",
  //         h: 3,
  //       },
  //       desktop: {
  //         x: "twoThird",
  //         w: "third",
  //         h: 3,
  //       },
  //     },
  //   },
  // ]),
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
      // Cyan
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
      bricks: homePageBricks,
      tags: ["nav"],
    },
    {
      label: "About",
      path: "/about",
      bricks: homePageBricks,
      tags: ["nav"],
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

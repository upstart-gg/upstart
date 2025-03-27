import { Type } from "@sinclair/typebox";
import { defineDataSources } from "@upstart.gg/sdk/datasources";
import { defineAttributes, attr } from "@upstart.gg/sdk/attributes";
import { defineConfig } from "@upstart.gg/sdk/page";
import type { Theme } from "@upstart.gg/sdk/shared/theme";
import { defineBricks, defineSections } from "@upstart.gg/sdk/shared/bricks";
import { color } from "@upstart.gg/sdk/shared/bricks/props/text";
import { backgroundColor } from "@upstart.gg/sdk/shared/bricks/props/background";

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
      { title: "Github", url: "https://github.com/upstart-gg/upstart" },
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
    order: 0,
    props: {
      $paddingHorizontal: 20,
    },
    position: {
      mobile: {
        h: 3,
      },
      desktop: {
        h: "full",
      },
    },
  },
  {
    id: "content",
    label: "Content",
    order: 1,
    props: {
      background: {
        color: "#FFDD55",
      },
    },
    position: {
      mobile: {
        h: "full",
      },
      desktop: {
        h: "full",
      },
    },
  },
  {
    id: "footer",
    label: "Footer",
    order: 2,
    props: {
      background: {
        color: "#CCCCCC",
      },
    },
    position: {
      mobile: {
        h: 3,
      },
      desktop: {
        h: 3,
      },
    },
  },
]);

const hpBricks = defineBricks([
  {
    type: "header",
    sectionId: "header",
    props: {
      container: {
        backgroundColor: "bg-secondary-900",
      },
      brand: {
        name: "Upstart",
        color: "color-auto",
      },
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
  {
    type: "container",
    sectionId: "header",
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
    position: {
      mobile: {
        x: 0,
        y: 8,
        w: "full",
        h: 8,
      },
      desktop: {
        x: 6,
        y: 8,
        w: "twoThird",
        h: 8,
      },
    },
  },
  {
    type: "text",
    sectionId: "content",
    props: {
      content: "Some specific content",
    },
    position: {
      mobile: {
        x: "quarter",
        y: 0,
        w: "half",
        h: 3,
      },
      desktop: {
        x: "quarter",
        y: 0,
        w: "half",
        h: 3,
      },
    },
  },
  {
    type: "text",
    sectionId: "content",
    props: {
      content: "Some specific content 2",
    },
    position: {
      mobile: {
        x: "quarter",
        y: 6,
        w: "half",
        h: 3,
      },
      desktop: {
        x: "quarter",
        y: 6,
        w: "half",
        h: 3,
      },
    },
  },
  {
    type: "text",
    sectionId: "footer",
    props: {
      textContent: "Footer text",
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
]);

const themes: Theme[] = [
  {
    id: "aurora",
    name: "Aurora",
    description: "Vibrant gradients with ethereal color transitions",
    tags: ["gradient", "vibrant", "modern", "creative", "dynamic", "artistic", "bold"],
    colors: {
      primary: "#2F5ABF",
      secondary: "#50C5B7",
      accent: "#533A71",
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
  customerId: attr.string("Customer ID", "", {
    "ui:group": "other",
    "ui:group:title": "Other",
  }),
  testUrl: attr.url("Test URL", "https://upstart.gg"),
});

export default defineConfig({
  attributes: siteAttributes,
  attr: {
    $textColor: "#222",
    $pageBackground: {
      color: "#FFFFFF",
    },
  },
  pages: [
    {
      label: "Home",
      path: "/",
      sections: homePageSections,
      bricks: hpBricks,
      tags: ["nav"],
    },
    {
      label: "About",
      path: "/about",
      sections: homePageSections,
      bricks: hpBricks,
      tags: ["nav"],
    },
  ],
  themes,
  datasources,
});

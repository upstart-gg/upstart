import { Type, type Static } from "@sinclair/typebox";
import { StringEnum } from "./utils/string-enum";
import { pageSchema } from "./page";

export const pageInfoSchema = Type.Pick(pageSchema, ["id", "label", "path"]);
export type PageInfo = Static<typeof pageInfoSchema>;

export const sectionsPlanSchema = Type.Array(
  Type.Object(
    {
      id: Type.String({ title: "Section ID (slug format)" }),
      name: Type.String({ title: "Section name" }),
      description: Type.String({
        title: "A long description of the section",
        description: `You must elaborate a clear and detailled plan that describes:
- The section purpose in the page, in detail.
- The section structure, look & feel, and structural/design organization, in detail
- the types of bricks (e.g. "container", "text", "video", "carousel", etc) that will be used and their purpose, in detail

IMPORTANT: be very descriptive and precise in your plan. The more details you provide, the better the generated page will be.`,
      }),
    },
    { additionalProperties: false },
  ),
  {
    title: "Sections plan",
    description: "A plan for the sections of the page. Used to generate the page content.",
  },
);

export const sitemapEntry = Type.Composite(
  [
    pageInfoSchema,
    Type.Object({
      tags: Type.Array(Type.String(), {
        default: [],
        description:
          "Tags for the page. Use the tag 'main-nav' for pages that should appear in the main navbar",
      }),
      status: Type.Optional(
        StringEnum(["draft", "published"], {
          title: "Page status",
          enumNames: ["Draft", "Published"],
          description:
            "The status of the page. Can be draft or published. [AI instructions: Dont generate this.]",
          "ai:instructions": "Do not generate this.",
        }),
      ),
      sectionsPlan: sectionsPlanSchema,
    }),
  ],
  {
    description: "Pages map. The complete list of site pages, their metadata and their sections summary",
    additionalProperties: false,
  },
);
export const sitemapSchema = Type.Array(sitemapEntry);

export type Sitemap = Static<typeof sitemapSchema>;

import { Type, type Static } from "@sinclair/typebox";
import { StringEnum } from "./utils/string-enum";
import { pageSchema } from "./page";
import { toLLMSchema } from "./utils/llm";

export const sitemapPageEntry = Type.Pick(pageSchema, ["id", "label", "path", "attributes"]);
export type SitemapPageEntry = Static<typeof sitemapPageEntry>;

export const sectionsPlanSchema = Type.Array(
  Type.Object(
    {
      id: Type.String({
        title: "Section ID",
        examples: ["header-section", "hero-section", "features-section"],
        format: "slug",
      }),
      name: Type.String({ title: "Section name", examples: ["Header", "Hero", "Features"] }),
      description: Type.String({
        title: "A long description of the section",
        description: `You must elaborate a clear and detailled plan that describes:
- The section purpose in the page, in detail.
- The section structure, look & feel, and structural/design organization, in detail
- the types of bricks (e.g. "container", "text", "video", "carousel", etc) that will be used and their purpose, in detail

IMPORTANT: be very descriptive and precise in your plan. The more details you provide, the better the generated page will be.`,

        examples: [
          "This section contains a `hero` and a call-to-action `button`. All of theme aligned horizontally. The section should market a coffee shop.",
          "This section should contain a `hero` text and an `image`.",
        ],
      }),
    },
    { additionalProperties: false },
  ),
  {
    title: "Sections plan",
    description: "A plan for the sections of the page. Used to generate the page content.",
    examples: [
      [
        {
          id: "header-section",
          name: "Header",
          description: "This section only contains a header brick",
        },
        {
          id: "hero-section",
          name: "Hero",
          description:
            "This is the hero section of the page. It should display a marketing message using a hero brick, as well as a button (CTA). The section should center bricks horizontally.",
        },
      ],
    ],
  },
);

export const sitemapEntry = Type.Composite(
  [
    sitemapPageEntry,
    Type.Object({
      status: Type.Optional(
        StringEnum(["draft", "published"], {
          title: "Page status",
          enumNames: ["Draft", "Published"],
          default: "draft",
          "ai:hidden": true,
          description:
            "The status of the page. Can be draft or published. [AI instructions: Dont generate this.]",
          "ai:instructions": "Upsie: Never generate this optional field.",
        }),
      ),
    }),
  ],
  {
    description: "Pages map. The complete list of site pages & their metadata",
    additionalProperties: false,
  },
);

export const sitemapSchema = Type.Array(sitemapEntry);
export type Sitemap = Static<typeof sitemapSchema>;

export const sitemapSchemaLLM = toLLMSchema(
  Type.Array(
    Type.Composite([
      sitemapEntry,
      Type.Object({
        // Sections plan helps agents to the structure and content of the page
        sectionsPlan: sectionsPlanSchema,
      }),
    ]),
  ),
);

export type SitemapWithPlans = Static<typeof sitemapSchemaLLM>;

export const sitemapSchemaNoPlansLLM = toLLMSchema(sitemapSchema);

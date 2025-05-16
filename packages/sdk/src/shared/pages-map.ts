import { Type, type Static } from "@sinclair/typebox";
import { StringEnum } from "./utils/schema";

export const pageInfoSchema = Type.Object({
  id: Type.String({ title: "Page UUID" }),
  label: Type.String(),
  path: Type.String(),
});

export type PageInfo = Static<typeof pageInfoSchema>;

export const pagesMapSchema = Type.Array(
  Type.Composite([
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
      sectionsPlan: Type.Array(
        Type.Object({
          id: Type.String({ title: "Section ID (slug format)" }),
          name: Type.String({ title: "Section name" }),
          description: Type.String({
            title: "A long description of the section",
            description: `You must elaborate a clear and detailled plan that describes:
- the section purpose in the page, in detail
- the section structure, look & feel, and structural/design organization, in detail
- the types of bricks (e.g. "container", "text", "video", "carousel", etc) and count that will be used and their purpose, in detail

All these information will be used in a later prompt to generate the section content`,
            minLength: 300,
          }),
        }),
        {
          minItems: 3,
          maxItems: 6,
        },
      ),
    }),
  ]),
);

export type PagesMap = Static<typeof pagesMapSchema>;

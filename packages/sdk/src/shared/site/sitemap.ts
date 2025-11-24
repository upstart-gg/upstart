import { Type, type Static } from "@sinclair/typebox";
import { StringEnum } from "../utils/string-enum";
import { pageSchema } from "./page";
import { pageAttributesSchema } from "./attributes";

export const sitemapEntry = Type.Composite(
  [
    Type.Pick(pageSchema, ["id", "label"]),
    Type.Pick(pageAttributesSchema, ["path", "tags"]),
    Type.Object({
      status: Type.Optional(
        StringEnum(["draft", "published"], {
          title: "Page status",
          enumNames: ["Draft", "Published"],
          default: "draft",
          "ai:hidden": true,
          description:
            "The status of the page. Can be draft or published. [AI instructions: Dont generate this.]",
        }),
      ),
      isInitialPage: Type.Optional(
        Type.Boolean({
          title: "Is initial page",
          "ai:hidden": true,
        }),
      ),
    }),
  ],
  {
    description: "Pages map. The complete list of site pages & their metadata",
    additionalProperties: true,
  },
);

export const sitemapSchema = Type.Array(sitemapEntry);
export type Sitemap = Static<typeof sitemapSchema>;

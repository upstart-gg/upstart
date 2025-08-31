import { pageAttributesSchema } from "./attributes";
import { sectionSchema } from "./bricks";
import { Type, type Static } from "@sinclair/typebox";

export const pageSchema = Type.Object({
  id: Type.String({ description: "The unique ID of the page. Use a human readable url-safe slug" }),
  label: Type.String({ description: "The label (name) of the page" }),
  path: Type.String({ description: "The path of the page in the URL. Should be unique" }),
  sections: Type.Array(sectionSchema, {
    description: "The sections of the page. See the Section schema",
  }),
  attributes: pageAttributesSchema,
});

export type Page = Static<typeof pageSchema>;

export type VersionedPage = Page & { version: string };

/**
 * Page context represents the page config PLUS:
 * - the pathParams of the actual request.
 * - the resolved data for the page.
 */
export type PageContext = VersionedPage & {
  pathParams?: Record<string, string>;
  data?: Record<string, unknown[]>;
};

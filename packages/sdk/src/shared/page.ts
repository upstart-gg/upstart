import { pageAttributesSchema } from "./attributes";
import { sectionSchema } from "./bricks";
import { Type, type Static } from "@sinclair/typebox";

export const pageSchema = Type.Object({
  id: Type.String({
    description: "The unique ID of the page. Use a human readable url-safe slug",
    examples: ["home", "about-us", "products-list"],
    pattern: "^[a-z0-9-_]+$",
  }),
  label: Type.String({
    description: "The label (name) of the page",
    examples: ["Home", "About us", "Products"],
  }),
  sections: Type.Array(sectionSchema, {
    description: "The sections of the page. See the Section schema",
  }),
  attributes: pageAttributesSchema,
});

export type Page = Static<typeof pageSchema>;

export const versionedPageSchema = Type.Composite([
  pageSchema,
  Type.Object({
    version: Type.String(),
  }),
]);

export type VersionedPage = Static<typeof versionedPageSchema>;

/**
 * Page context represents the page config PLUS:
 * - the pathParams of the actual request.
 * - the resolved data for the page.
 */
export type PageContext = VersionedPage & {
  pathParams?: Record<string, string>;
  data?: Record<string, unknown[]>;
};

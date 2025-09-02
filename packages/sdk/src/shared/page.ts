import { pageAttributesSchema } from "./attributes";
import { sectionSchema } from "./bricks";
import { Type, type Static } from "@sinclair/typebox";
import { toLLMSchema } from "./utils/schema";

export const pageSchema = Type.Object({
  id: Type.String({
    description: "The unique ID of the page. Use a human readable url-safe slug",
    examples: ["home", "about-us", "products-list"],
  }),
  label: Type.String({
    description: "The label (name) of the page",
    examples: ["Home", "About us", "Products"],
  }),
  // path: Type.String({
  //   description: "The path of the page in the URL. Should be unique",
  //   pattern: "^/[a-z0-9\\-:/]+$",
  //   examples: ["/", "/about", "/products/:id"],
  // }),
  sections: Type.Array(sectionSchema, {
    description: "The sections of the page. See the Section schema",
  }),
  attributes: pageAttributesSchema,
});

export const pageSchemaLLM = toLLMSchema(pageSchema);

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

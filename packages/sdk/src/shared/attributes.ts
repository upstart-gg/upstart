import { Type, type Static } from "@sinclair/typebox";
import type { JSONSchemaType } from "ajv";
import { getSchemaDefaults } from "../shared/utils/schema";
import { string } from "./bricks/props/string";
import { boolean } from "./bricks/props/boolean";
import { datetime } from "./bricks/props/date";
import { imageRef } from "./bricks/props/image";
import { colorPresetRef } from "./bricks/props/color-preset";
import { queryUseRef } from "./bricks/props/dynamic";

export type { JSONSchemaType };

// Default attributes
export const pageAttributesSchema = Type.Object({
  color: colorPresetRef({
    title: "Color",
    default: "bg-base-100",
  }),
  robotsIndexing: Type.Optional(
    boolean("Allow search engines to index this site", true, {
      description: "Disabling this will prevent search engines from indexing this site",
      "ui:group": "seo",
      "ui:group:title": "SEO",
      "ai:hidden": true,
    }),
  ),
  path: string("URL path", {
    default: "/",
    description: "The URL path of the page. Use placeholders like :id or :slug for dynamic paths.",
    "ui:group": "location",
    "ui:group:title": "Location",
    "ui:field": "path",
  }),
  queries: Type.Optional(
    Type.Array(queryUseRef(), {
      title: "Queries",
      description:
        "List of queries to use in this page. All listed queries will be executed when the page loads.",
      "ui:scope": "page",
      "ui:field": "query",
      "ai:instructions": "Reference Query IDs to use at the page level.",
      maxItems: 5,
    }),
  ),
  title: string("Title", {
    default: "Untitled",
    "ui:group": "meta",
    "ui:group:title": "Meta tags",
    description: "The title of the page. Appears in the browser tab and search results",
  }),
  description: string("Description", {
    "ui:widget": "textarea",
    "ui:group": "meta",
    "ui:group:title": "Meta tags",
    description: "A short description of the page. Used by search engines",
    "ui:multiline": true,
    "ui:textarea-class": "h-24",
    default: "",
  }),
  keywords: string("Keywords", {
    "ui:group": "meta",
    "ui:group:title": "Meta tags",
    description: "Keywords related to the page. Used by search engines",
    "ui:multiline": true,
    default: "",
  }),
  ogImage: Type.Optional(
    imageRef({
      title: "Social share image",
      description: "Image shown when this page is shared on social media",
      "ai:hidden": true,
      "ui:no-object-options": true,
      "ui:no-alt-text": true,
      "ui:show-img-search": false,
    }),
  ),
  lastUpdated: Type.Optional(
    datetime("Last updated", {
      "ui:hidden": true,
      "ai:guidelines": "Don't generate this property.",
    }),
  ),
});

export const siteAttributesSchema = Type.Object({
  ogImage: Type.Optional(
    imageRef({
      title: "Social share image",
      description: "Image shown when this site is shared on social media",
      "ui:scope": "site",
      "ai:hidden": true,
      "ui:no-object-options": true,
      "ui:no-alt-text": true,
      "ui:show-img-search": false,
    }),
  ),
  headTags: Type.Optional(
    Type.String({
      title: "Head tags",
      description:
        "Add custom tags to the <head> of your site. Useful for analytics tags, custom scripts, etc.",
      "ai:guidelines": "Don't include meta tags here, they are automatically generated.",
      "ui:multiline": true,
      "ui:textarea-class": "h-40 !font-mono",
      "ui:placeholder": "<script src='https://example.com/script.js'></script>",
      "ui:premium": true,
      "ui:textarea-font-size": "1",
      "ui:scope": "site",
      "ui:group": "external-scripts",
      "ui:group:title": "External scripts",
    }),
  ),
  bodyTags: Type.Optional(
    Type.String({
      title: "Body tags",
      description:
        "Add custom tags to the <body> of your site. Useful for analytics tags, custom scripts, etc.",
      "ui:multiline": true,
      "ui:premium": true,
      "ui:textarea-class": "h-40 !font-mono",
      "ui:textarea-font-size": "1",
      "ui:placeholder": "<script src='https://example.com/script.js'></script>",
      "ui:scope": "site",
      "ui:group": "external-scripts",
      "ui:group:title": "External scripts",
    }),
  ),
});

export type PageAttributes = Static<typeof pageAttributesSchema>;
export type SiteAttributes = Static<typeof siteAttributesSchema>;

export function resolvePageAttributes(data: Record<string, unknown> = {}) {
  const defaultAttrValues = getSchemaDefaults(pageAttributesSchema);
  return { ...defaultAttrValues, ...data } as PageAttributes;
}

export function resolveSiteAttributes(data: Record<string, unknown> = {}) {
  const defaultAttrValues = getSchemaDefaults(siteAttributesSchema);
  return { ...defaultAttrValues, ...data } as SiteAttributes;
}

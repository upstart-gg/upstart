import { Type, type Static } from "@sinclair/typebox";
import type { JSONSchemaType } from "ajv";
import { getSchemaDefaults } from "../shared/utils/schema";
import { string } from "./bricks/props/string";
import { boolean } from "./bricks/props/boolean";
import { datetime } from "./bricks/props/date";
import { imageRef } from "./bricks/props/image";
import { colorPresetRef } from "./bricks/props/color-preset";
import { queryUseRef } from "./bricks/props/dynamic";
import { querySchema } from "./datasources/types";
import { group } from "./bricks/props/helpers";
import { StringEnum } from "./utils/string-enum";

export type { JSONSchemaType };

// Default attributes
export const pageAttributesSchema = Type.Object({
  colorPreset: colorPresetRef({
    title: "Color",
    default: { color: "bg-base-100" },
    examples: [
      { color: "base-100" },
      { color: "primary-500" },
      { color: "accent-100", gradientDirection: "bg-gradient-to-r" },
    ],
  }),
  tags: Type.Optional(
    Type.Array(string("Tag"), {
      title: "Tags",
      description:
        "Tags for this page. Used for organization and filtering in navigation elements and in the dashboard.",
      "ui:field": "tags",
      examples: [["navbar", "navbar"], ["navbar", "sidebar"], ["sidebar"]],
    }),
  ),
  path: string("URL path", {
    default: "/",
    description: "The URL path of the page. Use placeholders like :id or :slug for dynamic paths.",
    "ui:group": "location",
    "ui:group:title": "Location",
    "ui:field": "path",
    examples: ["/", "/about", "/products/:id"],
  }),
  queries: Type.Optional(
    Type.Array(queryUseRef(), {
      title: "Page Queries",
      description:
        "List of queries to use in this page. All listed queries will be executed when the page loads.",
      "ai:instructions": "Reference Query IDs to use at the page level.",
      "ui:field": "page-queries",
      maxItems: 5,
    }),
  ),

  title: string("Title", {
    default: "Untitled",
    "ui:group": "meta",
    "ui:group:title": "Meta tags",
    description: "The title of the page. Appears in the browser tab and search results",
    "ui:placeholder": "Page title",
  }),
  description: string("Description", {
    "ui:widget": "textarea",
    "ui:group": "meta",
    "ui:group:title": "Meta tags",
    description: "A short description of the page. Used by search engines",
    "ui:multiline": true,
    "ui:textarea-class": "h-24",
    default: "",
    "ui:placeholder": "A brief description of the page",
  }),
  keywords: string("Keywords", {
    "ui:group": "meta",
    "ui:group:title": "Meta tags",
    description: "Keywords related to the page. Used by search engines",
    "ui:multiline": true,
    default: "",
    "ui:placeholder": "keyword1, keyword2, keyword3",
  }),
  ogImage: Type.Optional(
    imageRef({
      title: "Social share image",
      description: "Image shown when this page is shared on social media",
      "ai:hidden": true,
      "ui:no-object-options": true,
      "ui:no-alt-text": true,
      "ui:show-img-search": false,
      "ui:no-dynamic": true,
      "ui:placeholder": "https://example.com/image.jpg",
    }),
  ),
  robotsIndexing: Type.Optional(
    boolean("Allow search engines to index this page", true, {
      description: "Disabling this will prevent search engines from indexing this page",
      "ai:hidden": true,
    }),
  ),
  language: Type.Optional(
    StringEnum(
      [
        "ar",
        "zh",
        "cs",
        "nl",
        "en",
        "fr",
        "de",
        "he",
        "hi",
        "it",
        "ja",
        "ko",
        "fa",
        "pl",
        "pt",
        "ru",
        "es",
        "tr",
        "vi",
      ],
      {
        "ai:hidden": true,
        title: "Language",
        default: "en",
        description:
          "Overrides the site language for this page. Leave blank to use the site default language.",
        enumNames: [
          "Arabic",
          "Chinese",
          "Czech",
          "Dutch",
          "English",
          "French",
          "German",
          "Hebrew",
          "Hindi",
          "Italian",
          "Japanese",
          "Korean",
          "Persian",
          "Polish",
          "Portuguese",
          "Russian",
          "Spanish",
          "Turkish",
          "Vietnamese",
        ],
      },
    ),
  ),
  additionalTags: Type.Optional(
    group({
      title: "Additional script tags",
      children: {
        headTags: Type.Optional(
          Type.String({
            title: "Head script tags",
            description:
              "Add custom tags to the <head> of your site. Useful for analytics tags, custom scripts, etc.",
            "ai:instructions": "Don't include meta tags here, they are automatically generated.",
            "ui:multiline": true,
            "ui:textarea-class": "h-40 !font-mono",
            "ui:placeholder": "<script src='https://example.com/script.js'></script>",
            "ui:premium": true,
            "ui:textarea-font-size": "1",
            "ui:group": "external-scripts",
            "ui:group:title": "External scripts",
            "ui:no-dynamic": true,
          }),
        ),
        bodyTags: Type.Optional(
          Type.String({
            title: "Body script tags",
            description:
              "Add custom tags to the <body> of your site. Useful for analytics tags, custom scripts, etc.",
            "ui:multiline": true,
            "ui:premium": true,
            "ui:textarea-class": "h-40 !font-mono",
            "ui:textarea-font-size": "1",
            "ui:placeholder": "<script src='https://example.com/script.js'></script>",
            "ui:group": "external-scripts",
            "ui:group:title": "External scripts",
            "ui:no-dynamic": true,
          }),
        ),
      },
    }),
  ),
  lastUpdated: Type.Optional(
    datetime("Last updated", {
      "ui:hidden": true,
      "ai:hidden": true,
    }),
  ),
});

export const siteAttributesSchema = Type.Object({
  queries: Type.Optional(
    Type.Array(querySchema, {
      title: "Site Queries",
      "ui:field": "site-queries",
      description: "List of all queries available in this site. These can be used in any page.",
      "ai:instructions":
        "This is where queries are first defined. They are then referenced in pages attributes to use them.",
    }),
  ),
  language: StringEnum(
    [
      "ar",
      "zh",
      "cs",
      "nl",
      "en",
      "fr",
      "de",
      "he",
      "hi",
      "it",
      "ja",
      "ko",
      "fa",
      "pl",
      "pt",
      "ru",
      "es",
      "tr",
      "vi",
    ],
    {
      title: "Language",
      default: "en",
      enumNames: [
        "Arabic",
        "Chinese",
        "Czech",
        "Dutch",
        "English",
        "French",
        "German",
        "Hebrew",
        "Hindi",
        "Italian",
        "Japanese",
        "Korean",
        "Persian",
        "Polish",
        "Portuguese",
        "Russian",
        "Spanish",
        "Turkish",
        "Vietnamese",
      ],
      "ai:instructions":
        "Choose a value based on the site description. If the site is in multiple languages, use 'en'.",
    },
  ),
  ogImage: Type.Optional(
    imageRef({
      title: "Social share image",
      description: "Image shown when this site is shared on social media",
      "ai:hidden": true,
      "ui:no-object-options": true,
      "ui:no-alt-text": true,
      "ui:show-img-search": false,
      "ui:no-dynamic": true,
    }),
  ),
  robotsIndexing: Type.Optional(
    boolean("Allow search engines to index this site", true, {
      description: "Disabling this will prevent search engines from indexing this site entirely",
      "ai:hidden": true,
    }),
  ),
  headTags: Type.Optional(
    Type.String({
      title: "Head script tags",
      description:
        "Add custom tags to the <head> of your site. Useful for analytics tags, custom scripts, etc.",
      "ai:hidden": true,
      "ui:multiline": true,
      "ui:textarea-class": "h-40 !font-mono",
      "ui:placeholder": "<script src='https://example.com/script.js'></script>",
      "ui:premium": true,
      "ui:textarea-font-size": "1",
      "ui:group": "external-scripts",
      "ui:group:title": "External scripts",
      "ui:no-dynamic": true,
    }),
  ),
  bodyTags: Type.Optional(
    Type.String({
      title: "Body script tags",
      description:
        "Add custom tags to the <body> of your site. Useful for analytics tags, custom scripts, etc.",
      "ai:hidden": true,
      "ui:multiline": true,
      "ui:premium": true,
      "ui:textarea-class": "h-40 !font-mono",
      "ui:textarea-font-size": "1",
      "ui:placeholder": "<script src='https://example.com/script.js'></script>",
      "ui:group": "external-scripts",
      "ui:group:title": "External scripts",
      "ui:no-dynamic": true,
    }),
  ),
});

export type PageAttributes = Static<typeof pageAttributesSchema>;
export type SiteAttributes = Static<typeof siteAttributesSchema>;

export function resolvePageAttributes(data: Partial<PageAttributes> = {}) {
  const defaultAttrValues = getSchemaDefaults(pageAttributesSchema);
  return { ...defaultAttrValues, ...data } as PageAttributes;
}

export function resolveSiteAttributes(data: Partial<SiteAttributes> = {}) {
  const defaultAttrValues = getSchemaDefaults(siteAttributesSchema);
  return { ...defaultAttrValues, ...data } as SiteAttributes;
}

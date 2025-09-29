import { Type, type Static } from "@sinclair/typebox";
import type { JSONSchemaType } from "ajv";
import { getSchemaDefaults } from "../shared/utils/schema";
import { manifest as navbarManifest } from "./bricks/manifests/navbar.manifest";
import { manifest as footerManifest } from "./bricks/manifests/footer.manifest";
import { boolean } from "./bricks/props/boolean";
import { datetime } from "./bricks/props/date";
import { image } from "./bricks/props/image";
import { colorPreset } from "./bricks/props/color-preset";
import { queryUse, type QueryUseSettings } from "./bricks/props/dynamic";
import { querySchema } from "./datasources/types";
import { StringEnum } from "./utils/string-enum";
import { background } from "./bricks/props/background";
import { toLLMSchema } from "./utils/llm";

export type { JSONSchemaType };

// Default attributes
export const pageAttributesSchema = Type.Object(
  {
    backgroundImage: Type.Optional(background()),
    colorPreset: Type.Optional(
      colorPreset({
        examples: [
          { color: "base-100" },
          { color: "primary-500" },
          { color: "accent-100", gradientDirection: "bg-gradient-to-r" },
        ],
      }),
    ),
    tags: Type.Array(Type.String({ description: "A tag for the page. Should be url-safe." }), {
      title: "Tags",
      description:
        "Use tags to organize, group and filter pages in navigation elements and in the dashboard. By default, the navbar element display pages having the 'navbar' tag, while the sidebar displays the pages with the tag 'sidebar'.",
      "ui:field": "tags",
      examples: [["navbar", "important"], ["navbar", "sidebar"], ["sidebar"], ["campaign-landing-20250610"]],
      maxItems: 8,
      default: [],
    }),
    path: Type.String({
      title: "URL path",
      default: "/",
      description: "The URL path of the page. Use placeholders like :id or :slug for dynamic paths.",
      "ai:instructions": "Never put language codes in the path.",
      "ui:field": "path",
      pattern: "^/[a-z0-9-:/]*$",
      examples: ["/", "/about", "/products/:id"],
    }),
    queries: Type.Array(queryUse(), {
      title: "Page Queries",
      description:
        "List of queries to use in this page. All listed queries will be executed when the page loads.",
      "ai:instructions": "Reference Query IDs to use at the page level.",
      "ui:field": "page-queries",
      maxItems: 8,
      default: [],
    }),
    title: Type.String({
      title: "Title",
      default: "Untitled",
      "ui:group": "meta",
      "ui:group:title": "Meta tags",
      description: "The title of the page. Appears in the browser tab and search results",
      "ui:placeholder": "Page title",
    }),
    description: Type.String({
      title: "Description",
      "ui:widget": "textarea",
      "ui:group": "meta",
      "ui:group:title": "Meta tags",
      description: "A short description of the page. Used by search engines",
      "ui:multiline": true,
      "ui:textarea-class": "h-24",
      default: "",
      "ui:placeholder": "A brief description of the page",
    }),
    keywords: Type.String({
      title: "Keywords",
      "ui:group": "meta",
      "ui:group:title": "Meta tags",
      description: "Keywords related to the page. Used by search engines",
      "ui:multiline": true,
      default: "",
      "ui:placeholder": "keyword1, keyword2, keyword3",
    }),
    ogImage: Type.Optional(
      image({
        title: "Social share image",
        description: "Image shown when this page is shared on social media",
        "ui:group": "meta",
        "ai:hidden": true,
        "ui:no-object-options": true,
        "ui:no-alt-text": true,
        "ui:show-img-search": false,
        "ui:no-dynamic": true,
        "ui:placeholder": "https://example.com/image.jpg",
      }),
    ),
    robotsIndexing: Type.Optional(
      Type.Boolean({
        title: "Allow search engines to index this page",
        default: true,
        description: "Disabling this will prevent search engines from indexing this page",
        "ai:hidden": true,
        "ui:group": "meta",
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
          "ui:group": "meta",
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
      Type.Object(
        {
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
              "ui:no-dynamic": true,
            }),
          ),
        },
        { "ui:group": "meta", "ai:hidden": true },
      ),
    ),
    noNavbar: Type.Optional(
      Type.Boolean({
        title: "Hide navbar",
        default: false,
        "ui:group": "layout",
      }),
    ),
    noFooter: Type.Optional(
      Type.Boolean({
        title: "Hide footer",
        default: false,
        "ui:group": "layout",
      }),
    ),
  },
  {
    "ui:groups": {
      meta: "SEO & Meta tags",
      layout: "Layout",
    },
  },
);

export const pageQueriesSchema = Type.Array(queryUse(), {
  title: "Page Queries",
  description: `List of page queries in use in this page. All listed queries will be executed when the page loads. Aliases must be unique and camelCase'd.
The queryId must reference an existing site query ID.`,
  examples: [
    { queryId: "get-latest-posts", alias: "latestPosts" },
    {
      queryId: "get-user-profile",
      alias: "userProfile",
      params: [{ field: "userId", op: "eq", value: ":slug" }],
    },
    {
      queryId: "list-featured-products",
      alias: "featuredProducts",
    },
    {
      queryId: "get-event-by-slug",
      alias: "eventBySlug",
      params: [{ field: "$slug", op: "eq", value: ":slug" }],
    },
  ] satisfies QueryUseSettings[],
});

export const siteAttributesSchema = Type.Object(
  {
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
        title: "Site language",
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
    backgroundImage: Type.Optional(background()),
    colorPreset: Type.Optional(
      colorPreset({
        examples: [
          { color: "base-100" },
          { color: "primary-500" },
          { color: "secondary-400" },
          { color: "neutral-400" },
          { color: "accent-200-gradient", gradientDirection: "bg-gradient-to-r" },
          { color: "neutral-800-gradient", gradientDirection: "bg-gradient-to-t" },
        ],
      }),
    ),
    queries: Type.Optional(
      Type.Array(querySchema, {
        title: "Site Queries",
        "ui:field": "site-queries",
        description: "List of all queries available in this site. These can be used in any page.",
        "ai:instructions":
          "This is where queries are first defined. They are then referenced in pages attributes (in the 'queries' field) to use them.",
      }),
    ),
    navbar: Type.Optional(
      Type.Composite([navbarManifest.props], {
        title: "Navbar",
        "ui:group": "navbar",
      }),
    ),
    footer: Type.Optional(
      Type.Composite([footerManifest.props], {
        title: "Footer",
        "ui:group": "footer",
        // "ui:hidden": true, // Hidden in attributes panel. Users will have to click the brick to configure it, even if the configuration applies globally, so they have the same editing experience
      }),
    ),
    ogImage: Type.Optional(
      image({
        title: "Social share image",
        description: "Image shown when this site is shared on social media",
        "ai:hidden": true,
        "ui:group": "meta",
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
        "ui:group": "meta",
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
        "ui:group": "external",
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
        "ui:group": "external",
        "ui:no-dynamic": true,
      }),
    ),
  },
  {
    "ui:groups": {
      meta: "SEO & Meta tags",
      layout: "Layout",
      navbar: "Navbar",
      footer: "Footer",
      external: "External scripts",
    },
  },
);

export const siteAttributesNoQueriesSchema = Type.Omit(siteAttributesSchema, ["queries"]);
export const pageAttributesNoQueriesSchema = Type.Omit(pageAttributesSchema, ["queries"]);
export const siteQueriesSchema = Type.Array(querySchema);
export const siteQueriesSchemaLLM = toLLMSchema(siteQueriesSchema);

export type PageAttributes = Static<typeof pageAttributesSchema>;
export type SiteAttributes = Static<typeof siteAttributesSchema>;
export type SiteAttributesNoQueries = Static<typeof siteAttributesNoQueriesSchema>;
export type PageAttributesNoQueries = Static<typeof pageAttributesNoQueriesSchema>;

export function resolvePageAttributes(data: Partial<PageAttributes> = {}) {
  const defaultAttrValues = getSchemaDefaults(pageAttributesSchema);
  return { ...defaultAttrValues, ...data } as PageAttributes;
}

export function resolveSiteAttributes(data: Partial<SiteAttributes> = {}) {
  const defaultAttrValues = getSchemaDefaults(siteAttributesSchema);
  return { ...defaultAttrValues, ...data } as SiteAttributes;
}

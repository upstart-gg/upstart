import { Type, type TProperties, type Static, type TObject } from "@sinclair/typebox";
import type { JSONSchemaType } from "ajv";
import { ajv } from "./ajv";
import { background } from "./bricks/props/background";
import { Value } from "@sinclair/typebox/value";
import { string } from "./bricks/props/string";
import { optional } from "./bricks/props/helpers";
import { boolean } from "./bricks/props/boolean";
import { datetime } from "./bricks/props/date";
import { enumProp } from "./bricks/props/enum";

type EnumOption = {
  title?: string;
  description?: string;
  value: string;
  icon?: string;
};

type GeoPoint = { lat: number; lng: number; name?: string };

export function defineAttributes(attrs: TProperties) {
  // Attributes starting with "$" are reserved for internal use
  for (const key in attrs) {
    if (key.startsWith("$")) {
      throw new Error(
        `Attribute names starting with '$' (like "${key}") are reserved for internal use. Please rename it.`,
      );
    }
  }
  return Type.Object(attrs);
}

/**
 * Retuns the custom attributes schema merged with the default attributes schema
 */
export function processAttributesSchema(customAttributes: TObject) {
  return Type.Composite([customAttributes, defaultAttributesSchema]) as AttributesSchema;
}

export type { JSONSchemaType };

// Default attributes
const defaultAttributes = {
  $pageLanguage: enumProp("Language", "en", {
    options: [
      { value: "ar", title: "Arabic" },
      { value: "zh", title: "Chinese" },
      { value: "cs", title: "Czech" },
      { value: "nl", title: "Dutch" },
      { value: "en", title: "English" },
      { value: "fr", title: "French" },
      { value: "de", title: "German" },
      { value: "he", title: "Hebrew" },
      { value: "hi", title: "Hindi" },
      { value: "it", title: "Italian" },
      { value: "ja", title: "Japanese" },
      { value: "ko", title: "Korean" },
      { value: "fa", title: "Persian" },
      { value: "pl", title: "Polish" },
      { value: "pt", title: "Portuguese" },
      { value: "ru", title: "Russian" },
      { value: "es", title: "Spanish" },
      { value: "tr", title: "Turkish" },
      { value: "vi", title: "Vietnamese" },
    ],
    "ai:guidelines":
      "Choose a value based on the site description. If the site is in multiple languages, use 'en'.",

    "ui:group": "meta",
    "ui:group:title": "Meta tags",
  }),

  $pageOgImage: optional(
    string("Social share image", "", {
      description: "Image shown when page is shared on social media",
      "ai:guidelines": "Don't generate this property/image, it is automatically generated.",
      "ui:group": "meta",
    }),
  ),

  $robotsIndexing: optional(
    boolean("Allow search engines to index this site", true, {
      description: "Disabling this will prevent search engines from indexing this site",
      "ai:guidelines": "Don't generate this property/image, it is automatically generated.",
      "ui:group": "seo",
      "ui:group:title": "SEO",
      "ui:scope": "site",
    }),
  ),

  $siteOgImage: optional(
    string("Social share image", "", {
      description: "Image shown when this site is shared on social media",
      "ai:guidelines": "Don't generate this image, it is automatically generated.",
      "ui:field": "image",
      "ui:group": "meta",
      "ui:group:title": "Meta tags",
      "ui:scope": "site",
    }),
  ),

  $pagePath: string("Page path", "/", {
    description: "The URL path of the page",
    "ui:group": "location",
    "ui:group:title": "Location",
  }),

  $pageTitle: string("Title", "Untitled", {
    "ui:group": "meta",
    "ui:group:title": "Meta tags",
    description: "The title of the page. Appears in the browser tab and search results",
  }),

  $pageDescription: string("Description", "", {
    "ui:widget": "textarea",
    "ui:group": "meta",
    "ui:group:title": "Meta tags",
    description: "A short description of the page. Used by search engines",
  }),

  $pageKeywords: string("Keywords", "", {
    "ui:group": "meta",
    "ui:group:title": "Meta tags",
    description: "Keywords related to the page. Used by search engines",
  }),

  $pageLastUpdated: optional(
    datetime("Last updated", {
      "ui:hidden": true,
      "ai:guidelines": "Don't generate this property.",
    }),
  ),

  // --- layout attributes ---

  $bodyBackground: optional(
    Type.Composite([background()], {
      default: {
        color: "#ffffff",
      },
      title: "Body Background",
      description:
        "Applies to the body element of the page (while $pageBackground applies to the page container)",
      "ui:field": "background",
      "ui:show-img-search": true,
      "ui:group": "layout",
      "ui:group:title": "Page Layout",
      "ui:group:order": 3,
    }),
  ),

  $pageBackground: optional(
    Type.Composite(
      [
        background(),
        Type.Object(
          {},
          {
            title: "Page Background",
          },
        ),
      ],
      {
        default: {
          color: "base-100",
        },
        title: "Page Background",
        "ui:field": "background",
        "ui:show-img-search": true,
        "ui:group": "background",
        "ui:group:title": "Page Background",
        "ui:group:order": 4,
      },
    ),
  ),

  $siteHeadTags: optional(
    Type.String({
      title: "Head tags",
      description:
        "Add custom tags to the <head> of your site. Useful for analytics tags, custom scripts, etc.",
      "ai:guidelines": "Don't include meta tags here, they are automatically generated.",
      "ui:multiline": true,
      "ui:scope": "site",
      "ui:group": "external-scripts",
      "ui:group:title": "External scripts",
    }),
  ),
  $siteBodyTags: optional(
    Type.String({
      title: "Body tags",
      description:
        "Add custom tags to the <body> of your site. Useful for analytics tags, custom scripts, etc.",
      "ui:multiline": true,
      "ui:scope": "site",
      "ui:group": "external-scripts",
      "ui:group:title": "External scripts",
    }),
  ),
};

export const defaultAttributesSchema = Type.Object(defaultAttributes, { additionalProperties: true });
export const siteAttributesSchemaForLLM = Type.Pick(defaultAttributesSchema, [
  "$bodyBackground",
  "$pageBackground",
]);
export const pageAttributesSchemaForLLM = Type.Pick(defaultAttributesSchema, [
  "$pageTitle",
  "$pageDescription",
  "$pageKeywords",
  "$pageLanguage",
  "$pagePath",
  "$bodyBackground",
  "$pageBackground",
]);

export type AttributesSchema = typeof defaultAttributesSchema & Record<string, unknown>;

export type Attributes<T extends Record<string, unknown> = Record<string, unknown>> = Static<
  typeof defaultAttributesSchema
> &
  T;

export function resolveAttributes(customAttrsSchema: TObject, initialData: Record<string, unknown> = {}) {
  const validateCustom = ajv.compile(customAttrsSchema);
  const valid = validateCustom(initialData);
  if (!valid) {
    console.log("invalid custom attributes values", initialData, validateCustom.errors);
    throw new Error(`Invalid custom attributes values: ${validateCustom.errors}`);
  }
  const defaultAttrValues = Value.Create(defaultAttributesSchema);
  const data = { ...defaultAttrValues, ...initialData };
  return data as Attributes<Static<typeof customAttrsSchema>>;
}

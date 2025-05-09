import {
  Type,
  type StringOptions,
  type NumberOptions,
  type SchemaOptions,
  type ObjectOptions,
  type TProperties,
  type Static,
  type TObject,
} from "@sinclair/typebox";
import type { ElementColor } from "./themes/color-system";
import type { JSONSchemaType } from "ajv";
import { ajv } from "./ajv";
import { background } from "./bricks/props/background";
import { Value } from "@sinclair/typebox/value";

type EnumOption = {
  title?: string;
  description?: string;
  value: string;
  icon?: string;
};

type AttributeOptions<T extends Record<string, unknown>> = {
  "ui:field"?: string;
  "ui:group"?: string;
  "ui:group:title"?: string;
  "ui:group:order"?: number;
  advanced?: boolean;
  "ui:hidden"?: boolean | "if-empty";
  "ui:scope"?: "site" | "page";
} & T;

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

export const attr = {
  /**
   * Define a text
   */
  string(name: string, defaultValue = "", opts?: AttributeOptions<Omit<StringOptions, "title" | "default">>) {
    return Type.String({ title: name, default: defaultValue, ...opts });
  },
  /**
   * Define a number attribute
   */
  number(name: string, defaultValue = 0, opts?: AttributeOptions<Omit<NumberOptions, "title" | "default">>) {
    return Type.Number({ title: name, default: defaultValue, ...opts });
  },
  /**
   * Define a boolean
   */
  boolean(
    name: string,
    defaultValue = false,
    opts?: AttributeOptions<Omit<SchemaOptions, "title" | "default">>,
  ) {
    const defaultOpts = {
      "ui:field": "switch",
    };
    return Type.Boolean({ title: name, default: defaultValue, ...defaultOpts, ...opts });
  },
  /**
   * Define an enum
   */
  enum(
    name: string,
    defaultValue: string,
    opts: AttributeOptions<
      Omit<SchemaOptions, "title" | "default"> & {
        options: EnumOption[] | string[];
        displayAs?: "radio" | "select" | "button-group" | "icon-group";
      }
    >,
  ) {
    const defaultOpts = {
      "ui:field": "enum",
      "ui:display": opts.displayAs || "select",
    };
    const { options, displayAs, ...commonOpts } = opts;
    return Type.Union(
      options.map((opt) =>
        Type.Literal(typeof opt === "string" ? opt : opt.value, {
          title: typeof opt === "string" ? opt : opt.title,
          "ui:icon": typeof opt === "string" ? undefined : opt.icon,
        }),
      ),
      {
        title: name,
        default: defaultValue,
        ...defaultOpts,
        ...commonOpts,
      },
    );
  },
  /**
   * Define a file that can be uploaded by the user
   */
  file(
    name: string,
    defaultValue = "",
    opts: AttributeOptions<Omit<SchemaOptions, "title" | "default">> = {},
  ) {
    return Type.String({ title: name, default: defaultValue, ...opts, format: "data-url" });
  },
  /**
   * Define a URL
   */
  url(
    name: string,
    defaultValue = "",
    opts: AttributeOptions<Omit<SchemaOptions, "title" | "default">> = {},
  ) {
    return Type.String({ title: name, default: defaultValue, ...opts, format: "uri" });
  },
  /**
   * Define a color attribute
   */
  color(
    name: string,
    defaultValue: ElementColor = "",
    opts?: AttributeOptions<Omit<StringOptions, "title" | "default">>,
  ) {
    const defaultOpts = {
      "ui:field": "color",
      // important for the json schema form not to display several fields because of the union type
      // "ui:fieldReplacesAnyOrOneOf": true,
    };
    return Type.String({ title: name, default: defaultValue, ...defaultOpts, ...opts });
  },
  /**
   * Define a date
   */
  date(
    name: string,
    defaultValue = new Date(),
    opts: AttributeOptions<Omit<SchemaOptions, "title" | "default">> = {},
  ) {
    return Type.String({ title: name, default: defaultValue.toISOString(), ...opts, format: "date" });
  },
  /**
   * Define a date and time
   */
  datetime(
    name: string,
    defaultValue = new Date(),
    opts: AttributeOptions<Omit<SchemaOptions, "title" | "default">> = {},
  ) {
    return Type.String({ title: name, default: defaultValue.toISOString(), ...opts, format: "date-time" });
  },
  /**
   * Define a geolocation
   */
  geolocation(
    name: string,
    defaultValue: GeoPoint,
    opts: AttributeOptions<Omit<ObjectOptions, "title" | "default">> = {},
  ) {
    return Type.Object(
      {
        lat: Type.Number({ minimum: -90, maximum: 90 }),
        lng: Type.Number({ minimum: -180, maximum: 180 }),
        name: Type.Optional(Type.String({ title: "Name" })),
      },
      { title: name, default: defaultValue, ...opts },
    );
  },
};

// Default attributes
const defaultAttributes = {
  $pageLanguage: attr.enum("Language", "en", {
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

  $pageOgImage: Type.Optional(
    attr.string("Social share image", "", {
      description: "Image shown when page is shared on social media",
      "ai:guidelines": "Don't generate this property/image, it is automatically generated.",
      "ui:group": "meta",
    }),
  ),

  $robotsIndexing: Type.Optional(
    attr.boolean("Allow search engines to index this site", true, {
      description: "Disabling this will prevent search engines from indexing this site",
      "ai:guidelines": "Don't generate this property/image, it is automatically generated.",
      "ui:group": "seo",
      "ui:group:title": "SEO",
      "ui:scope": "site",
    }),
  ),

  $siteOgImage: Type.Optional(
    attr.string("Social share image", "", {
      description: "Image shown when this site is shared on social media",
      "ai:guidelines": "Don't generate this image, it is automatically generated.",
      "ui:field": "image",
      "ui:group": "meta",
      "ui:group:title": "Meta tags",
      "ui:scope": "site",
    }),
  ),

  $pagePath: attr.string("Page path", "/", {
    description: "The URL path of the page",
    "ui:group": "location",
    "ui:group:title": "Location",
  }),

  $pageTitle: attr.string("Title", "Untitled", {
    "ui:group": "meta",
    "ui:group:title": "Meta tags",
    description: "The title of the page. Appears in the browser tab and search results",
  }),

  $pageDescription: attr.string("Description", "", {
    "ui:widget": "textarea",
    "ui:group": "meta",
    "ui:group:title": "Meta tags",
    description: "A short description of the page. Used by search engines",
  }),

  $pageKeywords: attr.string("Keywords", "", {
    "ui:group": "meta",
    "ui:group:title": "Meta tags",
    description: "Keywords related to the page. Used by search engines",
  }),

  $pageLastUpdated: Type.Optional(
    attr.datetime("Last updated", undefined, {
      "ui:hidden": true,
      "ai:guidelines": "Don't generate this property.",
    }),
  ),

  // --- layout attributes ---

  $bodyBackground: Type.Optional(
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

  $pageBackground: Type.Optional(
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

  $siteHeadTags: Type.Optional(
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
  $siteBodyTags: Type.Optional(
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

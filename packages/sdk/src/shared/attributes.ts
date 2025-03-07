import {
  Type,
  type StringOptions,
  type NumberOptions,
  type SchemaOptions,
  type ObjectOptions,
  type TProperties,
  type Static,
} from "@sinclair/typebox";
import type { ElementColor } from "./themes/color-system";
import type { JSONSchemaType } from "ajv";
import { ajv } from "./ajv";
import { typeboxSchemaToJSONSchema } from "./utils/schema";
import { background } from "./bricks/props/background";

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
  return typeboxSchemaToJSONSchema<Attributes>(Type.Object({ ...defaultAttributes, ...attrs }));
}

export type { JSONSchemaType };
export type AttributesSchema = JSONSchemaType<Attributes>;

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
    "ui:group": "meta",
    "ui:group:title": "Meta tags",
  }),

  $pageOgImage: attr.string("Social share image", "", {
    description: "Image shown when page is shared on social media",
    "ui:group": "meta",
  }),

  $robotsIndexing: attr.boolean("Allow search engines to index this site", true, {
    description: "Disabling this will prevent search engines from indexing this site",
    "ui:group": "seo",
    "ui:group:title": "SEO",
    "ui:scope": "site",
  }),

  $siteOgImage: attr.string("Social share image", "", {
    description: "Image shown when this site is shared on social media",
    "ui:field": "image",
    "ui:group": "meta",
    "ui:group:title": "Meta tags",
    "ui:scope": "site",
  }),

  $pagePath: attr.string("Page path", "/", {
    description: "The URL path of the page",
    "ui:group": "location",
    "ui:group:title": "Location",
  }),

  $pageTitle: attr.string("Title", "Untitled", {
    "ui:group": "meta",
    "ui:group:title": "Meta tags",
    description: "The title of the page. Appears in the browser tab and search results.",
  }),

  $pageDescription: attr.string("Description", "", {
    "ui:widget": "textarea",
    "ui:group": "meta",
    "ui:group:title": "Meta tags",
    description: "A short description of the page. Used by search engines.",
  }),

  $pageKeywords: attr.string("Keywords", "", {
    "ui:group": "meta",
    "ui:group:title": "Meta tags",
    description: "Keywords related to the page. Used by search engines.",
  }),

  $pageLastUpdated: attr.datetime("Last updated", undefined, { "ui:hidden": true }),

  // --- layout attributes ---

  $pagePadding: Type.Object(
    {
      vertical: attr.enum("Vertical spacing", "0", {
        options: [
          { value: "0", title: "None" },
          { value: "10", title: "Small" },
          { value: "20", title: "Medium" },
          { value: "30", title: "Large" },
          { value: "50", title: "Extra large" },
        ],
        description: "Desktop only.",
        displayAs: "select",
        "ui:group": "layout",
        "ui:group:title": "Page Layout",
      }),
      horizontal: attr.enum("Horizontal spacing", "0", {
        options: [
          { value: "0", title: "None" },
          { value: "10", title: "Small" },
          { value: "20", title: "Medium" },
          { value: "30", title: "Large" },
          { value: "50", title: "Extra large" },
        ],
        description: "Desktop only.",
        displayAs: "button-group",
        "ui:group": "layout",
        "ui:group:title": "Page Layout",
      }),
    },
    {
      default: {
        vertical: "0",
        horizontal: "0",
      },
      "ui:field": "padding",
      "ui:group": "layout",
      "ui:group:order": 3,
      "ui:group:title": "Layout",
    },
  ),

  $pageWidth: attr.enum("Page width", "max-w-full", {
    options: [
      {
        value: "max-w-screen-lg",
        title: "Medium",
        description: "Common for text-heavy content/blog posts",
      },
      { value: "max-w-screen-xl", title: "Large", description: "Usefull or some landing pages" },
      { value: "max-w-screen-2xl", title: "Extra large", description: "Common width" },
      { value: "max-w-full", title: "Full width", description: "Takes the entire space" },
    ],
    description: "The maximum width of the page. Desktop only.",
    displayAs: "select",
    "ui:group": "layout",
    "ui:group:order": 3,
    "ui:group:title": "Layout",
  }),

  $bodyBackground: Type.Composite([background], {
    default: {
      color: "#ffffff",
    },
    title: "Body Background",
    "ui:field": "background",
    "ui:show-img-search": true,
    "ui:group": "layout",
    "ui:group:title": "Page Layout",
    "ui:group:order": 3,
  }),

  $pageBackground: Type.Composite(
    [
      background,
      Type.Object(
        {},
        {
          title: "Page Background",
        },
      ),
    ],
    {
      default: {
        color: "#ffffff",
      },
      title: "Page Background",
      "ui:field": "background",
      "ui:show-img-search": true,
      "ui:group": "background",
      "ui:group:title": "Page Background",
      "ui:group:order": 4,
    },
  ),

  $textColor: attr.color("Text color", "#222222", {
    "ui:field": "color",
    "ui:group": "layout",
    "ui:group:title": "Page Layout",
    "ui:color-type": "page-text",
  }),

  $siteHeadTags: Type.Optional(
    Type.String({
      title: "Head tags",
      description:
        "Add custom tags to the <head> of your site. Useful for analytics tags, custom scripts, etc.",
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

export const defaultAttributesSchema = Type.Object(defaultAttributes);
export type Attributes = Static<typeof defaultAttributesSchema> & Record<string, unknown>;

export function resolveAttributes(
  attributesSchema: JSONSchemaType<Attributes>,
  initialData: Record<string, unknown> = {},
): Attributes {
  const validate = ajv.compile(attributesSchema);
  const data = { ...initialData };
  const valid = validate(data);
  if (!valid) {
    console.log("invalid data attributes", data, validate.errors);
    throw new Error(`Invalid attributes: ${validate.errors}`);
  }
  return data;
}

import { type Attributes, defaultAttributesSchema, type AttributesSchema } from "./attributes";
import { type Section, sectionSchema } from "./bricks";
import type { Theme } from "./theme";
import { Type, type Static } from "@sinclair/typebox";
import type { DatasourcesList } from "./datasources/types";
import type { PageInfo, Sitemap } from "./sitemap";

/**
 * The Page config represents the page configuration (datasources, attributes, etc)
 */
export type PageConfig<D extends DatasourcesList> = PageInfo & {
  /**
   * Data sources manifests for the page. Undefined if no data sources are defined.
   */
  datasources?: D;
  /**
   * Resolved static data sources for the page.
   * Undefined if no data sources are defined.
   */
  data?: Record<string, unknown[]>;
  /**
   * Page attributes. (can override site attributes)
   */
  attributes?: AttributesSchema;
  /**
   * Resolved attributes for the page.
   */
  attr?: Attributes;
  sections: Section[];
  tags: string[];
};

export type GenericPageConfig = PageConfig<DatasourcesList>;

/**
 * Page context has attr (possibly inherited from site) but not attributes declaration, as they are not needed to render the page.
 * It alwso have the sitemap and theme.
 */
export type GenericPageContext = Omit<GenericPageConfig, "attr" | "attributes"> & {
  siteId: string;
  hostname: string;
  theme: Theme;
  sitemap: Sitemap;
  attr: Attributes;
  pathParams?: Record<string, string>;
};

export const pageSchema = Type.Object({
  id: Type.String({ description: "The unique ID of the page. Use a human readable url-safe slug" }),
  label: Type.String({ description: "The label (name) of the page" }),
  path: Type.String({ description: "The path of the page in the URL. Should be unique" }),
  sections: Type.Array(sectionSchema, {
    description: "The sections of the page. See the Section schema",
  }),
  tags: Type.Array(Type.String(), {
    description: "The tags of the page, used for organizating and filtering pages",
  }),
  attr: Type.Optional(defaultAttributesSchema),
});

export type Page = Static<typeof pageSchema>;

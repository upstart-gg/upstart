import {
  type Attributes,
  resolveAttributes,
  defaultAttributesSchema,
  type AttributesSchema,
} from "./attributes";
import { type Section, sectionSchema, sectionSchemaForLLM } from "./bricks";
import invariant from "./utils/invariant";
import type { Theme } from "./theme";
import { Type, type Static } from "@sinclair/typebox";
import type { DatasourcesMap, DatasourcesResolved } from "./datasources/types";
import type { PageInfo, Sitemap } from "./sitemap";
import type { SiteAndPagesConfig } from "./site";

/**
 * The Page config represents the page configuration (datasources, attributes, etc)
 */
export type PageConfig<D extends DatasourcesMap> = PageInfo & {
  /**
   * Data sources manifests for the page. Undefined if no data sources are defined.
   */
  datasources?: D;
  /**
   * Resolved static data sources for the page.
   * Undefined if no data sources are defined.
   */
  data?: D extends DatasourcesMap ? DatasourcesResolved<D> : undefined;
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

export type GenericPageConfig = PageConfig<DatasourcesMap>;

export function getNewPageConfig(
  config: SiteAndPagesConfig,
  path = "/",
  useFixedId: false | string = false,
): GenericPageConfig {
  const pageConfig = config.pages.find((p) => p.path === path);
  invariant(pageConfig, `createPageConfigFromTemplateConfig: No page config found for path ${path}`);

  return {
    id: typeof useFixedId === "boolean" ? crypto.randomUUID() : useFixedId,
    label: pageConfig.label,
    tags: pageConfig.tags ?? [],
    path,
    sections: pageConfig.sections,
    ...(pageConfig.attributes
      ? {
          attributes: pageConfig.attributes,
          attr: { ...resolveAttributes(pageConfig.attributes), ...(pageConfig.attr ?? {}) },
        }
      : {}),
  } satisfies GenericPageConfig;
}

/**
 * Page context has attr but not attributes declaration, as they are not needed to render the page.
 */
export type GenericPageContext = Omit<GenericPageConfig, "attr" | "attributes"> & {
  siteId: string;
  hostname: string;
  theme: Theme;
  sitemap: Sitemap;
  attr: Attributes;
};

export const pageSchema = Type.Object(
  {
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
  },
  { additionalProperties: false },
);

export const pageSchemaForLLM = Type.Object(
  {
    type: Type.Literal("page"),
    page: Type.Composite(
      [
        Type.Omit(pageSchema, ["sections"]),
        Type.Object({
          sections: Type.Array(sectionSchemaForLLM, {
            description: "The sections of the page. See the Section schema",
          }),
        }),
      ],
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export type Page = Static<typeof pageSchema>;

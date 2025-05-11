import {
  type Attributes,
  resolveAttributes,
  defaultAttributesSchema,
  type AttributesSchema,
} from "./attributes";
import { type Section, sectionSchema } from "./bricks";
import invariant from "./utils/invariant";
import type { Theme } from "./theme";
import { Type, type Static } from "@sinclair/typebox";
import type { DatasourcesMap, DatasourcesResolved } from "./datasources/types";
import type { TemplateConfig } from "./template";
import type { PageInfo, PagesMap } from "./pages-map";

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
  templateConfig: TemplateConfig,
  path = "/",
  useFixedId: false | string = false,
): GenericPageConfig {
  const pageConfig = templateConfig.pages.find((p) => p.path === path);
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
  pagesMap: PagesMap;
  attr: Attributes;
};

export const templatePageSchema = Type.Object(
  {
    label: Type.String({ description: "The label (name) of the page" }),
    path: Type.String({ description: "The path of the page in the URL. Should be unique" }),
    sections: Type.Array(sectionSchema, {
      description: "The sections of the page. See the Section schema",
    }),
    tags: Type.Array(Type.String(), {
      description: "The tags of the page, used for organizating and filtering pages",
      default: [],
    }),
    attr: Type.Optional(defaultAttributesSchema),
  },
  { additionalProperties: false },
);

export type TemplatePage = Static<typeof templatePageSchema>;

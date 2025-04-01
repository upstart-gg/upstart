import { type Attributes, resolveAttributes, defaultAttributesSchema } from "./attributes";
import { brickSchema, type Section, sectionSchema, type Brick, definedSectionSchema } from "./bricks";
import invariant from "./utils/invariant";
import { themeSchema, type Theme } from "./theme";
import { Type, type Static, type TObject, type TProperties } from "@sinclair/typebox";
import { datasourcesMap, type DatasourcesMap, type DatasourcesResolved } from "./datasources/types";
import { customAlphabet } from "nanoid";
import { datarecordsMap } from "./datarecords/types";
import type { TemplateConfig } from "./template";

const nanoid = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyz", 7);

const pagesMapSchema = Type.Array(
  Type.Object({
    id: Type.String(),
    label: Type.String(),
    path: Type.String(),
    tags: Type.Array(Type.String(), { default: [] }),
  }),
);

export type PagesMap = Static<typeof pagesMapSchema>;

export type PageInfo = {
  /**
   * The page id.
   */
  id: string;
  /**
   * Pathname to the page
   */
  path: string;
  /**
   * Label of the page
   */
  label: string;
};

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
  attributes?: TObject<TProperties>;
  /**
   * Resolved attributes for the page.
   */
  attr?: Attributes;

  sections: Section[];
  bricks: Brick[];

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
    bricks: pageConfig.bricks,
    ...(pageConfig.attributes
      ? {
          attributes: pageConfig.attributes,
          attr: { ...resolveAttributes(pageConfig.attributes), ...(pageConfig.attr ?? {}) },
        }
      : {}),
  } satisfies GenericPageConfig;
}

export const siteSchema = Type.Object({
  id: Type.String(),
  label: Type.String(),
  hostname: Type.String(),
  attributes: defaultAttributesSchema,
  attr: Type.Record(Type.String(), Type.Any()),
  datasources: Type.Optional(datasourcesMap),
  datarecords: Type.Optional(datarecordsMap),
  themes: Type.Array(themeSchema),
  theme: themeSchema,
  pagesMap: pagesMapSchema,
});

/**
 * Site config has always attributes and attr.
 */
export type Site = Omit<Static<typeof siteSchema>, "attributes"> & { attributes: TObject };

/**
 * Page context has attr but not attributes declaration, as they are not needed to render the page.
 */
export type GenericPageContext = Omit<GenericPageConfig, "attr" | "attributes"> & {
  siteId: Site["id"];
  hostname: Site["hostname"];
  theme: Site["theme"];
  pagesMap: Site["pagesMap"];
  attr: Attributes;
};

/**
 * Creates the necessary config for a new site based on the given template.
 * Returns an object with property "site" and "pages", which should be used to create the site and pages in db.
 * A temporary hostname is generated for the site.
 */
export function getNewSiteConfig(
  templateConfig: TemplateConfig,
  options: { label: string } = { label: "New site" },
  // used for testing to avoid changing the site id on every reload
  useFixedIds = false,
) {
  const id = useFixedIds ? "00000000-0000-0000-0000-000000000001" : crypto.randomUUID();
  const hostname = `${nanoid()}.upstart.do`;
  const pages: GenericPageConfig[] = templateConfig.pages.map((p, index) =>
    getNewPageConfig(
      templateConfig,
      p.path,
      useFixedIds ? `00000000-0000-0000-0000-00000000000${index}` : false,
    ),
  );

  const site = {
    id,
    label: options.label,
    hostname,
    attributes: templateConfig.attributes,
    attr: { ...resolveAttributes(templateConfig.attributes), ...(templateConfig.attr ?? {}) },
    datasources: templateConfig.datasources,
    themes: templateConfig.themes,
    theme: templateConfig.themes[0],
    pagesMap: pages.map((p) => ({
      id: p.id,
      label: p.label,
      path: p.path,
      tags: p.tags,
    })),
  } satisfies Site;

  return { site, pages };
}

export const templatePageSchema = Type.Object({
  label: Type.String({ description: "The label (name) of the page" }),
  path: Type.String({ description: "The path of the page in the URL. Should be unique" }),
  sections: Type.Array(sectionSchema, {
    description: "The sections of the page. See the Section schema",
    "doc:type": "Array of `Section` objects",
  }),
  bricks: Type.Array(brickSchema, {
    description: "The bricks of the page. See the various bricks available below",
    "doc:type": "Array of `Brick` objects",
  }),
  tags: Type.Array(Type.String(), {
    description: "The tags of the page, used for organizating and filtering pages",
    default: [],
  }),
  attributes: Type.Optional(Type.Object({}, { additionalProperties: true })),
  attr: Type.Optional(Type.Record(Type.String(), Type.Any())),
});

export type TemplatePage = Static<typeof templatePageSchema>;

const siteAndPagesSchema = Type.Object({
  site: siteSchema,
  pages: Type.Array(templatePageSchema),
});

export type SiteAndPagesConfig = Static<typeof siteAndPagesSchema>;

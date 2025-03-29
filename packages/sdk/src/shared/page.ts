import { type Attributes, resolveAttributes, defaultAttributesSchema } from "./attributes";
import { brickSchema, type Section, sectionSchema, type Brick } from "./bricks";
import invariant from "./utils/invariant";
import { themeSchema, type Theme } from "./theme";
import { Type, type Static, type TObject, type TProperties } from "@sinclair/typebox";
import { datasourcesMap, type DatasourcesMap, type DatasourcesResolved } from "./datasources/types";
import { manifestSchema } from "./manifest";
import { customAlphabet } from "nanoid";
import type { DatarecordsMap } from "./datarecords/types";
import type { TemplateConfig } from "./template";

const nanoid = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyz", 7);

export type PagesMapEntry = {
  id: string;
  label: string;
  path: string;
  tags: string[];
};

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
    tags: pageConfig.tags,
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

/**
 * Site config has always attributes and attr.
 */
export type SiteConfig = {
  id: string;
  label: string;
  hostname: string;
  attributes: TObject<TProperties>;
  attr: Attributes;
  datasources?: DatasourcesMap;
  datarecords?: DatarecordsMap;
  themes: Theme[];
  theme: Theme;
  pagesMap: PagesMapEntry[];
};

/**
 * Page context has attr but not attributes declaration, as they are not needed to render the page.
 */
export type GenericPageContext = Omit<GenericPageConfig, "attr" | "attributes"> & {
  siteId: SiteConfig["id"];
  hostname: SiteConfig["hostname"];
  theme: SiteConfig["theme"];
  pagesMap: SiteConfig["pagesMap"];
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
  const pages = templateConfig.pages.map((p, index) =>
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
  } satisfies SiteConfig;

  return { site, pages };
}

export type SiteAndPagesConfig = ReturnType<typeof getNewSiteConfig>;

const Module = Type.Module({
  Section: sectionSchema,
});

export const templatePageSchema = Type.Object({
  label: Type.String(),
  path: Type.String(),
  sections: Type.Array(sectionSchema),
  bricks: Type.Array(brickSchema),
  tags: Type.Array(Type.String()),
});

export type TemplatePage = Static<typeof templatePageSchema> & {
  attributes?: TObject<TProperties>;
  attr?: Partial<Attributes>;
};

export const definedTemplatePage = Type.Composite([
  Type.Omit(templatePageSchema, ["tags"]),
  Type.Object({
    tags: Type.Optional(Type.Array(Type.String())),
  }),
]);

export type DefinedTemplatePage = Static<typeof definedTemplatePage>;

export const templateSchema = Type.Object(
  {
    manifest: manifestSchema,
    themes: Type.Array(themeSchema),
    datasources: Type.Optional(datasourcesMap),
    // Those are site-level attributes
    attributes: Type.Optional(defaultAttributesSchema),
    pages: Type.Array(definedTemplatePage),
  },
  {
    title: "Template schema",
    description: "The template configuration schema",
  },
);

export type Template = Static<typeof templateSchema>;

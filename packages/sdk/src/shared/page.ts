import { type Attributes, resolveAttributes, defaultAttributesSchema } from "./attributes";
import { brickSchema, type Section, sectionSchema, type Brick } from "./bricks";
import invariant from "./utils/invariant";
import { themeSchema, type Theme } from "./theme";
import { Type, type Static } from "@sinclair/typebox";
import { datasourcesMap, type DatasourcesMap, type DatasourcesResolved } from "./datasources/types";
import { manifestSchema, type TemplateManifest } from "./manifest";
import type { JSONSchemaType } from "ajv";
import { customAlphabet } from "nanoid";
import type { DatarecordsMap } from "./datarecords/types";

const nanoid = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyz", 7);

export function defineConfig(config: TemplateConfig): TemplateConfig {
  return {
    attributes: config.attributes,
    attr: config.attr,
    manifest: config.manifest,
    pages: config.pages,
    themes: config.themes,
    ...(config.datasources ? { datasources: config.datasources } : {}),
  };
}

export type TemplateConfig = {
  /**
   * The template manifest and settings
   */
  manifest?: TemplateManifest;
  /**
   * The attributes declared for the template
   */
  attributes: JSONSchemaType<Attributes>;
  attr?: Partial<Attributes>;
  /**
   * The datasources declared for the template
   */
  datasources?: DatasourcesMap;
  /**
   * The Pages
   */
  pages: TemplatePage[];
  /**
   * The themes declared by the site.
   */
  themes: Theme[];
};

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
export type PageConfig<D extends DatasourcesMap, S extends Section[]> = PageInfo & {
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
  attributes?: JSONSchemaType<Attributes>;
  /**
   * Resolved attributes for the page.
   */
  attr?: Attributes;
  sections: S;

  tags: string[];
};

export type GenericPageConfig = PageConfig<DatasourcesMap, Section[]>;

export function getNewPageConfig(
  templateConfig: TemplateConfig,
  path = "/",
  useFixedId: false | string = false,
): GenericPageConfig {
  const pageConfig = templateConfig.pages.find((p) => p.path === path);
  invariant(pageConfig, `createPageConfigFromTemplateConfig: No page config found for path ${path}`);

  const sections = pageConfig.sections;

  return {
    id: typeof useFixedId === "boolean" ? crypto.randomUUID() : useFixedId,
    label: pageConfig.label,
    tags: pageConfig.tags,
    path,
    sections,
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
  attributes: JSONSchemaType<Attributes>;
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

export const templatePageSchema = Type.Object({
  label: Type.String(),
  path: Type.String(),
  sections: Type.Array(sectionSchema),
  tags: Type.Array(Type.String()),
});

export type TemplatePage = Static<typeof templatePageSchema> & {
  attributes?: JSONSchemaType<Attributes>;
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

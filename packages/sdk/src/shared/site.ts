import { Type, type Static } from "@sinclair/typebox";
import { type GenericPageConfig, getNewPageConfig, templatePageSchema } from "./page";
import { pageInfoSchema, sitemapSchema } from "./sitemap";
import { defaultAttributesSchema, type AttributesSchema, resolveAttributes } from "./attributes";
import { datasourcesMap } from "./datasources/types";
import { datarecordsMap } from "./datarecords/types";
import { defaultTheme, themeSchema } from "./theme";
import type { TemplateConfig } from "./template";

export const siteSchema = Type.Object({
  id: Type.String(),
  label: Type.String(),
  hostname: Type.String(),
  attributes: defaultAttributesSchema,
  attr: defaultAttributesSchema,
  datasources: Type.Optional(datasourcesMap),
  datarecords: Type.Optional(datarecordsMap),
  themes: Type.Array(themeSchema),
  theme: themeSchema,
  sitemap: sitemapSchema,
});

/**
 * Site config has always attributes and attr.
 */
export type Site = Omit<Static<typeof siteSchema>, "attributes"> & {
  attributes: AttributesSchema;
};

const partialSiteAndPagesSchema = Type.Object({
  site: Type.Omit(siteSchema, ["attributes"]),
  pages: Type.Array(Type.Composite([Type.Omit(templatePageSchema, ["attributes"]), pageInfoSchema])),
});

type PartialSiteAndPagesSchema = Static<typeof partialSiteAndPagesSchema>;

export type SiteAndPagesConfig = {
  site: PartialSiteAndPagesSchema["site"] & {
    attributes: AttributesSchema;
  };
  pages: Array<
    Omit<PartialSiteAndPagesSchema["pages"][number], "attributes"> & {
      attributes?: AttributesSchema;
    }
  >;
};

export function createEmptyConfig(): SiteAndPagesConfig {
  return {
    site: {
      id: crypto.randomUUID(),
      label: "New site",
      hostname: "example.com",
      theme: defaultTheme,
      themes: [],
      sitemap: [],
      attributes: defaultAttributesSchema,
      attr: resolveAttributes(),
    },
    pages: [
      {
        id: "_default_",
        label: "First page",
        path: "/",
        sections: [],
        tags: [],
        attributes: defaultAttributesSchema,
        attr: resolveAttributes(),
      },
    ],
  };
}

/**
 * Creates the necessary config for a new site based on the given template.
 * Returns an object with property "site" and "pages", which should be used to create the site and pages in db.
 * A temporary hostname is generated for the site.
 */
export function getNewSiteConfig(
  templateConfig: TemplateConfig,
  hostname: string,
  options: { label: string } = { label: "New site" },
  // used for testing to avoid changing the site id on every reload
  useFixedIds = false,
) {
  const id = useFixedIds ? "50000000-0000-0000-0000-000000000001" : crypto.randomUUID();
  const pages: GenericPageConfig[] = templateConfig.pages.map((p, index) =>
    getNewPageConfig(
      templateConfig,
      p.path,
      useFixedIds ? `60000000-0000-0000-0000-00000000000${index}` : false,
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
    sitemap: pages.map((p) => ({
      id: p.id,
      label: p.label,
      path: p.path,
      tags: p.tags,
      status: "draft",
      sectionsPlan: [],
    })),
  } satisfies Site;

  return { site, pages };
}

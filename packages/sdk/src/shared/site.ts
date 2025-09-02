import { Type, type Static } from "@sinclair/typebox";
import { generateId, type Section } from "./bricks";
import { datarecordsList } from "./datarecords/types";
import { datasourcesList } from "./datasources/types";
import { pageSchema } from "./page";
import { sitePrompt } from "./prompt";
import { sitemapSchema } from "./sitemap";
import { defaultTheme, themeSchema } from "./theme";
import { resolvePageAttributes, resolveSiteAttributes, siteAttributesSchema } from "./attributes";

export const siteSchema = Type.Object({
  id: Type.String(),
  label: Type.String(),
  hostname: Type.String(),
  attributes: siteAttributesSchema,
  datasources: datasourcesList,
  datarecords: datarecordsList,
  themes: Type.Array(themeSchema),
  theme: themeSchema,
  sitemap: sitemapSchema,
  sitePrompt,
});

export type Site = Static<typeof siteSchema>;
export type PublicSite = Omit<Site, "sitePrompt">;

const siteAndPagesSchema = Type.Object({
  site: siteSchema,
  pages: Type.Array(pageSchema),
});

export type SiteAndPagesConfig = Static<typeof siteAndPagesSchema>;

export function createEmptyConfig(sitePrompt: string): SiteAndPagesConfig {
  return {
    site: {
      id: crypto.randomUUID(),
      label: "My site",
      hostname: "example.com",
      sitePrompt,
      theme: defaultTheme,
      themes: [],
      sitemap: [],
      attributes: resolveSiteAttributes(),
      datarecords: [],
      datasources: [],
    },
    // we need a fake page
    pages: [
      {
        id: "_default_",
        label: "First page with really really long name that should be truncated",
        path: "/",
        sections: [],
        attributes: resolvePageAttributes({
          path: "/",
        }),
      },
    ],
  };
}

import { Type, type Static } from "@sinclair/typebox";
import { resolvePageAttributes, resolveSiteAttributes, siteAttributesSchema } from "./attributes";
import { datarecordsList } from "./datarecords/types";
import { datasourcesList } from "./datasources/types";
import { pageSchema } from "./page";
import { sitePrompt } from "./prompt";
import { sitemapSchema } from "./sitemap";
import { defaultTheme, themeSchema } from "./theme";

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
      label: `My site ${new Date().toLocaleString(undefined, { dateStyle: "short", timeStyle: "short" })}`,
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
        // Keep this fake id as is!
        id: "_default_",
        label: "Untitled",
        sections: [],
        attributes: resolvePageAttributes({
          path: "/",
          isInitialPage: true,
        }),
      },
    ],
  };
}

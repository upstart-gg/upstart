import { Type, type Static } from "@sinclair/typebox";
import { pageSchema } from "./page";
import { pageInfoSchema, sitemapSchema } from "./sitemap";
import { defaultAttributesSchema, type AttributesSchema, resolveAttributes } from "./attributes";
import { datasourcesMap } from "./datasources/types";
import { datarecordsMap } from "./datarecords/types";
import { defaultTheme, themeSchema } from "./theme";
import { sitePrompt } from "./prompt";
import { generateId } from "./bricks";

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
  sitePrompt: sitePrompt,
});

/**
 * Site config has always attributes and attr.
 */
export type Site = Omit<Static<typeof siteSchema>, "attributes"> & {
  attributes: AttributesSchema;
};

const partialSiteAndPagesSchema = Type.Object({
  site: Type.Omit(siteSchema, ["attributes"]),
  pages: Type.Array(Type.Composite([Type.Omit(pageSchema, ["attributes"]), pageInfoSchema])),
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

export function createEmptyConfig(sitePrompt: string): SiteAndPagesConfig {
  return {
    site: {
      id: crypto.randomUUID(),
      label: "New site",
      hostname: "example.com",
      sitePrompt,
      theme: defaultTheme,
      themes: [],
      sitemap: [],
      attributes: defaultAttributesSchema,
      attr: resolveAttributes(),
    },
    // we need a fake page
    pages: [
      {
        id: "_default_",
        label: "First page",
        path: "/",
        sections: [
          {
            id: generateId(),
            label: "Hero Section",
            order: 1,
            props: {},
            bricks: [
              {
                id: generateId(),
                type: "navbar",
                props: {
                  brand: {
                    name: "My Site",
                  },
                  navigation: {
                    staticItems: [{ urlOrPageId: "/about" }, { urlOrPageId: "/contact" }],
                  },
                },
              },
            ],
          },
        ],
        tags: [],
        attributes: defaultAttributesSchema,
        attr: resolveAttributes(),
      },
    ],
  };
}

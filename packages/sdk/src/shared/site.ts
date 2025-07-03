import { Type, type Static } from "@sinclair/typebox";
import { pageSchema } from "./page";
import { pageInfoSchema, sitemapSchema } from "./sitemap";
import { defaultAttributesSchema, type AttributesSchema, resolveAttributes } from "./attributes";
import { datasourcesMap } from "./datasources/types";
import { datarecordsMap } from "./datarecords/types";
import { defaultTheme, themeSchema } from "./theme";
import { sitePrompt } from "./prompt";
import { generateId, type Section } from "./bricks";

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
        label: "First page with really really long name that should be truncated",
        path: "/",
        sections: [
          {
            id: `s_${generateId()}`,
            label: "Top",
            order: 1,
            props: {},
            bricks: [
              {
                id: generateId(),
                type: "navbar",
                props: {
                  brand: "My Site",
                  navigation: {
                    staticItems: [{ urlOrPageId: "/about" }, { urlOrPageId: "/contact" }],
                  },
                },
              },
            ],
          },
          {
            id: `s_content-${generateId()}`,
            label: "Content",
            order: 2,
            props: {},
            bricks: [
              {
                id: `b_${generateId()}`,
                type: "text",
                props: {
                  preset: "subtle-accent",
                  content: "Irure dolor sit amet, consectetur adipiscing elit.",
                },
              },
              // {
              //   id: `b_${generateId()}`,
              //   type: "map",
              //   props: {
              //     location: {
              //       lat: 37.7749,
              //       lng: -122.4194,
              //       tooltip: "San Francisco, CA",
              //       address: "San Francisco, CA",
              //     },
              //   },
              // },
              {
                id: `b_${generateId()}`,
                type: "vbox",
                props: {
                  $children: [
                    // {
                    //   id: `b_${generateId()}`,
                    //   type: "map",
                    //   props: {
                    //     location: {
                    //       lat: 37.7749,
                    //       lng: -122.4194,
                    //       tooltip: "San Francisco, CA",
                    //       address: "San Francisco, CA",
                    //     },
                    //   },
                    // },
                    {
                      id: `b_${generateId()}`,
                      type: "text",
                      props: {
                        preset: "subtle-accent",
                        content: "Irure dolor sit amet, consectetur adipiscing elit.",
                      },
                    },
                    {
                      id: `b_${generateId()}`,
                      type: "text",
                      props: {
                        preset: "subtle-accent",
                        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                      },
                    },
                  ],
                },
              },
              {
                id: `b_${generateId()}`,
                type: "text",
                props: {
                  preset: "subtle-accent",
                  content: "Irure dolor sit amet, consectetur adipiscing elit.",
                },
              },
              // {
              //   id: `b_${generateId()}`,
              //   type: "card",
              //   props: {
              //     cardTitle: "Welcome to My Site",
              //     cardBody: "This is a sample card body. You can edit this content.",
              //     cardImage: {
              //       src: "https://images.unsplash.com/photo-1636828982375-a4ec8b809e5e?q=80&w=3456&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              //       alt: "Sample Card Image",
              //     },
              //   },
              // },
              {
                id: `b_${generateId()}`,
                type: "spacer",
                props: {
                  width: "20px",
                },
                mobileProps: {
                  width: "100%",
                },
              },
              {
                id: `b_${generateId()}`,
                type: "card",
                props: {
                  cardTitle: "Welcome to My Site",
                  cardBody: "This is a sample card body. You can edit this content.",
                  cardImage: {
                    src: "https://placehold.co/300x200@2x/FFFFFF/333333/svg?text=Card+Image",
                    alt: "Sample Card Image",
                  },
                },
              },
            ],
          },
          {
            id: `s_content-${generateId()}`,
            label: "Bottom",
            order: 3,
            props: {},
            bricks: [
              {
                id: `b_${generateId()}`,
                type: "footer",
                props: {
                  linksSections: [
                    {
                      sectionTitle: "Links",
                      links: [
                        { title: "About", url: "/about" },
                        { title: "Contact", url: "/contact" },
                        { title: "Privacy Policy", url: "/privacy" },
                      ],
                    },
                    {
                      sectionTitle: "Social",
                      links: [
                        { title: "Twitter", url: "https://twitter.com" },
                        { title: "Facebook", url: "https://facebook.com" },
                        { title: "Instagram", url: "https://instagram.com" },
                      ],
                    },
                    {
                      sectionTitle: "Legal",
                      links: [
                        { title: "Terms of Service", url: "/terms" },
                        { title: "Cookie Policy", url: "/cookies" },
                      ],
                    },
                    {
                      sectionTitle: "Contact",
                      links: [
                        { title: "Email Us", url: "mailto:" },
                        { title: "Support", url: "/support" },
                      ],
                    },
                  ],
                },
              },
            ],
          },
        ] satisfies Section[],
        tags: [],
        attributes: defaultAttributesSchema,
        attr: resolveAttributes(),
      },
    ],
  };
}

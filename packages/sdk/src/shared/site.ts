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
  let order = 0;
  return {
    site: {
      id: crypto.randomUUID(),
      label: "New site",
      hostname: "example.com",
      sitePrompt,
      theme: defaultTheme,
      themes: [],
      sitemap: [
        {
          id: "_default_",
          label: "First page with really really long name that should be truncated",
          path: "/",
          attributes: resolvePageAttributes({ path: "/" }),
        },
        {
          id: "_page_2",
          label: "Second page with really really long name that should be truncated",
          path: "/secondPage",
          attributes: resolvePageAttributes({ path: "/secondPage" }),
        },
      ],
      attributes: resolveSiteAttributes(),
      datarecords: [
        {
          id: "a7f26d80-d68e-4b7a-a4a3-e41c454670ce",
          label: "Simple Datarecord",
          schema: {
            type: "object",
            properties: {
              lastName: {
                type: "string",
                title: "Last Name",
                "ui:placeholder": "Enter your last name",
                metadata: {
                  order: 0,
                },
              },
              firstName: {
                type: "string",
                title: "First Name",
                "ui:placeholder": "Enter your first name",
                metadata: {
                  order: 1,
                },
              },
            },
          },
          provider: "internal",
        },
        {
          id: "aacfe76d-4309-466c-83ad-fda8b02b043d",
          label: "Complex Datarecord",
          schema: {
            type: "object",
            required: ["firstName", "lastName"],
            properties: {
              lastName: {
                type: "string",
                title: "Last Name",
                metadata: {
                  order: 1,
                },
              },
              firstName: {
                type: "string",
                title: "First Name",
                metadata: {
                  order: 0,
                },
              },
              multiline2: {
                type: "string",
                title: "Message",
                metadata: {
                  order: 4,
                  "ui:multiline": true,
                },
                maxLength: 30,
                minLength: 1,
              },
              age: {
                type: "number",
                title: "age",
                minimum: 1,
                metadata: {
                  order: 2,
                },
              },
              url: {
                type: "string",
                title: "personal web site",
                format: "uri",
                metadata: {
                  order: 3,
                  "ui:placeholder": "https://mysite.example",
                },
                description: "your personal website url",
              },
              agree: {
                type: "boolean",
                title: "agree",
                metadata: {
                  order: 5,
                },
              },
              favoriteColor: {
                enum: ["blue", "green", "red", "yellow", "purple"],
                type: "string",
                title: "Favorite Color",
                metadata: {
                  order: 6,
                },
                description: "Select your favorite color",
              },
              favoriteSeason: {
                enum: ["spring", "summer", "autumn", "winter"],
                type: "string",
                title: "Favorite Season",
                metadata: {
                  order: 6,
                  "ui:widget": "radio",
                },
                description: "Select your favorite season",
              },
              favoriteMusic: {
                enum: ["technology", "politics", "sports", "music", "movies"],
                type: "string",
                title: "Interests",
                metadata: {
                  order: 6,
                  "ui:widget": "checkbox",
                },
                description: "What kind of subjects are you interested in?",
              },
              registrationDate: {
                type: "string",
                title: "Registration date",
                format: "date",
                metadata: {
                  order: 7,
                },
              },
              email: {
                type: "string",
                title: "Email",
                format: "email",
                metadata: {
                  order: 8,
                },
              },
              address: {
                type: "string",
                title: "Address",
                metadata: {
                  order: 9,
                },
              },
              multiline1: {
                type: "string",
                title: "some text",
                metadata: {
                  order: 10,
                  "ui:multiline": true,
                },
              },
              datetimes: {
                type: "string",
                title: "A datetime",
                format: "date-time",
                metadata: {
                  order: 11,
                },
              },
            },
          },
          provider: "internal",
        },
      ],
      datasources: [
        {
          id: "employees",
          label: "Company employees",
          provider: "custom",
          schema: {
            type: "array",
            items: {
              type: "object",
              properties: {
                $id: {
                  type: "string",
                  title: "Id",
                  format: "nanoid",
                },
                $publicationDate: {
                  type: "string",
                  format: "date-time",
                  title: "Publication Date",
                },
                $lastModificationDate: {
                  type: "string",
                  format: "date-time",
                  title: "Last Modification Date",
                },
                $slug: {
                  type: "string",
                  format: "slug",
                  title: "Slug",
                },
                avatarUrl: {
                  title: "Avatar URL",
                  type: "string",
                  format: "uri",
                  default: "https://placehold.co/100x100",
                },
                firstName: {
                  type: "string",
                  title: "First Name",
                },
                lastName: {
                  type: "string",
                  title: "Last Name",
                },
                email: {
                  type: "string",
                  format: "email",
                  title: "Email",
                },
                height: {
                  type: "number",
                  title: "Height",
                },
                admin: {
                  type: "boolean",
                  title: "Is Admin",
                },
                startedOn: {
                  type: "string",
                  format: "date",
                  title: "Started On",
                },
                tags: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  title: "Tags",
                },
              },
              required: [
                "firstName",
                "lastName",
                "email",
                "$id",
                "$slug",
                "$publicationDate",
                "$lastModificationDate",
              ],
            },
            examples: [
              {
                $id: "example-1",
                $publicationDate: "2023-01-01T00:00:00Z",
                $lastModificationDate: "2023-01-01T00:00:00Z",
                $slug: "john-doe",
                firstName: "John",
                lastName: "Doe",
                email: "john.doe@example.com",
                avatarUrl: "https://placehold.co/100x100",
                height: 180,
                admin: false,
                startedOn: "2020-01-01",
                tags: ["developer", "javascript"],
              },
              {
                $id: "example-2",
                $publicationDate: "2023-01-02T00:00:00Z",
                $lastModificationDate: "2023-01-02T00:00:00Z",
                $slug: "jane-smith",
                firstName: "Jane",
                lastName: "Smith",
                email: "jane.smith@example.com",
                avatarUrl: "https://placehold.co/100x100",
                height: 165,
                admin: false,
                startedOn: "2020-01-01",
                tags: ["designer", "figma"],
              },
              {
                $id: "example-3",
                $publicationDate: "2023-01-03T00:00:00Z",
                $lastModificationDate: "2023-01-03T00:00:00Z",
                $slug: "alice-johnson",
                firstName: "Alice",
                lastName: "Johnson",
                email: "alice.johnson@example.com",
                avatarUrl: "https://placehold.co/100x100",
                height: 170,
                admin: false,
                startedOn: "2020-01-01",
                tags: ["developer", "react"],
              },
              {
                $id: "example-4",
                $publicationDate: "2023-01-04T00:00:00Z",
                $lastModificationDate: "2023-01-04T00:00:00Z",
                $slug: "bob-brown",
                firstName: "Bob",
                lastName: "Brown",
                email: "bob.brown@example.com",
                avatarUrl: "https://placehold.co/100x100",
                height: 175,
                admin: false,
                startedOn: "2020-01-01",
                tags: ["developer", "vue"],
              },
              {
                $id: "example-5",
                $publicationDate: "2023-01-05T00:00:00Z",
                $lastModificationDate: "2023-01-05T00:00:00Z",
                $slug: "charlie-white",
                firstName: "Charlie",
                lastName: "White",
                email: "charlie.white@example.com",
                avatarUrl: "https://placehold.co/100x100",
                height: 160,
                admin: false,
                startedOn: "2020-01-01",
                tags: ["designer", "figma"],
              },
            ],
          },
          indexes: [
            {
              fields: ["$id"],
              name: "idx_unique_id",
            },
            {
              fields: ["$slug"],
              name: "idx_unique_slug",
            },
            {
              fields: ["$publicationDate"],
              name: "idx_unique_publicationDate",
            },
            {
              fields: ["$lastModificationDate"],
              name: "idx_unique_lastModificationDate",
            },
            {
              fields: ["email"],
              name: "idx_unique_email",
            },

            {
              fields: ["admin"],
              name: "idx_unique_admin",
            },
            {
              fields: ["startedOn"],
              name: "idx_unique_startedOn",
            },
            {
              fields: ["tags"],
              name: "idx_unique_tags",
            },
          ],
        },
        {
          id: "employees2",
          label: "Company employees 2",
          provider: "custom",
          schema: {
            type: "array",
            items: {
              type: "object",
              properties: {
                $id: {
                  type: "string",
                  title: "ID",
                },
                $publicationDate: {
                  type: "string",
                  format: "date-time",
                  title: "Publication Date",
                },
                $lastModificationDate: {
                  type: "string",
                  format: "date-time",
                  title: "Last Modification Date",
                },
                $slug: {
                  type: "string",
                  title: "Slug",
                },
                firstName: {
                  type: "string",
                  title: "First Name",
                },
                lastName: {
                  type: "string",
                  title: "Last Name",
                },
                tags: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  title: "Tags",
                },
              },
              required: [
                "firstName",
                "lastName",
                "$id",
                "$slug",
                "$publicationDate",
                "$lastModificationDate",
              ],
            },
          },
          indexes: [
            {
              fields: ["$id"],
              name: "idx_unique_id",
            },
            {
              fields: ["$slug"],
              name: "idx_unique_slug",
            },
            {
              fields: ["$publicationDate"],
              name: "idx_unique_publicationDate",
            },
            {
              fields: ["$lastModificationDate"],
              name: "idx_unique_lastModificationDate",
            },
            {
              fields: ["lastName"],
              name: "idx_unique_lastName",
            },
            {
              fields: ["tags"],
              name: "idx_unique_tags",
            },
          ],
        },
      ],
    },
    // we need a fake page
    pages: [
      {
        id: "_default_",
        label: "First page with really really long name that should be truncated",
        path: "/blog/:slug",
        sections: [
          {
            id: `s_${generateId()}`,
            label: "Top",
            order: ++order,
            props: {
              variant: "navbar",
            },
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
            id: `s_${generateId()}`,
            order: ++order,
            label: "Media",
            props: {},
            bricks: [
              {
                id: generateId(),
                type: "video",
                props: {
                  url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                },
              },
              {
                id: generateId(),
                type: "image",
                props: {
                  image: {
                    // src: "https://placehold.co/600x400@2x/EEEEEE/333333/svg?text=Sample+Image",
                    alt: "Sample Image",
                  },
                  height: "200px",
                },
              },
              {
                id: generateId(),
                type: "icon",
                props: {
                  icon: "mdi:heart",
                },
              },
            ],
          },
          {
            id: `s_${generateId()}`,
            order: ++order,
            label: "Containers",
            props: {},
            bricks: [
              {
                // horizontal box
                id: generateId(),
                type: "box",
                props: {
                  loop: {
                    over: "allEmployees",
                  },
                  direction: "flex-row",

                  $children: [
                    {
                      id: generateId(),
                      type: "button",
                      props: {
                        label: "Button #1",
                      },
                    },
                    {
                      id: generateId(),
                      type: "button",
                      props: {
                        label: "Button #2",
                      },
                    },
                    {
                      id: generateId(),
                      type: "button",
                      props: {
                        label: "Button #3",
                      },
                    },
                    {
                      id: generateId(),
                      type: "button",
                      props: {
                        label: "Button #4",
                      },
                    },
                  ],
                },
              },
              // {
              //   // vertical box
              //   id: generateId(),
              //   type: "box",
              //   props: {
              //     direction: "flex-col",
              //     $children: [
              //       {
              //         id: generateId(),
              //         type: "button",
              //         props: {
              //           label: "Button #1",
              //         },
              //       },
              //       {
              //         id: generateId(),
              //         type: "button",
              //         props: {
              //           label: "Button #2",
              //         },
              //       },
              //       {
              //         id: generateId(),
              //         type: "button",
              //         props: {
              //           label: "Button #3",
              //         },
              //       },
              //       {
              //         id: generateId(),
              //         type: "button",
              //         props: {
              //           label: "Button #4",
              //         },
              //       },
              //     ],
              //   },
              // },
              {
                // dynamic box
                id: generateId(),
                type: "box",
                props: {
                  direction: "flex-col",
                  datasource: {
                    id: "employees",
                  },
                  $children: [
                    {
                      id: generateId(),
                      type: "text",
                      props: {
                        content:
                          "Hello this is the first text in the dynamic box.<br />I'm on a new line explicitly.<br />I'm the third line and I'm the longest of them all! Yeah!",
                      },
                    },
                    {
                      id: generateId(),
                      type: "button",
                      props: {
                        label: "Button #1 in dynamic box with a {{$slug}}",
                      },
                    },
                    {
                      id: generateId(),
                      type: "button",
                      props: {
                        label: "Small label",
                      },
                    },
                    {
                      id: generateId(),
                      type: "button",
                      props: {
                        label: "Button #3 with the largest label",
                      },
                    },
                  ],
                },
              },
              // {
              //   // dynamic box
              //   id: generateId(),
              //   type: "dynamic",
              //   props: {
              //     direction: "flex-row",
              //     datasource: {
              //       id: "employees",
              //     },
              //     $children: [
              //       {
              //         id: generateId(),
              //         type: "text",
              //         props: {
              //           content:
              //             "Hello this is the first text in the dynamic box.<br />I'm on a new line explicitly.<br />I'm the third line and I'm the longest of them all! Yeah!",
              //         },
              //       },
              //       {
              //         id: generateId(),
              //         type: "button",
              //         props: {
              //           label: "Button #1 in dynamic box",
              //         },
              //       },
              //       {
              //         id: generateId(),
              //         type: "button",
              //         props: {
              //           label: "Small label",
              //         },
              //       },
              //       {
              //         id: generateId(),
              //         type: "button",
              //         props: {
              //           label: "Button #3 with the largest label",
              //         },
              //       },
              //     ],
              //   },
              // },
            ],
          },
          {
            id: `s_${generateId()}`,
            order: ++order,
            label: "Dynamic",
            bricks: [
              {
                type: "box",
                props: {
                  alignSelf: "self-auto",
                  datasource: {},
                  $children: [],
                },
                id: generateId(),
              },
            ],
            props: {},
          },
          {
            id: `s_${generateId()}`,
            order: ++order,
            label: "Section 8",
            bricks: [
              {
                type: "form",
                props: {
                  alignSelf: "self-auto",
                  color: "base100",
                  align: "vertical",
                  padding: "p-4",
                  fontSize: "inherit",
                  button: {
                    size: "block",
                    rounding: "rounded-md",
                    border: {
                      width: "border",
                      rounding: "rounded-md",
                    },
                  },
                  title: "My form",
                  buttonLabel: "Submit",
                  successMessage: "Thank you for your submission!",
                  errorMessage: "There was an error submitting the form. Please try again later.",
                  height: "104.4px",
                },
                id: "brick-OKkJLZl",
              },
            ],
            props: {},
          },
          // {
          //   id: `s_${generateId()}`,
          //   order: 2,
          //   label: "Bikes",
          //   bricks: [
          //     {
          //       type: "images-gallery",
          //       props: {
          //         alignSelf: "self-start",
          //         useDatabase: false,
          //         datasource: {
          //           mapping: {},
          //           filters: []
          //         },
          //         images: [],
          //         columns: 3,
          //         gap: "gap-4",
          //         padding: "p-4",
          //         aspectRatio: "aspect-[4/3]",
          //         height: "104.4px",
          //         lastTouched: 1752850834838,
          //       },
          //       id: "brick-YCqqkii",
          //     },
          //   ],
          //   props: {
          //     minHeight: "524px",
          //     lastTouched: 1752850818572,
          //   },
          // },
          {
            id: `s_${generateId()}`,
            label: "Testimonial",
            order: ++order,
            props: {
              justifyContent: "justify-center",
              alignItems: "items-start",
            },
            bricks: [
              {
                id: generateId(),
                type: "box",
                props: {
                  alignSelf: "self-auto",
                  datasource: {
                    id: "employees2",
                  },
                  $children: [
                    {
                      id: generateId(),
                      type: "testimonials",
                      props: {
                        testimonials: {
                          author: "{{firstName}} {{lastName}}",
                          text: "{{testimonial}}",
                          socialIcon: "{{icon}}",
                          company: "{{company}}",
                        },
                      },
                    },
                  ],
                },
              },
              {
                type: "testimonials",
                props: {
                  alignSelf: "self-auto",
                  orientation: "horizontal",
                  testimonials: [
                    {
                      author: "Billy Gates",
                      text: "Upstart rocks! I love the flexibility and ease of use. Can't wait to see more features!",
                      socialIcon: "mdi:twitter",
                      company: "Microsoft",
                    },
                    {
                      author: "Jeff Bezos",
                      text: "Amazing product! Upstart has transformed the way I build websites. Highly recommend it!",
                      socialIcon: "mdi:facebook",
                      company: "Amazon",
                    },
                    {
                      author: "Elon Musk",
                      text: "Upstart is a game changer! The possibilities are endless.",
                      socialIcon: "mdi:linkedin",
                      company: "SpaceX",
                    },
                    {
                      author: "Mark Zuckerberg",
                      text: "Upstart is a fantastic tool for building modern websites. I'm impressed!",
                      socialIcon: "mdi:facebook",
                      company: "Meta",
                    },
                  ],
                },
                id: "s_uuqtYzo",
              },
            ],
          },
          {
            id: `s_${generateId()}`,
            label: "SocialLinks",
            order: ++order,
            props: {
              justifyContent: "justify-center",
            },
            bricks: [
              {
                type: "social-links",
                props: {
                  alignSelf: "self-auto",
                  links: [
                    {
                      href: "https://facebook.com",
                      label: "Facebook",
                      icon: "mdi:facebook",
                    },
                    {
                      href: "https://instagram.com",
                      label: "Instagram",
                      icon: "mdi:instagram",
                    },
                    {
                      href: "https://x.com",
                      label: "X",
                      icon: "mdi:twitter",
                    },
                  ],
                },
                id: generateId(),
              },
              {
                type: "button",
                props: {
                  alignSelf: "self-auto",
                  label: "hey ho!",
                  justifyContent: "justify-center",
                  type: "button",
                  height: "42px",
                },
                id: generateId(),
              },
            ],
          },
          {
            id: `s_${generateId()}`,
            label: "Form",
            order: ++order,
            props: {
              // fillSpace: true,
              justifyContent: "justify-center",
              alignItems: "items-start",
            },
            bricks: [
              {
                id: generateId(),
                type: "images-gallery",
                props: {},
              },
              {
                id: generateId(),
                type: "form",
                props: {
                  padding: "p-4",
                  datarecordId: "a7f26d80-d68e-4b7a-a4a3-e41c454670ce",
                  title: "Simple Form",
                  intro: "This is a simple form to collect user information.",
                  button: {
                    label: "Register",
                    size: "block",
                    borderRadius: "rounded-lg",
                  },
                },
              },
              {
                id: generateId(),
                type: "form",
                props: {
                  padding: "p-4",
                  datarecordId: "aacfe76d-4309-466c-83ad-fda8b02b043d",
                  title: "Complex Form",
                  intro: "This is a complex form with various field types.",
                  button: {
                    label: "Submit Form",
                    borderRadius: "rounded-md",
                    color: "btn-color-accent",
                  },
                },
              },
            ],
          },
          {
            id: `s_content-${generateId()}`,
            label: "Hero",
            order: ++order,
            props: {
              minHeight: "400px",
              // backgroundColor: "secondary-dark",
            },
            bricks: [
              {
                id: `b_${generateId()}`,
                type: "hero",
                props: {},
              },
            ],
          },
          {
            id: `s_content-${generateId()}`,
            label: "Content",
            order: ++order,
            props: {},
            bricks: [
              {
                id: `b_${generateId()}`,
                type: "text",
                props: {
                  text: "This is some sample content for the second page.",
                },
              },
              {
                id: `b_${generateId()}`,
                type: "spacer",
                props: {
                  width: "20px",
                },
              },
              {
                id: `b_${generateId()}`,
                type: "card",
                props: {
                  title: "Welcome to My Site",
                  text: "This is a sample card body. You can edit this content.",
                  cardImage: {
                    src: "https://placehold.co/300x200@2x/EEEEEE/333333/svg?text=Sample",
                    alt: "Sample",
                  },
                },
              },
            ],
          },
          {
            id: `s_content-${generateId()}`,
            label: "Bottom",
            order: ++order,
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
        attributes: resolvePageAttributes({
          path: "/blog/:slug",
          queries: [
            {
              queryId: "get-employee",
              alias: "employee",
              params: [
                {
                  field: "$id",
                  op: "eq",
                  value: ":slug",
                },
              ],
            },
            {
              queryId: "get-employees",
              alias: "allEmployees",
            },
          ],
        }),
      },
      {
        id: "_page_2",
        label: "Second page with really really long name that should be truncated",
        path: "/secondPage",
        sections: [
          {
            id: `s_${generateId()}`,
            label: "Top",
            order: ++order,
            props: {
              variant: "navbar",
            },
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
            id: `s_${generateId()}`,
            label: "Form",
            order: ++order,
            props: {
              // fillSpace: true,
              justifyContent: "justify-center",
            },
            bricks: [
              {
                id: generateId(),
                type: "form",
                props: {
                  padding: "p-4",
                  datarecordId: "a7f26d80-d68e-4b7a-a4a3-e41c454670ce",
                  title: "Simple Form",
                  intro: "This is a simple form to collect user information.",
                  button: {
                    label: "Register",
                    position: "center",
                    borderRadius: "rounded-lg",
                  },
                  align: "horizontal",
                },
              },

              {
                type: "button",
                props: {
                  alignSelf: "self-auto",
                  label: "My button",
                  justifyContent: "justify-center",
                  type: "button",
                },
                id: generateId(),
              },
              {
                id: generateId(),
                type: "form",
                props: {
                  padding: "p-4",
                  datarecordId: "aacfe76d-4309-466c-83ad-fda8b02b043d",
                  title: "Complex Form",
                  intro: "This is a complex form with various field types.",
                  button: {
                    label: "Register 2",
                    borderRadius: "rounded-lg",
                  },
                },
              },
            ],
          },
          {
            id: `s_content-${generateId()}`,
            label: "Hero",
            order: ++order,
            props: {
              minHeight: "400px",
            },
            bricks: [
              {
                id: `b_${generateId()}`,
                type: "hero",
                props: {
                  color: "primary",
                },
              },
            ],
          },
          {
            id: `s_content-${generateId()}`,
            label: "Content",
            order: ++order,
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

              {
                id: `b_${generateId()}`,
                type: "spacer",
                props: {},
              },
              {
                id: `b_${generateId()}`,
                type: "card",
                props: {
                  title: "Welcome to My Site",
                  text: "This is a sample card body. You can edit this content.",
                  cardImage: {
                    src: "https://placehold.co/300x200@2x/EEEEEE/333333/svg?text=Sample",
                    alt: "Sample",
                  },
                },
              },
            ],
          },
          {
            id: `s_content-${generateId()}`,
            label: "Bottom",
            order: ++order,
            props: {
              direction: "flex-row",
            },
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
        attributes: resolvePageAttributes(),
      },
    ],
  };
}

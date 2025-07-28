import { Type, type Static } from "@sinclair/typebox";
import { defaultAttributesSchema, resolveAttributes, type AttributesSchema } from "./attributes";
import { generateId, type Section } from "./bricks";
import { datarecordsList } from "./datarecords/types";
import { datasourcesList } from "./datasources/types";
import { pageSchema } from "./page";
import { sitePrompt } from "./prompt";
import { pageInfoSchema, sitemapSchema } from "./sitemap";
import { defaultTheme, themeSchema } from "./theme";

export const siteSchema = Type.Object({
  id: Type.String(),
  label: Type.String(),
  hostname: Type.String(),
  attributes: defaultAttributesSchema,
  attr: defaultAttributesSchema,
  datasources: datasourcesList,
  datarecords: datarecordsList,
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
          tags: [],
          sectionsPlan: [],
        },
        {
          id: "_page_2",
          label: "Second page with really really long name that should be truncated",
          path: "/secondPage",
          tags: [],
          sectionsPlan: [],
        },
      ],
      attributes: defaultAttributesSchema,
      attr: resolveAttributes(),
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
          name: "Company employees",
          provider: "custom",
          schema: {
            type: "array",
            items: {
              type: "object",
              properties: {
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
              },
              required: ["firstName", "lastName", "email"],
            },
          },
          indexes: [
            {
              fields: ["email"],
              unique: true,
              name: "idx_unique_email",
            },
            {
              fields: ["lastName"],
              unique: true,
              name: "idx_unique_lastName",
            },
            {
              fields: ["height"],
              name: "idx_unique_height",
            },
            {
              fields: ["admin"],
              name: "idx_unique_admin",
            },
            {
              fields: ["startedOn"],
              name: "idx_unique_startedOn",
            },
          ],
          sampleData: [
            {
              firstName: "John",
              lastName: "Doe",
              email: "john.doe@example.com",
            },
          ],
        },
        {
          id: "employees2",
          name: "Company employees 2",
          provider: "custom",
          schema: {
            type: "array",
            items: {
              type: "object",
              properties: {
                firstName: {
                  type: "string",
                  title: "First Name",
                },
                lastName: {
                  type: "string",
                  title: "Last Name",
                },
              },
              required: ["firstName", "lastName"],
            },
          },
          indexes: [
            {
              fields: ["lastName"],
              unique: true,
              name: "idx_unique_lastName",
            },
          ],
          sampleData: [
            {
              firstName: "John",
              lastName: "Doe",
              email: "john.doe@example.com",
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
        path: "/",
        sections: [
          {
            id: `s_${generateId()}`,
            label: "Top",
            order: ++order,
            props: {
              purpose: "navbar",
            },
            bricks: [
              {
                id: generateId(),
                type: "navbar",
                props: {
                  backgroundColor: "neutral-dark-gradient",
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
                  width: "300px",
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
                  direction: "flex-row",
                  $children: [
                    {
                      id: generateId(),
                      type: "button",
                      props: {},
                    },
                    {
                      id: generateId(),
                      type: "button",
                      props: {},
                    },
                    {
                      id: generateId(),
                      type: "button",
                      props: {},
                    },
                    {
                      id: generateId(),
                      type: "button",
                      props: {},
                    },
                  ],
                },
              },
              {
                // vertical box
                id: generateId(),
                type: "box",
                props: {
                  direction: "flex-col",
                  $children: [
                    {
                      id: generateId(),
                      type: "button",
                      props: {},
                    },
                    {
                      id: generateId(),
                      type: "button",
                      props: {},
                    },
                    {
                      id: generateId(),
                      type: "button",
                      props: {},
                    },
                    {
                      id: generateId(),
                      type: "button",
                      props: {},
                    },
                  ],
                },
              },
              {
                // dynamic box
                id: generateId(),
                type: "dynamic",
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
                        width: "45%",
                      },
                    },
                    {
                      id: generateId(),
                      type: "button",
                      props: {},
                    },
                    {
                      id: generateId(),
                      type: "button",
                      props: {},
                    },
                    {
                      id: generateId(),
                      type: "button",
                      props: {},
                    },
                  ],
                },
              },
            ],
          },
          {
            id: `s_${generateId()}`,
            order: ++order,
            label: "Dynamic",
            bricks: [
              {
                type: "dynamic",
                props: {
                  alignSelf: "self-auto",
                  datasource: {},
                  $children: [],
                  height: "104.390625px",
                  width: "29.03826810534016%",
                  growHorizontally: false,
                  lastTouched: 1753359079542,
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
                  gradientDirection: "bg-gradient-to-br",
                  align: "vertical",
                  padding: "p-4",
                  fontSize: "inherit",
                  button: {
                    color: "btn-color-primary",
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
          //           filters: {
          //             patternProperties: {
          //               "^(.*)$": {
          //                 op: {},
          //               },
          //             },
          //           },
          //           sort: {
          //             patternProperties: {
          //               "^(.*)$": {},
          //             },
          //           },
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
                type: "dynamic",
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
                  growHorizontally: true,
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
                  label: "My button",
                  justifyContent: "justify-center",
                  type: "button",
                  modifier: "btn-block",
                  color: "btn-color-primary",
                  width: "20.834446225071225%",
                  height: "42px",
                  growHorizontally: false,
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
                    color: "btn-color-primary",
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
        tags: [],
        attributes: defaultAttributesSchema,
        attr: resolveAttributes(),
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
              purpose: "navbar",
            },
            bricks: [
              {
                id: generateId(),
                type: "navbar",
                props: {
                  backgroundColor: "neutral-dark-gradient",
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
                    color: "btn-color-primary",
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
                    position: "left",
                    borderRadius: "rounded-lg",
                    color: "btn-color-primary",
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
                props: {},
              },
              {
                id: `b_${generateId()}`,
                type: "card",
                props: {
                  cardTitle: "Welcome to My Site",
                  cardBody: "This is a sample card body. You can edit this content.",
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
        tags: [],
        attributes: defaultAttributesSchema,
        attr: resolveAttributes(),
      },
    ],
  };
}

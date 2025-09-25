import { Type, type Static, type TObject } from "@sinclair/typebox";
import { customAlphabet } from "nanoid";
import { brickTypes, defaultProps, manifests } from "./bricks/manifests/all-manifests";
import { cssLengthRef } from "./bricks/props/css-length";
import { colorPresetRef } from "./bricks/props/color-preset";
import { mergeIgnoringArrays } from "./utils/merge";
import { getSchemaDefaults } from "./utils/schema";
import { StringEnum } from "./utils/string-enum";
import { alignItemsRef, justifyContentRef } from "./bricks/props/align";
import type { CommonBrickProps } from "./bricks/props/common";
import { directionRef } from "./bricks/props/direction";
import type { PageAttributes, SiteAttributes } from "./attributes";
import { toLLMSchema } from "./utils/llm";
import { backgroundRef } from "./bricks/props/background";

/**
 * Generates a unique identifier for bricks.
 */
export const generateId = customAlphabet("azertyuiopqsdfghjklmwxcvbnAZERTYUIOPQSDFGHJKLMWXCVBN", 7);

const brickAbsolutePositionSchema = Type.Object({
  left: Type.Optional(
    Type.String({
      title: "top",
      description: "The left position in css unit.",
    }),
  ),
  top: Type.Optional(
    Type.String({
      title: "top",
      description: "The top position in css unit.",
    }),
  ),
  right: Type.Optional(
    Type.String({
      title: "right",
      description: "The right position in css unit.",
    }),
  ),
  bottom: Type.Optional(
    Type.String({
      title: "bottom",
      description: "The bottom position in css unit.",
    }),
  ),
  inset: Type.Optional(
    Type.String({
      title: "inset",
      description: "The inset position in css unit.",
    }),
  ),
  translateX: Type.Optional(
    Type.String({
      title: "translateX",
      description: "The translateX position in css unit.",
    }),
  ),
  translateY: Type.Optional(
    Type.String({
      title: "translateY",
      description: "The translateY position in css unit.",
    }),
  ),
  rotate: Type.Optional(
    Type.String({
      title: "rotate",
      description: "The rotate position in css unit.",
    }),
  ),
});

export type BrickAbsolutePosition = Static<typeof brickAbsolutePositionSchema>;

export const brickTypeSchema = StringEnum(Object.keys(defaultProps), {
  title: "Brick type",
});

export const brickSchema = Type.Object(
  {
    id: Type.String({
      title: "ID",
      description: "A unique identifier for the brick.",
    }),
    type: brickTypeSchema,
    label: Type.Optional(
      Type.String({
        title: "Label",
        description: "A human-readable label for the brick. Used for organization and identification.",
      }),
    ),
    props: Type.Any({
      title: "Props",
      description: "The static props of the brick. The available props depends on the brick type.",
    }),
    mobileProps: Type.Optional(
      Type.Any({
        title: "Props",
        description:
          "The overriden props for mobile, merged with desktop props. Same type as props but partial.",
      }),
    ),
  },
  { additionalProperties: true },
);

export function makeFullBrickSchemaForLLM(type: string, otherTypes?: string[]) {
  return toLLMSchema(
    Type.Object(
      {
        id: Type.String({
          title: "ID",
          description: "A unique identifier for the brick.",
        }),
        type: Type.Literal(type),
        props: manifests[type].props,
        mobileProps: Type.Optional(Type.Partial(manifests[type].props)),
      },
      // IMPORTANT: DO NOT set "additionalProperties" to `false` because it would break validation with Cabidela library
      // { additionalProperties: false },
    ),
  );
}

export type Brick = Omit<Static<typeof brickSchema>, "props" | "mobileProps"> & {
  props: CommonBrickProps & Record<string, unknown>;
  mobileProps?: CommonBrickProps & Record<string, unknown>;
};

export const sectionProps = Type.Object(
  {
    colorPreset: Type.Optional(
      colorPresetRef({
        title: "Color",
      }),
    ),
    backgroundImage: Type.Optional(
      backgroundRef({
        title: "Background",
        description:
          "The background image of the section. Prefer to set background images on sections rather than on individual bricks.",
      }),
    ),
    direction: directionRef({
      default: "flex-row",
      title: "Direction",
      description: "The direction of the section. Only apply to desktop. On mobile, it is always vertical.",
      "ui:responsive": "desktop",
    }),
    minHeight: Type.Optional(
      cssLengthRef({
        title: "Min height",
        default: "fit-content",
        description:
          "The min height of the section. default is 'fit-content'. You can also use  the keyword 'full' to make it full viewport height. Lastly, you can use any valid CSS length unit.",
        "ui:field": "hidden",
      }),
    ),
    variant: Type.Optional(
      StringEnum(["navbar", "footer", "sidebar"], {
        title: "Custom section variant",
        description: "Used for custom styling and layout.",
        enumNames: ["Navbar", "Footer", "Sidebar"],
        "ui:field": "hidden",
        "ai:hidden": true,
      }),
    ),
    maxWidth: Type.Optional(
      StringEnum(["max-w-screen-lg", "max-w-screen-xl", "max-w-screen-2xl", "max-w-full"], {
        title: "Max width",
        default: "max-w-full",
        enumNames: ["M", "L", "XL", "Full"],
        description: "The maximum width of the section. Desktop only",
        "ai:instructions":
          "Choose the most appropriate max width for the section. The value 'max-w-full' is the most common and the default. Use the same value for all sections on the same page unless there is a good reason to do otherwise.",
        displayAs: "button-group",
        "ui:responsive": "desktop",
      }),
    ),
    verticalMargin: Type.Optional(
      cssLengthRef({
        title: "Vertical Margin",
        description:
          "The vertical margin of the section. By default, all sections touch each other with no space in between. If you want to add space between sections, set this value to e.g. '2rem' or '32px'. Adding a vertical margin will reveal the background color of the page.",
        default: "0",
        "ui:styleId": "styles:verticalMargin",
      }),
    ),
    justifyContent: Type.Optional(
      justifyContentRef({
        default: "justify-center",
      }),
    ),
    alignItems: Type.Optional(
      alignItemsRef({
        default: "items-center",
      }),
    ),
    padding: Type.Optional(
      cssLengthRef({
        default: "2rem",
        description: "Padding inside the section.",
        title: "Padding",
        "ui:responsive": true,
        "ui:placeholder": "Not specified",
        "ui:styleId": "styles:padding",
      }),
    ),
    gap: Type.Optional(
      cssLengthRef({
        title: "Gap",
        description: "The gap between the bricks in the section.",
        default: "20px",
        "ui:styleId": "styles:gap",
      }),
    ),
    wrap: Type.Optional(
      Type.Boolean({
        title: "Wrap",
        description: "Wrap bricks if they overflow the section.",
        default: true,
        "ui:styleId": "styles:wrap",
      }),
    ),
    lastTouched: Type.Optional(
      Type.Number({
        description: "Do not use this field. It is used internally by the editor.",
        "ui:field": "hidden",
        "ai:hidden": true,
      }),
    ),
  },
  {
    additionalProperties: false,
  },
);

export const sectionSchema = Type.Object(
  {
    id: Type.String({
      description: "The unique ID of the section. Use a human readable url-safe slug",
      examples: ["content-section", "contact-section"],
    }),
    label: Type.String({
      description: "The label of the section. Shown only to the website owner, not public.",
      examples: ["Content", "Contact"],
    }),
    order: Type.Number({
      description: "Determines section order in the page (lower numbers appear first). 0-based",
    }),
    props: sectionProps,
    mobileProps: Type.Optional(Type.Partial(sectionProps, { additionalProperties: false })),
    bricks: Type.Array(brickSchema),
  },
  {
    description: "Sections are direct children of the page that are stacked vertically.",
  },
);

export const sectionSchemaLLM = toLLMSchema(sectionSchema);
export const sectionSchemaNoBricks = Type.Omit(sectionSchema, ["bricks"]);
export type SectionSchemaNoBricks = Static<typeof sectionSchemaNoBricks>;

export const sectionSchemaNoBricksLLM = toLLMSchema(sectionSchemaNoBricks);

const sectionDefaultprops = getSchemaDefaults(sectionSchema.properties.props, "desktop") as Section["props"];
const sectionMobileDefaultprops = getSchemaDefaults(
  sectionSchema.properties.mobileProps,
  "mobile",
) as Section["mobileProps"];

export type Section = Static<typeof sectionSchema>;

export function processSections(
  sections: Section[],
  siteAttributes: SiteAttributes,
  pageAttributes: PageAttributes,
): Section[] {
  const processSection = (section: Section) => {
    return {
      ...section,
      props: mergeIgnoringArrays({} as Section["props"], sectionDefaultprops, section.props),
      mobileProps: mergeIgnoringArrays({}, sectionMobileDefaultprops, section.mobileProps || {}),
      bricks: section.bricks.map(processBrick).filter(Boolean) as Brick[],
    } as const;
  };

  const finalSections = sections.map(processSection);

  if (siteAttributes.navbar && !pageAttributes.noNavbar) {
    finalSections.unshift(
      processSection({
        order: -1,
        id: "navbar-section",
        label: "Navbar",
        props: {
          variant: "navbar",
          direction: "flex-row",
        },
        mobileProps: {},
        bricks: [
          {
            id: "navbar",
            type: "navbar",
            props: siteAttributes.navbar,
          },
        ],
      }),
    );
  }
  if (siteAttributes.footer && !pageAttributes.noFooter) {
    finalSections.push(
      processSection({
        order: 1000,
        id: "footer-section",
        label: "Footer",
        props: {
          variant: "footer",
          direction: "flex-row",
        },
        mobileProps: {},
        bricks: [
          {
            id: "footer",
            type: "footer",
            props: siteAttributes.footer,
          },
        ],
      }),
    );
  }

  return finalSections satisfies Section[];
}

/**
 *  process a brick and add default props
 */
export function processBrick<T extends Brick>(brick: T): T {
  const defProps = defaultProps[brick.type];
  // if (!defProps) {
  //   console.warn(`No default props found for brick type: ${brick.type}`);
  //   return false; // or throw an error if you prefer
  // }
  const result = {
    ...brick,
    props: mergeIgnoringArrays({} as Brick["props"], defProps.props, {
      ...brick.props,
      ...(brick.props.$children
        ? { $children: (brick.props.$children as T[]).map(processBrick).filter(Boolean) }
        : {}),
    }),
  };

  return result;
}

export function getDefaultPropsForBrick(type: string) {
  return defaultProps[type].props;
}

export function createEmptyBrick(type: string, ghost = false): Brick {
  const props = { ...defaultProps[type].props, ghost };
  const newBrick = {
    id: `b-${generateId()}`,
    type,
    props,
  };
  return newBrick;
}

export const sectionsExamples: { label: string; description: string; example: Section }[] = [
  {
    label: "Hero section with centered 'hero' and 'button' bricks",
    description: `A simple hero section with a title and a light primary background.
The "hero" brick does not have a colorPreset so it is transparent and inherits the background/text-color settings from the section.
Bricks are centered both vertically and horizontally using justifyContent and alignItems.
Bricks are stacked vertically using the "direction" set to "flex-col".
`,
    example: {
      id: "hero-section",
      label: "Hero",
      order: 0,
      props: {
        colorPreset: { color: "primary-100" },
        direction: "flex-col",
        padding: "6rem",
        gap: "3rem",
        justifyContent: "justify-center",
        alignItems: "items-center",
      },
      bricks: [
        {
          id: "hero",
          type: "hero",
          label: "Main hero title",
          props: {
            content: "<h1 style='text-align:center'>Welcome to my SaaS</h1>",
            tagline: "The future of productivity starts here",
          },
        },
        {
          id: "cta-button",
          type: "button",
          label: "Call to action button",
          props: {
            label: "Get Started",
            href: "/signup",
            colorPreset: { color: "primary-500", variant: "solid" },
          },
        },
      ],
    },
  },
  {
    label: "Contact section with a text and a form",
    description: `A contact section with a title and a form.
The section has a light gray background using a colorPreset.
Bricks are stacked vertically using the "direction" set to "flex-col".
`,
    example: {
      id: "contact-section",
      label: "Contact",
      order: 1,
      props: {
        colorPreset: { color: "gray-100" },
        direction: "flex-col",
        padding: "4rem",
        gap: "2rem",
        justifyContent: "justify-center",
        alignItems: "items-center",
      },
      bricks: [
        {
          id: "contact-title",
          type: "text",
          props: {
            content: "<h2>Get in Touch</h2>",
          },
        },
        {
          id: "contact-form",
          type: "form",
          props: {
            title: "Contact Us",
            fields: [
              { name: "name", label: "Name", type: "text", required: true },
              { name: "email", label: "Email", type: "email", required: true },
              { name: "message", label: "Message", type: "textarea", required: true },
            ],
          },
        },
      ],
    },
  },
  {
    label: "Feature showcase with horizontal layout and container brick",
    description: `A features section using horizontal layout with a container "box" brick that holds multiple feature items.
The box brick is the only container type that can hold $children (other bricks).
This demonstrates nested brick structure where the box contains multiple feature bricks.`,
    example: {
      id: "features-section",
      label: "Features",
      order: 2,
      props: {
        direction: "flex-col",
        padding: "5rem",
        gap: "3rem",
        maxWidth: "max-w-screen-xl",
        justifyContent: "justify-center",
        alignItems: "items-center",
      },
      bricks: [
        {
          id: "features-title",
          type: "text",
          props: {
            content: "<h2 style='text-align:center'>Our Features</h2>",
          },
        },
        {
          id: "features-container",
          type: "box",
          props: {
            direction: "flex-row",
            gap: "2rem",
            padding: "2rem",
            $children: [
              {
                id: "feature-1",
                type: "text",
                props: {
                  content: "<h3>Fast</h3><p>Lightning-fast performance for your needs.</p>",
                  colorPreset: { color: "blue-500" },
                },
              },
              {
                id: "feature-2",
                type: "text",
                props: {
                  content: "<h3>Secure</h3><p>Enterprise-grade security built-in.</p>",
                  colorPreset: { color: "green-500" },
                },
              },
              {
                id: "feature-3",
                type: "text",
                props: {
                  content: "<h3>Scalable</h3><p>Grows with your business seamlessly.</p>",
                  colorPreset: { color: "purple-500" },
                },
              },
            ],
          },
        },
      ],
    },
  },
  {
    label: "Media-rich section with image and text side by side",
    description: `A content section using horizontal layout to place an image next to text content.
Demonstrates how direction "flex-row" arranges bricks horizontally.
The section uses responsive mobile overrides to stack vertically on mobile.`,
    example: {
      id: "about-section",
      label: "About",
      order: 3,
      props: {
        direction: "flex-row",
        padding: "4rem",
        gap: "3rem",
        alignItems: "items-center",
        maxWidth: "max-w-screen-xl",
      },
      mobileProps: {
        direction: "flex-col",
        padding: "2rem",
      },
      bricks: [
        {
          id: "about-image",
          type: "image",
          props: {
            src: "https://example.com/about-image.jpg",
            alt: "About our company",
            width: "400px",
            height: "300px",
          },
        },
        {
          id: "about-text",
          type: "text",
          props: {
            content:
              "<h2>About Us</h2><p>We are a leading company in innovative solutions, dedicated to transforming how businesses operate in the digital age.</p>",
          },
        },
      ],
    },
  },
  {
    label: "Complex nested layout with multiple container levels",
    description: `Advanced example showing deeply nested brick structure using multiple box containers.
Demonstrates how box bricks can contain other box bricks, creating sophisticated layouts.
Shows responsive design with different mobile arrangements.`,
    example: {
      id: "complex-layout-section",
      label: "Complex layout",
      order: 4,
      props: {
        direction: "flex-col",
        padding: "4rem",
        gap: "2rem",
        backgroundImage: { image: "https://example.com/bg.jpg" },
      },
      bricks: [
        {
          id: "main-container",
          type: "box",
          props: {
            direction: "flex-row",
            gap: "2rem",
            padding: "2rem",
            $children: [
              {
                id: "left-column",
                type: "box",
                props: {
                  direction: "flex-col",
                  gap: "1rem",
                  colorPreset: { color: "gray-50" },
                  padding: "1.5rem",
                  $children: [
                    {
                      id: "left-title",
                      type: "text",
                      props: {
                        content: "<h3>Left Column</h3>",
                      },
                    },
                    {
                      id: "left-button",
                      type: "button",
                      props: {
                        label: "Learn More",
                        href: "/learn",
                        colorPreset: { color: "blue-500", variant: "outline" },
                      },
                    },
                  ],
                },
              },
              {
                id: "right-column",
                type: "box",
                props: {
                  direction: "flex-col",
                  gap: "1rem",
                  colorPreset: { color: "blue-50" },
                  padding: "1.5rem",
                  $children: [
                    {
                      id: "right-image",
                      type: "image",
                      props: {
                        src: "https://example.com/feature.jpg",
                        alt: "Feature showcase",
                        width: "100%",
                      },
                    },
                    {
                      id: "right-text",
                      type: "text",
                      props: {
                        content: "<p>Detailed description of our amazing features and capabilities.</p>",
                      },
                    },
                  ],
                },
              },
            ],
            mobileProps: {
              direction: "flex-col",
            },
          },
        },
      ],
    },
  },
  {
    label: "Footer-style section with multiple columns",
    description: `A footer-like section demonstrating horizontal layout with multiple informational columns.
Uses the footer variant for special styling and contains multiple text bricks arranged horizontally.
Shows how to create multi-column layouts using direction and gap properties.`,
    example: {
      id: "info-footer-section",
      label: "Info footer",
      order: 5,
      props: {
        variant: "footer",
        direction: "flex-row",
        padding: "3rem",
        gap: "4rem",
        colorPreset: { color: "gray-800" },
        justifyContent: "justify-center",
      },
      mobileProps: {
        direction: "flex-col",
        gap: "2rem",
      },
      bricks: [
        {
          id: "company-info",
          type: "text",
          props: {
            content:
              "<h4 style='color:white'>Company</h4><p style='color:gray'>About Us<br>Careers<br>Contact</p>",
          },
        },
        {
          id: "product-info",
          type: "text",
          props: {
            content:
              "<h4 style='color:white'>Product</h4><p style='color:gray'>Features<br>Pricing<br>Documentation</p>",
          },
        },
        {
          id: "support-info",
          type: "text",
          props: {
            content:
              "<h4 style='color:white'>Support</h4><p style='color:gray'>Help Center<br>Community<br>Status</p>",
          },
        },
      ],
    },
  },
  {
    label: "Video showcase section with title and description",
    description: `A media section featuring a YouTube video with accompanying text.
Shows how to use video bricks for multimedia content.
The section uses a light background to make the video stand out.`,
    example: {
      id: "video-showcase-section",
      label: "Video showcase",
      order: 6,
      props: {
        direction: "flex-col",
        padding: "4rem",
        gap: "2rem",
        colorPreset: { color: "gray-50" },
        alignItems: "items-center",
        maxWidth: "max-w-screen-lg",
      },
      bricks: [
        {
          id: "video-title",
          type: "text",
          props: {
            content: "<h2 style='text-align:center'>Watch Our Demo</h2>",
          },
        },
        {
          id: "demo-video",
          type: "video",
          props: {
            url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            title: "Product Demo Video",
          },
        },
        {
          id: "video-description",
          type: "text",
          props: {
            content:
              "<p style='text-align:center'>See how our platform can transform your workflow in just 2 minutes.</p>",
          },
        },
      ],
    },
  },
  {
    label: "Image gallery section with carousel",
    description: `A media-rich section showcasing an image carousel.
Demonstrates how to use carousel bricks for displaying multiple images.
Perfect for portfolios, product showcases, or photo galleries.`,
    example: {
      id: "gallery-section",
      label: "Gallery",
      order: 7,
      props: {
        direction: "flex-col",
        padding: "4rem",
        gap: "2rem",
        alignItems: "items-center",
      },
      bricks: [
        {
          id: "gallery-title",
          type: "text",
          props: {
            content: "<h2 style='text-align:center'>Our Portfolio</h2>",
          },
        },
        {
          id: "portfolio-carousel",
          type: "carousel",
          props: {
            images: [
              { src: "https://example.com/project1.jpg", alt: "Project 1" },
              { src: "https://example.com/project2.jpg", alt: "Project 2" },
              { src: "https://example.com/project3.jpg", alt: "Project 3" },
            ],
            autoplay: true,
            showDots: true,
          },
        },
      ],
    },
  },
  {
    label: "Interactive form section with styled inputs",
    description: `A comprehensive form section for user registration or contact.
Shows how to create forms with various field types and validation.
Uses a card-like appearance with rounded corners and shadow.`,
    example: {
      id: "signup-form-section",
      label: "Signup form",
      order: 8,
      props: {
        direction: "flex-col",
        padding: "4rem",
        gap: "2rem",
        colorPreset: { color: "blue-50" },
        alignItems: "items-center",
      },
      bricks: [
        {
          id: "form-header",
          type: "text",
          props: {
            content:
              "<h2 style='text-align:center'>Join Our Platform</h2><p style='text-align:center'>Create your account and start building today.</p>",
          },
        },
        {
          id: "registration-form",
          type: "form",
          props: {
            title: "Sign Up",
            submitLabel: "Create Account",
            fields: [
              { name: "firstName", label: "First Name", type: "text", required: true },
              { name: "lastName", label: "Last Name", type: "text", required: true },
              { name: "email", label: "Email Address", type: "email", required: true },
              { name: "password", label: "Password", type: "password", required: true },
              { name: "company", label: "Company", type: "text", required: false },
              { name: "newsletter", label: "Subscribe to newsletter", type: "checkbox", required: false },
            ],
            colorPreset: { color: "white" },
            shadow: "shadow-lg",
            rounding: "rounded-lg",
            padding: "2rem",
          },
        },
      ],
    },
  },
  {
    label: "Testimonials section with customer feedback",
    description: `A social proof section using the testimonials brick to display customer feedback.
Shows how to structure testimonials with avatars, company information, and social icons.
Perfect for building trust and credibility with potential customers.`,
    example: {
      id: "testimonials-section",
      label: "Testimonials",
      order: 9,
      props: {
        direction: "flex-col",
        padding: "5rem",
        gap: "3rem",
        colorPreset: { color: "purple-50" },
        alignItems: "items-center",
      },
      bricks: [
        {
          id: "testimonials-title",
          type: "text",
          props: {
            content: "<h2 style='text-align:center'>What Our Customers Say</h2>",
          },
        },
        {
          id: "customer-testimonials",
          type: "testimonials",
          props: {
            testimonials: [
              {
                text: "This platform has completely transformed how we handle our projects. The automation features and intuitive interface have saved us countless hours every week.",
                author: "Sarah Johnson",
                company: "TechCorp Solutions",
                avatar: {
                  src: "https://via.placeholder.com/80x80.png?text=SJ",
                  alt: "Sarah Johnson profile photo",
                },
                socialIcon: "mdi:linkedin",
              },
              {
                text: "Outstanding customer support and regular feature updates. We've been using this for over a year and it keeps getting better. Highly recommend!",
                author: "Mike Chen",
                company: "StartupFlow",
                avatar: {
                  src: "https://via.placeholder.com/80x80.png?text=MC",
                  alt: "Mike Chen profile photo",
                },
                socialIcon: "mdi:twitter",
              },
              {
                text: "The results speak for themselves - our productivity increased by 40% after implementing this solution. It's like having an extra team member.",
                author: "Emily Rodriguez",
                company: "Digital Agency Pro",
                avatar: {
                  src: "https://via.placeholder.com/80x80.png?text=ER",
                  alt: "Emily Rodriguez profile photo",
                },
                socialIcon: "mdi:briefcase",
              },
            ],
            colorPreset: { color: "white" },
            shadow: "shadow-lg",
            padding: "2rem",
            gap: "2rem",
          },
        },
      ],
    },
  },
  {
    label: "Location and contact information with map",
    description: `A contact section featuring an interactive map alongside contact details.
Shows how to combine map bricks with text and contact information.
Perfect for businesses with physical locations.`,
    example: {
      id: "location-section",
      label: "Location",
      order: 10,
      props: {
        direction: "flex-row",
        padding: "4rem",
        gap: "3rem",
        alignItems: "items-start",
      },
      mobileProps: {
        direction: "flex-col",
      },
      bricks: [
        {
          id: "contact-details",
          type: "box",
          props: {
            direction: "flex-col",
            gap: "2rem",
            padding: "2rem",
            colorPreset: { color: "gray-50" },
            rounding: "rounded-lg",
            $children: [
              {
                id: "office-title",
                type: "text",
                props: {
                  content: "<h3>Visit Our Office</h3>",
                },
              },
              {
                id: "address",
                type: "text",
                props: {
                  content:
                    "<p><strong>Address:</strong><br>123 Business Street<br>Suite 100<br>San Francisco, CA 94105</p>",
                },
              },
              {
                id: "contact-info",
                type: "text",
                props: {
                  content:
                    "<p><strong>Phone:</strong> +1 (555) 123-4567<br><strong>Email:</strong> hello@company.com</p>",
                },
              },
              {
                id: "hours",
                type: "text",
                props: {
                  content:
                    "<p><strong>Business Hours:</strong><br>Monday - Friday: 9:00 AM - 6:00 PM<br>Saturday: 10:00 AM - 4:00 PM</p>",
                },
              },
            ],
          },
        },
        {
          id: "office-map",
          type: "map",
          props: {
            address: "123 Business Street, San Francisco, CA 94105",
            zoom: 15,
            height: "400px",
          },
        },
      ],
    },
  },
  {
    label: "Statistics showcase with icons and numbers",
    description: `A metrics section displaying key statistics using icon and text bricks.
Demonstrates how to create compelling data visualizations.
Uses horizontal layout with consistent spacing and visual hierarchy.`,
    example: {
      id: "stats-section",
      label: "Stats",
      order: 11,
      props: {
        direction: "flex-col",
        padding: "5rem",
        gap: "3rem",
        colorPreset: { color: "gradient", gradientDirection: "bg-gradient-to-r" },
        alignItems: "items-center",
      },
      bricks: [
        {
          id: "stats-title",
          type: "text",
          props: {
            content: "<h2 style='text-align:center; color:white'>Our Impact</h2>",
          },
        },
        {
          id: "stats-container",
          type: "box",
          props: {
            direction: "flex-row",
            gap: "4rem",
            justifyContent: "justify-center",
            $children: [
              {
                id: "users-stat",
                type: "box",
                props: {
                  direction: "flex-col",
                  gap: "1rem",
                  alignItems: "items-center",
                  $children: [
                    {
                      id: "users-icon",
                      type: "icon",
                      props: {
                        icon: "users",
                        size: "3rem",
                        color: "white",
                      },
                    },
                    {
                      id: "users-number",
                      type: "text",
                      props: {
                        content:
                          "<h3 style='color:white; text-align:center'>50K+</h3><p style='color:white; text-align:center'>Active Users</p>",
                      },
                    },
                  ],
                },
              },
              {
                id: "projects-stat",
                type: "box",
                props: {
                  direction: "flex-col",
                  gap: "1rem",
                  alignItems: "items-center",
                  $children: [
                    {
                      id: "projects-icon",
                      type: "icon",
                      props: {
                        icon: "briefcase",
                        size: "3rem",
                        color: "white",
                      },
                    },
                    {
                      id: "projects-number",
                      type: "text",
                      props: {
                        content:
                          "<h3 style='color:white; text-align:center'>100K+</h3><p style='color:white; text-align:center'>Projects Created</p>",
                      },
                    },
                  ],
                },
              },
              {
                id: "satisfaction-stat",
                type: "box",
                props: {
                  direction: "flex-col",
                  gap: "1rem",
                  alignItems: "items-center",
                  $children: [
                    {
                      id: "satisfaction-icon",
                      type: "icon",
                      props: {
                        icon: "star",
                        size: "3rem",
                        color: "white",
                      },
                    },
                    {
                      id: "satisfaction-number",
                      type: "text",
                      props: {
                        content:
                          "<h3 style='color:white; text-align:center'>98%</h3><p style='color:white; text-align:center'>Satisfaction Rate</p>",
                      },
                    },
                  ],
                },
              },
            ],
            mobileProps: {
              direction: "flex-col",
              gap: "2rem",
            },
          },
        },
      ],
    },
  },
  {
    label: "Social links and newsletter signup",
    description: `A community engagement section combining social media links with newsletter signup.
Shows how to use social-links bricks and forms together.
Creates a cohesive call-to-action for community building.`,
    example: {
      id: "community-section",
      label: "Community",
      order: 12,
      props: {
        direction: "flex-col",
        padding: "4rem",
        gap: "3rem",
        colorPreset: { color: "indigo-100" },
        alignItems: "items-center",
        maxWidth: "max-w-full",
      },
      bricks: [
        {
          id: "community-title",
          type: "text",
          props: {
            content:
              "<h2 style='text-align:center'>Stay Connected</h2><p style='text-align:center'>Join our community and never miss an update.</p>",
          },
        },
        {
          id: "social-links",
          type: "social-links",
          props: {
            links: [
              { platform: "twitter", url: "https://twitter.com/company" },
              { platform: "linkedin", url: "https://linkedin.com/company/company" },
              { platform: "github", url: "https://github.com/company" },
              { platform: "youtube", url: "https://youtube.com/company" },
            ],
            size: "large",
            style: "filled",
          },
        },
        {
          id: "newsletter-form",
          type: "form",
          props: {
            title: "Subscribe to Our Newsletter",
            subtitle: "Get weekly updates and exclusive content delivered to your inbox.",
            submitLabel: "Subscribe",
            fields: [
              {
                name: "email",
                label: "Email Address",
                type: "email",
                required: true,
                placeholder: "your@email.com",
              },
            ],
            colorPreset: { color: "white" },
            rounding: "rounded-lg",
            padding: "2rem",
            shadow: "shadow-md",
          },
        },
      ],
    },
  },
  {
    label: "Pricing table with multiple options",
    description: `A pricing section using card bricks to create a comparison table.
Demonstrates how to structure pricing tiers with different features.
Uses consistent styling with highlighted premium option.`,
    example: {
      id: "pricing-section",
      label: "Pricing",
      order: 13,
      props: {
        direction: "flex-col",
        padding: "5rem",
        gap: "3rem",
        alignItems: "items-center",
      },
      bricks: [
        {
          id: "pricing-header",
          type: "text",
          props: {
            content:
              "<h2 style='text-align:center'>Choose Your Plan</h2><p style='text-align:center'>Select the perfect plan for your needs.</p>",
          },
        },
        {
          id: "pricing-cards",
          type: "box",
          props: {
            direction: "flex-row",
            gap: "2rem",
            justifyContent: "justify-center",
            $children: [
              {
                id: "basic-plan",
                type: "card",
                props: {
                  title: "Basic",
                  subtitle: "$9/month",
                  content: "• 5 Projects<br>• 10GB Storage<br>• Email Support<br>• Basic Templates",
                  colorPreset: { color: "white" },
                  border: { width: "border-2", color: "border-gray-200" },
                  rounding: "rounded-lg",
                  padding: "2rem",
                  shadow: "shadow-md",
                },
              },
              {
                id: "pro-plan",
                type: "card",
                props: {
                  title: "Pro",
                  subtitle: "$29/month",
                  content:
                    "• Unlimited Projects<br>• 100GB Storage<br>• Priority Support<br>• Premium Templates<br>• Advanced Analytics",
                  colorPreset: { color: "blue-500" },
                  rounding: "rounded-lg",
                  padding: "2rem",
                  shadow: "shadow-lg",
                  border: { width: "border-2", color: "border-blue-400" },
                },
              },
              {
                id: "enterprise-plan",
                type: "card",
                props: {
                  title: "Enterprise",
                  subtitle: "Custom",
                  content:
                    "• Everything in Pro<br>• Unlimited Storage<br>• 24/7 Phone Support<br>• Custom Integrations<br>• Dedicated Account Manager",
                  colorPreset: { color: "white" },
                  border: { width: "border-2", color: "border-gray-200" },
                  rounding: "rounded-lg",
                  padding: "2rem",
                  shadow: "shadow-md",
                },
              },
            ],
            mobileProps: {
              direction: "flex-col",
            },
          },
        },
      ],
    },
  },
];

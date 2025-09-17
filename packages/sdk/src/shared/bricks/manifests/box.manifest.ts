import { defineBrickManifest } from "~/shared/brick-manifest";
import { defineProps } from "../props/helpers";
import { Type } from "@sinclair/typebox";
import { borderRef, roundingRef } from "../props/border";
import { shadowRef } from "../props/effects";
import type { BrickProps } from "../props/types";
import { cssLengthRef } from "../props/css-length";
import { directionRef } from "../props/direction";
import { RxBox } from "react-icons/rx";
import { alignItemsRef, justifyContentRef } from "../props/align";
import { colorPresetRef } from "../props/color-preset";
import { loopRef } from "../props/dynamic";

// Generic container can hold any type of array data source
export const manifest = defineBrickManifest({
  type: "box",
  category: "container",
  name: "Box",
  description: "A container for stacking bricks horizontally or vertically.",
  aiInstructions:
    "A box is a container for other bricks. A box cannot contain other boxes as children. A box should contain at least 2 bricks to be useful, otherwise use a simple brick instead.",
  isContainer: true,
  defaultWidth: {
    desktop: "auto",
    mobile: "100%",
  },
  defaultHeight: {
    desktop: "auto",
  },
  icon: RxBox,
  props: defineProps({
    colorPreset: Type.Optional(
      colorPresetRef({
        title: "Color",
      }),
    ),
    direction: directionRef({
      default: "flex-col",
      title: "Direction",
      description: "Direction of the box layout",
    }),
    justifyContent: Type.Optional(
      justifyContentRef({
        default: "justify-center",
      }),
    ),
    alignItems: Type.Optional(
      alignItemsRef({
        default: "items-stretch",
      }),
    ),
    gap: Type.Optional(
      cssLengthRef({
        title: "Gap",
        default: "1rem",
        description: "Gap between children bricks.",
        "ai:instructions":
          "Can be a tailwind gap class like 'gap-1' or 'gap-2', or a custom value like '10px'",
        "ui:placeholder": "Not specified",
        "ui:styleId": "styles:gap",
      }),
    ),
    padding: Type.Optional(
      cssLengthRef({
        default: "1rem",
        description: "Padding inside the box.",
        "ai:instructions": "Use only a single value like '1rem' or '10px'",
        title: "Padding",
        "ui:placeholder": "Not specified",
        "ui:styleId": "styles:padding",
      }),
    ),
    wrap: Type.Optional(
      Type.Boolean({
        title: "Wrap",
        description: "Wrap bricks if they overflow the section.",
        default: false,
        "ui:styleId": "styles:wrap",
      }),
    ),
    rounding: Type.Optional(
      roundingRef({
        default: "rounded-md",
      }),
    ),
    border: Type.Optional(borderRef()),
    shadow: Type.Optional(shadowRef()),
    loop: Type.Optional(loopRef()),
    $children: Type.Array(Type.Any(), {
      "ui:field": "hidden",
      description: "List of nested bricks",
      default: [],
      examples: [
        [
          {
            type: "text",
            props: {
              content: "Hello World",
            },
          },
          {
            type: "image",
            props: {
              src: "https://via.placeholder.com/150",
              alt: "Placeholder Image",
            },
          },
        ],
      ],
    }),
  }),
});

export type Manifest = typeof manifest;

export const examples: {
  description: string;
  type: string;
  props: BrickProps<Manifest>["brick"]["props"];
}[] = [
  {
    description: "A simple box with 2 text bricks aligned vertically",
    type: "box",
    props: {
      direction: "flex-col",
      gap: "1rem",
      $children: [
        {
          type: "text",
          props: {
            $children: [
              {
                type: "text",
                props: {
                  content: "Hello World",
                },
              },
              {
                type: "text",
                props: {
                  content: "Hello World",
                },
              },
            ],
          },
        },
      ],
    },
  },
  {
    description: "A horizontal box with wrapping enabled - images will wrap to new rows if they overflow",
    type: "box",
    props: {
      direction: "flex-row",
      gap: "1rem",
      wrap: true,
      $children: [
        {
          type: "image",
          props: {
            src: "https://via.placeholder.com/150",
            alt: "Placeholder Image",
          },
        },
        {
          type: "image",
          props: {
            src: "https://via.placeholder.com/150",
            alt: "Placeholder Image",
          },
        },
        {
          type: "image",
          props: {
            src: "https://via.placeholder.com/150",
            alt: "Placeholder Image",
          },
        },
        {
          type: "image",
          props: {
            src: "https://via.placeholder.com/150",
            alt: "Placeholder Image",
          },
        },
        {
          type: "image",
          props: {
            src: "https://via.placeholder.com/150",
            alt: "Placeholder Image",
          },
        },
      ],
    },
  },
  {
    description: "A vertical box with 2 text bricks and 1 image",
    type: "box",
    props: {
      direction: "flex-col",
      gap: "1rem",
      $children: [
        {
          type: "text",
          props: {
            content: "Hello World",
          },
        },
        {
          type: "image",
          props: {
            src: "https://via.placeholder.com/150",
            alt: "Placeholder Image",
          },
        },
        {
          type: "text",
          props: {
            content: "Hello World",
          },
        },
      ],
    },
  },
  {
    description: "Employee directory using allEmployees query with vertical layout",
    type: "box",
    props: {
      direction: "flex-col",
      gap: "1.5rem",
      padding: "2rem",
      colorPreset: {
        color: "neutral-100",
      },
      rounding: "rounded-lg",
      loop: {
        over: "allEmployees",
      },
      $children: [
        {
          type: "text",
          props: {
            content:
              "<h3>{{allEmployees.name}}</h3><p><strong>{{allEmployees.position}}</strong></p><p>{{allEmployees.department}} • {{allEmployees.email}}</p>",
          },
        },
        {
          type: "image",
          props: {
            src: "{{allEmployees.photo}}",
            alt: "Photo of {{allEmployees.name}}",
          },
        },
      ],
    },
  },
  {
    description: "Blog posts grid using blogPosts query with horizontal cards",
    type: "box",
    props: {
      direction: "flex-row",
      gap: "2rem",
      padding: "1rem",
      justifyContent: "justify-start",
      alignItems: "items-stretch",
      loop: {
        over: "blogPosts",
      },
      $children: [
        {
          type: "image",
          props: {
            src: "{{blogPosts.featuredImage}}",
            alt: "{{blogPosts.title}}",
          },
        },
        {
          type: "text",
          props: {
            content:
              "<h4>{{blogPosts.title}}</h4><p>{{blogPosts.excerpt}}</p><p><em>By {{blogPosts.author}} • {{blogPosts.publishDate}}</em></p>",
          },
        },
      ],
    },
  },
  {
    description: "Featured products showcase using featuredProducts query",
    type: "box",
    props: {
      direction: "flex-col",
      gap: "1rem",
      padding: "1.5rem",
      colorPreset: {
        color: "primary-50",
      },
      border: {
        width: "border",
        color: "border-primary-200",
      },
      rounding: "rounded-xl",
      shadow: "shadow-md",
      loop: {
        over: "featuredProducts",
      },
      $children: [
        {
          type: "image",
          props: {
            src: "{{featuredProducts.image}}",
            alt: "{{featuredProducts.name}}",
          },
        },
        {
          type: "text",
          props: {
            content:
              "<h3>{{featuredProducts.name}}</h3><p>{{featuredProducts.description}}</p><p><strong>${{featuredProducts.price}}</strong></p>",
          },
        },
        {
          type: "button",
          props: {
            text: "Add to Cart",
            link: "/cart/add/{{featuredProducts.id}}",
          },
        },
      ],
    },
  },
  {
    description:
      "Team members horizontal layout with wrapping - members will wrap to multiple rows on smaller screens",
    type: "box",
    props: {
      direction: "flex-row",
      gap: "2rem",
      padding: "2rem",
      wrap: true,
      justifyContent: "justify-center",
      alignItems: "items-center",
      colorPreset: {
        color: "secondary-100",
      },
      loop: {
        over: "teamMembers",
      },
      $children: [
        {
          type: "image",
          props: {
            src: "{{teamMembers.avatar}}",
            alt: "{{teamMembers.fullName}}",
          },
        },
        {
          type: "text",
          props: {
            content: "<h4>{{teamMembers.fullName}}</h4><p>{{teamMembers.role}}</p><p>{{teamMembers.bio}}</p>",
          },
        },
      ],
    },
  },
  {
    description: "Event listings using upcomingEvents query with accent styling",
    type: "box",
    props: {
      direction: "flex-col",
      gap: "1.25rem",
      padding: "2.5rem",
      colorPreset: {
        color: "accent-100",
      },
      border: {
        width: "border-2",
        color: "border-accent-300",
      },
      rounding: "rounded-lg",
      loop: {
        over: "upcomingEvents",
      },
      $children: [
        {
          type: "text",
          props: {
            content:
              "<h3>{{upcomingEvents.title}}</h3><p><strong>{{upcomingEvents.date}} at {{upcomingEvents.time}}</strong></p><p>{{upcomingEvents.venue}} • {{upcomingEvents.city}}</p><p>{{upcomingEvents.description}}</p>",
          },
        },
        {
          type: "button",
          props: {
            text: "Register Now",
            link: "/events/{{upcomingEvents.slug}}/register",
          },
        },
      ],
    },
  },
  {
    description: "Testimonials carousel using customerTestimonials query",
    type: "box",
    props: {
      direction: "flex-col",
      gap: "1rem",
      padding: "3rem",
      justifyContent: "justify-center",
      alignItems: "items-center",
      colorPreset: {
        color: "neutral-50",
      },
      shadow: "shadow-lg",
      rounding: "rounded-2xl",
      loop: {
        over: "customerTestimonials",
      },
      $children: [
        {
          type: "text",
          props: {
            content:
              '<blockquote>"{{customerTestimonials.quote}}"</blockquote><p><strong>{{customerTestimonials.customerName}}</strong></p><p>{{customerTestimonials.company}} • {{customerTestimonials.position}}</p>',
          },
        },
        {
          type: "icon",
          props: {
            icon: "mdi:star",
            size: "1.5rem",
            color: "#fbbf24",
          },
        },
      ],
    },
  },
  {
    description: "Portfolio projects using portfolioProjects query with horizontal layout",
    type: "box",
    props: {
      direction: "flex-row",
      gap: "1.5rem",
      padding: "1rem",
      alignItems: "items-start",
      justifyContent: "justify-start",
      loop: {
        over: "portfolioProjects",
      },
      $children: [
        {
          type: "image",
          props: {
            src: "{{portfolioProjects.thumbnail}}",
            alt: "{{portfolioProjects.projectName}}",
          },
        },
        {
          type: "text",
          props: {
            content:
              "<h4>{{portfolioProjects.projectName}}</h4><p>{{portfolioProjects.client}}</p><p>{{portfolioProjects.category}} • {{portfolioProjects.year}}</p><p>{{portfolioProjects.shortDescription}}</p>",
          },
        },
        {
          type: "button",
          props: {
            text: "View Project",
            link: "/portfolio/{{portfolioProjects.slug}}",
          },
        },
      ],
    },
  },
  {
    description: "News articles using latestNews query with vertical stacking",
    type: "box",
    props: {
      direction: "flex-col",
      gap: "2rem",
      padding: "2rem",
      colorPreset: {
        color: "primary-100",
      },
      border: {
        width: "border",
        color: "border-primary-300",
      },
      loop: {
        over: "latestNews",
      },
      $children: [
        {
          type: "text",
          props: {
            content:
              "<h3>{{latestNews.headline}}</h3><p><strong>{{latestNews.category}}</strong> • {{latestNews.publishedDate}}</p><p>{{latestNews.summary}}</p>",
          },
        },
        {
          type: "text",
          props: {
            content: "<a href='/news/{{latestNews.slug}}'>Read full article →</a>",
          },
        },
      ],
    },
  },
  {
    description: "Service offerings using companyServices query with centered layout",
    type: "box",
    props: {
      direction: "flex-col",
      gap: "1rem",
      padding: "2rem",
      justifyContent: "justify-center",
      alignItems: "items-center",
      colorPreset: {
        color: "secondary-200",
      },
      rounding: "rounded-xl",
      shadow: "shadow-md",
      loop: {
        over: "companyServices",
      },
      $children: [
        {
          type: "icon",
          props: {
            icon: "{{companyServices.iconName}}",
            size: "2rem",
            color: "{{companyServices.iconColor}}",
          },
        },
        {
          type: "text",
          props: {
            content:
              "<h4>{{companyServices.serviceName}}</h4><p>{{companyServices.description}}</p><p><strong>Starting at ${{companyServices.price}}</strong></p>",
          },
        },
        {
          type: "button",
          props: {
            text: "Learn More",
            link: "/services/{{companyServices.serviceSlug}}",
          },
        },
      ],
    },
  },
];

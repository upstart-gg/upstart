import { defineBrickManifest } from "~/shared/brick-manifest";
import { defineProps } from "../props/helpers";
import { Type } from "@sinclair/typebox";
import { borderRef, roundingRef } from "../props/border";
import { shadowRef } from "../props/effects";
import { cssLengthRef } from "../props/css-length";
import { directionRef } from "../props/direction";
import { RxBox } from "react-icons/rx";
import { alignItemsRef, justifyContentRef } from "../props/align";
import { colorPresetRef } from "../props/color-preset";
import { loopRef } from "../props/dynamic";
import type { BrickExample } from "./_types";

// Generic container can hold any type of array data source
export const manifest = defineBrickManifest({
  type: "box",
  category: "container",
  name: "Box",
  description: "A container for stacking bricks horizontally or vertically.",
  aiInstructions: `Use the box component as a flexible container for organizing and arranging multiple bricks in horizontal or vertical layouts.

WHEN TO USE:
- Grouping related content elements (text + image + button)
- Creating card-like layouts with multiple components
- Building responsive grid systems with wrapping
- Organizing form elements or input groups
- Displaying repeated data from queries (products, team members, blog posts)
- Creating structured layouts with consistent spacing

LAYOUT GUIDELINES:
- direction: "flex-col" for vertical stacking, "flex-row" for horizontal arrangement
- gap: "0.5rem" for tight spacing, "1rem" for standard, "2rem" for spacious layouts
- padding: "1rem" for standard padding, "2rem" for generous spacing, "0" for edge-to-edge
- wrap: true for responsive grids that wrap on smaller screens, false for fixed layouts
- justifyContent: "justify-start" for left-align, "justify-center" for center, "justify-between" for space-between
- alignItems: "items-stretch" for equal heights, "items-center" for center-align, "items-start" for top-align

STYLING OPTIONS:
- colorPreset: Use light backgrounds like "primary-50", "neutral-100", "secondary-100" for content containers
- rounding: "rounded-md" for standard, "rounded-lg" for friendly, "rounded-xl"/"rounded-2xl" for modern
- border: Add subtle borders with "border" width and colors like "border-gray-200", "border-primary-300"
- shadow: "shadow-sm" for subtle depth, "shadow-md" for cards, "shadow-lg" for prominence

CONTENT RULES:
- Must contain at least 2 child bricks to be useful
- Cannot contain other box components as direct children
- Commonly contains: text, image, button, icon combinations
- Perfect for repeating patterns using loop data

DYNAMIC CONTENT:
- Use loop property to repeat the box itself over data queries
- Template variables work in all child components: "{{ product.name}}", "{{user.email}}"
- Great for: product catalogs, team directories, blog listings

AVOID:
- Single child elements (use individual brick instead)
- Nesting boxes inside boxes (use single box with proper layout)
- Complex nested structures (break into separate boxes)`,
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

export const examples: BrickExample<Manifest>[] = [
  // BASIC LAYOUTS
  {
    description: "Simple vertical layout - Basic text and image combination",
    type: "box",
    props: {
      direction: "flex-col",
      gap: "1rem",
      padding: "1.5rem",
      $children: [
        {
          type: "text",
          props: {
            content:
              "<h3>Welcome to Our Service</h3><p>We provide innovative solutions for modern businesses.</p>",
          },
        },
        {
          type: "image",
          props: {
            src: "https://via.placeholder.com/300x200",
            alt: "Service showcase",
          },
        },
        {
          type: "button",
          props: {
            label: "Learn More",
            link: "/services",
          },
        },
      ],
    },
  },

  {
    description: "Horizontal layout with wrapping - Perfect for responsive image galleries",
    type: "box",
    props: {
      direction: "flex-row",
      gap: "1rem",
      wrap: true,
      justifyContent: "justify-center",
      padding: "1rem",
      $children: [
        {
          type: "image",
          props: {
            src: "https://via.placeholder.com/150",
            alt: "Gallery image 1",
          },
        },
        {
          type: "image",
          props: {
            src: "https://via.placeholder.com/150",
            alt: "Gallery image 2",
          },
        },
        {
          type: "image",
          props: {
            src: "https://via.placeholder.com/150",
            alt: "Gallery image 3",
          },
        },
        {
          type: "image",
          props: {
            src: "https://via.placeholder.com/150",
            alt: "Gallery image 4",
          },
        },
      ],
    },
  },

  // STYLED CONTAINERS
  {
    description: "Content card with background and border - Professional presentation style",
    type: "box",
    props: {
      direction: "flex-col",
      gap: "1rem",
      padding: "2rem",
      colorPreset: { color: "primary-50" },
      border: { width: "border", color: "border-primary-200" },
      rounding: "rounded-lg",
      shadow: "shadow-md",
      $children: [
        {
          type: "text",
          props: {
            content:
              "<h3>Featured Article</h3><p>Discover the latest trends in technology and innovation that are shaping our future.</p>",
          },
        },
        {
          type: "image",
          props: {
            src: "https://via.placeholder.com/400x250",
            alt: "Technology trends",
          },
        },
        {
          type: "button",
          props: {
            label: "Read Full Article",
            link: "/articles/tech-trends",
          },
        },
      ],
    },
  },

  // DYNAMIC CONTENT EXAMPLES
  {
    description: "Employee directory using dynamic data - Shows team member profiles",
    type: "box",
    props: {
      direction: "flex-col",
      gap: "1.5rem",
      padding: "2rem",
      colorPreset: { color: "neutral-100" },
      rounding: "rounded-lg",
      border: { width: "border", color: "border-neutral-300" },
      loop: { over: "allEmployees" },
      $children: [
        {
          type: "image",
          props: {
            src: "{{allEmployees.photo}}",
            alt: "Photo of {{allEmployees.name}}",
          },
        },
        {
          type: "text",
          props: {
            content:
              "<h3>{{allEmployees.name}}</h3><p><strong>{{allEmployees.position}}</strong></p><p>{{allEmployees.department}} • {{allEmployees.email}}</p>",
          },
        },
        {
          type: "button",
          props: {
            label: "Contact {{allEmployees.name}}",
            link: "mailto:{{allEmployees.email}}",
          },
        },
      ],
    },
  },

  {
    description: "Blog post cards with horizontal layout - Great for article previews",
    type: "box",
    props: {
      direction: "flex-row",
      gap: "2rem",
      padding: "1.5rem",
      justifyContent: "justify-start",
      alignItems: "items-stretch",
      colorPreset: { color: "secondary-50" },
      rounding: "rounded-lg",
      shadow: "shadow-sm",
      loop: { over: "blogPosts" },
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
        {
          type: "button",
          props: {
            label: "Read More",
            link: "/blog/{{blogPosts.slug}}",
          },
        },
      ],
    },
  },

  {
    description: "Product showcase cards with pricing - Perfect for e-commerce displays",
    type: "box",
    props: {
      direction: "flex-col",
      gap: "1rem",
      padding: "1.5rem",
      justifyContent: "justify-center",
      alignItems: "items-center",
      colorPreset: { color: "accent-50" },
      border: { width: "border-2", color: "border-accent-200" },
      rounding: "rounded-xl",
      shadow: "shadow-md",
      loop: { over: "featuredProducts" },
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
            label: "Add to Cart",
            link: "/cart/add/{{featuredProducts.id}}",
          },
        },
      ],
    },
  },

  // RESPONSIVE GRID LAYOUTS
  {
    description: "Team members with wrapping - Responsive grid that adapts to screen size",
    type: "box",
    props: {
      direction: "flex-row",
      gap: "2rem",
      padding: "2rem",
      wrap: true,
      justifyContent: "justify-center",
      alignItems: "items-start",
      colorPreset: { color: "secondary-100" },
      rounding: "rounded-lg",
      loop: { over: "teamMembers" },
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
            content:
              "<h4>{{teamMembers.fullName}}</h4><p><strong>{{teamMembers.role}}</strong></p><p>{{teamMembers.bio}}</p>",
          },
        },
        {
          type: "button",
          props: {
            label: "View Profile",
            link: "/team/{{teamMembers.slug}}",
          },
        },
      ],
    },
  },

  {
    description: "Event listings with accent styling - Prominent call-to-action design",
    type: "box",
    props: {
      direction: "flex-col",
      gap: "1.25rem",
      padding: "2.5rem",
      alignItems: "items-center",
      colorPreset: { color: "accent-100" },
      border: { width: "border-2", color: "border-accent-300" },
      rounding: "rounded-lg",
      shadow: "shadow-lg",
      loop: { over: "upcomingEvents" },
      $children: [
        {
          type: "icon",
          props: {
            icon: "mdi:calendar-event",
            size: "2rem",
            color: "#f59e0b",
          },
        },
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
            label: "Register Now",
            link: "/events/{{upcomingEvents.slug}}/register",
          },
        },
      ],
    },
  },

  // TESTIMONIALS & REVIEWS
  {
    description: "Customer testimonials with star ratings - Social proof presentation",
    type: "box",
    props: {
      direction: "flex-col",
      gap: "1rem",
      padding: "3rem",
      justifyContent: "justify-center",
      alignItems: "items-center",
      colorPreset: { color: "neutral-50" },
      shadow: "shadow-lg",
      rounding: "rounded-2xl",
      loop: { over: "customerTestimonials" },
      $children: [
        {
          type: "icon",
          props: {
            icon: "mdi:format-quote-open",
            size: "2rem",
            color: "#6b7280",
          },
        },
        {
          type: "text",
          props: {
            content:
              '<p style="text-align: center"><em>"{{customerTestimonials.quote}}"</em></p><p style="text-align: center"><strong>{{customerTestimonials.customerName}}</strong></p><p style="text-align: center">{{customerTestimonials.company}} • {{customerTestimonials.position}}</p>',
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
    description: "Portfolio project showcase - Creative work presentation with client details",
    type: "box",
    props: {
      direction: "flex-row",
      gap: "1.5rem",
      padding: "2rem",
      alignItems: "items-start",
      justifyContent: "justify-start",
      colorPreset: { color: "primary-50" },
      border: { width: "border", color: "border-primary-200" },
      rounding: "rounded-lg",
      loop: { over: "portfolioProjects" },
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
              "<h4>{{portfolioProjects.projectName}}</h4><p><strong>{{portfolioProjects.client}}</strong></p><p>{{portfolioProjects.category}} • {{portfolioProjects.year}}</p><p>{{portfolioProjects.shortDescription}}</p>",
          },
        },
        {
          type: "button",
          props: {
            label: "View Project",
            link: "/portfolio/{{portfolioProjects.slug}}",
          },
        },
      ],
    },
  },

  // NEWS & ARTICLES
  {
    description: "News article previews with categories - Clean editorial layout",
    type: "box",
    props: {
      direction: "flex-col",
      gap: "1.5rem",
      padding: "2rem",
      colorPreset: { color: "neutral-100" },
      border: { width: "border", color: "border-neutral-300" },
      rounding: "rounded-md",
      loop: { over: "latestNews" },
      $children: [
        {
          type: "text",
          props: {
            content:
              "<h3>{{latestNews.headline}}</h3><p><strong>{{latestNews.category}}</strong> • {{latestNews.publishedDate}}</p><p>{{latestNews.summary}}</p>",
          },
        },
        {
          type: "button",
          props: {
            label: "Read Full Article",
            link: "/news/{{latestNews.slug}}",
          },
        },
      ],
    },
  },

  // SERVICE OFFERINGS
  {
    description: "Service packages with icons and pricing - Professional service presentation",
    type: "box",
    props: {
      direction: "flex-col",
      gap: "1rem",
      padding: "2rem",
      justifyContent: "justify-center",
      alignItems: "items-center",
      colorPreset: { color: "secondary-200" },
      rounding: "rounded-xl",
      shadow: "shadow-md",
      loop: { over: "companyServices" },
      $children: [
        {
          type: "icon",
          props: {
            icon: "{{companyServices.iconName}}",
            size: "2.5rem",
            color: "{{companyServices.iconColor}}",
          },
        },
        {
          type: "text",
          props: {
            content:
              "<h4 style='text-align: center'>{{companyServices.serviceName}}</h4><p style='text-align: center'>{{companyServices.description}}</p><p style='text-align: center'><strong>Starting at ${{companyServices.price}}</strong></p>",
          },
        },
        {
          type: "button",
          props: {
            label: "Learn More",
            link: "/services/{{companyServices.serviceSlug}}",
          },
        },
      ],
    },
  },
];

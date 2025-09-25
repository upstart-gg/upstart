import { defineBrickManifest } from "~/shared/brick-manifest";
import { defineProps } from "../props/helpers";
import { Type } from "@sinclair/typebox";
import { borderRef, roundingRef } from "../props/border";
import { shadowRef } from "../props/effects";
import type { BrickProps } from "../props/types";
import { cssLengthRef } from "../props/css-length";
import { HiOutlineViewColumns } from "react-icons/hi2";
import { colorPresetRef } from "../props/color-preset";
import { loopRef } from "../props/dynamic";
import { StringEnum } from "~/shared/utils/string-enum";
import type { BrickExample } from "./_types";

// Tab configuration schema
const tabRef = Type.Object({
  label: Type.String({
    title: "Tab Label",
    description: "The text shown on the tab button",
    "ai:instructions": "Use a short, descriptive label for the tab",
  }),
  id: Type.Optional(
    Type.String({
      title: "Tab ID",
      description: "Unique identifier for the tab (auto-generated if not provided)",
    }),
  ),
});

export const manifest = defineBrickManifest({
  type: "tabs",
  category: "container",
  name: "Tabs",
  description: "A tabbed container that displays different content panels based on the selected tab.",
  aiInstructions:
    "Tabs are containers for organizing content into multiple panels. Each tab has a label and contains child bricks. Users can click tab buttons to switch between different content panels. Ideal for organizing related content, settings panels, or product information.",
  isContainer: true,
  defaultWidth: {
    desktop: "100%",
    mobile: "100%",
  },
  defaultHeight: {
    desktop: "auto",
  },
  icon: HiOutlineViewColumns,
  props: defineProps({
    colorPreset: Type.Optional(
      colorPresetRef({
        title: "Color",
      }),
    ),
    tabs: Type.Array(tabRef, {
      title: "Tabs",
      description: "List of tab configurations",
      default: [{ label: "Tab 1" }, { label: "Tab 2" }],
      "ai:instructions":
        "Each tab should have a descriptive label. Content for each tab is defined in the $children array.",
      examples: [
        [{ label: "Overview" }, { label: "Features" }, { label: "Pricing" }],
        [{ label: "About" }, { label: "Services" }, { label: "Contact" }],
      ],
    }),
    defaultTab: Type.Optional(
      Type.Number({
        title: "Default Tab",
        description: "Index of the tab to show by default (0-based)",
        default: 0,
        minimum: 0,
        "ai:instructions": "Use 0 for the first tab, 1 for the second tab, etc.",
      }),
    ),
    tabPosition: Type.Optional(
      StringEnum(["top", "bottom"], {
        title: "Tab Position",
        description: "Position of the tab buttons relative to content",
        default: "top",
        "ai:instructions":
          "Use 'top' for tabs above content (most common) or 'bottom' for tabs below content",
      }),
    ),
    tabStyle: Type.Optional(
      StringEnum(["pills", "underline", "bordered"], {
        title: "Tab Style",
        description: "Visual style of the tab buttons",
        default: "underline",
        "ai:instructions":
          "Pills are rounded buttons, underline shows a line under active tab, bordered shows tabs with borders",
      }),
    ),
    fullWidth: Type.Optional(
      Type.Boolean({
        title: "Full Width Tabs",
        description: "Make tab buttons span the full width of the container",
        default: false,
        "ai:instructions": "Enable this to make tab buttons evenly distribute across the full width",
      }),
    ),
    padding: Type.Optional(
      cssLengthRef({
        default: "1.5rem",
        description: "Padding inside each tab panel.",
        "ai:instructions": "Use values like '1rem', '1.5rem', or '2rem' for tab content padding",
        title: "Content Padding",
        "ui:placeholder": "Not specified",
        "ui:styleId": "styles:padding",
      }),
    ),
    gap: Type.Optional(
      cssLengthRef({
        title: "Tab Gap",
        default: "0.5rem",
        description: "Gap between tab buttons.",
        "ai:instructions": "Small values like '0.25rem' or '0.5rem' work best for tab spacing",
        "ui:placeholder": "Not specified",
        "ui:styleId": "styles:gap",
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
    $children: Type.Array(Type.Array(Type.Any()), {
      "ui:field": "hidden",
      description: "Array of child brick arrays - each sub-array represents the content for one tab",
      default: [[], []],
      examples: [
        [
          // Tab 1 content
          [
            {
              type: "text",
              props: {
                content: "<h3>Overview</h3><p>This is the overview tab content.</p>",
              },
            },
          ],
          // Tab 2 content
          [
            {
              type: "text",
              props: {
                content: "<h3>Features</h3><p>Here are our key features.</p>",
              },
            },
            {
              type: "button",
              props: {
                text: "Learn More",
                link: "/features",
              },
            },
          ],
        ],
      ],
    }),
  }),
});

export type Manifest = typeof manifest;

export const examples: BrickExample<Manifest>[] = [
  {
    description: "Simple tabs with basic content in each panel",
    type: "tabs",
    props: {
      tabs: [{ label: "About" }, { label: "Services" }, { label: "Contact" }],
      defaultTab: 0,
      tabStyle: "underline",
      $children: [
        [
          {
            type: "text",
            props: {
              content: "<h3>About Us</h3><p>We are a company focused on delivering exceptional results.</p>",
            },
          },
        ],
        [
          {
            type: "text",
            props: {
              content: "<h3>Our Services</h3><p>We offer a wide range of professional services.</p>",
            },
          },
          {
            type: "button",
            props: {
              text: "View All Services",
              link: "/services",
            },
          },
        ],
        [
          {
            type: "text",
            props: {
              content:
                "<h3>Contact Information</h3><p>Email: hello@company.com</p><p>Phone: (555) 123-4567</p>",
            },
          },
        ],
      ],
    },
  },
  {
    description: "Product information tabs with pills style and custom styling",
    type: "tabs",
    props: {
      tabs: [{ label: "Overview" }, { label: "Specifications" }, { label: "Reviews" }, { label: "Support" }],
      defaultTab: 0,
      tabStyle: "pills",
      fullWidth: true,
      colorPreset: {
        color: "primary-50",
      },
      border: {
        width: "border",
        color: "border-primary-200",
      },
      rounding: "rounded-lg",
      padding: "2rem",
      $children: [
        [
          {
            type: "text",
            props: {
              content: "<h3>Product Overview</h3><p>This product revolutionizes the way you work.</p>",
            },
          },
          {
            type: "image",
            props: {
              src: "https://via.placeholder.com/400x200",
              alt: "Product image",
            },
          },
        ],
        [
          {
            type: "text",
            props: {
              content:
                '<h3>Technical Specifications</h3><ul><li>Weight: 2.5 lbs</li><li>Dimensions: 12" x 8" x 2"</li><li>Battery: 8 hours</li></ul>',
            },
          },
        ],
        [
          {
            type: "text",
            props: {
              content:
                '<h3>Customer Reviews</h3><p>★★★★★ "Amazing product, highly recommend!"</p><p>★★★★☆ "Great value for money."</p>',
            },
          },
        ],
        [
          {
            type: "text",
            props: {
              content: "<h3>Support</h3><p>Need help? Contact our support team.</p>",
            },
          },
          {
            type: "button",
            props: {
              text: "Contact Support",
              link: "/support",
            },
          },
        ],
      ],
    },
  },
  {
    description: "Portfolio sections with bordered tabs",
    type: "tabs",
    props: {
      tabs: [{ label: "Web Design" }, { label: "Mobile Apps" }, { label: "Branding" }],
      defaultTab: 0,
      tabStyle: "bordered",
      shadow: "shadow-md",
      rounding: "rounded-xl",
      $children: [
        [
          {
            type: "text",
            props: {
              content: "<h3>Web Design Projects</h3><p>Beautiful, responsive websites that convert.</p>",
            },
          },
          {
            type: "image",
            props: {
              src: "https://via.placeholder.com/600x300",
              alt: "Web design portfolio",
            },
          },
        ],
        [
          {
            type: "text",
            props: {
              content: "<h3>Mobile Applications</h3><p>Native and cross-platform mobile solutions.</p>",
            },
          },
          {
            type: "image",
            props: {
              src: "https://via.placeholder.com/300x500",
              alt: "Mobile app portfolio",
            },
          },
        ],
        [
          {
            type: "text",
            props: {
              content:
                "<h3>Brand Identity</h3><p>Comprehensive branding solutions for modern businesses.</p>",
            },
          },
          {
            type: "image",
            props: {
              src: "https://via.placeholder.com/500x400",
              alt: "Branding portfolio",
            },
          },
        ],
      ],
    },
  },
  {
    description: "FAQ sections with bottom-positioned tabs",
    type: "tabs",
    props: {
      tabs: [{ label: "General" }, { label: "Billing" }, { label: "Technical" }],
      defaultTab: 0,
      tabPosition: "bottom",
      tabStyle: "underline",
      padding: "1.5rem",
      $children: [
        [
          {
            type: "text",
            props: {
              content:
                "<h3>General Questions</h3><p><strong>What is your company about?</strong></p><p>We provide excellent services to our customers.</p><p><strong>Where are you located?</strong></p><p>We have offices worldwide.</p>",
            },
          },
        ],
        [
          {
            type: "text",
            props: {
              content:
                "<h3>Billing Questions</h3><p><strong>How does billing work?</strong></p><p>We bill monthly based on usage.</p><p><strong>Can I change my plan?</strong></p><p>Yes, you can upgrade or downgrade anytime.</p>",
            },
          },
        ],
        [
          {
            type: "text",
            props: {
              content:
                "<h3>Technical Support</h3><p><strong>How do I reset my password?</strong></p><p>Use the forgot password link on the login page.</p><p><strong>Is there an API?</strong></p><p>Yes, we have a comprehensive REST API.</p>",
            },
          },
        ],
      ],
    },
  },
  {
    description: "Team member profiles using teamMembers query with dynamic tabs",
    type: "tabs",
    props: {
      loop: {
        over: "teamMembers",
      },
      tabs: [{ label: "{{teamMembers.name}}" }],
      tabStyle: "pills",
      fullWidth: false,
      colorPreset: {
        color: "secondary-100",
      },
      padding: "2rem",
      $children: [
        [
          {
            type: "image",
            props: {
              src: "{{teamMembers.photo}}",
              alt: "{{teamMembers.name}}",
            },
          },
          {
            type: "text",
            props: {
              content:
                "<h3>{{teamMembers.name}}</h3><p><strong>{{teamMembers.position}}</strong></p><p>{{teamMembers.bio}}</p><p>Email: {{teamMembers.email}}</p>",
            },
          },
        ],
      ],
    },
  },
  {
    description: "Product categories using productCategories query",
    type: "tabs",
    props: {
      loop: {
        over: "productCategories",
      },
      tabs: [{ label: "{{productCategories.categoryName}}" }],
      tabStyle: "bordered",
      fullWidth: true,
      border: {
        width: "border-2",
        color: "border-primary-300",
      },
      rounding: "rounded-lg",
      shadow: "shadow-lg",
      $children: [
        [
          {
            type: "text",
            props: {
              content:
                "<h3>{{productCategories.categoryName}}</h3><p>{{productCategories.description}}</p><p>{{productCategories.productCount}} products available</p>",
            },
          },
          {
            type: "button",
            props: {
              text: "Browse {{productCategories.categoryName}}",
              link: "/products/{{productCategories.slug}}",
            },
          },
        ],
      ],
    },
  },
  {
    description: "Service packages with pricing information",
    type: "tabs",
    props: {
      tabs: [{ label: "Basic" }, { label: "Professional" }, { label: "Enterprise" }],
      defaultTab: 1,
      tabStyle: "pills",
      fullWidth: true,
      colorPreset: {
        color: "accent-50",
      },
      border: {
        width: "border",
        color: "border-accent-200",
      },
      rounding: "rounded-xl",
      shadow: "shadow-md",
      padding: "2.5rem",
      $children: [
        [
          {
            type: "text",
            props: {
              content:
                "<h3>Basic Package</h3><p><strong>$99/month</strong></p><ul><li>5 Projects</li><li>10GB Storage</li><li>Email Support</li></ul>",
            },
          },
          {
            type: "button",
            props: {
              text: "Choose Basic",
              link: "/pricing/basic",
            },
          },
        ],
        [
          {
            type: "text",
            props: {
              content:
                "<h3>Professional Package</h3><p><strong>$199/month</strong></p><ul><li>25 Projects</li><li>100GB Storage</li><li>Priority Support</li><li>Advanced Analytics</li></ul>",
            },
          },
          {
            type: "button",
            props: {
              text: "Choose Professional",
              link: "/pricing/professional",
            },
          },
        ],
        [
          {
            type: "text",
            props: {
              content:
                "<h3>Enterprise Package</h3><p><strong>$499/month</strong></p><ul><li>Unlimited Projects</li><li>1TB Storage</li><li>24/7 Phone Support</li><li>Custom Integrations</li><li>Dedicated Account Manager</li></ul>",
            },
          },
          {
            type: "button",
            props: {
              text: "Contact Sales",
              link: "/contact/enterprise",
            },
          },
        ],
      ],
    },
  },
  {
    description: "Documentation sections with technical content",
    type: "tabs",
    props: {
      tabs: [
        { label: "Getting Started" },
        { label: "API Reference" },
        { label: "Examples" },
        { label: "Troubleshooting" },
      ],
      defaultTab: 0,
      tabStyle: "underline",
      tabPosition: "top",
      padding: "1.5rem",
      colorPreset: {
        color: "neutral-50",
      },
      $children: [
        [
          {
            type: "text",
            props: {
              content:
                "<h3>Getting Started</h3><p>Welcome to our platform! Here's how to get started:</p><ol><li>Create an account</li><li>Set up your first project</li><li>Invite team members</li></ol>",
            },
          },
        ],
        [
          {
            type: "text",
            props: {
              content:
                "<h3>API Reference</h3><p>Our REST API provides programmatic access to all features:</p><pre>GET /api/v1/projects</pre><pre>POST /api/v1/projects</pre>",
            },
          },
        ],
        [
          {
            type: "text",
            props: {
              content:
                "<h3>Code Examples</h3><p>Here are some common use cases:</p><pre>curl -X GET https://api.example.com/projects</pre>",
            },
          },
        ],
        [
          {
            type: "text",
            props: {
              content:
                "<h3>Troubleshooting</h3><p><strong>Issue:</strong> Cannot connect to API</p><p><strong>Solution:</strong> Check your API key and network connection.</p>",
            },
          },
        ],
      ],
    },
  },
];

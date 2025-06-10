import { defineBrickManifest } from "~/shared/brick-manifest";
import { defineProps, group, optional } from "../props/helpers";
import { background, backgroundRef } from "../props/background";
import { datasourceRef } from "../props/datasource";
import { containerLayout, containerLayoutRef, makeContainerProps } from "../props/container";
import { Type } from "@sinclair/typebox";
import { border, borderRef } from "../props/border";
import { shadowRef } from "../props/effects";
import { padding, paddingRef } from "../props/padding";
import { RxGrid } from "react-icons/rx";
import type { BrickProps } from "../props/types";
import type { FC } from "react";

export const datasource = Type.Array(Type.Object({}, { additionalProperties: true }));

// Generic container can hold any type of array data source
export const manifest = defineBrickManifest({
  type: "container",
  kind: "brick",
  name: "Container",
  description: "A container that can hold other bricks and align them horizontally or vertically",
  aiInstructions: `A container acts as a flexbox (default) or a grid and allows you to align bricks horizontally, vertically, or in a grid. `,
  isContainer: true,
  defaultHeight: {
    desktop: 6,
    mobile: 6,
  },
  defaultWidth: {
    desktop: 12,
    mobile: 12,
  },
  datasource,
  icon: RxGrid,
  props: defineProps({
    layout: containerLayoutRef(),
    background: optional(backgroundRef()),
    border: optional(borderRef),
    padding: optional(paddingRef),
    shadow: optional(shadowRef()),
    datasource: optional(datasourceRef()),
    ...makeContainerProps(),
  }),
});

export type Manifest = typeof manifest;

export const examples: {
  description: string;
  type: string;
  props: BrickProps<Manifest>["brick"]["props"];
}[] = [
  {
    description: "Feature cards grid layout",
    type: "container",
    props: {
      preset: "prominent-primary",
      layout: {
        type: "grid",
        columns: 3,
        gap: "gap-4",
      },
      padding: "p-8",
      border: {
        rounding: "rounded-lg",
      },
      $children: [
        {
          type: "card",
          props: {
            variants: ["centered"],
            cardTitle: {
              content: "Fast Performance",
            },
            cardBody: {
              content: "Lightning-fast load times and optimized performance for the best user experience.",
            },
          },
        },
        {
          type: "card",
          props: {
            variants: ["centered"],
            cardTitle: {
              content: "Secure & Reliable",
            },
            cardBody: {
              content: "Enterprise-grade security with 99.9% uptime guarantee and data protection.",
            },
          },
        },
        {
          type: "card",
          props: {
            variants: ["centered"],
            cardTitle: {
              content: "Easy Integration",
            },
            cardBody: {
              content: "Simple API integration with comprehensive documentation and support.",
            },
          },
        },
      ],
    },
  },
  {
    description: "Horizontal hero section with image and text",
    type: "container",
    props: {
      preset: "prominent-secondary",
      layout: {
        type: "flex",
        direction: "flex-row",
        alignItems: "items-center",
        gap: "gap-8",
      },
      padding: "p-16",
      $children: [
        {
          type: "text",
          props: {
            content:
              "<h1>Transform Your Business</h1><p>Discover how our innovative solutions can streamline your operations and accelerate growth. Join thousands of satisfied customers worldwide.</p>",
            color: "#ffffff",
            padding: "p-0",
          },
        },
        {
          type: "image",
          props: {
            image: {
              src: "https://via.placeholder.com/400x300.png?text=Business+Growth",
              alt: "Business transformation illustration",
            },
            border: {
              borderRadius: "8px",
            },
          },
        },
      ],
    },
  },
  {
    description: "Vertical testimonial section",
    type: "container",
    props: {
      layout: {
        type: "flex",
        direction: "flex-col",
        alignItems: "items-center",
        gap: "gap-8",
      },
      background: {
        color: "#ffffff",
      },
      padding: "p-8",
      $children: [
        {
          type: "text",
          props: {
            content: "<h2 style='text-align: center'>What Our Customers Say</h2>",
            padding: "p-0",
          },
        },
        {
          type: "testimonials",
          props: {
            orientation: "horizontal",
            testimonials: [
              {
                author: "Sarah Johnson",
                company: "Tech Solutions Inc.",
                text: "This platform has revolutionized how we manage our projects. Incredible results!",
                avatar: {
                  src: "https://via.placeholder.com/60x60.png?text=SJ",
                  alt: "Sarah Johnson",
                },
                socialIcon: "mdi:linkedin",
              },
              {
                author: "Mike Chen",
                company: "Digital Agency",
                text: "Outstanding support and features. Highly recommend to any growing business.",
                avatar: {
                  src: "https://via.placeholder.com/60x60.png?text=MC",
                  alt: "Mike Chen",
                },
                socialIcon: "mdi:twitter",
              },
            ],
          },
        },
      ],
    },
  },
  {
    description: "Two-column content layout",
    type: "container",
    props: {
      layout: {
        type: "grid",
        columns: 2,
        gap: "gap-8",
      },
      padding: "p-8",
      $children: [
        {
          type: "text",
          props: {
            content:
              "<h3>About Our Company</h3><p>We've been providing innovative solutions since 2010, helping businesses across industries achieve their goals through technology and expertise.</p><p>Our team of dedicated professionals works tirelessly to ensure every client receives personalized service and exceptional results.</p>",
            background: {
              backgroundColor: "#f0f9ff",
            },
            padding: "p-6",
            border: {
              borderRadius: "8px",
            },
          },
        },
        {
          type: "container",
          props: {
            layout: {
              type: "flex",
              flexDirection: "flex-col",
              gap: "gap-4",
            },
            $children: [
              {
                type: "text",
                props: {
                  content: "<h4>Key Stats</h4>",
                  padding: "p-0",
                },
              },
              {
                type: "text",
                props: {
                  content: "<strong>500+</strong> Happy Customers",
                  background: {
                    backgroundColor: "#dcfce7",
                  },
                  padding: "p-3",
                  border: {
                    borderRadius: "6px",
                  },
                },
              },
              {
                type: "text",
                props: {
                  content: "<strong>10+</strong> Years Experience",
                  background: {
                    backgroundColor: "#dbeafe",
                  },
                  padding: "p-3",
                  border: {
                    borderRadius: "6px",
                  },
                },
              },
              {
                type: "text",
                props: {
                  content: "<strong>99.9%</strong> Uptime Record",
                  background: {
                    backgroundColor: "#fef3c7",
                  },
                  padding: "p-3",
                  border: {
                    borderRadius: "6px",
                  },
                },
              },
            ],
          },
        },
      ],
    },
  },
  {
    description: "Call-to-action section with centered alignment",
    type: "container",
    props: {
      layout: {
        type: "flex",
        direction: "flex-col",
        alignItems: "items-center",
        justifyContent: "justify-center",
        gap: "gap-4",
      },
      padding: "p-16",

      $children: [
        {
          type: "hero",
          props: {
            content: "Ready to Get Started?",
            tagline: "Join thousands of satisfied customers and transform your business today",
            align: "center",
            color: "#ffffff",
            padding: "p-0",
            effects: {
              textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
            },
          },
        },
        {
          type: "container",
          props: {
            layout: {
              type: "flex",
              flexDirection: "flex-row",
              gap: "gap-4",
            },
            $children: [
              {
                type: "text",
                props: {
                  content:
                    "<a href='/signup' style='text-align: center'><strong>Start Free Trial</strong></a>",
                  background: {
                    backgroundColor: "#ffffff",
                  },
                  color: "#667eea",
                  padding: "p-4",
                  border: {
                    borderRadius: "8px",
                  },
                  effects: {
                    shadow: "shadow-lg",
                  },
                },
              },
              {
                type: "text",
                props: {
                  content: "<a href='/demo' style='text-align: center'><strong>Watch Demo</strong></a>",
                  background: {
                    backgroundColor: "transparent",
                  },
                  color: "#ffffff",
                  padding: "p-4",
                  border: {
                    border: "2px solid #ffffff",
                    borderRadius: "8px",
                  },
                },
              },
            ],
          },
        },
      ],
    },
  },
];

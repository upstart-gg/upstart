import { defineBrickManifest } from "~/shared/brick-manifest";
import { defineProps } from "../props/helpers";
import { textContentRef } from "../props/text";
import { BsCardText } from "react-icons/bs";
import { imageRef } from "../props/image";
import { type Static, Type } from "@sinclair/typebox";
import type { BrickProps } from "../props/types";
import { shadowRef } from "../props/effects";
import { borderRef, roundingRef } from "../props/border";
import { colorPresetRef } from "../props/color-preset";
import { loopRef } from "../props/dynamic";
import { StringEnum } from "~/shared/utils/string-enum";

export const manifest = defineBrickManifest({
  type: "card",
  name: "Card",
  description: "A card that can have a title, image, and content.",
  aiInstructions:
    "Use this brick to create cards that contain an image, title, and text content. Cards are useful for displaying information in a concise and visually appealing way.",
  icon: BsCardText,
  defaultWidth: { desktop: "400px", mobile: "100%" },
  minWidth: { desktop: 300 },
  minHeight: { mobile: 200, desktop: 200 },
  maxWidth: { desktop: 650 },
  props: defineProps({
    colorPreset: Type.Optional(
      colorPresetRef({
        title: "Color preset",
        default: { color: "base-100" },
      }),
    ),

    cardImage: Type.Optional(
      imageRef({
        "ui:responsive": "desktop",
        metadata: {
          category: "content",
        },
      }),
    ),
    imagePosition: Type.Optional(
      StringEnum(["top", "middle", "bottom", "left", "right"], {
        enumNames: ["Top", "Middle", "Bottom", "Left", "Right"],
        title: "Image Position",
        description: "Where the image should be placed in the card",
        default: "top",
        "ui:responsive": "desktop",
        metadata: {
          category: "content",
          filter: (manifestProps: Manifest["props"], formData: Static<Manifest["props"]>) => {
            return !!formData.cardImage?.src;
          },
        },
      }),
    ),
    noTitle: Type.Optional(
      Type.Boolean({
        title: "No Title",
        description: "Whether to hide the card title",
        default: false,
        "ui:responsive": "desktop",
      }),
    ),
    title: Type.Optional(textContentRef({ title: "Title" })),
    text: Type.Optional(textContentRef({ title: "Text" })),
    rounding: Type.Optional(
      roundingRef({
        default: "rounded-md",
      }),
    ),
    border: Type.Optional(
      borderRef({
        // default: { width: "border", color: "border-base-300" },
      }),
    ),
    shadow: Type.Optional(
      shadowRef({
        default: "shadow-sm",
      }),
    ),
    loop: Type.Optional(loopRef()),
  }),
});

export type Manifest = typeof manifest;

export const examples: {
  description: string;
  type: string;
  props: BrickProps<Manifest>["brick"]["props"];
}[] = [
  {
    description: "A simple card with a title and content",
    type: "card",
    props: {
      title: "Card Title",
      text: "This is the body of the card.",
    },
  },
  {
    description: "Product card with image on the left",
    type: "card",
    props: {
      cardImage: {
        src: "https://via.placeholder.com/200x200",
        alt: "Product image",
      },
      title: "Premium Headphones",
      text: "High-quality wireless headphones with noise cancellation and 30-hour battery life.",
    },
  },
  {
    description: "Feature card with large padding and background",
    type: "card",
    props: {
      title: "Key Feature",
      text: "This feature provides exceptional value and enhances user experience significantly.",
    },
  },
  {
    description: "Blog post card with image at the bottom",
    type: "card",
    props: {
      title: "The Future of Technology",
      text: "Exploring emerging trends and innovations that will shape our digital landscape in the coming decade.",
      cardImage: {
        src: "https://via.placeholder.com/400x200",
        alt: "Technology concept",
      },
    },
  },
  {
    description: "Testimonial card with right-side image",
    type: "card",
    props: {
      title: "Customer Review",
      text: '"This product exceeded my expectations. The quality is outstanding and the customer service is top-notch!"',
      cardImage: {
        src: "https://via.placeholder.com/150x150",
        alt: "Customer photo",
      },
    },
  },
  {
    description: "Minimal centered card without image",
    type: "card",
    props: {
      title: "Simple Announcement",
      text: "Important updates will be posted here regularly.",
    },
  },
  {
    description: "Event card with multiple variants",
    type: "card",
    props: {
      cardImage: {
        src: "https://via.placeholder.com/400x250",
        alt: "Event venue",
      },
      title: "Annual Conference 2025",
      text: "Join us for three days of inspiring talks, networking opportunities, and hands-on workshops.",
    },
  },
  {
    description: "News article card with compact layout",
    type: "card",
    props: {
      cardImage: {
        src: "https://via.placeholder.com/120x120",
        alt: "News thumbnail",
      },
      title: "Breaking News Update",
      text: "Latest developments in the ongoing story with expert analysis and community reactions.",
    },
  },
  {
    description: "Call-to-action card with prominent styling",
    type: "card",
    props: {
      title: "Get Started Today",
      text: "Transform your workflow with our powerful tools. Sign up now and get 30 days free!",
    },
  },
  {
    description: "Dynamic product card using products query with pricing and details",
    type: "card",
    props: {
      cardImage: {
        src: "{{products.image}}",
        alt: "{{products.name}}",
      },
      title: "{{products.name}}",
      text: "{{products.description}}<br><strong>Price: ${{products.price}}</strong><br>Category: {{products.category}}",
      colorPreset: { color: "primary-50" },
      border: { width: "border", color: "border-primary-200" },
      rounding: "rounded-lg",
      shadow: "shadow-md",
      loop: {
        over: "products",
      },
    },
  },
  {
    description: "Employee profile card using teamMembers query with contact information",
    type: "card",
    props: {
      cardImage: {
        src: "{{teamMembers.photo}}",
        alt: "Photo of {{teamMembers.fullName}}",
      },
      imagePosition: "top",
      title: "{{teamMembers.fullName}}",
      text: "<strong>{{teamMembers.position}}</strong><br>{{teamMembers.department}}<br>Email: {{teamMembers.email}}<br>Phone: {{teamMembers.phone}}",
      colorPreset: { color: "neutral-100" },
      rounding: "rounded-xl",
      shadow: "shadow-lg",
      loop: {
        over: "teamMembers",
      },
    },
  },
  {
    description: "Blog post card using blogPosts query with author and date",
    type: "card",
    props: {
      cardImage: {
        src: "{{blogPosts.featuredImage}}",
        alt: "{{blogPosts.title}}",
      },
      imagePosition: "top",
      title: "{{blogPosts.title}}",
      text: "{{blogPosts.excerpt}}<br><br><em>By {{blogPosts.author}} • {{blogPosts.publishDate}}</em><br>Tags: {{blogPosts.tags}}",
      colorPreset: { color: "secondary-50" },
      border: { width: "border", color: "border-secondary-300" },
      rounding: "rounded-md",
      shadow: "shadow-sm",
      loop: {
        over: "blogPosts",
      },
    },
  },
  {
    description: "Event listing card using upcomingEvents query with venue details",
    type: "card",
    props: {
      cardImage: {
        src: "{{upcomingEvents.banner}}",
        alt: "{{upcomingEvents.title}}",
      },
      imagePosition: "top",
      title: "{{upcomingEvents.title}}",
      text: "<strong>{{upcomingEvents.date}} at {{upcomingEvents.time}}</strong><br>{{upcomingEvents.venue}}, {{upcomingEvents.city}}<br><br>{{upcomingEvents.description}}<br><br>Tickets: ${{upcomingEvents.price}}",
      colorPreset: { color: "accent-100" },
      border: { width: "border-2", color: "border-accent-400" },
      rounding: "rounded-lg",
      shadow: "shadow-md",
      loop: {
        over: "upcomingEvents",
      },
    },
  },
  {
    description: "Testimonial card using customerReviews query with ratings",
    type: "card",
    props: {
      cardImage: {
        src: "{{customerReviews.customerPhoto}}",
        alt: "{{customerReviews.customerName}}",
      },
      imagePosition: "left",
      title: "{{customerReviews.customerName}}",
      text: '"{{customerReviews.review}}"<br><br><strong>Rating: {{customerReviews.rating}}/5 stars</strong><br>{{customerReviews.company}} • {{customerReviews.position}}',
      colorPreset: { color: "neutral-50" },
      rounding: "rounded-xl",
      shadow: "shadow-lg",
      loop: {
        over: "customerReviews",
      },
    },
  },
  {
    description: "Service offering card using companyServices query with pricing tiers",
    type: "card",
    props: {
      cardImage: {
        src: "{{companyServices.icon}}",
        alt: "{{companyServices.serviceName}}",
      },
      imagePosition: "top",
      title: "{{companyServices.serviceName}}",
      text: "{{companyServices.description}}<br><br><strong>Starting at ${{companyServices.startingPrice}}</strong><br>Duration: {{companyServices.duration}}<br>Includes: {{companyServices.features}}",
      colorPreset: { color: "primary-100" },
      border: { width: "border", color: "border-primary-300" },
      rounding: "rounded-lg",
      shadow: "shadow-md",
      loop: {
        over: "companyServices",
      },
    },
  },
  {
    description: "Portfolio project card using portfolioWork query with project details",
    type: "card",
    props: {
      cardImage: {
        src: "{{portfolioWork.thumbnail}}",
        alt: "{{portfolioWork.projectName}}",
      },
      imagePosition: "top",
      title: "{{portfolioWork.projectName}}",
      text: "<strong>Client:</strong> {{portfolioWork.clientName}}<br><strong>Year:</strong> {{portfolioWork.year}}<br><strong>Category:</strong> {{portfolioWork.category}}<br><br>{{portfolioWork.description}}",
      colorPreset: { color: "secondary-100" },
      rounding: "rounded-md",
      shadow: "shadow-sm",
      loop: {
        over: "portfolioWork",
      },
    },
  },
];

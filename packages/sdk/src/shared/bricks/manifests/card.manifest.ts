import { defineBrickManifest } from "~/shared/brick-manifest";
import { defineProps } from "../props/helpers";
import { textContent } from "../props/text";
import { BsCardText } from "react-icons/bs";
import { image } from "../props/image";
import { type Static, Type } from "@sinclair/typebox";
import type { BrickProps } from "../props/types";
import { shadow } from "../props/effects";
import { border, rounding } from "../props/border";
import { colorPreset } from "../props/color-preset";
import { loop } from "../props/dynamic";
import { StringEnum } from "~/shared/utils/string-enum";
import { urlOrPageId } from "../props/string";
import type { BrickExample } from "./_types";

export const manifest = defineBrickManifest({
  type: "card",
  name: "Card",
  description: "A card that can have a title, image, and content.",
  aiInstructions: `Use this brick to create visually distinct content blocks (product, feature, testimonial, event, article, CTA, etc.).

  Guidelines:
- Button is REQUIRED.
- Always provide a short action label (1-3 words) and pick a color matching semantic weight (primary/accent for primary actions, neutral/secondary for low emphasis).
- Image is OPTIONAL. If present you may set imagePosition to top | middle | bottom. Default is top.
- Pick middle for vertically centered feature highlights, bottom for caption-first layouts.
- Set noTitle: true when the card is intentionally title-less (e.g. a quote card or pure media focus).
- Do NOT include an empty title string alongside noTitle.
- Use dynamic tokens (e.g. {{products.price}}) instead of duplicating literal values.
- Prefer gradient presets for more visual emphasis (e.g. primary-gradient-400 with gradientDirection).
- border + rounding + shadow should be cohesive: stronger borders pair well with larger rounding + moderate shadow; minimal / flat cards may use border-0 + no shadow.
- For internal navigation you can supply a page ID (e.g. 'about') OR a relative/absolute URL (e.g. '/pricing', 'https://example.com').
- Keep HTML inside text minimal (<strong>, <em>, <br>) — for richer structure consider multiple bricks instead.
- Avoid mixing noTitle with large heading text embedded inside the text field — in that case keep a proper title.
- Return ONLY valid properties defined in the schema; do not invent new ones.`,
  icon: BsCardText,
  defaultWidth: { desktop: "400px", mobile: "100%" },
  minWidth: { desktop: 300 },
  minHeight: { mobile: 200, desktop: 200 },
  maxWidth: { desktop: 650 },
  props: defineProps({
    colorPreset: Type.Optional(
      colorPreset({
        title: "Color preset",
        default: { color: "base-100" },
      }),
    ),

    cardImage: Type.Optional(
      image({
        "ui:responsive": "desktop",
        metadata: {
          category: "content",
        },
      }),
    ),
    imagePosition: Type.Optional(
      StringEnum(["top", "middle", "bottom"], {
        enumNames: ["Top", "Middle", "Bottom"],
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
    title: Type.Optional(textContent({ title: "Title" })),
    text: Type.Optional(textContent({ title: "Text" })),
    rounding: Type.Optional(
      rounding({
        default: "rounded-md",
      }),
    ),
    border: Type.Optional(
      border({
        // default: { width: "border", color: "border-base-300" },
      }),
    ),
    shadow: Type.Optional(
      shadow({
        default: "shadow-sm",
      }),
    ),
    loop: Type.Optional(loop()),
    button: Type.Object(
      {
        label: Type.String({
          title: "Button label",
          default: "Click me",
          examples: ["Learn more", "Buy now", "Sign up"],
          metadata: {
            category: "content",
          },
        }),
        url: urlOrPageId({
          title: "Button URL",
          description: "The URL the button should link to.",
          metadata: {
            category: "content",
          },
        }),
        color: Type.Optional(
          StringEnum(["btn-neutral", "btn-primary", "btn-secondary", "btn-accent"], {
            enumNames: ["Neutral", "Primary", "Secondary", "Accent"],
            title: "Color",
            default: "btn-primary",
          }),
        ),
      },
      { title: "Button", description: "Button displayed at the bottom of the card" },
    ),
  }),
});

export type Manifest = typeof manifest;

export const examples: BrickExample<Manifest>[] = [
  {
    description: "A simple card with a title and content",
    type: "card",
    props: {
      title: "Card Title",
      text: "This is the body of the card.",
      button: {
        label: "Learn more",
        url: "/learn-more",
        color: "btn-primary",
      },
    },
  },
  // IMAGE POSITION MIDDLE VARIANT
  {
    description: "Feature highlight card with centered image (imagePosition=middle)",
    type: "card",
    props: {
      cardImage: { src: "https://via.placeholder.com/420x240", alt: "Feature visual" },
      imagePosition: "middle",
      title: "Blazing Performance",
      text: "Our new engine reduces processing time by 45% while maintaining reliability.",
      colorPreset: { color: "primary-100" },
      border: { width: "border", color: "border-primary-200" },
      rounding: "rounded-lg",
      shadow: "shadow-sm",
      button: { label: "Learn More", url: "/features/performance", color: "btn-primary" },
    },
  },
  // IMAGE POSITION BOTTOM VARIANT
  {
    description: "Case study card with image at the bottom (imagePosition=bottom)",
    type: "card",
    props: {
      title: "Case Study: ScaleOps",
      text: "How ScaleOps handled 10x growth with zero downtime using our platform.",
      cardImage: { src: "https://via.placeholder.com/600x260", alt: "Scale graph" },
      imagePosition: "bottom",
      colorPreset: { color: "secondary-50" },
      rounding: "rounded-md",
      shadow: "shadow-sm",
      button: { label: "Read Study", url: "/cases/scaleops", color: "btn-secondary" },
    },
  },
  // NO TITLE VARIANT
  {
    description: "Quote / testimonial style card without a title (uses noTitle=true)",
    type: "card",
    props: {
      noTitle: true,
      text: '"This toolkit accelerated our launch by weeks — the component quality is outstanding."<br><em>— CTO, FinEdge</em>',
      colorPreset: { color: "neutral-100" },
      border: { width: "border", color: "border-neutral-300" },
      rounding: "rounded-xl",
      shadow: "shadow-sm",
      button: { label: "See More", url: "/testimonials", color: "btn-neutral" },
    },
  },
  // INTERNAL PAGE ID LINK VARIANT
  {
    description: "Internal navigation card using a page ID instead of a URL",
    type: "card",
    props: {
      title: "About Our Mission",
      text: "Learn how we're building an open, extensible site generation platform for modern teams.",
      colorPreset: { color: "base-100" },
      rounding: "rounded-md",
      button: { label: "About Us", url: "about", color: "btn-primary" },
    },
  },
  // GRADIENT & STRONG BORDER VARIANT
  {
    description: "High-emphasis promotional card using gradient background and thick border",
    type: "card",
    props: {
      title: "Limited Time Offer",
      text: "Upgrade now and receive a complimentary strategy session plus extended analytics access.",
      colorPreset: { color: "primary-gradient-400", gradientDirection: "bg-gradient-to-tr" },
      border: { width: "border-4", color: "border-primary-400" },
      rounding: "rounded-xl",
      shadow: "shadow-lg",
      button: { label: "Upgrade", url: "/pricing", color: "btn-accent" },
    },
  },
  // MINIMAL / FLAT VARIANT (no border, no shadow, subtle preset)
  {
    description: "Minimal flat information card (border-0, no shadow)",
    type: "card",
    props: {
      title: "Maintenance Window",
      text: "Scheduled maintenance on Saturday 02:00–03:00 UTC. API responses may be delayed.",
      colorPreset: { color: "neutral-50" },
      border: { width: "border-0", color: "border-neutral-200" },
      button: { label: "Status Page", url: "/status", color: "btn-neutral" },
    },
  },
  // DARK / INVERTED VARIANT
  {
    description: "Dark themed spotlight card (primary-800 background)",
    type: "card",
    props: {
      title: "Night Mode Preview",
      text: "Experience the new adaptive dark theme optimized for low ambient light environments.",
      colorPreset: { color: "primary-800" },
      border: { width: "border", color: "border-primary-600" },
      rounding: "rounded-lg",
      shadow: "shadow-md",
      button: { label: "Preview", url: "/themes/dark", color: "btn-primary" },
    },
  },
  {
    description: "Feature card with large padding and background",
    type: "card",
    props: {
      title: "Key Feature",
      text: "This feature provides exceptional value and enhances user experience significantly.",
      colorPreset: { color: "primary-50" },
      border: { width: "border", color: "border-primary-200" },
      rounding: "rounded-lg",
      shadow: "shadow-sm",
      button: {
        label: "Discover More",
        url: "/features",
        color: "btn-primary",
      },
    },
  },
  {
    description: "Blog post card with image at the bottom",
    type: "card",
    props: {
      title: "Future of Tech",
      text: "Exploring emerging trends and innovations that will shape our digital landscape in the coming decade.",
      cardImage: {
        src: "https://via.placeholder.com/400x200",
        alt: "Technology concept",
      },
      button: {
        label: "Read More",
        url: "/blog/{{ blogPosts.$slug }}",
        color: "btn-primary",
      },
    },
  },
  {
    description: "Minimal centered card without image",
    type: "card",
    props: {
      title: "Simple Announcement",
      text: "Important updates will be posted here regularly.",
      button: {
        label: "View Updates",
        url: "/updates",
        color: "btn-neutral",
      },
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
      button: {
        label: "Register Now",
        url: "/events/conference-2025",
        color: "btn-primary",
      },
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
      button: {
        label: "Read Full Article",
        url: "/news/breaking-update",
        color: "btn-secondary",
      },
    },
  },
  {
    description: "Call-to-action card with prominent styling",
    type: "card",
    props: {
      title: "Get Started Today",
      text: "Transform your workflow with our powerful tools. Sign up now and get 30 days free!",
      button: {
        label: "Sign Up Now",
        url: "/signup",
        color: "btn-primary",
      },
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
      button: {
        label: "Buy Now",
        url: "{{products.purchaseUrl}}",
        color: "btn-primary",
      },
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
      button: {
        label: "Contact",
        url: "mailto:{{teamMembers.email}}",
        color: "btn-neutral",
      },
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
      button: {
        label: "Read More",
        url: "{{blogPosts.url}}",
        color: "btn-secondary",
      },
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
      button: {
        label: "Book Tickets",
        url: "{{upcomingEvents.ticketUrl}}",
        color: "btn-accent",
      },
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
      imagePosition: "top",
      title: "{{customerReviews.customerName}}",
      text: '"{{customerReviews.review}}"<br><br><strong>Rating: {{customerReviews.rating}}/5 stars</strong><br>{{customerReviews.company}} • {{customerReviews.position}}',
      colorPreset: { color: "neutral-50" },
      rounding: "rounded-xl",
      shadow: "shadow-lg",
      button: {
        label: "See All Reviews",
        url: "/reviews",
        color: "btn-neutral",
      },
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
      button: {
        label: "Learn More",
        url: "{{companyServices.detailsUrl}}",
        color: "btn-primary",
      },
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
      button: {
        label: "View Project",
        url: "{{portfolioWork.projectUrl}}",
        color: "btn-secondary",
      },
      loop: {
        over: "portfolioWork",
      },
    },
  },
];

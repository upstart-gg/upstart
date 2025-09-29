import { defineBrickManifest } from "~/shared/brick-manifest";
import { defineProps } from "../props/helpers";
import { textContent } from "../props/text";
import { BsAlphabetUppercase } from "react-icons/bs";
import type { BrickProps } from "../props/types";
import { Type } from "@sinclair/typebox";
import { shadow, textShadow } from "../props/effects";
import { border, rounding } from "../props/border";
import { colorPreset } from "../props/color-preset";
import { alignItems, justifyContent } from "../props/align";
import { cssLength } from "../props/css-length";
import type { BrickExample } from "./_types";

export const manifest = defineBrickManifest({
  type: "hero",
  category: "basic",
  name: "Hero",
  description: "A big textual element for home pages.",
  aiInstructions: `PURPOSE
A prominent textual block (main heading + optional tagline) used to introduce a page, product, event, company, or dynamic entity.

STRUCTURE
1. Always supply 'content' (can be plain text or simple HTML like <h1>, <strong>, <br/>).
2. 'tagline' is optional. Prefer concise value (1 short sentence). Omit if not needed.
3. Do NOT add buttons, images, forms, lists, or unrelated HTML here (use dedicated bricks for that).

COLOR & BACKGROUND
• Prefer omitting colorPreset so the hero inherits its parent layout background.
• When you need emphasis use semantic presets: primary-, secondary-, accent-, neutral-, base-*** or gradient variants like primary-gradient-400 (then add gradientDirection).
• NEVER invent tokens like success-, warning-, danger-, blue-, orange- (they don't exist). Map them to semantic sets (e.g. success -> secondary, warning -> accent, danger -> accent or primary, blue -> primary, orange -> accent).

LAYOUT & SPACING
• Use padding suited to visual weight: landing hero: 5–8rem desktop; simple page intro: 2–4rem.
• You may provide a mobile override via mobileProps (e.g. smaller padding such as 2rem).
• Keep justifyContent + alignItems consistent (usually center/center or start/start). Avoid mixing center with start.

TYPOGRAPHY
• 'content' should typically render ONE main heading concept (avoid stacking multiple unrelated headings). Use <br/> to split lines when stylistic.
• Avoid overly long taglines (>140 chars).

DYNAMIC DATA
• You may interpolate page queries fields fields: {{company.name}}, {{product.name}}, etc.
• Ensure dynamic tokens exist in the referenced query context. Don't fabricate field names.

RESPONSIVE
• Use mobileProps only for necessary reductions (padding, alignment). Do not duplicate unchanged properties.

DON'TS
✗ Don't add properties that are not in the schema.
✗ Don't wrap everything with extraneous HTML containers.
✗ Don't use colorPreset plus a conflicting parent background rationale—choose one.

DO
✓ Keep content focused.
✓ Use semantic colors thoughtfully.
✓ Use gradientDirection ONLY with gradient presets.
✓ Provide accessible plain text when not using HTML tags.
`,
  icon: BsAlphabetUppercase,

  defaultWidth: { desktop: "60dvw", mobile: "auto" },

  // Force the wrapper direction to be the same as the text direction
  staticClasses: "flex-col",

  props: defineProps({
    content: textContent({
      title: "Hero title",
      default: "<h1 style='text-align:center'>Lorem Ipsum<br />dolor sit amet</h1>",
    }),
    tagline: Type.Optional(
      textContent({
        title: "Hero tagline",
        // default: "<p style='text-align:center'>Use our platform to build your business with confidence.</p>",
      }),
    ),
    colorPreset: Type.Optional(
      colorPreset({
        title: "Color",
      }),
    ),

    textShadow: Type.Optional(
      textShadow({
        default: "text-shadow-sm",
      }),
    ),
    padding: Type.Optional(
      cssLength({
        default: "6rem",
        description: "Padding inside the hero.",
        "ai:instructions": "Use only a single value like '1rem' or '10px'",
        title: "Padding",
        "ui:responsive": true,
        "ui:placeholder": "Not specified",
        "ui:styleId": "styles:padding",
      }),
    ),
    rounding: rounding({
      default: "rounded-md",
    }),
    border: Type.Optional(border()),
    shadow: Type.Optional(shadow()),
    justifyContent: Type.Optional(
      justifyContent({
        default: "justify-center",
      }),
    ),
    alignItems: Type.Optional(
      alignItems({
        default: "items-center",
      }),
    ),
  }),
});

export type Manifest = typeof manifest;

export const examples: BrickExample<Manifest>[] = [
  {
    description: "Simple welcome hero with primary background",
    type: "hero",
    props: {
      content: "Welcome to Our Platform",
      tagline: "The future of productivity starts here",
      padding: "3rem",
      colorPreset: {
        color: "primary-400",
      },
    },
  },
  {
    description: "Startup hero with primary gradient background to bottom-right",
    type: "hero",
    props: {
      content: "Build Something Amazing",
      tagline: "Turn your ideas into reality with our cutting-edge tools",
      padding: "3rem",
      colorPreset: {
        color: "primary-500",
        gradientDirection: "bg-gradient-to-br",
      },
    },
  },
  {
    description: "Construction company hero with bold presence",
    type: "hero",
    props: {
      content: "Building Tomorrow Today",
      tagline: "Quality construction services for residential and commercial projects",
      padding: "3rem",
    },
  },
  {
    description: "Fashion brand hero with modern appeal",
    type: "hero",
    props: {
      content: "Express Your Style",
      tagline: "Contemporary fashion that speaks to your individuality",
      padding: "6rem",
    },
  },
  {
    description: "Law firm hero with authoritative tone",
    type: "hero",
    props: {
      content: "Justice You Can Trust",
      tagline: "Experienced legal representation for individuals and businesses",
      padding: "6rem",
      colorPreset: {
        color: "neutral-800",
      },
    },
  },
  {
    description: "Photography studio hero with artistic flair",
    type: "hero",
    props: {
      content: "Capturing Life's Moments",
      tagline: "Professional photography services for weddings, portraits, and events",
    },
  },
  {
    description: "Restaurant hero with warm colors and rounded design (accent mapping for former 'orange')",
    type: "hero",
    props: {
      content: "Authentic Italian Cuisine",
      tagline: "Fresh ingredients, traditional recipes, unforgettable flavors",
      padding: "4rem",
      colorPreset: {
        color: "accent-600",
      },
      rounding: "rounded-xl",
      shadow: "shadow-lg",
    },
  },
  {
    description:
      "Tech company hero with secondary gradient (mapped from former 'success') and modern styling",
    type: "hero",
    props: {
      content: "Innovation Redefined",
      tagline: "Pushing the boundaries of what's possible with AI technology",
      padding: "5rem",
      colorPreset: {
        color: "secondary-gradient-400",
        gradientDirection: "bg-gradient-to-r",
      },
      textShadow: "text-shadow-lg",
      border: {
        width: "border-2",
        color: "border-success-300",
      },
    },
  },
  {
    description: "Medical practice hero with trust-inspiring design (primary mapping for former 'blue')",
    type: "hero",
    props: {
      content: "Your Health, Our Priority",
      tagline: "Comprehensive healthcare services with compassionate care",
      padding: "4rem",
      colorPreset: {
        color: "primary-500",
      },
      rounding: "rounded-lg",
      justifyContent: "justify-start",
      alignItems: "items-start",
    },
  },
  {
    description:
      "Creative agency hero with accent gradient (mapped from former 'warning') and diagonal gradient",
    type: "hero",
    props: {
      content: "Creative Solutions",
      tagline: "Bold designs that make your brand unforgettable",
      padding: "3rem",
      colorPreset: {
        color: "accent-gradient-300",
        gradientDirection: "bg-gradient-to-tl",
      },
      shadow: "shadow-xl",
      border: {
        width: "border",
        color: "border-warning-200",
      },
    },
  },
  {
    description: "Fitness studio hero with accent strong presence (mapping former 'danger')",
    type: "hero",
    props: {
      content: "Transform Your Body",
      tagline: "High-intensity training programs that deliver real results",
      padding: "5rem",
      colorPreset: {
        color: "accent-600",
      },
      textShadow: "text-shadow-md",
      rounding: "rounded-2xl",
      justifyContent: "justify-center",
      alignItems: "items-center",
    },
  },
  {
    description: "Minimalist hero with neutral tones and subtle effects",
    type: "hero",
    props: {
      content: "Simplicity Perfected",
      tagline: "Clean design solutions for modern businesses",
      padding: "8rem",
      colorPreset: {
        color: "neutral-100",
      },
      shadow: "shadow-sm",
      border: {
        width: "border",
        color: "border-neutral-300",
      },
      rounding: "rounded-md",
    },
  },
  {
    description: "Inverted dark hero using neutral-800 background and left alignment",
    type: "hero",
    props: {
      content: "Experience Powerful Automation",
      tagline: "Scale operations with intelligent workflows",
      padding: "5rem",
      colorPreset: { color: "neutral-800" },
      justifyContent: "justify-start",
      alignItems: "items-start",
      textShadow: "text-shadow-sm",
    },
  },
  {
    description: "Compact hero without tagline (no colorPreset to inherit parent)",
    type: "hero",
    props: {
      content: "Documentation",
      padding: "2rem",
      justifyContent: "justify-start",
      alignItems: "items-start",
    },
  },
  {
    description: "Responsive hero with large desktop padding and reduced mobile padding",
    type: "hero",
    props: {
      content: "All-In-One Platform",
      tagline: "Design • Launch • Grow",
      padding: "8rem",
      colorPreset: { color: "primary-gradient-500", gradientDirection: "bg-gradient-to-br" },
    },
    mobileProps: {
      content: "All-In-One Platform",
      padding: "3rem",
    },
  },
  {
    description: "Hero using dynamic product dataset with gradient emphasis",
    type: "hero",
    props: {
      content: "Introducing {{product.name}}",
      tagline: "{{product.shortTagline}}",
      padding: "5rem",
      colorPreset: { color: "accent-gradient-400", gradientDirection: "bg-gradient-to-r" },
      textShadow: "text-shadow-md",
    },
  },
  {
    description: "Dynamic company hero using business query data",
    type: "hero",
    props: {
      content: "Welcome to {{company.name}}",
      tagline: "{{company.tagline}} - Serving {{company.location}} since {{company.foundedYear}}",
      padding: "4rem",
      colorPreset: {
        color: "primary-500",
      },
    },
  },
  {
    description: "Dynamic employee spotlight using employee query",
    type: "hero",
    props: {
      content: "Meet {{employee.fullName}}",
      tagline:
        "{{employee.position}} at {{employee.department}} - {{employee.yearsExperience}} years of experience",
      padding: "3rem",
      colorPreset: {
        color: "secondary-400",
        gradientDirection: "bg-gradient-to-r",
      },
    },
  },
  {
    description: "Dynamic product launch hero using product query",
    type: "hero",
    props: {
      content: "Introducing {{product.name}}",
      tagline: "{{product.description}} - Starting at ${{product.price}}",
      padding: "5rem",
      colorPreset: {
        color: "accent-600",
      },
      shadow: "shadow-lg",
      rounding: "rounded-xl",
    },
  },
  {
    description: "Dynamic event announcement using event query",
    type: "hero",
    props: {
      content: "{{event.title}}",
      tagline: "Join us on {{event.date}} at {{event.venue}} - {{event.city}}",
      padding: "4rem",
      colorPreset: {
        color: "primary-400",
        gradientDirection: "bg-gradient-to-br",
      },
      textShadow: "text-shadow-md",
    },
  },
  {
    description: "Dynamic blog post hero using article query",
    type: "hero",
    props: {
      content: "{{article.title}}",
      tagline: "By {{article.author}} • Published {{article.publishDate}} • {{article.readTime}} min read",
      padding: "3rem",
      colorPreset: {
        color: "neutral-700",
      },
      justifyContent: "justify-start",
      alignItems: "items-start",
    },
  },
  {
    description: "Dynamic service promotion using service query",
    type: "hero",
    props: {
      content: "{{service.name}}",
      tagline: "{{service.description}} - {{service.duration}} • Starting at ${{service.price}}",
      padding: "6rem",
      colorPreset: {
        color: "secondary-500",
        gradientDirection: "bg-gradient-to-tl",
      },
      border: {
        width: "border-2",
        color: "border-secondary-300",
      },
    },
  },
  {
    description: "Dynamic property showcase using property query",
    type: "hero",
    props: {
      content: "{{property.address}}",
      tagline:
        "${{property.price}} • {{property.bedrooms}} bed, {{property.bathrooms}} bath • {{property.squareFootage}} sq ft",
      padding: "4rem",
      colorPreset: {
        color: "accent-500",
      },
      rounding: "rounded-lg",
      shadow: "shadow-md",
    },
  },
  {
    description: "Dynamic course announcement using course query",
    type: "hero",
    props: {
      content: "{{course.title}}",
      tagline:
        "Learn {{course.subject}} with {{course.instructor}} • {{course.duration}} • {{course.skillLevel}} level",
      padding: "5rem",
      colorPreset: {
        color: "primary-600",
      },
      textShadow: "text-shadow-lg",
      justifyContent: "justify-center",
      alignItems: "items-center",
    },
  },
];

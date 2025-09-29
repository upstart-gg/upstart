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
4. Hero should be placed in vertical sections, except for very specific cases.

COLOR & BACKGROUND
- Prefer omitting "colorPreset" so the hero inherits its parent section background.
- If you do set "colorPreset", ensure sufficient contrast between text and background.

LAYOUT & SPACING
• Use padding suited to visual weight: landing hero: 5-8rem desktop; simple page intro: 2-4rem.
• You may provide a mobile override via mobileProps (e.g. smaller padding such as 2rem).
• Keep justifyContent + alignItems consistent (usually center/center or start/start). Avoid mixing center with start.

TYPOGRAPHY
• 'content' should typically render ONE main heading concept (avoid stacking multiple unrelated headings). Use <br/> to split lines when stylistic.
• Avoid overly long taglines (>140 chars).

DYNAMIC DATA
• You may interpolate page queries fields fields: {{company.name}}, {{product.name}}, etc.
• Ensure dynamic tokens exist in the referenced query context. Don't fabricate field names.

RESPONSIVE
• Use "mobileProps" only for necessary reductions (padding, alignment). Do not duplicate unchanged properties.

DON'TS
✗ Don't add properties that are not in the schema.
✗ Don't wrap everything with extraneous HTML containers.
✗ Don't use colorPreset plus a conflicting parent background rationale—choose one.

DO
✓ Keep content focused.
✓ Wrap tagline in <p> for alignment control.
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
    border: Type.Optional(
      border({
        "ai:hidden": true,
      }),
    ),
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
    description: "Simple welcome hero with primary background, centered",
    type: "hero",
    props: {
      content: "Welcome to Our Platform",
      tagline: "<p style='text-align:center'>The future of productivity starts here</p>",
      padding: "3rem",
    },
  },
  {
    description: "Startup hero with primary gradient background to bottom-right",
    type: "hero",
    props: {
      content: "Build Something Amazing",
      tagline: "<p style='text-align:center'>Turn your ideas into reality with our cutting-edge tools</p>",
      padding: "3rem",
    },
  },
  {
    description: "Construction company hero with bold presence",
    type: "hero",
    props: {
      content: "Building Tomorrow Today",
      tagline:
        "<p style='text-align:center'>Quality construction services for residential and commercial projects</p>",
      padding: "3rem",
    },
  },
  {
    description: "Fitness studio hero with accent strong presence",
    type: "hero",
    props: {
      content: "Transform Your Body",
      tagline: "<p style='text-align:center'>High-intensity training programs that deliver real results</p>",
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
    description: "Responsive hero with large desktop padding and reduced mobile padding",
    type: "hero",
    props: {
      content: "All-In-One Platform",
      tagline: "<p style='text-align:center'>Design • <i>Launch</i> • Grow</p>",
      padding: "8rem",
    },
    mobileProps: {
      padding: "3rem",
    },
  },
  {
    description: "Hero using dynamic product dataset with light text shadow for contrast",
    type: "hero",
    props: {
      content: "Introducing {{product.name}}",
      tagline: "<p style='text-align:center'>{{product.shortTagline}}</p>",
      padding: "5rem",
      textShadow: "text-shadow-sm",
    },
  },
  {
    description: "Dynamic company hero using business query data; no tagline",
    type: "hero",
    props: {
      content: "Welcome to {{company.name}}",
      padding: "4rem",
    },
  },
  {
    description: "Dynamic employee spotlight using employee query",
    type: "hero",
    props: {
      content: "Meet {{employee.fullName}}",
      tagline:
        "<p style='text-align:center'>{{employee.position}} at {{employee.department}} - {{employee.yearsExperience}} years of experience</p>",
      padding: "3rem",
    },
  },
  {
    description: "Dynamic product launch hero using product query",
    type: "hero",
    props: {
      content: "Introducing {{product.name}}",
      tagline: "<p style='text-align:center'>{{product.description}} - Starting at ${{product.price}}</p>",
      padding: "5rem",
    },
  },
  {
    description: "Dynamic event announcement using 'allEvents' query, text shadow for contrast",
    type: "hero",
    props: {
      content: "{{allEvents.title}}",
      tagline:
        "<p style='text-align:center'>Join us on {{allEvents.date}} at {{allEvents.venue}} - {{allEvents.city}}</p>",
      padding: "4rem",
      textShadow: "text-shadow-md",
    },
  },
  {
    description:
      "Dynamic blog post hero using article query, alignment to left-center to be able to arrange a brick on its right",
    type: "hero",
    props: {
      content: "{{article.title}}",
      tagline:
        "<p style='text-align:center'>By {{article.author}} • Published {{article.publishDate}} • {{article.readTime}} min read</p>",
      padding: "3rem",
      justifyContent: "justify-start",
      alignItems: "items-center",
    },
  },
];

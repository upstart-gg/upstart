import { type Static, Type } from "@sinclair/typebox";
import { FaWpforms } from "react-icons/fa6";
import { defineBrickManifest } from "~/shared/bricks/types";
import { StringEnum } from "~/shared/utils/string-enum";
import { border, rounding } from "../props/border";
import { datarecord } from "../props/datarecord";
import { defineProps, group } from "../props/helpers";
import { fontSize } from "../props/text";
import { colorPreset } from "../props/color-preset";
import { direction } from "../props/direction";
import { cssLength } from "../props/css-length";
import type { BrickExample } from "./_types";

export const manifest = defineBrickManifest({
  type: "form",
  name: "Form",
  description: "A form element.",
  aiInstructions: `PURPOSE
Dynamic form generator. Fields are inferred from the referenced datarecord schema (datarecordId). You NEVER list fields manually and the form does not accept children.

REQUIRED
• datarecordId must reference an existing datarecord definition.

COLOR & STYLE
• Optional colorPreset sets background + text. If omitted the form inherits parent background.
• Allowed tokens: primary-/secondary-/accent-/neutral-/base-*** (and gradient variants). Do NOT invent success, warning, danger, info, etc. Map them (success->secondary or primary; warning->accent; danger->accent/primary).
• Use rounding + border + padding for emphasis. Keep padding modest (1–3rem) unless it's a feature form hero (max ~4rem).

LAYOUT
• direction controls stacking (flex-col vs flex-row). Wide multi-column layouts usually flex-row on desktop, stacked (flex-col) on mobile.
• Use mobileProps to reduce padding or switch direction ONLY if necessary. (If switching direction, you must repeat required props.)

BUTTON GROUP
• Only supply button overrides you actually change (color, size, position, rounding). Unspecified values fallback to defaults.
• If button.size = wide then hide position (handled by schema metadata automatically—don't circumvent).

CONTENT STRINGS
• title, intro, buttonLabel, successMessage, errorMessage should be concise.
• Avoid marketing fluff inside intro beyond one short paragraph.

DYNAMIC DATA
• Do not interpolate inside datarecordId (it must be a static id).
• You MAY interpolate page queries aliases in title/intro (e.g. "Apply for {{job.title}}") if those fields exist in surrounding dataset context.

DON'TS
✗ Don't invent props.
✗ Don't add HTML tags except basic inline markup if absolutely needed (prefer plain text).
✗ Don't set impossible color tokens.

DO
✓ Keep examples lean.
✓ Use semantic color mapping guidelines.
✓ Provide accessible, human-readable labels.
`,
  isContainer: false,
  icon: FaWpforms,
  minWidth: {
    desktop: 300,
  },
  props: defineProps({
    datarecordId: datarecord("Datarecord ID", {
      description: "The ID of the datarecord to use to generate the form fields. The datarecord must exist.",
      "ui:responsive": "desktop",
    }),
    colorPreset: Type.Optional(
      colorPreset({
        title: "Color",
        default: "base-200",
      }),
    ),
    direction: Type.Optional(
      direction({
        title: "Direction",
        description: "The direction of the form fields",
        default: "flex-col",
        "ui:responsive": "desktop",
        "ui:desktop-only": true,
      }),
    ),
    padding: Type.Optional(
      cssLength({
        default: "2rem",
        description: "Padding inside the form.",
        title: "Padding",
        "ui:responsive": true,
        "ui:placeholder": "Not specified",
        "ui:styleId": "styles:padding",
      }),
    ),
    rounding: Type.Optional(
      rounding({
        default: "rounded-md",
      }),
    ),
    border: Type.Optional(border({})),
    fontSize: Type.Optional(fontSize({ default: "inherit", "ui:no-extra-large-sizes": true })),
    button: group({
      title: "Button",
      children: {
        color: Type.Optional(
          StringEnum(["btn-neutral", "btn-primary", "btn-secondary", "btn-accent"], {
            enumNames: ["Neutral", "Primary", "Secondary", "Accent"],
            title: "Color",
            default: "btn-primary",
          }),
        ),
        size: Type.Optional(
          StringEnum(["block", "wide"], {
            title: "Size",
            description: "Button sizes.",
            enumNames: ["Block", "Wide"],
            default: "block",
            "ui:responsive": "desktop",
          }),
        ),
        position: Type.Optional(
          StringEnum(["justify-start", "justify-center", "justify-end"], {
            title: "Button Position",
            description: "The position of the button in the form",
            enumNames: ["Left", "Center", "Right"],
            default: "justify-end",
            "ui:responsive": "desktop",
            metadata: {
              filter: (manifestProps: Manifest["props"], formData: Static<Manifest["props"]>) => {
                return formData.button?.size !== "wide";
              },
            },
          }),
        ),
        rounding: rounding({ default: "rounded-md" }),
      },
    }),

    title: Type.Optional(
      Type.String({
        title: "Form title",
        default: "My form",
        metadata: {
          category: "content",
        },
      }),
    ),
    intro: Type.Optional(
      Type.String({
        title: "Intro",
        description: "The intro text of the form",
        "ui:multiline": true,
        metadata: {
          category: "content",
        },
      }),
    ),
    buttonLabel: Type.Optional(
      Type.String({
        title: "Button label",
        default: "Submit",
        metadata: { category: "content" },
      }),
    ),
    successMessage: Type.Optional(
      Type.String({
        title: "Success Message",
        description: "The message to display when the form is successfully submitted",
        default: "Thank you for your submission!",
        metadata: {
          category: "content",
        },
      }),
    ),
    errorMessage: Type.Optional(
      Type.String({
        title: "Error Message",
        description: "The message to display when the form submission fails",
        default: "There was an error submitting the form. Please try again later.",
        metadata: {
          category: "content",
        },
      }),
    ),
  }),
});

export type Manifest = typeof manifest;

export const examples: BrickExample<Manifest>[] = [
  {
    description: "Basic contact form",
    type: "form",
    props: {
      title: "Contact Us",
      intro: "We'd love to hear from you. Send us a message and we'll respond as soon as possible.",
      direction: "flex-row",
      datarecordId: "contacts",
      buttonLabel: "Send Message",
      button: {
        size: "block",
      },
    },
  },
  {
    description: "User registration form with large button",
    type: "form",
    props: {
      title: "Create Account",
      intro: "Join our platform and start your journey today.",
      direction: "flex-row",
      datarecordId: "user-registration",
      buttonLabel: "Register",
      button: {
        size: "wide",
      },
    },
  },
  {
    description: "Responsive newsletter subscription: desktop horizontal -> mobile vertical",
    type: "form",
    props: {
      title: "Stay Updated",
      intro: "Subscribe for product news and occasional tips.",
      direction: "flex-row",
      datarecordId: "newsletter-subscription",
      padding: "3rem",
      buttonLabel: "Subscribe",
      button: { size: "block" },
      colorPreset: { color: "neutral-100" },
    },
    mobileProps: {
      title: "Stay Updated",
      intro: "Subscribe for product news and occasional tips.",
      direction: "flex-col",
      datarecordId: "newsletter-subscription",
      padding: "2rem",
      buttonLabel: "Subscribe",
      button: { size: "block" },
      colorPreset: { color: "neutral-100" },
    },
  },
  {
    description: "Newsletter subscription form (horizontal) with large padding",
    type: "form",
    props: {
      title: "Stay Updated",
      intro: "Subscribe to our newsletter for the latest updates and exclusive content.",
      direction: "flex-col",
      datarecordId: "newsletter-subscription",
      padding: "3rem",
      buttonLabel: "Subscribe",
      button: {
        size: "block",
      },
    },
  },
  {
    description: "Minimal inline signup form (no background colorPreset, inherits parent)",
    type: "form",
    props: {
      title: "Join Beta",
      intro: "Access early features before public launch.",
      direction: "flex-row",
      datarecordId: "beta-signup",
      buttonLabel: "Request Access",
      button: { size: "block" },
      padding: "1.5rem",
    },
  },
  {
    description: "Dark themed form using neutral-800 background and accent button",
    type: "form",
    props: {
      title: "Feedback",
      intro: "Tell us how we can improve the product.",
      direction: "flex-col",
      datarecordId: "product-feedback",
      buttonLabel: "Send Feedback",
      colorPreset: { color: "neutral-800" },
      padding: "2.5rem",
      button: { color: "btn-accent" },
      rounding: "rounded-lg",
      border: { width: "border", color: "border-neutral-700" },
    },
  },
  {
    description: "Gradient emphasis form (primary gradient) for event signup",
    type: "form",
    props: {
      title: "Conference RSVP",
      intro: "Reserve your seat for {{event.title}}.",
      direction: "flex-col",
      datarecordId: "event-registration",
      buttonLabel: "Reserve Seat",
      colorPreset: { color: "primary-gradient-400", gradientDirection: "bg-gradient-to-br" },
      padding: "3rem",
      button: { color: "btn-secondary" },
      rounding: "rounded-xl",
      border: { width: "border-2", color: "border-primary-300" },
    },
  },
  {
    description: "Event registration form",
    type: "form",
    props: {
      title: "Conference Registration",
      intro: "Register for the Annual Tech Conference 2025. Early bird pricing ends soon!",
      direction: "flex-col",
      datarecordId: "event-registration",
      buttonLabel: "Register Now",
      button: {
        size: "block",
      },
    },
  },
  {
    description: "Job application form",
    type: "form",
    props: {
      title: "Apply for Position",
      intro: "We're excited to learn more about you! Please fill out this application form completely.",
      direction: "flex-col",
      datarecordId: "job-application",
      buttonLabel: "Submit Application",
      button: {
        size: "block",
      },
    },
  },
  {
    description: "Dynamic job application (title interpolated) mapping dataset field",
    type: "form",
    props: {
      title: "Apply for {{job.title}}",
      intro: "Join our team in {{job.location}}.",
      direction: "flex-col",
      datarecordId: "job-application",
      buttonLabel: "Apply Now",
      colorPreset: { color: "secondary-100" },
      button: { size: "block", color: "btn-primary" },
      padding: "2rem",
    },
  },
];

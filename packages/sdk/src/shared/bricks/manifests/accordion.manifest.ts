import { Type, type TObject } from "@sinclair/typebox";
import { TfiLayoutAccordionSeparated } from "react-icons/tfi";
import { defineBrickManifest } from "~/shared/brick-manifest";
import { StringEnum } from "~/shared/utils/string-enum";
import { boolean } from "../props/boolean";
import { basicGapRef } from "../props/gap";
import { defineProps } from "../props/helpers";
import { colorPresetRef } from "../props/preset";
import { fontSizeRef, textContentRef } from "../props/text";
import type { BrickProps } from "../props/types";

export const manifest = defineBrickManifest({
  type: "accordion",
  kind: "widget",
  name: "Accordion",
  description: "An accordion/collapse element for expandable content",
  aiInstructions: `
This accordion element displays content in collapsible panels.
It is typically used for FAQ sections, organized documentation, or to save space.
Each item has a title and expandable content area.
Multiple panels can be open simultaneously or limited to one at a time.
  `.trim(),
  icon: TfiLayoutAccordionSeparated,

  defaultWidth: { desktop: "250px", mobile: "100%" },

  props: defineProps(
    {
      items: Type.Array(
        Type.Object({
          title: textContentRef({
            title: "Title",
            default: "My title",
            disableSizing: true,
            showInSettings: true,
          }),
          content: textContentRef({ title: "Content", default: "Expandable content goes here" }),
          defaultOpen: Type.Optional(boolean("Open by default", false)),
        }),
        {
          title: "Accordion items",
          metadata: {
            category: "content",
          },
        },
      ),
      fontSize: Type.Optional(fontSizeRef({ default: "inherit" })),
      restrictOneOpen: boolean("Restrict to one open item", false, {
        description:
          "Restrict to one open item at a time. If false, multiple items can be open simultaneously.",
      }),
      // collapse: Type.Optional(
      //   Type.Union(
      //     [
      //     Type.Literal("collapse-none", { title: "None" }),
      //       Type.Literal("collapse-plus", { title: "Plus" }),
      //       Type.Literal("collapse-arrow", { title: "Arrow" }),
      //     ],
      //     {
      //       title: "Collapse indicator",
      //       description: "Collapse indicator style.",
      //       default: "collapse-none",
      //     },
      //   ),
      // ),
      gap: basicGapRef({ allowNoGap: false }),
      // border: Type.Optional(
      //   borderRef({
      //     default: {
      //       width: "border",
      //       rounding: "rounded-md",
      //     },
      //   }),
      // ),
      rounding: Type.Optional(
        StringEnum(
          [
            "rounded-auto",
            "rounded-none",
            "rounded-sm",
            "rounded-md",
            "rounded-lg",
            "rounded-xl",
            "rounded-2xl",
            "rounded-3xl",
          ],
          {
            title: "Corner rounding",
            enumNames: ["Auto", "None", "Small", "Medium", "Large", "Extra large", "2xl", "3xl"],
            "ui:placeholder": "Not specified",
            "ui:field": "enum",
            "ui:display": "select",
            "ui:styleId": "styles:rounding",
            default: "rounded-auto",
          },
        ),
      ),
      colorPreset: Type.Optional(
        colorPresetRef({
          title: "Color preset",
          "ui:presets": {
            "primary-light": {
              previewBgClass: "bg-primary-light text-primary-content-light",
              value: {
                title: "bg-primary-light text-primary-content-light",
                border: "border-primary-light",
              },
              label: "Primary light",
            },
            "primary-light-gradient": {
              previewBgClass: "bg-gradient-to-br from-primary-300 to-primary-500 text-primary-content-light",
              value: {
                title: "from-primary-300 to-primary-500 text-primary-content-light",
                border: "border-primary",
              },
              label: "Primary light gradient",
            },
            primary: {
              previewBgClass: "bg-primary text-primary-content",
              label: "Primary",
              value: {
                title: "bg-primary text-primary-content",
                border: "border-primary",
              },
            },
            "primary-gradient": {
              previewBgClass: "bg-gradient-to-br from-primary-500 to-primary-700 text-primary-content",
              label: "Primary gradient",
              value: {
                title: "from-primary-500 to-primary-700 text-primary-content",
                border: "border-primary",
              },
            },
            "primary-dark": {
              previewBgClass: "bg-primary-dark text-primary-content",
              label: "Primary dark",
              value: {
                title: "bg-primary-dark text-primary-content",
                border: "border-primary-dark",
              },
            },
            "primary-dark-gradient": {
              previewBgClass: "bg-gradient-to-br from-primary-700 to-primary-900 text-primary-content",
              label: "Primary dark gradient",
              value: {
                title: "from-primary-700 to-primary-900 text-primary-content",
                border: "border-primary-dark",
              },
            },
            "secondary-light": {
              previewBgClass: "bg-secondary-light text-secondary-content-light",
              label: "Secondary light",
              value: {
                title: "bg-secondary-light text-secondary-content-light",
                border: "border-secondary-light",
              },
            },
            "secondary-light-gradient": {
              previewBgClass:
                "bg-gradient-to-br from-secondary-300 to-secondary-500 text-secondary-content-light",
              label: "Secondary light gradient",
              value: {
                title: "from-secondary-300 to-secondary-500 text-secondary-content-light",
                border: "border-secondary",
              },
            },
            secondary: {
              previewBgClass: "bg-secondary text-secondary-content",
              label: "Secondary",
              value: {
                title: "bg-secondary text-secondary-content",
                border: "border-secondary",
              },
            },
            "secondary-gradient": {
              previewBgClass: "bg-gradient-to-br from-secondary-500 to-secondary-700 text-secondary-content",
              label: "Secondary gradient",
              value: {
                title: "from-secondary-500 to-secondary-700 text-secondary-content",
                border: "border-secondary",
              },
            },
            "secondary-dark": {
              previewBgClass: "bg-secondary-dark text-secondary-content",
              label: "Secondary dark",
              value: {
                title: "bg-secondary-dark text-secondary-content",
                border: "border-secondary-dark",
              },
            },

            "secondary-dark-gradient": {
              previewBgClass: "bg-gradient-to-br from-secondary-700 to-secondary-900 text-secondary-content",
              label: "Secondary dark gradient",
              value: {
                title: "from-secondary-700 to-secondary-900 text-secondary-content",
                border: "border-secondary-dark",
              },
            },

            "accent-light": {
              previewBgClass: "bg-accent-light text-accent-content-light",
              label: "Accent lighter",
              value: {
                title: "bg-accent-light text-accent-content-light",
                border: "border-accent-light",
              },
            },

            "accent-light-gradient": {
              previewBgClass: "bg-gradient-to-br from-accent-300 to-accent-500 text-accent-content-light",
              label: "Accent light gradient",
              value: {
                title: "from-accent-300 to-accent-500 text-accent-content-light",
                border: "border-accent",
              },
            },
            accent: {
              previewBgClass: "bg-accent text-accent-content",
              label: "Accent",
              value: {
                title: "bg-accent text-accent-content",
                border: "border-accent",
              },
            },

            "accent-gradient": {
              previewBgClass: "bg-gradient-to-br from-accent-500 to-accent-700 text-accent-content",
              label: "Accent gradient",
              value: {
                title: "from-accent-500 to-accent-700 text-accent-content",
                border: "border-accent",
              },
            },
            "accent-dark": {
              previewBgClass: "bg-accent-dark text-accent-content",
              label: "Accent dark",
              value: {
                title: "bg-accent-dark text-accent-content",
                border: "border-accent-dark",
              },
            },

            "accent-dark-gradient": {
              previewBgClass: "bg-gradient-to-br from-accent-700 to-accent-900 text-accent-content",
              label: "Accent dark gradient",
              value: {
                title: "from-accent-700 to-accent-900 text-accent-content",
                border: "border-accent-dark",
              },
            },
            "neutral-light": {
              previewBgClass: "bg-neutral-light text-neutral-content-light",
              label: "Neutral light",
              value: {
                title: "bg-neutral-light text-neutral-content-light",
                border: "border-neutral-light",
              },
            },

            "neutral-light-gradient": {
              previewBgClass: "bg-gradient-to-br from-neutral-300 to-neutral-500 text-neutral-content-light",
              label: "Neutral light gradient",
              value: {
                title: "from-neutral-300 to-neutral-500 text-neutral-content-light",
                border: "border-neutral",
              },
            },

            neutral: {
              previewBgClass: "bg-neutral text-neutral-content",
              label: "Neutral",
              value: {
                title: "bg-neutral text-neutral-content",
                border: "border-neutral",
              },
            },

            "neutral-gradient": {
              previewBgClass: "bg-gradient-to-br from-neutral-500 to-neutral-700 text-neutral-content",
              label: "Neutral gradient",
              value: {
                title: "from-neutral-500 to-neutral-700 text-neutral-content",
                border: "border-neutral",
              },
            },

            "neutral-dark": {
              previewBgClass: "bg-neutral-dark text-neutral-content",
              label: "Neutral dark",
              value: {
                title: "bg-neutral-dark text-neutral-content",
                border: "border-neutral-dark",
              },
            },

            "neutral-dark-gradient": {
              previewBgClass: "bg-gradient-to-br from-neutral-700 to-neutral-900 text-neutral-content",
              label: "Neutral dark gradient",
              value: {
                title: "from-neutral-700 to-neutral-900 text-neutral-content",
                border: "border-neutral-dark",
              },
            },
            base100: {
              previewBgClass: "bg-base-100 text-base-content border-base-200 border-2",
              label: "Base 100",
              value: {
                title: "bg-base-100 text-base-content border-base-200",
                border: "border-base-200",
              },
            },
            base100_primary: {
              previewBgClass: "bg-base-100 text-base-content border-primary border-2",
              label: "Base 100 / Primary",
              value: {
                title: "bg-base-100 text-base-content border-primary",
                border: "border-primary",
              },
            },
            base100_secondary: {
              previewBgClass: "bg-base-100 text-base-content border-secondary border-2",
              label: "Base 100 / Secondary",
              value: {
                title: "bg-base-100 text-base-content border-secondary",
                border: "border-secondary",
              },
            },
            base100_accent: {
              previewBgClass: "bg-base-100 text-base-content border-accent border-2",
              label: "Base 100 / Accent",
              value: {
                title: "bg-base-100 text-base-content border-accent",
                border: "border-accent",
              },
            },

            none: { label: "None", value: {} },
          },
          default: "primary",
        }),
      ),
      gradientDirection: Type.Optional(
        StringEnum(
          [
            "bg-gradient-to-t",
            "bg-gradient-to-r",
            "bg-gradient-to-b",
            "bg-gradient-to-l",
            "bg-gradient-to-tl",
            "bg-gradient-to-tr",
            "bg-gradient-to-br",
            "bg-gradient-to-bl",
          ],
          {
            title: "Gradient direction",
            description: "The direction of the gradient. Only applies when color preset is a gradient.",
            enumNames: [
              "Top",
              "Right",
              "Bottom",
              "Left",
              "Top left",
              "Top right",
              "Bottom right",
              "Bottom left",
            ],
            default: "bg-gradient-to-br",
            "ui:responsive": "desktop",
            "ui:styleId": "styles:gradientDirection",
            metadata: {
              filter: (manifestProps: TObject, formData: Manifest["props"]) => {
                return formData.colorPreset?.includes("gradient") === true;
              },
            },
          },
        ),
      ),
    },
    {
      default: {
        container: {
          padding: "p-6",
          backgroundColor: "bg-transparent",
        },
        allowMultiple: true,
        variants: ["collapse-arrow"],
      },
    },
  ),
});

export type Manifest = typeof manifest;

export const examples: {
  description: string;
  type: string;
  props: BrickProps<Manifest>["brick"]["props"];
}[] = [
  {
    description: "FAQ section with card styling with single open",
    type: "accordion",
    props: {
      restrictOneOpen: true,
      items: [
        {
          title: "What is included in the basic plan?",
          content:
            "The basic plan includes access to all core features, up to 10 projects, 5GB storage, email support, and basic analytics. You can upgrade at any time to access advanced features like API access, priority support, and unlimited projects.",
          defaultOpen: true,
        },
        {
          title: "How do I cancel my subscription?",
          content:
            "You can cancel your subscription at any time from your account settings. Go to Billing > Manage Subscription > Cancel. Your access will continue until the end of your current billing period, and you won't be charged for the next cycle.",
        },
        {
          title: "Is there a free trial available?",
          content:
            "Yes! We offer a 14-day free trial with full access to all premium features. No credit card required to start. You can upgrade to a paid plan anytime during or after the trial period.",
        },
        {
          title: "What payment methods do you accept?",
          content:
            "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for annual subscriptions. All payments are processed securely through our payment partners.",
        },
        {
          title: "Do you offer refunds?",
          content:
            "We offer a 30-day money-back guarantee for all new subscriptions. If you're not satisfied with our service, contact our support team within 30 days of your purchase for a full refund.",
        },
      ],
    },
  },
];

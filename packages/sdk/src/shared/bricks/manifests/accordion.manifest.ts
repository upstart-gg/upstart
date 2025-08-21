import { Type } from "@sinclair/typebox";
import { TfiLayoutAccordionSeparated } from "react-icons/tfi";
import { defineBrickManifest } from "~/shared/brick-manifest";
import { StringEnum } from "~/shared/utils/string-enum";
import { boolean } from "../props/boolean";
import { basicGapRef } from "../props/gap";
import { defineProps } from "../props/helpers";
import { colorPresetRef } from "../props/color-preset";
import { fontSizeRef, textContentRef } from "../props/text";
import type { BrickProps } from "../props/types";

export const manifest = defineBrickManifest({
  type: "accordion",
  name: "Accordion",
  description: "An accordion/collapse element for expandable content",
  aiInstructions: `
This accordion element displays content in collapsible panels.
It is typically used for FAQ sections, organized documentation, or to save space.
Each item has a title and expandable content area.
Multiple panels can be open simultaneously or limited to one at a time.
  `.trim(),
  icon: TfiLayoutAccordionSeparated,

  defaultWidth: { desktop: "450px", mobile: "100%" },

  props: defineProps({
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
    gap: Type.Optional(basicGapRef({ allowNoGap: false, default: "gap-px" })),
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
        title: "Color",
        default: { color: "bg-primary-500 text-primary-500-content" },
      }),
    ),
  }),
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

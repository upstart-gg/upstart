import { defineBrickManifest } from "~/shared/brick-manifest";
import { defineProps, group } from "../props/helpers";
import { Type } from "@sinclair/typebox";
import { MdExpandMore } from "react-icons/md";
import { backgroundColor, backgroundColorRef } from "../props/background";
import { fontSize, fontSizeRef, textContent, textContentRef } from "../props/text";
import { string } from "../props/string";
import { padding, paddingRef } from "../props/padding";
import { border, borderRef } from "../props/border";
import { shadow, shadowRef } from "../props/effects";
import { boolean } from "../props/boolean";
import { TfiLayoutAccordionSeparated } from "react-icons/tfi";
import type { BrickProps } from "../props/types";
import { colorRef } from "../props/color";
import type { FC } from "react";
import { StringEnum } from "~/shared/utils/string-enum";

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

  defaultWidth: { desktop: "250px", mobile: "100%" },

  props: defineProps(
    {
      container: Type.Optional(
        group({
          title: "Container",
          children: {
            backgroundColor: Type.Optional(backgroundColorRef()),
            padding: Type.Optional(paddingRef()),
            border: Type.Optional(borderRef()),
            shadow: Type.Optional(shadowRef()),
          },
        }),
      ),
      items: Type.Array(
        Type.Object({
          title: textContentRef({ title: "Title", default: "My title", disableSizing: true }),
          content: textContentRef({ title: "Content", default: "Expandable content goes here" }),
          defaultOpen: Type.Optional(boolean("Open by default", false)),
        }),
        {
          title: "Accordion items",
        },
      ),
      itemsStyles: Type.Optional(
        group({
          title: "Accordion item styles",
          children: {
            backgroundColor: Type.Optional(backgroundColorRef()),
            color: Type.Optional(colorRef()),
            fontSize: fontSizeRef({ default: "inherit" }),
          },
        }),
      ),
      allowMultiple: boolean("Allow multiple open", true, {
        description: "Allow multiple accordion items to be open at the same time",
      }),
      variants: Type.Array(
        StringEnum(["collapse-arrow", "collapse-plus"], {
          default: ["collapse-arrow"],
          enumNames: ["With Arrow indicator", "With + indicator"],
        }),
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
      container: {
        backgroundColor: "bg-base-50",
        padding: "p-8",
        border: {
          rounding: "rounded-lg",
        },
        shadow: "shadow-lg",
      },
      variants: ["collapse-plus"],
      allowMultiple: false,
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
  {
    description: "Product features with arrow indicator and multiple open",
    type: "accordion",
    props: {
      container: {
        padding: "p-4",
      },
      variants: ["collapse-arrow"],
      allowMultiple: true,
      items: [
        {
          title: "Advanced Analytics",
          content:
            "Get detailed insights into your data with our comprehensive analytics dashboard. Track key metrics, generate custom reports, and identify trends with powerful visualization tools.",
          defaultOpen: true,
        },
        {
          title: "Team Collaboration",
          content:
            "Work seamlessly with your team using real-time collaboration features. Share projects, assign tasks, leave comments, and track progress all in one place.",
        },
        {
          title: "API Integration",
          content:
            "Connect with your existing tools and workflows using our robust API. Full documentation, SDKs for popular languages, and webhook support included.",
        },
        {
          title: "Security & Compliance",
          content:
            "Enterprise-grade security with SOC 2 compliance, data encryption at rest and in transit, SSO support, and comprehensive audit logs.",
        },
      ],
    },
  },
];

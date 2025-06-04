import { defineBrickManifest } from "~/shared/brick-manifest";
import { defineProps, optional, group, prop } from "../props/helpers";
import { Type } from "@sinclair/typebox";
import { MdExpandMore } from "react-icons/md";
import { preset } from "../props/preset";
import { backgroundColor } from "../props/background";
import { textContent } from "../props/text";
import { string } from "../props/string";
import { padding } from "../props/padding";
import { border } from "../props/border";
import { shadow } from "../props/effects";
import { boolean } from "../props/boolean";
import { TfiLayoutAccordionSeparated } from "react-icons/tfi";
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

  defaultHeight: { desktop: 10, mobile: 15 },
  defaultWidth: { desktop: 36, mobile: 24 },

  props: defineProps(
    {
      container: optional(
        group({
          title: "Container",
          children: {
            backgroundColor: optional(backgroundColor()),
            padding: optional(padding("p-4")),
            border: optional(border()),
            shadow: optional(shadow()),
          },
        }),
      ),
      items: prop({
        title: "Accordion items",
        schema: Type.Array(
          Type.Object({
            title: textContent("Title", "Section title", { disableSizing: true }),
            content: textContent("Content", "Expandable content goes here"),
            defaultOpen: optional(boolean("Open by default", false)),
            icon: optional(
              prop({
                title: "Icon",
                description: "Icon to display (iconify reference)",
                schema: string("Icon", undefined, {
                  description: "Icon for this accordion item",
                  "ui:widget": "iconify",
                }),
              }),
            ),
            disabled: optional(boolean("Disabled", false)),
          }),
        ),
      }),
      behavior: optional(
        group({
          title: "Behavior",
          children: {
            allowMultiple: optional(
              boolean("Allow multiple open", true, {
                description: "Allow multiple accordion items to be open at the same time",
              }),
            ),
            collapsible: optional(
              boolean("Collapsible", true, {
                description: "Allow opened items to be collapsed",
              }),
            ),
            animation: optional(
              prop({
                title: "Animation",
                schema: Type.Union(
                  [
                    Type.Literal("none", { title: "None" }),
                    Type.Literal("slide", { title: "Slide" }),
                    Type.Literal("fade", { title: "Fade" }),
                  ],
                  { default: "slide" },
                ),
              }),
            ),
          },
        }),
      ),
      variants: Type.Array(
        Type.Union(
          [
            Type.Literal("bordered", {
              title: "Bordered",
              description: "Add borders around accordion items",
            }),
            Type.Literal("separated", {
              title: "Separated",
              description: "Add space between accordion items",
            }),
            Type.Literal("minimal", {
              title: "Minimal",
              description: "Simple design with minimal styling",
            }),
            Type.Literal("card-style", {
              title: "Card style",
              description: "Display each item as a card",
            }),
            Type.Literal("with-icon", {
              title: "With icon",
              description: "Show expand/collapse icon",
            }),
            Type.Literal("icon-left", {
              title: "Icon left",
              description: "Position expand icon on the left",
            }),
            Type.Literal("flush", {
              title: "Flush",
              description: "Remove outer borders and padding",
            }),
          ],
          {
            title: "Variant",
            description: "Accordion display variants",
          },
        ),
        { default: ["bordered", "with-icon"] },
      ),
    },
    {
      default: {
        container: {
          padding: "p-6",
          backgroundColor: "bg-transparent",
        },
        behavior: {
          allowMultiple: true,
          collapsible: true,
          animation: "slide",
        },
        variants: ["bordered", "with-icon"],
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
    description: "FAQ section with card styling",
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
      variants: ["card-style", "separated", "with-icon"],
      behavior: {
        allowMultiple: false,
        collapsible: true,
        animation: "slide",
      },
      items: [
        {
          title: "What is included in the basic plan?",
          content:
            "The basic plan includes access to all core features, up to 10 projects, 5GB storage, email support, and basic analytics. You can upgrade at any time to access advanced features like API access, priority support, and unlimited projects.",
          defaultOpen: true,
          icon: "mdi:help-circle",
        },
        {
          title: "How do I cancel my subscription?",
          content:
            "You can cancel your subscription at any time from your account settings. Go to Billing > Manage Subscription > Cancel. Your access will continue until the end of your current billing period, and you won't be charged for the next cycle.",
          icon: "mdi:credit-card-off",
        },
        {
          title: "Is there a free trial available?",
          content:
            "Yes! We offer a 14-day free trial with full access to all premium features. No credit card required to start. You can upgrade to a paid plan anytime during or after the trial period.",
          icon: "mdi:gift",
        },
        {
          title: "What payment methods do you accept?",
          content:
            "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for annual subscriptions. All payments are processed securely through our payment partners.",
          icon: "mdi:credit-card",
        },
        {
          title: "Do you offer refunds?",
          content:
            "We offer a 30-day money-back guarantee for all new subscriptions. If you're not satisfied with our service, contact our support team within 30 days of your purchase for a full refund.",
          icon: "mdi:cash-refund",
        },
      ],
    },
  },
  {
    description: "Product features with minimal styling",
    type: "accordion",
    props: {
      container: {
        padding: "p-4",
      },
      variants: ["minimal", "flush", "icon-left"],
      behavior: {
        allowMultiple: true,
        collapsible: true,
        animation: "fade",
      },
      items: [
        {
          title: "Advanced Analytics",
          content:
            "Get detailed insights into your data with our comprehensive analytics dashboard. Track key metrics, generate custom reports, and identify trends with powerful visualization tools.",
          icon: "mdi:chart-line",
        },
        {
          title: "Team Collaboration",
          content:
            "Work seamlessly with your team using real-time collaboration features. Share projects, assign tasks, leave comments, and track progress all in one place.",
          icon: "mdi:account-group",
        },
        {
          title: "API Integration",
          content:
            "Connect with your existing tools and workflows using our robust API. Full documentation, SDKs for popular languages, and webhook support included.",
          icon: "mdi:api",
        },
        {
          title: "Security & Compliance",
          content:
            "Enterprise-grade security with SOC 2 compliance, data encryption at rest and in transit, SSO support, and comprehensive audit logs.",
          icon: "mdi:shield-check",
        },
      ],
    },
  },
  {
    description: "Support documentation with bordered layout",
    type: "accordion",
    props: {
      container: {
        backgroundColor: "bg-white",
        padding: "p-8",
        border: {
          rounding: "rounded-lg",
        },
      },
      variants: ["bordered", "with-icon"],
      behavior: {
        allowMultiple: true,
        collapsible: true,
        animation: "slide",
      },
      items: [
        {
          title: "Getting Started",
          content:
            "<h4>Welcome to our platform!</h4><p>Follow these steps to get started:</p><ol><li>Create your account and verify your email</li><li>Complete your profile setup</li><li>Explore the dashboard and key features</li><li>Connect your first integration</li></ol><p>Need help? Check out our <a href='/tutorials'>video tutorials</a> or contact support.</p>",
          defaultOpen: true,
          icon: "mdi:rocket-launch",
        },
        {
          title: "Account Management",
          content:
            "<p>Manage your account settings, billing information, and team members from the Account section.</p><p><strong>Key features:</strong></p><ul><li>Update profile and contact information</li><li>Manage billing and subscription</li><li>Invite and remove team members</li><li>Configure security settings</li><li>Download invoices and usage reports</li></ul>",
          icon: "mdi:account-cog",
        },
        {
          title: "Troubleshooting",
          content:
            "<p>Common issues and solutions:</p><p><strong>Login Problems:</strong> Clear your browser cache, check your email for verification links, or reset your password.</p><p><strong>Performance Issues:</strong> Try refreshing the page, check your internet connection, or contact support if problems persist.</p><p><strong>Feature Not Working:</strong> Ensure you have the required permissions and your subscription includes access to that feature.</p>",
          icon: "mdi:wrench",
        },
        {
          title: "Contact Support",
          content:
            "<p>Our support team is here to help!</p><p><strong>Email:</strong> support@company.com<br><strong>Response time:</strong> Within 24 hours</p><p><strong>Live Chat:</strong> Available Monday-Friday, 9 AM - 6 PM EST</p><p><strong>Phone:</strong> +1 (555) 123-4567 (Premium subscribers only)</p><p>Before contacting support, please check our <a href='/knowledge-base'>knowledge base</a> for quick answers.</p>",
          icon: "mdi:headset",
          disabled: false,
        },
      ],
    },
  },
];

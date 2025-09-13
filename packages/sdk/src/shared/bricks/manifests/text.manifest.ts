import { defineBrickManifest } from "~/shared/brick-manifest";
import { textContentRef } from "../props/text";
import { defineProps } from "../props/helpers";
import { paddingRef } from "../props/padding";
import { borderRef, roundingRef } from "../props/border";
import { RxTextAlignLeft } from "react-icons/rx";
import type { BrickProps } from "../props/types";
import { Type } from "@sinclair/typebox";
import { alignItemsRef } from "../props/align";
import { shadowRef } from "../props/effects";
import { colorPresetRef } from "../props/color-preset";
import { loopRef } from "../props/dynamic";

export const manifest = defineBrickManifest({
  type: "text",
  category: "basic",
  name: "Text",
  description: "Text with formatting options",
  aiInstructions: `Text "content" can contain minimal HTML tags like <strong>, <em>, <br> and <a> as well as <p> and <span> and lists.
Only 'align' is supported as an inline style, so don't use other inline styles like 'font-size' or 'color' in the content prop.
You may simply omit the colorPreset property so that the brick will inherit the default color from its parent container.
`,
  defaultWidth: {
    mobile: "100%",
  },
  defaultHeight: {
    desktop: "auto",
    mobile: "auto",
  },
  staticClasses: "prose lg:prose-lg",
  icon: RxTextAlignLeft,
  props: defineProps({
    colorPreset: Type.Optional(
      colorPresetRef({
        title: "Color",
      }),
    ),
    content: textContentRef({
      // metadata: {
      //   category: "content",
      // },
    }),
    verticalAlign: Type.Optional(
      alignItemsRef({
        default: "items-center",
        title: "Align",
      }),
    ),
    padding: Type.Optional(paddingRef({ default: "p-4" })),
    rounding: Type.Optional(
      roundingRef({
        default: "rounded-md",
      }),
    ),
    border: Type.Optional(borderRef()),
    shadow: Type.Optional(shadowRef()),
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
    description: "Welcome paragraph with emphasis and padding",
    type: "text",
    props: {
      content:
        "Welcome to our platform! We're <strong>excited</strong> to have you here. Our mission is to <em>transform</em> the way you work with cutting-edge technology and <a href='/features'>innovative features</a>.",
      padding: "p-16",
    },
  },
  {
    description: "Feature list with HTML formatting and smaller padding",
    type: "text",
    props: {
      content:
        "<h3>Key Features</h3><ul><li><strong>Advanced Analytics</strong> - Real-time data insights</li><li><strong>Cloud Integration</strong> - Seamless connectivity</li><li><strong>24/7 Support</strong> - Always here to help</li></ul>",
      padding: "p-8",
    },
  },
  {
    description: "Quote block with text styling but no background",
    type: "text",
    props: {
      content:
        "<p style='text-align: center'><em>\"Innovation distinguishes between a leader and a follower.\"</em><br><strong>- Steve Jobs</strong></p>",
      padding: "p-8",
    },
  },
  {
    description: "Simple heading with subtle background",
    type: "text",
    props: {
      content:
        "<h2>About Our Company</h2><p>We've been serving customers since 2010, building trust through quality products and exceptional service.</p>",
      colorPreset: {
        color: "base-100",
      },
    },
  },
  {
    description: "Team introduction with formatting, no background color",
    type: "text",
    props: {
      content:
        "<p style='text-align: center'><strong>Meet Our Team</strong></p><p>Our diverse team of experts brings together decades of experience in technology, design, and business strategy. We're passionate about <em>creating solutions</em> that make a real difference.</p><p><a href='/team'>Learn more about our team</a> and the values that drive us forward.</p>",
      padding: "p-8",
    },
  },
  {
    description: "Paragraph with an emoji, neutral background",
    type: "text",
    props: {
      content:
        "<p>Scheduled maintenance will occur on <em>Sunday, March 15th</em> from 2:00 AM to 6:00 AM UTC.</p><p>During this time, some features may be temporarily unavailable. We apologize for any inconvenience.</p>",
      padding: "p-8",
      colorPreset: {
        color: "neutral-700",
      },
    },
  },
];

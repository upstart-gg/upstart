import { defineBrickManifest } from "~/shared/brick-manifest";
import { textContent } from "../props/text";
import { defineProps } from "../props/helpers";
import { border, rounding } from "../props/border";
import { RxTextAlignLeft } from "react-icons/rx";
import { Type } from "@sinclair/typebox";
import { alignItems } from "../props/align";
import { shadow } from "../props/effects";
import { colorPreset } from "../props/color-preset";
import { loop } from "../props/dynamic";
import { cssLength } from "../props/css-length";
import type { BrickExample } from "./_types";

export const manifest = defineBrickManifest({
  type: "text",
  category: "basic",
  name: "Text",
  description: "Text with formatting options",
  aiInstructions: `Use the text component for rich content blocks, announcements, descriptions, and formatted text throughout your site.

CONTENT FORMATTING:
- Supports HTML tags: <h1>, <h2>, <h3>, <h4>, <p>, <span>, <strong>, <em>, <br>, <a>, <ul>, <li>, <ol>
- Only 'text-align' style is supported (center, left, right) - avoid other inline styles
- Use <strong> for emphasis, <em> for italics, <br> for line breaks
- Links: <a href="/page">Internal</a> or <a href="https://external.com">External</a>
- Lists: <ul><li>Item 1</li><li>Item 2</li></ul>

STYLING OPTIONS:
- colorPreset: Leave empty to inherit parent colors, or use "primary-100", "secondary-200", "neutral-50", "accent-100" for backgrounds
- padding: Use CSS values like "1rem", "2rem", "24px" for internal spacing
- rounding: "rounded-none" (sharp), "rounded-md" (standard), "rounded-lg" (friendly), "rounded-xl" (soft)
- border: Add borders with width ("border", "border-2") and color ("border-gray-300", "border-primary-500")
- shadow: Add depth with "shadow-sm", "shadow-md", "shadow-lg"

WHEN TO USE:
- Rich content sections (About Us, Service descriptions)
- Announcements and notices
- Product descriptions with formatting
- Quotes and testimonials
- FAQ content and detailed explanations
- Footer information and legal text

BEST PRACTICES:
- Keep HTML minimal - complex layouts should use multiple components
- Use semantic headings (h2, h3, h4) for proper hierarchy
- Center-align for quotes/testimonials, left-align for body text
- Choose background colors that provide good contrast, or no background for inline text`,
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
      colorPreset({
        title: "Color",
      }),
    ),
    content: textContent({
      title: "Content",
      // metadata: {
      //   category: "content",
      // },
    }),
    verticalAlign: Type.Optional(
      alignItems({
        default: "items-center",
        title: "Align",
      }),
    ),
    padding: Type.Optional(
      cssLength({
        default: "2rem",
        description: "Padding inside the text.",
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
  }),
});

export type Manifest = typeof manifest;

export const examples: BrickExample<Manifest>[] = [
  {
    description: "Welcome paragraph with emphasis and padding",
    type: "text",
    props: {
      content:
        "Welcome to our platform! We're <strong>excited</strong> to have you here. Our mission is to <em>transform</em> the way you work with cutting-edge technology and <a href='/features'>innovative features</a>.",
      padding: "2rem",
    },
  },
  {
    description: "Feature list with HTML formatting and smaller padding",
    type: "text",
    props: {
      content:
        "<h3>Key Features</h3><ul><li><strong>Advanced Analytics</strong> - Real-time data insights</li><li><strong>Cloud Integration</strong> - Seamless connectivity</li><li><strong>24/7 Support</strong> - Always here to help</li></ul>",
      padding: "1rem",
    },
  },
  {
    description: "Quote block with text styling but no background",
    type: "text",
    props: {
      content:
        "<p style='text-align: center'><em>\"Innovation distinguishes between a leader and a follower.\"</em><br><strong>- Steve Jobs</strong></p>",
      padding: "3rem",
    },
  },
  {
    description: "Simple heading with subtle background",
    type: "text",
    props: {
      content:
        "<h2>About Our Company</h2><p>We've been serving customers since 2010, building trust through quality products and exceptional service.</p>",
      colorPreset: {
        color: "primary-100",
      },
    },
  },
  {
    description: "Team introduction with formatting, no background color",
    type: "text",
    props: {
      content:
        "<p style='text-align: center'><strong>Meet Our Team</strong></p><p>Our diverse team of experts brings together decades of experience in technology, design, and business strategy. We're passionate about <em>creating solutions</em> that make a real difference.</p><p><a href='/team'>Learn more about our team</a> and the values that drive us forward.</p>",
      padding: "2rem",
    },
  },
  {
    description: "Maintenance notice with neutral background and border",
    type: "text",
    props: {
      content:
        "<p>Scheduled maintenance will occur on <em>Sunday, March 15th</em> from 2:00 AM to 6:00 AM UTC.</p><p>During this time, some features may be temporarily unavailable. We apologize for any inconvenience.</p>",
      padding: "1rem",
      colorPreset: {
        color: "neutral-700",
      },
      border: {
        width: "border",
        color: "border-neutral-400",
      },
      rounding: "rounded-lg",
    },
  },
  {
    description: "Minimal text with no padding or background",
    type: "text",
    props: {
      content: "This is some minimal text.",
      padding: "0rem",
    },
  },
  {
    description: "Call-to-action text with secondary background and shadow",
    type: "text",
    props: {
      content:
        "<h3 style='text-align: center'>Ready to Get Started?</h3><p style='text-align: center'>Join thousands of satisfied customers who trust our platform. <strong>Sign up today</strong> and experience the difference!</p><p style='text-align: center'><a href='/signup'>Create Your Free Account</a></p>",
      colorPreset: {
        color: "secondary-200",
      },
      padding: "2.5rem",
      rounding: "rounded-xl",
      shadow: "shadow-md",
      verticalAlign: "items-center",
    },
  },
  {
    description: "Technical documentation with accent colors and code-like formatting",
    type: "text",
    props: {
      content:
        "<h4>API Authentication</h4><p>To authenticate your requests, include your API key in the header:</p><p><strong>Authorization: Bearer YOUR_API_KEY</strong></p><p>All API endpoints require authentication. You can find your API key in the <a href='/dashboard'>dashboard settings</a>.</p>",
      colorPreset: {
        color: "accent-100",
      },
      padding: "1.5rem",
      rounding: "rounded-md",
      border: {
        width: "border-4",
        color: "border-accent-500",
      },
    },
  },
  {
    description: "Success message with primary background and top alignment",
    type: "text",
    props: {
      content:
        "<h3>✅ Payment Successful!</h3><p>Thank you for your purchase. Your order <strong>#12345</strong> has been confirmed.</p><p>You will receive an email confirmation shortly at your registered email address.</p>",
      colorPreset: {
        color: "primary-200",
      },
      padding: "2rem",
      rounding: "rounded-lg",
      shadow: "shadow-sm",
      verticalAlign: "items-start",
    },
  },
  {
    description: "Footer information with neutral dark theme and multiple links",
    type: "text",
    props: {
      content:
        "<p style='text-align: center'>© 2024 Company Name. All rights reserved.</p><p style='text-align: center'><a href='/privacy'>Privacy Policy</a> | <a href='/terms'>Terms of Service</a> | <a href='/contact'>Contact Us</a></p><p style='text-align: center'><em>Follow us on social media for the latest updates</em></p>",
      colorPreset: {
        color: "neutral-800",
      },
      padding: "1.5rem",
      verticalAlign: "items-end",
    },
  },
  {
    description: "Product description with large padding and rounded corners",
    type: "text",
    props: {
      content:
        "<h2>Premium Wireless Headphones</h2><p>Experience <strong>crystal-clear audio</strong> with our latest wireless headphones featuring:</p><ul><li>Active noise cancellation</li><li>30-hour battery life</li><li>Premium leather comfort</li><li>Hi-res audio certification</li></ul><p>Perfect for <em>music lovers</em> and <em>professionals</em> alike.</p>",
      padding: "3rem",
      rounding: "rounded-2xl",
      shadow: "shadow-lg",
      border: {
        width: "border",
        color: "border-neutral-300",
      },
    },
  },
  {
    description: "Emergency alert with accent background and extra bold formatting",
    type: "text",
    props: {
      content:
        "<h3 style='text-align: center'>⚠️ URGENT NOTICE</h3><p style='text-align: center'><strong>System maintenance is currently in progress.</strong></p><p style='text-align: center'>Some services may be <em>temporarily unavailable</em>. We expect full restoration by 4:00 PM EST.</p><p style='text-align: center'>For urgent support, please <a href='/emergency-contact'>contact our emergency line</a>.</p>",
      colorPreset: {
        color: "accent-400",
      },
      padding: "2rem",
      rounding: "rounded-md",
      border: {
        width: "border-2",
        color: "border-accent-600",
      },
      shadow: "shadow-xl",
      verticalAlign: "items-center",
    },
  },
];

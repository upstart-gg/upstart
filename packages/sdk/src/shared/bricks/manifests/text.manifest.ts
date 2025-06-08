import { defineBrickManifest } from "~/shared/brick-manifest";
import { textContent, textContentRef } from "../props/text";
import { defineProps, optional } from "../props/helpers";
import { backgroundColor, backgroundColorRef } from "../props/background";
import { padding, paddingRef } from "../props/padding";
import { border, borderRef } from "../props/border";
import { effects, effectsRef } from "../props/effects";
import { RxTextAlignLeft } from "react-icons/rx";
import type { BrickProps } from "../props/types";
import { colorRef } from "../props/color";

export const manifest = defineBrickManifest({
  type: "text",
  kind: "brick",
  name: "Text",
  description: "Text with formatting options",
  aiInstructions: `Text "content" can contain minimal HTML tags like <strong>, <em>, <br> and <a> as well as <p> and <span> and lists.
Only 'align' is supported as an inline style, so don't use other inline styles like 'font-size' or 'color' in the content prop.
`,
  minHeight: {
    desktop: 2,
    mobile: 2,
  },
  minWidth: {
    desktop: 2,
    mobile: 2,
  },
  defaultHeight: {
    desktop: 7,
    mobile: 7,
  },
  defaultWidth: {
    desktop: 6,
    mobile: 6,
  },
  repeatable: true,
  icon: RxTextAlignLeft,
  props: defineProps(
    {
      content: textContentRef(),
      backgroundColor: optional(backgroundColorRef()),
      color: optional(colorRef()),
      padding: optional(paddingRef),
      border: optional(borderRef),
      effects: optional(effectsRef({ enableTextShadow: true })),
    },
    {
      default: {
        padding: "p-8",
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
    description: "Welcome paragraph with emphasis, using a preset",
    type: "text",
    props: {
      preset: "prominent-primary",
      content:
        "Welcome to our platform! We're <strong>excited</strong> to have you here. Our mission is to <em>transform</em> the way you work with cutting-edge technology and <a href='/features'>innovative features</a>.",
      padding: "p-16",
    },
  },
  {
    description: "Feature list with HTML formatting",
    type: "text",
    props: {
      content:
        "<h3>Key Features</h3><ul><li><strong>Advanced Analytics</strong> - Real-time data insights</li><li><strong>Cloud Integration</strong> - Seamless connectivity</li><li><strong>24/7 Support</strong> - Always here to help</li></ul>",
      backgroundColor: "#f8fafc",
      padding: "p-8",
    },
  },
  {
    description: "Quote block with styling",
    type: "text",
    props: {
      content:
        "<p style='text-align: center'><em>\"Innovation distinguishes between a leader and a follower.\"</em><br><strong>- Steve Jobs</strong></p>",
      backgroundColor: "#1e293b",
      color: "#f1f5f9",
      padding: "p-8",
      effects: {
        textShadow: "text-shadow-md",
      },
    },
  },
  {
    description: "Multi-paragraph article content",
    type: "text",
    props: {
      content:
        "<p>The future of web development is rapidly evolving with new technologies and frameworks emerging every year. <strong>Modern developers</strong> need to stay current with trends while maintaining focus on <em>user experience</em> and performance.</p><p>Our platform provides the tools and resources you need to build <a href='/docs'>exceptional web applications</a> that scale with your business needs.</p><p>Join thousands of developers who trust our solutions for their most critical projects.</p>",
      padding: "p-8",
    },
  },
  {
    description: "Call-to-action text with bright styling",
    type: "text",
    props: {
      content:
        "<p style='text-align: center'><strong>Ready to Get Started?</strong><br>Join over <span style='color: #ef4444'>50,000</span> satisfied customers and transform your business today!</p><p style='text-align: center'><a href='/signup'>Sign up now</a> and get your first month <em>absolutely free</em>.</p>",
      backgroundColor: "#fef3c7",
      color: "#92400e",
    },
  },
  {
    description: "Simple heading with subtle background",
    type: "text",
    props: {
      content:
        "<h2>About Our Company</h2><p>We've been serving customers since 2010, building trust through quality products and exceptional service.</p>",
      backgroundColor: "#f0f9ff",
    },
  },
  {
    description: "Technical documentation snippet",
    type: "text",
    props: {
      content:
        "<h4>API Configuration</h4><p>To get started with our API, you'll need to:</p><ol><li>Create an account and <strong>generate an API key</strong></li><li>Install the SDK: <code>npm install @company/sdk</code></li><li>Initialize with your credentials</li></ol><p>For detailed instructions, visit our <a href='/docs/api'>API documentation</a>.</p>",
      backgroundColor: "#f8fafc",
      padding: "p-8",
    },
  },
  {
    description: "Team introduction with formatting",
    type: "text",
    props: {
      content:
        "<p style='text-align: center'><strong>Meet Our Team</strong></p><p>Our diverse team of experts brings together decades of experience in technology, design, and business strategy. We're passionate about <em>creating solutions</em> that make a real difference.</p><p><a href='/team'>Learn more about our team</a> and the values that drive us forward.</p>",
      padding: "p-8",
      color: "#374151",
    },
  },
  {
    description: "Warning notice with dark theme",
    type: "text",
    props: {
      content:
        "<p><strong>⚠️ Important Notice:</strong><br>Scheduled maintenance will occur on <em>Sunday, March 15th</em> from 2:00 AM to 6:00 AM UTC.</p><p>During this time, some features may be temporarily unavailable. We apologize for any inconvenience.</p>",
      backgroundColor: "#dc2626",
      color: "#fef2f2",
      padding: "p-8",
    },
  },
  {
    description: "Success message with green theme",
    type: "text",
    props: {
      content:
        "<p style='text-align: center'><strong>✅ Success!</strong><br>Your account has been created successfully.</p><p style='text-align: center'>Check your email for verification instructions and <a href='/dashboard' style='color: #065f46'>start exploring</a> your new dashboard.</p>",
      backgroundColor: "#d1fae5",
      padding: "p-8",
    },
  },
];

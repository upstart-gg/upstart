import { defineBrickManifest } from "~/shared/brick-manifest";
import { textContentRef } from "../props/text";
import { defineProps } from "../props/helpers";
import { paddingRef } from "../props/padding";
import { borderRef } from "../props/border";
import { RxTextAlignLeft } from "react-icons/rx";
import type { BrickProps } from "../props/types";
import { type Static, type TObject, Type } from "@sinclair/typebox";
import { basicAlignRef } from "../props/align";
import { shadowRef } from "../props/effects";
import { colorPresetRef } from "../props/preset";
import { StringEnum } from "~/shared/utils/string-enum";

export const manifest = defineBrickManifest({
  type: "text",
  category: "basic",
  name: "Text",
  description: "Text with formatting options",
  aiInstructions: `Text "content" can contain minimal HTML tags like <strong>, <em>, <br> and <a> as well as <p> and <span> and lists.
Only 'align' is supported as an inline style, so don't use other inline styles like 'font-size' or 'color' in the content prop.
`,
  defaultWidth: {
    desktop: "200px",
    mobile: "100%",
  },
  defaultHeight: {
    desktop: "auto",
    mobile: "auto",
  },
  repeatable: true,
  icon: RxTextAlignLeft,
  props: defineProps(
    {
      color: Type.Optional(
        colorPresetRef({
          title: "Color",
          "ui:presets": {
            "primary-light": {
              previewBgClass: "bg-primary-light text-primary-content-light",
              value: { main: "bg-primary-light text-primary-content-light border-primary-light" },
              label: "Primary light",
            },
            "primary-light-gradient": {
              previewBgClass: "bg-gradient-to-br from-primary-300 to-primary-500 text-primary-content-light",
              value: {
                main: "from-primary-300 to-primary-500 text-primary-content-light border-primary",
              },
              label: "Primary light gradient",
            },
            primary: {
              previewBgClass: "bg-primary text-primary-content",
              label: "Primary",
              value: { main: "bg-primary text-primary-content border-primary" },
            },
            "primary-gradient": {
              previewBgClass: "bg-gradient-to-br from-primary-500 to-primary-700 text-primary-content",
              label: "Primary gradient",
              value: { main: "from-primary-500 to-primary-700 text-primary-content border-primary" },
            },
            "primary-dark": {
              previewBgClass: "bg-primary-dark text-primary-content",
              label: "Primary dark",
              value: { main: "bg-primary-dark text-primary-content border-primary-dark" },
            },
            "primary-dark-gradient": {
              previewBgClass: "bg-gradient-to-br from-primary-700 to-primary-900 text-primary-content",
              label: "Primary dark gradient",
              value: {
                main: "from-primary-700 to-primary-900 text-primary-content border-primary-dark",
              },
            },
            "secondary-light": {
              previewBgClass: "bg-secondary-light text-secondary-content-light",
              label: "Secondary light",
              value: { main: "bg-secondary-light text-secondary-content-light border-secondary-light" },
            },
            "secondary-light-gradient": {
              previewBgClass:
                "bg-gradient-to-br from-secondary-300 to-secondary-500 text-secondary-content-light",
              label: "Secondary light gradient",
              value: {
                main: "from-secondary-300 to-secondary-500 text-secondary-content-light border-secondary",
              },
            },
            secondary: {
              previewBgClass: "bg-secondary text-secondary-content",
              label: "Secondary",
              value: { main: "bg-secondary text-secondary-content border-secondary" },
            },
            "secondary-gradient": {
              previewBgClass: "bg-gradient-to-br from-secondary-500 to-secondary-700 text-secondary-content",
              label: "Secondary gradient",
              value: {
                main: "from-secondary-500 to-secondary-700 text-secondary-content border-secondary",
              },
            },
            "secondary-dark": {
              previewBgClass: "bg-secondary-dark text-secondary-content",
              label: "Secondary dark",
              value: { main: "bg-secondary-dark text-secondary-content border-secondary-dark" },
            },

            "secondary-dark-gradient": {
              previewBgClass: "bg-gradient-to-br from-secondary-700 to-secondary-900 text-secondary-content",
              label: "Secondary dark gradient",
              value: {
                main: "from-secondary-700 to-secondary-900 text-secondary-content border-secondary-dark",
              },
            },

            "accent-light": {
              previewBgClass: "bg-accent-light text-accent-content-light",
              label: "Accent lighter",
              value: { main: "bg-accent-light text-accent-content-light border-accent-light" },
            },

            "accent-light-gradient": {
              previewBgClass: "bg-gradient-to-br from-accent-300 to-accent-500 text-accent-content-light",
              label: "Accent light gradient",
              value: { main: "from-accent-300 to-accent-500 text-accent-content-light border-accent" },
            },
            accent: {
              previewBgClass: "bg-accent text-accent-content",
              label: "Accent",
              value: { main: "bg-accent text-accent-content border-accent" },
            },

            "accent-gradient": {
              previewBgClass: "bg-gradient-to-br from-accent-500 to-accent-700 text-accent-content",
              label: "Accent gradient",
              value: { main: "from-accent-500 to-accent-700 text-accent-content border-accent" },
            },
            "accent-dark": {
              previewBgClass: "bg-accent-dark text-accent-content",
              label: "Accent dark",
              value: { main: "bg-accent-dark text-accent-content border-accent-dark" },
            },

            "accent-dark-gradient": {
              previewBgClass: "bg-gradient-to-br from-accent-700 to-accent-900 text-accent-content",
              label: "Accent dark gradient",
              value: { main: "from-accent-700 to-accent-900 text-accent-content border-accent-dark" },
            },
            "neutral-light": {
              previewBgClass: "bg-neutral-light text-neutral-content-light",
              label: "Neutral light",
              value: { main: "bg-neutral-light text-neutral-content-light border-neutral-light" },
            },

            "neutral-light-gradient": {
              previewBgClass: "bg-gradient-to-br from-neutral-300 to-neutral-500 text-neutral-content-light",
              label: "Neutral light gradient",
              value: {
                main: "from-neutral-300 to-neutral-500 text-neutral-content-light border-neutral",
              },
            },

            neutral: {
              previewBgClass: "bg-neutral text-neutral-content",
              label: "Neutral",
              value: { main: "bg-neutral text-neutral-content border-neutral" },
            },

            "neutral-gradient": {
              previewBgClass: "bg-gradient-to-br from-neutral-500 to-neutral-700 text-neutral-content",
              label: "Neutral gradient",
              value: { main: "from-neutral-500 to-neutral-700 text-neutral-content border-neutral" },
            },

            "neutral-dark": {
              previewBgClass: "bg-neutral-dark text-neutral-content",
              label: "Neutral dark",
              value: { main: "bg-neutral-dark text-neutral-content border-neutral-dark" },
            },

            "neutral-dark-gradient": {
              previewBgClass: "bg-gradient-to-br from-neutral-700 to-neutral-900 text-neutral-content",
              label: "Neutral dark gradient",
              value: {
                main: "from-neutral-700 to-neutral-900 text-neutral-content border-neutral-dark",
              },
            },
            base100: {
              previewBgClass: "bg-base-100 text-base-content border-base-200 border-2",
              label: "Base 100",
              value: { main: "bg-base-100 text-base-content border-base-200" },
            },
            base100_primary: {
              previewBgClass: "bg-base-100 text-base-content border-primary border-2",
              label: "Base 100 / Primary",
              value: { main: "bg-base-100 text-base-content border-primary" },
            },
            base100_secondary: {
              previewBgClass: "bg-base-100 text-base-content border-secondary border-2",
              label: "Base 100 / Secondary",
              value: { main: "bg-base-100 text-base-content border-secondary" },
            },
            base100_accent: {
              previewBgClass: "bg-base-100 text-base-content border-accent border-2",
              label: "Base 100 / Accent",
              value: { main: "bg-base-100 text-base-content border-accent" },
            },

            none: { label: "None", value: {} },
          },
          default: "base100",
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
              filter: (manifestProps: TObject, formData: Static<Manifest["props"]>) => {
                return formData.color?.includes("gradient") === true;
              },
            },
          },
        ),
      ),
      content: textContentRef(),
      verticalAlign: Type.Optional(
        basicAlignRef({
          title: "Vertical align",
          description: "Vertical alignment of the text within the brick.",
          "ui:no-horizontal-align": true,
          "ui:vertical-align-label": "Vertical Align",
          default: { vertical: "items-start" },
        }),
      ),
      padding: Type.Optional(paddingRef({ default: "p-0" })),
      // backgroundColor: Type.Optional(backgroundColorRef()),
      // color: Type.Optional(colorRef()),
      border: Type.Optional(borderRef()),
      shadow: Type.Optional(shadowRef()),
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
      padding: "p-8",
    },
  },
  {
    description: "Quote block with styling",
    type: "text",
    props: {
      content:
        "<p style='text-align: center'><em>\"Innovation distinguishes between a leader and a follower.\"</em><br><strong>- Steve Jobs</strong></p>",
      padding: "p-8",
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
    },
  },
  {
    description: "Simple heading with subtle background",
    type: "text",
    props: {
      content:
        "<h2>About Our Company</h2><p>We've been serving customers since 2010, building trust through quality products and exceptional service.</p>",
    },
  },
  {
    description: "Technical documentation snippet",
    type: "text",
    props: {
      content:
        "<h4>API Configuration</h4><p>To get started with our API, you'll need to:</p><ol><li>Create an account and <strong>generate an API key</strong></li><li>Install the SDK: <code>npm install @company/sdk</code></li><li>Initialize with your credentials</li></ol><p>For detailed instructions, visit our <a href='/docs/api'>API documentation</a>.</p>",
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
    },
  },
  {
    description: "Warning notice with dark theme",
    type: "text",
    props: {
      content:
        "<p><strong>⚠️ Important Notice:</strong><br>Scheduled maintenance will occur on <em>Sunday, March 15th</em> from 2:00 AM to 6:00 AM UTC.</p><p>During this time, some features may be temporarily unavailable. We apologize for any inconvenience.</p>",
      padding: "p-8",
    },
  },
  {
    description: "Success message with green theme",
    type: "text",
    props: {
      content:
        "<p style='text-align: center'><strong>✅ Success!</strong><br>Your account has been created successfully.</p><p style='text-align: center'>Check your email for verification instructions and <a href='/dashboard' style='color: #065f46'>start exploring</a> your new dashboard.</p>",
      padding: "p-8",
    },
  },
];

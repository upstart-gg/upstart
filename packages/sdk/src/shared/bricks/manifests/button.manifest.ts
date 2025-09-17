import { Type } from "@sinclair/typebox";
import { RxButton } from "react-icons/rx";
import { defineBrickManifest } from "~/shared/brick-manifest";
import { defineProps } from "../props/helpers";
import { string, urlOrPageIdRef } from "../props/string";
import type { BrickProps } from "../props/types";
import { borderRef, roundingRef } from "../props/border";
import { fontSizeRef } from "../props/text";
import { colorPresetRef } from "../props/color-preset";

export const manifest = defineBrickManifest({
  type: "button",
  name: "Button",
  category: "basic",
  description: "A button",
  aiInstructions:
    "A clickable button that can link to a URL or a page within the site. It can be styled with different colors, font sizes, and border radii. Don't use it in forms since forms have their own submit button.",
  resizable: "horizontal",
  icon: RxButton,
  minWidth: {
    desktop: 120,
    mobile: 120,
  },
  defaultWidth: {
    mobile: "100%",
  },
  props: defineProps(
    {
      colorPreset: Type.Optional(
        colorPresetRef({
          default: { color: "primary-500" },
          title: "Color",
          "ui:default-gradient-direction": "bg-gradient-to-b",
        }),
      ),
      label: string("Label", { default: "My button", metadata: { category: "content" } }),
      fontSize: Type.Optional(
        fontSizeRef({
          title: "Font size",
          description: "The font size of the button text.",
          default: "text-base",
          "ui:responsive": "desktop",
          "ui:no-extra-large-sizes": true,
        }),
      ),
      rounding: Type.Optional(
        roundingRef({
          default: "rounded-md",
        }),
      ),
      border: Type.Optional(borderRef({ default: { width: "border-0" }, "ui:responsive": "desktop" })),
      link: urlOrPageIdRef({
        title: "Link",
        "ui:placeholder": "https://example.com",
        metadata: { category: "content" },
      }),
    },
    { noGrow: true },
  ),
});

export type Manifest = typeof manifest;

export const examples: {
  description: string;
  type: string;
  props: BrickProps<Manifest>["brick"]["props"];
}[] = [
  {
    description: "Primary button, full width, linking to an external URL",
    type: "button",
    props: {
      label: "Click me",
      link: "https://example.com",
      colorPreset: { color: "primary-500" },
    },
  },
  {
    description: "Secondary button, block width, linking to a page id",
    type: "button",
    props: {
      label: "Go to page",
      link: "page-id-123",
      colorPreset: { color: "secondary-500" },
    },
  },
  {
    description: "Neutral colored button with large text and rounded corners and external link",
    type: "button",
    props: {
      label: "Submit",
      fontSize: "text-lg",
      rounding: "rounded-full",
      link: "https://example.com",
      colorPreset: { color: "neutral-500" },
    },
  },
  {
    description: "Dynamic label from a page query alias named 'employee'",
    type: "button",
    props: {
      label: "Go to profile of {{employee.name}}",
      link: "/employees/{{employee.$slug}}",
      fontSize: "text-lg",
      rounding: "rounded-full",
      colorPreset: { color: "neutral-500" },
    },
  },
  {
    description: "Accent colored call-to-action button with medium text and subtle border",
    type: "button",
    props: {
      label: "Get Started",
      link: "/signup",
      fontSize: "text-base",
      rounding: "rounded-lg",
      colorPreset: { color: "accent-600" },
      border: { width: "border", color: "border-accent-700" },
    },
  },
  {
    description: "Small text button with sharp corners for minimal design",
    type: "button",
    props: {
      label: "Learn More",
      link: "/about",
      fontSize: "text-sm",
      rounding: "rounded-none",
      colorPreset: { color: "primary-400" },
    },
  },
  {
    description: "Large download button with thick border and rounded corners",
    type: "button",
    props: {
      label: "Download Now",
      link: "https://download.example.com/file.zip",
      fontSize: "text-xl",
      rounding: "rounded-xl",
      colorPreset: { color: "secondary-600" },
      border: { width: "border-2", color: "border-secondary-800" },
    },
  },
  {
    description: "Contact button with neutral colors and medium border radius",
    type: "button",
    props: {
      label: "Contact Us",
      link: "/contact",
      fontSize: "text-base",
      rounding: "rounded-md",
      colorPreset: { color: "neutral-600" },
      border: { width: "border", color: "border-neutral-400" },
    },
  },
  {
    description: "Newsletter signup button with gradient background and full rounding",
    type: "button",
    props: {
      label: "Subscribe to Newsletter",
      link: "/newsletter",
      fontSize: "text-lg",
      rounding: "rounded-full",
      colorPreset: {
        color: "primary-500",
        gradientDirection: "bg-gradient-to-r",
      },
    },
  },
  {
    description: "Shop now button with accent colors and extra large text",
    type: "button",
    props: {
      label: "Shop Now",
      link: "/shop",
      fontSize: "text-xl",
      rounding: "rounded-lg",
      colorPreset: { color: "accent-500" },
    },
  },
  {
    description: "Dynamic product button using product query data",
    type: "button",
    props: {
      label: "Buy {{product.name}} - ${{product.price}}",
      link: "/products/{{product.id}}/purchase",
      fontSize: "text-base",
      rounding: "rounded-md",
      colorPreset: { color: "primary-600" },
      border: { width: "border", color: "border-primary-800" },
    },
  },
  {
    description: "Event registration button with secondary gradient and medium text",
    type: "button",
    props: {
      label: "Register for Event",
      link: "/events/register",
      fontSize: "text-base",
      rounding: "rounded-lg",
      colorPreset: {
        color: "secondary-500",
        gradientDirection: "bg-gradient-to-br",
      },
      border: { width: "border", color: "border-secondary-300" },
    },
  },
];

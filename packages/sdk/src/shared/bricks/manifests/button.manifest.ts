import { Type } from "@sinclair/typebox";
import { RxButton } from "react-icons/rx";
import { defineBrickManifest } from "~/shared/brick-manifest";
import { StringEnum } from "~/shared/utils/string-enum";
import { defineProps } from "../props/helpers";
import { string, urlOrPageIdRef } from "../props/string";
import type { BrickProps } from "../props/types";

export const manifest = defineBrickManifest({
  type: "button",
  name: "Button",
  repeatable: true,
  description: "A button with text and optional icon",
  icon: RxButton,
  props: defineProps({
    color: StringEnum(["btn-color-neutral", "btn-color-primary", "btn-color-secondary", "btn-color-accent"], {
      title: "Color",
      enumNames: ["Neutral", "Primary", "Secondary", "Accent"],
      description: "Button variants.",
      default: "btn-color-primary",
    }),
    modifier: StringEnum(["btn-block", "btn-wide"], {
      title: "Modifier",
      description: "Button modifiers.",
      enumNames: ["Block", "Wide"],
      default: "btn-block",
    }),
    label: string("Label", { default: "My button" }),
    justifyContent: Type.Optional(
      StringEnum(["justify-start", "justify-center", "justify-end"], {
        enumNames: ["Left", "Center", "Right"],
        title: "Alignment",
        "ui:placeholder": "Not specified",
        default: "justify-center",
        "ui:responsive": "desktop",
      }),
    ),
    type: Type.Optional(
      StringEnum(["button", "submit", "reset"], {
        title: "Type",
        enumNames: ["Button", "Submit", "Reset"],
        default: "button",
        description: "The type of the button",
        "ai:instructions":
          "Use 'button' for regular buttons, 'submit' for form submission, and 'reset' to reset form fields.",
      }),
    ),
    round: Type.Optional(
      StringEnum(["rounded-none", "rounded-sm", "rounded", "rounded-md", "rounded-lg", "rounded-xl"], {
        title: "Border Radius",
        enumNames: ["None", "XS", "S", "M", "L", "XL"],
        default: "rounded-md",
        description: "Border radius of the button",
        "ui:placeholder": "Not specified",
      }),
    ),
    icon: Type.Optional(
      string("Icon", {
        title: "Icon",
        description: "Icon to display (iconify reference)",
        "ui:field": "iconify",
      }),
    ),
    linkToUrlOrPageId: Type.Optional(urlOrPageIdRef({ title: "Link" })),
  }),
});

export type Manifest = typeof manifest;

export const examples: {
  description: string;
  type: string;
  props: BrickProps<Manifest>["brick"]["props"];
}[] = [
  {
    description: "Primary button, wide, linking to a URL",
    type: "button",
    props: {
      color: "btn-color-primary",
      modifier: "btn-wide",
      label: "Click me",
      linkToUrlOrPageId: "https://example.com",
    },
  },
  {
    description: "Secondary button, block size, linking to a page",
    type: "button",
    props: {
      color: "btn-color-secondary",
      label: "Go to page",
      modifier: "btn-block",
      linkToUrlOrPageId: "page-id-123",
    },
  },
  {
    description: "Submit button in a form",
    type: "button",
    props: {
      color: "btn-color-primary",
      label: "Submit form",
      type: "submit",
      modifier: "btn-wide",
    },
  },
  {
    description: "Button with icon on the right",
    type: "button",
    props: {
      color: "btn-color-primary",
      modifier: "btn-block",
      label: "Icon Button",
      icon: "mdi:check-circle",
    },
  },
];

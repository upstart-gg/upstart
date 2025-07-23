import { type Static, type TObject, Type } from "@sinclair/typebox";
import { FaWpforms } from "react-icons/fa6";
import { defineBrickManifest } from "~/shared/brick-manifest";
import { StringEnum } from "~/shared/utils/string-enum";
import { basicAlignRef } from "../props/align";
import { borderRef } from "../props/border";
import { datarecord } from "../props/datarecord";
import { defineProps, group } from "../props/helpers";
import { paddingRef } from "../props/padding";
import { string } from "../props/string";
import type { BrickProps } from "../props/types";
import { fontSizeRef } from "../props/text";
import { colorPresetRef } from "../props/preset";

export const manifest = defineBrickManifest({
  type: "form",
  name: "Form",
  description: "A form element",
  aiInstructions: `The form brick automatically renders form fields based on the datarecord id provided in the props.
There is no need to define the form fields manually and the form does not accept any children`,
  isContainer: false,
  icon: FaWpforms,
  minWidth: {
    desktop: 300,
  },
  props: defineProps({
    datarecordId: datarecord("Datarecord ID", {
      description: "The ID of the datarecord to use to generate the form fields",
    }),
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
    align: Type.Optional(
      StringEnum(["vertical", "horizontal"], {
        default: "vertical",
        title: "Alignment",
        description: "The alignment of the form fields. Default is vertical",
      }),
    ),
    padding: Type.Optional(
      paddingRef({
        default: "p-4",
      }),
    ),
    buttonPosition: Type.Optional(
      basicAlignRef({
        title: "Button Position",
        description: "The position of the button.",
        defaultValue: { horizontal: "justify-end" },
        "ui:no-vertical-align": true,
        "ui:horizontal-align-label": "Button position",
      }),
    ),
    fontSize: Type.Optional(fontSizeRef({ default: "inherit", "ui:no-extra-large-sizes": true })),
    button: group({
      title: "Button",
      children: {
        color: Type.Union(
          [
            Type.Literal("btn-color-neutral", { title: "Neutral", "ui:variant-type": "color" }),
            Type.Literal("btn-color-primary", { title: "Primary", "ui:variant-type": "color" }),
            Type.Literal("btn-color-secondary", { title: "Secondary", "ui:variant-type": "color" }),
            Type.Literal("btn-color-accent", { title: "Accent", "ui:variant-type": "color" }),
          ],
          {
            title: "Variant",
            description: "Button variants.",
            "ai:tip": "Those are  button variants",
          },
        ),
        size: StringEnum(["block", "wide"], {
          title: "Size",
          description: "Button sizes.",
          enumNames: ["Block", "Wide"],
          default: "block",
        }),
        border: Type.Optional(
          borderRef({
            default: {
              width: "border",
              rounding: "rounded-md",
            },
          }),
        ),
      },
    }),

    title: Type.Optional(
      Type.String({
        title: "Form title",
        default: "My form",
        metadata: {
          category: "content",
        },
      }),
    ),
    intro: Type.Optional(
      Type.String({
        title: "Intro",
        description: "The intro text of the form",
        "ui:multiline": true,
        metadata: {
          category: "content",
        },
      }),
    ),
    buttonLabel: Type.Optional(
      string("Button Label", {
        default: "Submit",
        metadata: { category: "content" },
      }),
    ),
    successMessage: Type.Optional(
      Type.String({
        title: "Success Message",
        description: "The message to display when the form is successfully submitted",
        default: "Thank you for your submission!",
        metadata: {
          category: "content",
        },
      }),
    ),
    errorMessage: Type.Optional(
      Type.String({
        title: "Error Message",
        description: "The message to display when the form submission fails",
        default: "There was an error submitting the form. Please try again later.",
        metadata: {
          category: "content",
        },
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
    description: "Basic contact form",
    type: "form",
    props: {
      title: "Contact Us",
      intro: "We'd love to hear from you. Send us a message and we'll respond as soon as possible.",
      align: "vertical",
      datarecordId: "contacts",
      buttonPosition: {
        horizontal: "end",
      },
      buttonLabel: "Send Message",
      button: {
        color: "btn-color-primary",
        size: "block",
      },
    },
  },
  {
    description: "User registration form with large button",
    type: "form",
    props: {
      title: "Create Account",
      intro: "Join our platform and start your journey today.",
      align: "vertical",
      datarecordId: "user-registration",
      buttonPosition: {
        horizontal: "end",
      },
      buttonLabel: "Register",
      button: {
        color: "btn-color-secondary",
        size: "wide",
      },
    },
  },
  {
    description: "Newsletter subscription form (horizontal)",
    type: "form",
    props: {
      title: "Stay Updated",
      intro: "Subscribe to our newsletter for the latest updates and exclusive content.",
      align: "horizontal",
      datarecordId: "newsletter-subscription",
      buttonPosition: {
        horizontal: "center",
      },
      buttonLabel: "Subscribe",
      button: {
        color: "btn-color-accent",
        size: "block",
      },
    },
  },
  {
    description: "Event registration form",
    type: "form",
    props: {
      title: "Conference Registration",
      intro: "Register for the Annual Tech Conference 2025. Early bird pricing ends soon!",
      align: "vertical",
      datarecordId: "event-registration",
      buttonPosition: {
        horizontal: "end",
      },
      buttonLabel: "Register Now",
      button: {
        color: "btn-color-primary",
        size: "block",
      },
    },
  },
  {
    description: "Job application form",
    type: "form",
    props: {
      title: "Apply for Position",
      intro: "We're excited to learn more about you! Please fill out this application form completely.",
      align: "vertical",
      datarecordId: "job-application",
      buttonPosition: {
        horizontal: "start",
      },
      buttonLabel: "Submit Application",
      button: {
        color: "btn-color-secondary",
        size: "block",
      },
    },
  },
  {
    description: "Customer feedback form",
    type: "form",
    props: {
      title: "Share Your Feedback",
      intro: "Your opinion matters to us. Help us improve our products and services.",
      align: "vertical",
      datarecordId: "customer-feedback",
      buttonPosition: {
        horizontal: "end",
      },
      buttonLabel: "Submit Feedback",
      button: {
        color: "btn-color-accent",
        size: "wide",
      },
    },
  },
];

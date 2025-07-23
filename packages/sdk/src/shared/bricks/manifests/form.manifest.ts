import { Type } from "@sinclair/typebox";
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
    align: Type.Optional(
      StringEnum(["vertical", "horizontal"], {
        default: "vertical",
        title: "Alignment",
        description: "The alignment of the form fields. Default is vertical",
      }),
    ),
    padding: Type.Optional(paddingRef()),
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

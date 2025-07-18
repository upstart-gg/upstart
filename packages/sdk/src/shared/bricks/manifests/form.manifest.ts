import { Type } from "@sinclair/typebox";
import { FaWpforms } from "react-icons/fa6";
import { defineBrickManifest } from "~/shared/brick-manifest";
import { StringEnum } from "~/shared/utils/string-enum";
import { datarecord } from "../props/datarecord";
import { defineProps, group } from "../props/helpers";
import { paddingRef } from "../props/padding";
import { string } from "../props/string";
import type { BrickProps } from "../props/types";
import { fontSizeRef } from "../props/text";

export const manifest = defineBrickManifest({
  type: "form",
  kind: "widget",
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
    fontSize: Type.Optional(fontSizeRef({ default: "inherit", noExtraLargeSizes: true })),
    button: group({
      title: "Button",
      children: {
        buttonLabel: Type.Optional(
          string("Button Label", {
            default: "Submit",
          }),
        ),
        buttonPosition: Type.Union(
          [
            Type.Literal("left", { title: "Left" }),
            Type.Literal("center", { title: "Center" }),
            Type.Literal("right", { title: "Right" }),
          ],
          { title: "Position", default: "right", "ui:responsive": "desktop" },
        ),
        buttonColor: Type.Union(
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
        buttonBorderRadius: Type.Optional(
          StringEnum(["rounded-none", "rounded-sm", "rounded", "rounded-md", "rounded-lg", "rounded-xl"], {
            title: "Border Radius",
            enumNames: ["None", "XS", "S", "M", "L", "XL"],
            default: "rounded-md",
            description: "Border radius of the button",
          }),
        ),
      },
    }),

    title: Type.Optional(string("Title", { description: "The title of the form", default: "My form" })),
    intro: Type.Optional(
      string("Intro", { description: "The intro text of the form", "ui:multiline": true }),
    ),
    successMessage: Type.Optional(
      string("Success Message", {
        description: "The message to display when the form is successfully submitted",
        default: "Thank you for your submission!",
      }),
    ),
    errorMessage: Type.Optional(
      string("Error Message", {
        description: "The message to display when the form submission fails",
        default: "There was an error submitting the form. Please try again later.",
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
      button: {
        buttonLabel: "Send Message",
        buttonPosition: "right",
        buttonBorderRadius: "rounded-md",
        buttonColor: "btn-color-primary",
      },
    },
  },
  {
    description: "User registration form",
    type: "form",
    props: {
      title: "Create Account",
      intro: "Join our platform and start your journey today.",
      align: "vertical",
      datarecordId: "user-registration",
      button: {
        buttonLabel: "Register",
        buttonPosition: "right",
        buttonBorderRadius: "rounded-md",
        buttonColor: "btn-color-secondary",
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
      button: {
        buttonLabel: "Subscribe",
        buttonPosition: "center",
        buttonBorderRadius: "rounded-md",
        buttonColor: "btn-color-accent",
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
      button: {
        buttonLabel: "Register Now",
        buttonPosition: "right",
        buttonBorderRadius: "rounded-md",
        buttonColor: "btn-color-primary",
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
      button: {
        buttonLabel: "Submit Application",
        buttonPosition: "right",
        buttonBorderRadius: "rounded-md",
        buttonColor: "btn-color-secondary",
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
      button: {
        buttonLabel: "Submit Feedback",
        buttonPosition: "right",
        buttonBorderRadius: "rounded-md",
        buttonColor: "btn-color-accent",
      },
    },
  },
];

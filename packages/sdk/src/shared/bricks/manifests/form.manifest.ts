import { Type } from "@sinclair/typebox";
import { FaWpforms } from "react-icons/fa6";
import { defineBrickManifest } from "~/shared/brick-manifest";
import { StringEnum } from "~/shared/utils/string-enum";
import { datarecord } from "../props/datarecord";
import { defineProps, group } from "../props/helpers";
import { paddingRef } from "../props/padding";
import { string } from "../props/string";
import type { BrickProps } from "../props/types";

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
    button: group({
      title: "Button",
      children: {
        label: Type.Optional(
          string("Button Label", {
            description: "The label of the submit button",
            default: "Submit",
          }),
        ),
        position: Type.Union(
          [
            Type.Literal("left", { title: "Left" }),
            Type.Literal("center", { title: "Center" }),
            Type.Literal("right", { title: "Right" }),
          ],
          { title: "Position", default: "right", "ui:responsive": "desktop" },
        ),
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
        borderRadius: Type.Optional(
          StringEnum(["rounded-none", "rounded-sm", "rounded", "rounded-md", "rounded-lg", "rounded-xl"], {
            title: "Border Radius",
            enumNames: ["None", "XS", "S", "M", "L", "XL"],
            default: "rounded-md",
            description: "Border radius of the button",
          }),
        ),
        modifier: StringEnum(["btn-block", "btn-wide"], {
          title: "Modifier",
          description: "Button modifiers.",
          enumNames: ["Block", "Wide"],
          default: "btn-block",
        }),
      },
    }),
    title: Type.Optional(string("Title", { description: "The title of the form", default: "My form" })),
    intro: Type.Optional(string("Intro", { description: "The intro text of the form" })),
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
        label: "Send Message",
        position: "right",
        borderRadius: "rounded-md",
        color: "btn-color-primary",
        modifier: "btn-block",
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
      button: {
        label: "Register",
        position: "right",
        borderRadius: "rounded-md",
        color: "btn-color-secondary",
        modifier: "btn-wide",
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
        label: "Subscribe",
        position: "center",
        borderRadius: "rounded-md",
        color: "btn-color-accent",
        modifier: "btn-block",
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
        label: "Register Now",
        position: "right",
        borderRadius: "rounded-md",
        color: "btn-color-primary",
        modifier: "btn-block",
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
        label: "Submit Application",
        position: "right",
        borderRadius: "rounded-md",
        color: "btn-color-secondary",
        modifier: "btn-block",
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
        label: "Submit Feedback",
        position: "right",
        borderRadius: "rounded-md",
        color: "btn-color-accent",
        modifier: "btn-wide",
      },
    },
  },
];

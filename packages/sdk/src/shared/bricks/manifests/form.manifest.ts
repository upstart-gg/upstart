import { type Static, Type } from "@sinclair/typebox";
import { FaWpforms } from "react-icons/fa6";
import { defineBrickManifest } from "~/shared/brick-manifest";
import { StringEnum } from "~/shared/utils/string-enum";
import { borderRef, roundingRef } from "../props/border";
import { datarecord } from "../props/datarecord";
import { defineProps, group } from "../props/helpers";
import { paddingRef } from "../props/padding";
import { string } from "../props/string";
import type { BrickProps } from "../props/types";
import { fontSizeRef } from "../props/text";
import { colorPresetRef } from "../props/color-preset";
import { directionRef } from "../props/direction";

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
      "ui:responsive": "desktop",
    }),
    colorPreset: Type.Optional(
      colorPresetRef({
        title: "Color",
        default: "base-200",
      }),
    ),
    direction: Type.Optional(
      directionRef({
        title: "Direction",
        description: "The direction of the form fields",
        default: "flex-col",
        "ui:responsive": "desktop",
        "ui:desktop-only": true,
      }),
    ),
    padding: Type.Optional(
      paddingRef({
        default: "p-4",
      }),
    ),
    rounding: Type.Optional(
      roundingRef({
        default: "rounded-md",
      }),
    ),
    border: Type.Optional(borderRef({})),
    fontSize: Type.Optional(fontSizeRef({ default: "inherit", "ui:no-extra-large-sizes": true })),
    button: group({
      title: "Button",
      children: {
        color: Type.Optional(
          StringEnum(["btn-neutral", "btn-primary", "btn-secondary", "btn-accent"], {
            enumNames: ["Neutral", "Primary", "Secondary", "Accent"],
            title: "Color",
            default: "btn-primary",
          }),
        ),
        size: Type.Optional(
          StringEnum(["block", "wide"], {
            title: "Size",
            description: "Button sizes.",
            enumNames: ["Block", "Wide"],
            default: "block",
            "ui:responsive": "desktop",
          }),
        ),
        position: Type.Optional(
          StringEnum(["justify-start", "justify-center", "justify-end"], {
            title: "Button Position",
            description: "The position of the button in the form",
            enumNames: ["Left", "Center", "Right"],
            default: "justify-end",
            "ui:responsive": "desktop",
            metadata: {
              filter: (manifestProps: Manifest["props"], formData: Static<Manifest["props"]>) => {
                return formData.button?.size !== "wide";
              },
            },
          }),
        ),
        rounding: Type.Optional(roundingRef({ default: "rounded-md" })),
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
      direction: "flex-row",
      datarecordId: "contacts",
      buttonLabel: "Send Message",
      button: {
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
      direction: "flex-row",
      datarecordId: "user-registration",
      buttonLabel: "Register",
      button: {
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
      direction: "flex-col",
      datarecordId: "newsletter-subscription",
      buttonLabel: "Subscribe",
      button: {
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
      direction: "flex-col",
      datarecordId: "event-registration",
      buttonLabel: "Register Now",
      button: {
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
      direction: "flex-col",
      datarecordId: "job-application",
      buttonLabel: "Submit Application",
      button: {
        size: "block",
      },
    },
  },
];

import { defineBrickManifest } from "~/shared/brick-manifest";
import { defineProps } from "../props/helpers";
import { FaWpforms } from "react-icons/fa6";
import { string } from "../props/string";
import type { BrickProps } from "../props/types";
import { StringEnum } from "~/shared/utils/string-enum";
import { paddingRef } from "../props/padding";
import { backgroundColorRef } from "../props/background";
import { colorRef } from "../props/color";
import { datarecord } from "../props/datarecord";
import { Type } from "@sinclair/typebox";

export const manifest = defineBrickManifest({
  type: "form",
  kind: "widget",
  name: "Form",
  description: "A form element",
  aiInstructions: `The form brick automatically renders form fields based on the datarecord id provided in the props.
There is no need to define the form fields manually and the form does not accept any children`,
  isContainer: false,
  icon: FaWpforms,
  props: defineProps({
    title: Type.Optional(string("Title", { description: "The title of the form", default: "My form" })),
    intro: Type.Optional(string("Intro", { description: "The intro text of the form" })),
    datarecordId: datarecord("Datarecord ID", {
      description: "The ID of the datarecord to use to generate the form fields",
    }),
    padding: Type.Optional(paddingRef()),
    backgroundColor: Type.Optional(backgroundColorRef()),
    color: Type.Optional(colorRef()),
    align: Type.Optional(
      StringEnum(["vertical", "horizontal"], {
        default: "vertical",
        title: "Alignment",
        description: "The alignment of the form fields. Default is vertical",
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
    },
  },
];

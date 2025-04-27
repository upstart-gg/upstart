import { defineBrickManifest } from "~/shared/brick-manifest";
import { defineProps, prop } from "../props/helpers";
import { FaWpforms } from "react-icons/fa6";
import { Type } from "@sinclair/typebox";
import { string } from "../props/string";

export const manifest = defineBrickManifest({
  type: "form",
  kind: "widget",
  name: "Form",
  description: "A form element",
  isContainer: true,
  icon: FaWpforms,
  props: defineProps({
    title: string("Title", "My form"),
    intro: string("Intro", "Please fill out the form below"),
    fields: prop({
      title: "Fields",
      description: "The fields of the form",
      schema: Type.Array(
        Type.Object({
          name: Type.String({ title: "Name" }),
          type: Type.String({
            title: "Type",
            enum: ["text", "email", "password", "number", "checkbox", "radio", "select", "textarea"],
          }),
          label: Type.String({ title: "Label" }),
          placeholder: Type.Optional(Type.String({ title: "Placeholder" })),
        }),
      ),
    }),
  }),
});

export type Manifest = typeof manifest;

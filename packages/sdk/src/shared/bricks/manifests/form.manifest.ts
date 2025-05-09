import { defineBrickManifest } from "~/shared/brick-manifest";
import { defineProps, optional, prop } from "../props/helpers";
import { FaWpforms } from "react-icons/fa6";
import { Type } from "@sinclair/typebox";
import { string } from "../props/string";

export const manifest = defineBrickManifest({
  type: "form",
  kind: "widget",
  name: "Form",
  description: "A form element",
  aiInstructions: `The form brick takes a JSON schema as input and generates a form based on it.
The schema should define the fields using string, number, and boolean types.
The available string formats are:
- date-time
- time
- date
- email
- uri
- uuid
- regex
- password
- multiline (for textarea)
The form will be rendered with the specified fields and will handle user input accordingly.`,
  isContainer: true,
  icon: FaWpforms,
  props: defineProps({
    // preset: preset(),
    title: optional(string("Title", "My form", { description: " The title of the form" })),
    intro: optional(string("Intro", undefined, { description: " The intro text of the form" })),
    fields: prop({
      title: "Fields",
      description: "The JSON schema of the form fields",
      schema: Type.Object({}, { additionalProperties: true }),
    }),
    align: optional(
      prop({
        title: "Alignment",
        description:
          "The alignment of the form fields. Default is vertical. Only use horizotal for very short forms.",
        schema: Type.Union(
          [
            Type.Literal("vertical", { title: "Vertical" }),
            Type.Literal("horizontal", { title: "Horizontal" }),
          ],
          { default: "vertical" },
        ),
      }),
    ),
  }),
});

export type Manifest = typeof manifest;

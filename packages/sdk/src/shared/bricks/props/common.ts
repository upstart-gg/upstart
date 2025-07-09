import { type TString, Type } from "@sinclair/typebox";
import { typedRef } from "~/shared/utils/typed-ref";
import { cssLengthRef } from "./css-length";
import { StringEnum } from "~/shared/utils/string-enum";

export function hidden() {
  return Type.Object(
    {
      desktop: Type.Boolean(),
      mobile: Type.Boolean(),
    },
    {
      $id: "styles:hidden",
      title: "Hidden",
      description: "Used to hide the brick on desktop or mobile.",
      "ui:field": "hidden",
    },
  );
}

export const commonProps = {
  lastTouched: Type.Optional(
    Type.Number({
      "ui:field": "hidden",
      "ai:hidden": true,
    }),
  ),
  hidden: Type.Optional(typedRef("styles:hidden")),
  editable: Type.Optional(
    Type.Boolean({
      description: "Do not use. It is used internally by the editor.",
      "ui:field": "hidden",
      "ai:hidden": true,
    }),
  ),
  width: Type.Optional(
    cssLengthRef({
      title: "Fixed Width",
      description:
        "Set a fixed width for the brick. If not set, the brick will be responsive and will follow the flex layout of its parent section.",
      "ai:instructions": "Use percentage values to make the width responsive, like '50%'",
      "ui:field": "hidden",
    }) as TString,
  ),
  growHorizontally: Type.Optional(
    Type.Boolean({
      title: "Grow horizontally",
      description:
        "If set, the brick will grow to fill the available width of its parent section. If not set, the brick will have a fixed width.",
      "ui:responsive": "desktop",
      "ui:styleId": "styles:growHorizontally",
    }),
  ),
  height: Type.Optional(
    cssLengthRef({
      title: "Fixed height",
      description:
        "Set a fixed height for the brick. If not set, the brick will be responsive and will follow the flex layout of its parent section.",
      "ui:field": "hidden",
    }),
  ),
  alignSelf: Type.Optional(
    StringEnum(["self-auto", "self-start", "self-center", "self-end"], {
      title: "Vertical position",
      // "ui:field": "hidden",
      "ui:field": "enum",
      "ui:display": "select",
      description: "How the brick vertically aligns itself within its parent section.",
      enumNames: ["Auto", "Top", "Center", "Bottom"],
      default: "self-auto",
      "ui:placeholder": "Not specified",
      "ui:styleId": "styles:alignSelf",
    }),
  ),
  // preset: Type.Optional(presetRef()),
};

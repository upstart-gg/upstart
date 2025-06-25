import { Type } from "@sinclair/typebox";
import { presetRef } from "./preset";
import { typedRef } from "~/shared/utils/typed-ref";
import { cssLength, cssLengthRef } from "./css-length";

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
      "ui:field": "hidden",
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
  preset: Type.Optional(presetRef),
};

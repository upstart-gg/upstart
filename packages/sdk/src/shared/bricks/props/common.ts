import { Type } from "@sinclair/typebox";
import { presetRef } from "./preset";
import { typedRef } from "~/shared/utils/typed-ref";

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
      default: 0,
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
  preset: Type.Optional(presetRef),
};

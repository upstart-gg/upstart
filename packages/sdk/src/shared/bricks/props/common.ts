import { Type } from "@sinclair/typebox";
import { preset } from "./preset";

export const commonProps = {
  className: Type.Optional(
    Type.String({
      default: "",
      "ui:field": "hidden",
    }),
  ),
  lastTouched: Type.Optional(
    Type.Number({
      default: 0,
      "ui:field": "hidden",
    }),
  ),
  hidden: Type.Optional(
    Type.Object(
      {
        desktop: Type.Boolean(),
        mobile: Type.Boolean(),
      },
      {
        "ui:field": "hidden",
        "ai:instructions": "Do not use the hidden prop. It is used internally by the editor.",
      },
    ),
  ),
  editable: Type.Optional(
    Type.Boolean({
      description: "Allow editing. It is automatically set by the editor, so no need to specify it manually.",
      default: false,
      "ui:field": "hidden",
    }),
  ),
  preset: Type.Optional(preset()),
};

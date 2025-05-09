import { Type } from "@sinclair/typebox";
import { StringEnum } from "~/shared/utils/schema";
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
  editable: Type.Optional(
    Type.Boolean({
      description: "Allow editing. It is automatically set by the editor, so no need to specify it manually.",
      default: false,
      "ui:field": "hidden",
    }),
  ),
  preset: Type.Optional(preset()),
};

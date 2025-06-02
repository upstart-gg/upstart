import { Type } from "@sinclair/typebox";
import { preset } from "./preset";

export const commonProps = {
  // className: Type.Optional(
  //   Type.String({
  //     default: "",
  //     "ui:field": "hidden",
  //   }),
  // ),
  lastTouched: Type.Optional(
    Type.Number({
      default: 0,
      "ui:field": "hidden",
      "ai:instructions": "Do not use. It is used internally by the editor.",
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
        "ai:instructions": "Do not use. It is used internally by the editor.",
      },
    ),
  ),
  editable: Type.Optional(
    Type.Boolean({
      description: "Do not use. It is used internally by the editor.",
      default: false,
      "ui:field": "hidden",
    }),
  ),
  preset: Type.Optional(preset()),
};

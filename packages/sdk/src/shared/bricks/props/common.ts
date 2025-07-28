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

  height: Type.Optional(
    cssLengthRef({
      title: "Fixed height",
      description:
        "Set a fixed height for the brick. If not set, the brick will be responsive and will follow the flex layout of its parent section.",
      "ui:field": "hidden",
    }),
  ),
  growHorizontally: Type.Optional(
    Type.Boolean({
      title: "Expand horizontally",
      description:
        "If set, the brick will grow to fill the available width of its parent section. If not set, the brick will have a fixed width.",
      "ui:styleId": "styles:growHorizontally",
      // "ui:field": "hidden",
    }),
  ),
  alignSelf: Type.Optional(
    StringEnum(["self-auto", "self-start", "self-center", "self-end"], {
      title: "Vertical position",
      "ui:field": "hidden",
      "ui:display": "icon-group",
      description: "How the brick vertically aligns itself within its parent section.",
      enumNames: ["Auto", "Top", "Center", "Bottom"],
      "ui:icons": [
        "fluent:auto-fit-height-20-regular",
        "fluent:align-start-vertical-20-regular",
        "fluent:center-vertical-20-regular",
        "fluent:align-end-vertical-20-regular",
      ],
      default: "self-auto",
      "ui:placeholder": "Not specified",
      "ui:styleId": "styles:alignSelf",
    }),
  ),
  dynamicContent: Type.Optional(
    Type.Boolean({
      title: "Use dynamic content",
      description: "If enabled, the brick will use dynamic content from the closest 'Dynamic' brick.",
      "ai:instructions":
        "If set, the brick will use dynamic content from the closest brick of type 'dynamic'. It can only be set to true if the brick is a child of a 'dynamic' brick.",
      metadata: {
        category: "content",
      },
      "ui:field": "hidden",
      "ui:no-mapping": true,
    }),
  ),
  // preset: Type.Optional(presetRef()),
};

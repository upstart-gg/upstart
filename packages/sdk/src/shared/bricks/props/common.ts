import { type Static, type TString, Type } from "@sinclair/typebox";
import { cssLength } from "./css-length";
import { alignSelf } from "./align";
import { grow } from "./grow";

export function hidden() {
  return Type.Object(
    {
      desktop: Type.Optional(Type.Boolean({ description: "Hide on desktop" })),
      mobile: Type.Optional(Type.Boolean({ description: "Hide on mobile" })),
    },
    {
      // $id: "styles:hidden",
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
  hidden: Type.Optional(hidden()),
  editable: Type.Optional(
    Type.Boolean({
      "ui:field": "hidden",
      "ai:hidden": true,
    }),
  ),
  width: Type.Optional(
    cssLength({
      title: "Fixed Width",
      description:
        "Set a fixed width for the brick. If not set, the brick will be responsive and will follow the flex layout of its parent.",
      "ai:instructions": "Use percentage values to make the width responsive, like '50%'",
      "ui:field": "hidden",
    }) as TString,
  ),
  height: Type.Optional(
    cssLength({
      title: "Fixed height",
      description:
        "Set a fixed height for the brick. If not set, the brick will be responsive and will follow the flex layout of its parent.",
      "ui:field": "hidden",
    }),
  ),
  grow: Type.Optional(grow()),
  alignSelf: Type.Optional(alignSelf()),
  className: Type.Optional(
    Type.String({
      title: "CSS classname",
      description:
        "Add tailwind CSS classes to the brick for advanced styling. Tailwind colors limited to `primary`, `secondary`, `accent`, `neutral` and `base` variants.",
    }),
  ),
};

const commonPropsSchema = Type.Object(commonProps);
export type CommonBrickProps = Static<typeof commonPropsSchema>;

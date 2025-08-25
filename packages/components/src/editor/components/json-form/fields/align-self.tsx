import type { FieldProps } from "./types";
import type { AlignSelfSettings } from "@upstart.gg/sdk/shared/bricks/props/align";
import { useParentBrick, useSectionByBrickId } from "~/editor/hooks/use-page-data";
import invariant from "@upstart.gg/sdk/shared/utils/invariant";
import EnumField from "./enum";

export default function AlignSelfField(props: FieldProps<AlignSelfSettings>) {
  const { brickId, onChange, schema } = props;
  const section = useSectionByBrickId(brickId);
  const parentBrick = useParentBrick(brickId);
  const parentElement = parentBrick ?? section;

  if (!parentElement) {
    // Parent element not found for AlignSelfField
    return null;
  }

  const htmlElement = document.getElementById(parentElement.id);
  if (!htmlElement) {
    // HTML element not found for AlignSelfField
    return null;
  }
  const parentFlexOrientation = getComputedStyle(htmlElement).flexDirection;

  const customSchema = {
    ...schema,
    title: parentFlexOrientation === "column" ? "Horizontal position" : "Vertical position",
    description:
      parentFlexOrientation === "column"
        ? "Horizontal position of the brick within its parent box or section."
        : "Vertical position of the brick within its parent box or section.",
    "ui:display": "icon-group",
    enumNames:
      parentFlexOrientation === "column"
        ? ["Auto", "Left", "Center", "Right", "Stretch"]
        : ["Auto", "Top", "Center", "Bottom", "Stretch"],
    "ui:icons":
      parentFlexOrientation === "column"
        ? [
            null,
            "fluent:align-start-horizontal-20-regular",
            "fluent:center-horizontal-20-regular",
            "fluent:align-end-horizontal-20-regular",
            "fluent:auto-fit-width-20-regular",
          ]
        : [
            null,
            "fluent:align-start-vertical-20-regular",
            "fluent:center-vertical-20-regular",
            "fluent:align-end-vertical-20-regular",
            "fluent:auto-fit-height-20-regular",
          ],
  };

  return (
    <EnumField
      {...props}
      schema={customSchema}
      title={customSchema.title}
      description={customSchema.description}
      onChange={onChange as (value: string | null) => void}
    />
  );
}

import type { FieldProps } from "./types";
import type { JustifyContentSettings } from "@upstart.gg/sdk/shared/bricks/props/align";
import EnumField from "./enum";

export default function JustifyContentField(props: FieldProps<JustifyContentSettings>) {
  const { brickId, onChange, schema } = props;
  const htmlElement = document.getElementById(brickId);
  const flexOrientation = htmlElement ? getComputedStyle(htmlElement).flexDirection : "row";

  const customSchema = {
    ...schema,
    title: flexOrientation === "row" ? "Horizontal Align." : `Vertical Align.`,
    description:
      flexOrientation === "row"
        ? "Aligns the bricks horizontally within the container. (justify-content)"
        : "Aligns the bricks vertically within the container. (justify-content)",
    "ui:display": "icon-group",
    enumNames:
      flexOrientation === "row"
        ? ["Left", "Center", "Right", "Between", "Around", "Evenly"]
        : ["Top", "Center", "Bottom", "Between", "Around", "Evenly"],
    "ui:icons":
      flexOrientation === "row"
        ? [
            "fluent:align-start-horizontal-20-regular",
            "fluent:center-horizontal-20-regular",
            "fluent:align-end-horizontal-20-regular",
            "fluent:align-space-between-vertical-20-regular",
            "fluent:align-space-around-vertical-20-regular",
            "fluent:align-space-evenly-horizontal-20-regular",
          ]
        : [
            "fluent:align-start-vertical-20-regular",
            "fluent:center-vertical-20-regular",
            "fluent:align-end-vertical-20-regular",
            "fluent:align-space-between-horizontal-20-regular",
            "fluent:align-space-around-horizontal-20-regular",
            "fluent:align-space-evenly-vertical-20-regular",
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

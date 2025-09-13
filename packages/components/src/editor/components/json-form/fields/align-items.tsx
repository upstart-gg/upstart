import type { FieldProps } from "./types";
import type { AlignItemsSettings } from "@upstart.gg/sdk/shared/bricks/props/align";
import EnumField from "./enum";
import { useParentBrick } from "~/editor/hooks/use-page-data";

export default function AlignItemsField(props: FieldProps<AlignItemsSettings>) {
  const { brickId, onChange, schema } = props;
  const htmlElement = document.getElementById(brickId);
  const parentbrick = useParentBrick(brickId);

  if (!htmlElement) {
    return null;
  }

  const flexOrientation = getComputedStyle(htmlElement).flexDirection;

  const customSchema = {
    ...schema,
    title: flexOrientation === "column" ? "Horizontal alignment" : `Vertical alignment`,
    "ui:display": "icon-group",
    description:
      flexOrientation === "column"
        ? "Aligns the child bricks horizontally. (align-items)"
        : "Aligns the child bricks vertically. (align-items)",
    enumNames:
      flexOrientation === "column"
        ? ["Left", "Center", "Right", "Stretch"]
        : ["Top", "Center", "Bottom", "Stretch"],
    "ui:icons":
      flexOrientation === "column"
        ? [
            "fluent:align-start-horizontal-20-regular",
            "fluent:center-horizontal-20-regular",
            "fluent:align-end-horizontal-20-regular",
            "fluent:auto-fit-width-20-regular",
          ]
        : [
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

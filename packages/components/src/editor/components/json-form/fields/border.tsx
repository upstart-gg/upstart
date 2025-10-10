import type { FieldProps } from "./types";
import type { BorderSettings } from "@upstart.gg/sdk/bricks";
import EnumField from "./enum";
import { FieldTitle } from "../field-factory";
import { ColorElementPreviewPill } from "./color";

export default function BorderField(props: FieldProps<BorderSettings>) {
  const { currentValue, onChange, schema, title, description } = props;
  const onPropsChange = (newVal: Partial<BorderSettings>) => onChange({ ...currentValue, ...newVal });

  return (
    <div className="flex justify-between flex-1 gap-1 flex-wrap">
      <FieldTitle title={title} description={description} />
      <div className="flex-1 gap-3 flex items-center justify-end">
        {currentValue?.width && currentValue.width !== "border-0" && (
          <ColorElementPreviewPill
            elementColorType="border"
            onChange={(color) => {
              onPropsChange({ color: color || undefined });
            }}
            color={currentValue?.color}
            hideColorLabel={true}
          />
        )}
        <EnumField
          {...props}
          title={undefined}
          schema={schema.properties.width}
          currentValue={currentValue?.width}
          onChange={(value) => onPropsChange({ width: value as BorderSettings["width"] })}
          noFieldGrow={true}
        />
      </div>
    </div>
  );
}

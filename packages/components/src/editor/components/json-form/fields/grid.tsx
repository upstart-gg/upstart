import type { FieldProps } from "./types";
import { Text, Select } from "@upstart.gg/style-system/system";
import type { GridSettings } from "@upstart.gg/sdk/shared/bricks/props/container";
import { fieldLabel } from "../form-class";
import { Slider } from "@upstart.gg/style-system/system";
import { HelpIcon } from "../HelpIcon";
import { FieldTitle } from "../field-factory";

export const GridField: React.FC<FieldProps<GridSettings>> = (props) => {
  const {
    currentValue = {
      columns: 2,
    } satisfies Partial<GridSettings>,
    onChange,
    description,
    schema,
    formData,
    title,
  } = props;

  if (formData.layoutType !== "grid") {
    return null;
  }

  const onSettingsChange = (newVal: Partial<GridSettings>) => onChange({ ...currentValue, ...newVal });

  return (
    <div className="grid-field">
      <FieldTitle title={title} description={description} />
      <div className="flex items-start flex-wrap gap-x-4 gap-y-1">
        {/* Columns */}
        <div className="flex flex-col gap-1 flex-1 basis-1/4">
          <div className="flex gap-1 items-center">
            <label className={fieldLabel}>
              Columns <span className="text-xs text-gray-500 font-normal">({currentValue.columns})</span>
            </label>
            <HelpIcon help="Number of columns" />
          </div>
          <Slider
            className="!mt-3 !mx-px"
            onValueChange={(value) => onSettingsChange({ columns: value[0] })}
            size="1"
            variant="soft"
            min={1}
            step={1}
            max={16}
            defaultValue={[currentValue.columns]}
          />
        </div>
      </div>
    </div>
  );
};

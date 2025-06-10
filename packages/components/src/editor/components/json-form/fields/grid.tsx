import type { FieldProps } from "./types";
import { fieldLabel } from "../form-class";
import { Slider } from "@upstart.gg/style-system/system";
import { HelpIcon } from "../HelpIcon";
import { FieldTitle } from "../field-factory";
import type { FC } from "react";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const GridField: FC<FieldProps<any>> = (props) => {
  const {
    currentValue = {
      columns: 2,
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    } satisfies Partial<any>,
    onChange,
    description,
    schema,
    formData,
    title,
  } = props;

  if (formData.layoutType !== "grid") {
    return null;
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const onSettingsChange = (newVal: Partial<any>) => onChange({ ...currentValue, ...newVal });

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

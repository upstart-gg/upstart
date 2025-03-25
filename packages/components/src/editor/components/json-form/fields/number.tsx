import type { FieldProps } from "./types";
import { IconButton, Slider, Tooltip } from "@upstart.gg/style-system/system";
import { TextField, Text } from "@upstart.gg/style-system/system";
import { fieldLabel } from "../form-class";
import { IoIosHelpCircleOutline } from "react-icons/io";
import { FieldTitle } from "../field-factory";

export const SliderField: React.FC<FieldProps<number>> = (props) => {
  const { schema, currentValue, onChange, required, title, description } = props;

  const unit = schema["ui:unit"] ?? "";
  const multiplier = parseFloat(schema["ui:multiplier"] ?? "1");

  return (
    <div className="slider-field flex-1 flex justify-between gap-10 items-center">
      <FieldTitle title={title} description={description} />
      <div className="ml-auto basis-1/2 flex items-center gap-2">
        <Slider
          onValueChange={(value) => onChange(value[0])}
          size="1"
          variant="soft"
          min={schema.minimum}
          max={schema.maximum}
          step={schema.multipleOf ?? 1}
          defaultValue={[currentValue]}
        />
        <span className="text-gray-500 text-sm text-nowrap whitespace-nowrap">
          {currentValue * multiplier}
          {unit}
        </span>
      </div>
    </div>
  );
};

export const NumberField: React.FC<FieldProps<number>> = (props) => {
  const { currentValue, onChange, required, title, description, placeholder } = props;

  return (
    <div className="number-field">
      <FieldTitle title={title} description={description} />
      <TextField.Root
        defaultValue={currentValue}
        type="number"
        onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null)}
        className="!mt-1.5"
        required={required}
        placeholder={placeholder}
      />
    </div>
  );
};

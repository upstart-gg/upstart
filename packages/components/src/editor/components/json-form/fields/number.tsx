import type { FieldProps } from "./types";
import { Slider } from "@upstart.gg/style-system/system";
import { TextField } from "@upstart.gg/style-system/system";
import { FieldTitle } from "../field-factory";
import { useState, type FC } from "react";

export const SliderField: FC<FieldProps<number>> = (props) => {
  const { schema, currentValue, onChange, title, description } = props;
  const unit = schema["ui:unit"] ?? "";
  const multiplier = schema["ui:multiplier"] ?? 1;
  const [val, setVal] = useState(currentValue);

  return (
    <div className="slider-field flex-1 flex justify-between gap-3 items-center">
      <FieldTitle title={title} description={description} />
      <div className="ml-auto basis-1/3 flex items-center gap-2">
        <Slider
          onValueChange={(value) => {
            console.log("slider value changed", value[0]);
            setVal(value[0]);
            onChange(value[0]);
          }}
          size="1"
          variant="soft"
          min={schema.minimum}
          max={schema.maximum}
          step={schema.multipleOf ?? 1}
          defaultValue={[currentValue]}
        />
        {typeof currentValue === "number" && (
          <span className="text-gray-500 text-sm text-nowrap whitespace-nowrap">
            {val * multiplier} {unit}
          </span>
        )}
      </div>
    </div>
  );
};

export const NumberField: FC<FieldProps<number>> = (props) => {
  const { currentValue, onChange, schema, title, description, placeholder } = props;
  return (
    <div className="number-field flex-1 flex justify-between gap-3 items-center">
      <FieldTitle title={title} description={description} />
      <TextField.Root
        defaultValue={currentValue}
        type="number"
        onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null)}
        className="!max-w-[50px] !text-right"
        inputMode="numeric"
        min={schema.minimum}
        max={schema.maximum}
        step={schema.multipleOf ?? 1}
        placeholder={placeholder ?? schema["ui:placeholder"]}
      />
    </div>
  );
};

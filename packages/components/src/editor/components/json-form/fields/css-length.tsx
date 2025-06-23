import type { FieldProps } from "./types";
import { Select, TextField } from "@upstart.gg/style-system/system";
import { FieldTitle } from "../field-factory";
import { type FC, useEffect, useState } from "react";

export const CssLengthField: FC<FieldProps<string>> = (props) => {
  const { currentValue, onChange, schema, required, title, description, placeholder } = props;

  // remove leading slash
  const rx = /([0-9\.]+)(lh|rlh|px|em|rem|%|dvh|vh|vw|dvw|cqw|cqh|cqi|cqb|cqmin|cqmax)/;
  const [_, baseVal, baseUnit = "px"] = rx.exec(currentValue ?? "") || [];

  const [state, setState] = useState({
    value: baseVal,
    unit: baseUnit,
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const newValue = `${state.value}${state.unit}`;
    if (newValue !== currentValue) {
      onChange(newValue);
    }
  }, [state, currentValue]);

  const units: string[] = schema["ui:css-units"] ?? [];

  return (
    <div className="field field-csslength basis-full flex justify-between">
      <FieldTitle title={title} description={description} />
      <TextField.Root
        type="number"
        size="1"
        defaultValue={baseVal}
        onChange={(e) =>
          setState((prev) => ({
            ...prev,
            value: e.target.value,
          }))
        }
        className="!pr-1 !basis-2/5 focus:(!ring-0 !border-0)"
        required={required}
      >
        <TextField.Slot side="right" className="!mr-px">
          <Select.Root
            defaultValue={baseUnit}
            size="1"
            onValueChange={(value) => setState((prev) => ({ ...prev, unit: value }))}
          >
            <Select.Trigger radius="medium" variant="ghost" />
            <Select.Content position="popper">
              <Select.Group>
                {units.map((option) => (
                  <Select.Item key={option} value={option}>
                    {option}
                  </Select.Item>
                ))}
              </Select.Group>
            </Select.Content>
          </Select.Root>
        </TextField.Slot>
      </TextField.Root>
    </div>
  );
};

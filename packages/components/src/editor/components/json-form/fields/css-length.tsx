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
    <div className="field field-path basis-full flex justify-between">
      <FieldTitle title={title} description={description} />
      <TextField.Root
        type="number"
        defaultValue={baseVal}
        onChange={(e) =>
          setState((prev) => ({
            ...prev,
            value: e.target.value,
          }))
        }
        className="!text-right !gap-0.5 !basis-2/5 focus:(!ring-0 !border-0)"
        required={required}
      >
        <TextField.Slot side="right">
          <Select.Root
            defaultValue={baseUnit}
            size="2"
            onValueChange={(value) => setState((prev) => ({ ...prev, unit: value }))}
          >
            <Select.Trigger radius="large" variant="ghost" />
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

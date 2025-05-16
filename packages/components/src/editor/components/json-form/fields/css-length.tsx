import type { FieldProps } from "./types";
import { Select, TextField } from "@upstart.gg/style-system/system";
import { TbSlash } from "react-icons/tb";
import { useDebounceCallback } from "usehooks-ts";
import { FieldTitle } from "../field-factory";

export const CssLengthField: React.FC<FieldProps<string>> = (props) => {
  const { currentValue, onChange, schema, required, title, description, placeholder } = props;

  const onChangeDebounced = useDebounceCallback(onChange, 300);
  // remove leading slash
  const rx = /([0-9\.]+)(lh|rlh|px|em|rem|%|dvh|vh|vw|dvw|cqw|cqh|cqi|cqb|cqmin|cqmax)/;
  const [_, val, unit = "px"] = rx.exec(currentValue ?? "") || [];
  const units: string[] = schema["ui:css-units"] ?? [];

  return (
    <div className="field field-path basis-full flex justify-between">
      <FieldTitle title={title} description={description} />
      <TextField.Root
        defaultValue={val}
        onChange={(e) => onChangeDebounced(e.target.value)}
        className="!text-right !gap-0.5 !basis-2/5 focus:(!ring-0 !border-0)"
        required={required}
      >
        <TextField.Slot side="right">
          <Select.Root defaultValue={unit} size="2" onValueChange={(value) => onChange(value)}>
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

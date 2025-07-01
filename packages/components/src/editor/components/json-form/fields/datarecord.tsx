import type { FieldProps } from "./types";
import type { DatarecordSettings } from "@upstart.gg/sdk/shared/bricks/props/datarecord";
import { fieldLabel } from "../form-class";
import { SegmentedControl, Select } from "@upstart.gg/style-system/system";
import {
  PiAlignCenterVertical,
  PiAlignBottom,
  PiAlignTop,
  PiAlignLeft,
  PiAlignRight,
  PiAlignCenterHorizontal,
} from "react-icons/pi";
import type { FC } from "react";

export const DatarecordField: FC<FieldProps<DatarecordSettings | undefined>> = (props) => {
  const { currentValue, onChange, required, title, description, placeholder, schema } = props;

  const onSettingsChange = (newVal: Partial<DatarecordSettings>) => {
    // onChange();
  };

  return (
    <div className="layout-field basis-full">
      <div className="flex items-start flex-wrap gap-x-4 gap-y-1">
        <div className="flex justify-between gap-1 flex-1">
          <label className={fieldLabel}>Database</label>
          <Select.Root defaultValue={currentValue} size="2" onValueChange={(value) => onChange(value)}>
            <Select.Trigger
              radius="large"
              variant="ghost"
              placeholder={schema["ui:placeholder"] ?? "Not specified"}
            />
            <Select.Content position="popper">
              <Select.Group>
                {/* {options
                            .filter((o) => !o["ui:hidden-option"])
                            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                            .map((option: any) => (
                              <Select.Item key={option.const} value={option.const}>
                                {option.title}
                              </Select.Item>
                            ))} */}
              </Select.Group>
            </Select.Content>
          </Select.Root>
        </div>
        <button type="button">create new</button>
      </div>
    </div>
  );
};

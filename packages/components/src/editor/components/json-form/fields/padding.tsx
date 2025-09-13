import type { FieldProps } from "./types";
import { Select } from "@upstart.gg/style-system/system";
import { fieldLabel } from "../form-class";
import { FieldTitle } from "../field-factory";
import type { FC } from "react";
import { normalizeSchemaEnum } from "@upstart.gg/sdk/shared/utils/schema";

export type TempPadding = {
  horizontal: string;
  vertical: string;
};

export const PagePaddingField: FC<FieldProps<TempPadding>> = (props) => {
  const { currentValue, onChange, title, description, placeholder, schema } = props;
  const onSettingsChange = (newVal: Partial<TempPadding>) => onChange({ ...currentValue, ...newVal });

  return (
    <div className="border-field">
      <FieldTitle title={title} description={description} />
      <div className="flex items-start flex-wrap gap-x-4 gap-y-1">
        {/* Padding */}
        <div className="flex flex-col gap-1 flex-1">
          <label className={fieldLabel}>Horizontal padding</label>
          <Select.Root
            defaultValue={currentValue.horizontal}
            size="2"
            onValueChange={(value) => onSettingsChange({ horizontal: value as TempPadding["horizontal"] })}
          >
            <Select.Trigger radius="large" variant="ghost" />
            <Select.Content position="popper">
              <Select.Group>
                {normalizeSchemaEnum(schema.properties.horizontal).map((item) => (
                  <Select.Item key={item.const} value={item.const}>
                    {item.title}
                  </Select.Item>
                ))}
              </Select.Group>
            </Select.Content>
          </Select.Root>
        </div>
        <div className="flex flex-col gap-1 flex-1">
          <label className={fieldLabel}>Vertical padding</label>
          <Select.Root
            defaultValue={currentValue.vertical}
            size="2"
            onValueChange={(value) => onSettingsChange({ vertical: value as TempPadding["horizontal"] })}
          >
            <Select.Trigger radius="large" variant="ghost" />
            <Select.Content position="popper">
              <Select.Group>
                {/* biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
                {schema.properties.vertical.anyOf.map((item: any) => (
                  <Select.Item key={item.const} value={item.const}>
                    {item.title}
                  </Select.Item>
                ))}
              </Select.Group>
            </Select.Content>
          </Select.Root>
        </div>
      </div>
    </div>
  );
};

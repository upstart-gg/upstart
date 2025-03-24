import type { FieldProps } from "./types";
import { Text, Select } from "@upstart.gg/style-system/system";
import { fieldLabel } from "../form-class";
import type { Attributes } from "@upstart.gg/sdk/shared/attributes";

export type TempPadding = {
  horizontal: string;
  vertical: string;
};

export const PagePaddingField: React.FC<FieldProps<TempPadding>> = (props) => {
  const { currentValue, onChange, required, title, description, placeholder, schema } = props;
  const onSettingsChange = (newVal: Partial<TempPadding>) => onChange({ ...currentValue, ...newVal });

  return (
    <div className="border-field">
      {description && (
        <Text as="p" color="gray" size="1">
          {description}
        </Text>
      )}
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
                {/* biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
                {schema.properties.horizontal.anyOf.map((item: any) => (
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

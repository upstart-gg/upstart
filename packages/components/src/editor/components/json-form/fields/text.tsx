import type { FieldProps } from "./types";
import { Text, Select, Slider } from "@upstart.gg/style-system/system";
import type { TextSettings } from "@upstart.gg/sdk/shared/bricks/props/all";
import { fieldLabel } from "../form-class";
import { ColorPill } from "./color";

export const TextField: React.FC<FieldProps<TextSettings>> = (props) => {
  const {
    currentValue = {
      size: "text-base",
      color: "inherit",
    } satisfies TextSettings,
    onChange,
    required,
    title,
    description,
    placeholder,
    schema,
  } = props;
  const onSettingsChange = (newVal: Partial<TextSettings>) => onChange({ ...currentValue, ...newVal });

  return (
    <div className="text-field">
      {description && (
        <Text as="p" color="gray" size="1">
          {description}
        </Text>
      )}
      <div className="flex items-start flex-wrap gap-x-4 gap-y-1">
        {/* Padding */}
        <div className="flex flex-col gap-1 flex-1">
          <label className={fieldLabel}>Default size</label>
          <Select.Root
            defaultValue={currentValue.size}
            size="2"
            onValueChange={(value) => onSettingsChange({ size: value as TextSettings["size"] })}
          >
            <Select.Trigger radius="large" variant="ghost" />
            <Select.Content position="popper">
              <Select.Group>
                {/* biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
                {schema.properties.size.anyOf.map((item: any) => (
                  <Select.Item key={item.const} value={item.const}>
                    {item.title}
                  </Select.Item>
                ))}
              </Select.Group>
            </Select.Content>
          </Select.Root>
        </div>
        {/* Height */}
        <div className="flex flex-col gap-1 flex-1">
          <label className={fieldLabel}>Default color</label>
          <ColorPill
            elementColorType="text"
            color={currentValue.color}
            onChange={(color) => onSettingsChange({ color })}
          />
        </div>
      </div>
    </div>
  );
};

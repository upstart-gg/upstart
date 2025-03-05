import type { FieldProps } from "./types";
import { Text, Select, Slider } from "@upstart.gg/style-system/system";
import type { LayoutSettings } from "@upstart.gg/sdk/shared/bricks/props/layout";
import { fieldLabel } from "../form-class";
import { SegmentedControl } from "@upstart.gg/style-system/system";
import { tx } from "@upstart.gg/style-system/twind";

export const LayoutField: React.FC<FieldProps<LayoutSettings>> = (props) => {
  const { currentValue = {}, onChange, required, title, description, placeholder, schema } = props;
  const onSettingsChange = (newVal: Partial<LayoutSettings>) => {
    const newProps = { ...currentValue, ...newVal };
    onChange(newProps);
  };

  return (
    <div className="layout-field">
      {description && (
        <Text as="p" color="gray" size="1">
          {description}
        </Text>
      )}
      <div className="flex items-start flex-wrap gap-x-4 gap-y-1">
        {/* Padding */}
        <div className="flex flex-col gap-1 flex-1">
          <label className={fieldLabel}>Padding</label>
          <Select.Root
            defaultValue={currentValue.padding}
            size="2"
            onValueChange={(value) => onSettingsChange({ padding: value as LayoutSettings["padding"] })}
          >
            <Select.Trigger radius="large" variant="ghost" />
            <Select.Content position="popper">
              <Select.Group>
                {/* biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
                {schema.properties.padding.anyOf.map((item: any) => (
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
          <label className={fieldLabel}>Height</label>
          <SegmentedControl.Root
            onValueChange={(value) => onSettingsChange({ height: value as LayoutSettings["height"] })}
            defaultValue={currentValue.height as string}
            size="1"
            className="w-full !max-w-full "
            radius="large"
          >
            {/* biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
            {schema.properties.height.anyOf.map((option: any) => (
              <SegmentedControl.Item
                key={option.const}
                value={option.const}
                className={tx("[&_.rt-SegmentedControlItemLabel]:px-1")}
              >
                {option.title}
              </SegmentedControl.Item>
            ))}
          </SegmentedControl.Root>
        </div>
      </div>
    </div>
  );
};

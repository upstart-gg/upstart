import type { FieldProps } from "./types";
import { Text, Select } from "@upstart.gg/style-system/system";
import type { FlexSettings } from "@upstart.gg/sdk/shared/bricks/props/container";
import { fieldLabel } from "../form-class";
import { SegmentedControl, Switch } from "@upstart.gg/style-system/system";
import { tx } from "@upstart.gg/style-system/twind";
import { HelpIcon } from "../HelpIcon";
import { FieldTitle } from "../field-factory";

export const FlexField: React.FC<FieldProps<FlexSettings>> = (props) => {
  const {
    currentValue = {
      direction: "flex-row",
      wrap: "flex-nowrap",
      alignItems: "items-stretch",
      justifyContent: "justify-stretch",
    } satisfies Partial<FlexSettings>,
    onChange,
    description,
    formData,
    schema,
    title,
  } = props;

  const onSettingsChange = (newVal: Partial<FlexSettings>) => onChange({ ...currentValue, ...newVal });

  return (
    <div className="flex-field">
      <FieldTitle title={title} description={description} />
      <div className="flex items-start flex-wrap gap-x-4 gap-y-1">
        {/* Direction */}
        <div className="flex flex-col gap-1 basis-2/5">
          <label className={fieldLabel}>Direction</label>
          <SegmentedControl.Root
            onValueChange={(value) => onSettingsChange({ direction: value as FlexSettings["direction"] })}
            defaultValue={currentValue.direction as string}
            size="1"
            className="w-full mt-0.5 !max-w-full"
            radius="large"
          >
            {/* biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
            {schema.properties.direction.anyOf.map((option: any) => (
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

        {/* Wrap */}
        <div className="flex flex-col gap-1 flex-1 basis-1/4">
          <div className="flex gap-1 items-center">
            <label className={fieldLabel}>Wrap</label>
            <HelpIcon help="Whether the children bricks should wrap to the next line when they reach the end of the container." />
          </div>
          <Switch
            className="!mt-1"
            onCheckedChange={(value) => onSettingsChange({ wrap: value ? "flex-wrap" : "flex-nowrap" })}
            size="2"
            variant="soft"
            defaultChecked={currentValue.wrap === "flex-wrap"}
          />
        </div>

        {/* break */}
        <div className="basis-full w-0 h-2" />

        <div className="flex flex-col gap-1 flex-1">
          <div className="flex gap-1 items-center">
            <label className={fieldLabel}>Justify</label>
            <HelpIcon help="How the children elements are justified (following the chosen direction)" />
          </div>
          <Select.Root
            defaultValue={currentValue.justifyContent}
            size="2"
            onValueChange={(value) =>
              onSettingsChange({ justifyContent: value as FlexSettings["justifyContent"] })
            }
          >
            <Select.Trigger radius="large" variant="ghost" />
            <Select.Content position="popper">
              <Select.Group>
                {/* biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
                {schema.properties.justifyContent.anyOf.map((item: any) => (
                  <Select.Item key={item.const} value={item.const}>
                    {item.title}
                  </Select.Item>
                ))}
              </Select.Group>
            </Select.Content>
          </Select.Root>
        </div>

        <div className="flex flex-col gap-1 flex-1">
          <div className="flex gap-1 items-center">
            <label className={fieldLabel}>Align items</label>
            <HelpIcon help="How the children elements should be aligned (opposite to the chosen direction)" />
          </div>

          <Select.Root
            defaultValue={currentValue.alignItems}
            size="2"
            onValueChange={(value) => onSettingsChange({ alignItems: value as FlexSettings["alignItems"] })}
          >
            <Select.Trigger radius="large" variant="ghost" />
            <Select.Content position="popper">
              <Select.Group>
                {/* biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
                {schema.properties.alignItems.anyOf.map((item: any) => (
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

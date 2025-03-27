import type { FieldProps } from "./types";
import { Text, Select, Slider } from "@upstart.gg/style-system/system";
import type { ContainerLayoutSettings } from "@upstart.gg/sdk/shared/bricks/props/container";
import { fieldLabel } from "../form-class";
import { SegmentedControl, Switch } from "@upstart.gg/style-system/system";
import { tx } from "@upstart.gg/style-system/twind";
import { HelpIcon } from "../HelpIcon";
import { FieldTitle } from "../field-factory";
import { useGetBrick } from "~/editor/hooks/use-editor";

export const ContainerLayoutField: React.FC<FieldProps<ContainerLayoutSettings>> = (props) => {
  const getBrickInfo = useGetBrick();
  const { currentValue, onChange, description, formData, schema, title, brickId } = props;

  const onSettingsChange = (newVal: Partial<ContainerLayoutSettings>) => {};

  return (
    <div className="flex-field flex-1 flex flex-col gap-3">
      <div className="flex items-start flex-wrap gap-x-4 gap-y-2">
        {/* Gap */}
        <div className="flex flex-col gap-1 flex-1">
          <div className="flex gap-1 items-center">
            <label className={fieldLabel}>Gap</label>
            <HelpIcon help="Gap between elements" />
          </div>
          <Select.Root
            size="2"
            onValueChange={(value) => {
              onSettingsChange({ gap: value as ContainerLayoutSettings["gap"] });
            }}
          >
            <Select.Trigger radius="large" variant="ghost" className="!mt-px" placeholder="Unspecified" />
            <Select.Content position="popper">
              <Select.Group>
                {/* biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
                {schema.properties.gap.anyOf.map((item: any) => (
                  <Select.Item key={item.const} value={item.const}>
                    {item.title}
                  </Select.Item>
                ))}
              </Select.Group>
            </Select.Content>
          </Select.Root>
        </div>
        {/* Columns */}
        <div className="flex flex-col gap-1 flex-1">
          <div className="flex gap-1 items-center">
            <label className={fieldLabel}>Columns</label>
            <HelpIcon help="Gap between elements" />
          </div>
          <Slider
            className="!mt-3 !mx-px"
            onValueChange={(value) => onSettingsChange({ columns: value[0] })}
            size="1"
            variant="soft"
            min={1}
            step={1}
            max={16}
            defaultValue={[currentValue.columns ?? 2]}
          />
        </div>
      </div>
      <div className="flex items-start flex-wrap gap-x-4 gap-y-2">
        {/* Direction */}
        <div className="flex flex-col gap-1 flex-1">
          <label className={fieldLabel}>Direction</label>
          <SegmentedControl.Root
            onValueChange={(value) =>
              onSettingsChange({
                direction: value as Required<ContainerLayoutSettings>["direction"],
              })
            }
            // defaultValue={currentValue.direction as string}
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

        {/* break */}
        <div className="basis-full w-0 h-2" />

        <div className="flex flex-col gap-1 flex-1">
          <div className="flex gap-1 items-center">
            <label className={fieldLabel}>Justify</label>
            <HelpIcon help="How the children elements are justified (following the chosen direction)" />
          </div>
          <Select.Root
            // defaultValue={currentValue.justifyContent}
            size="2"
            onValueChange={(value) =>
              onSettingsChange({
                justifyContent: value as Required<ContainerLayoutSettings>["justifyContent"],
              })
            }
          >
            <Select.Trigger radius="large" variant="ghost" placeholder="Unspecified" />
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
            // defaultValue={currentValue.alignItems}
            size="2"
            onValueChange={(value) =>
              onSettingsChange({
                alignItems: value as Required<ContainerLayoutSettings>["alignItems"],
              })
            }
          >
            <Select.Trigger radius="large" variant="ghost" placeholder="Unspecified" />
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

        <div className="flex flex-col gap-1 flex-1">
          {/* Wrap */}
          <div className="flex flex-col gap-1 flex-1">
            <div className="flex gap-1 items-center">
              <label className={fieldLabel}>Wrap</label>
              <HelpIcon help="Whether the children bricks should wrap to the next line when they reach the end of the container." />
            </div>
            <Switch
              className="!mt-1"
              onCheckedChange={(value) => onSettingsChange({ wrap: value ? "flex-wrap" : "flex-nowrap" })}
              size="2"
              variant="soft"
              // defaultChecked={currentValue.wrap === "flex-wrap"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

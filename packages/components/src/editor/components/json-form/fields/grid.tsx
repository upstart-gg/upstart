import type { FieldProps } from "./types";
import { Text, Select } from "@upstart.gg/style-system/system";
import type { GridSettings } from "@upstart.gg/sdk/shared/bricks/props/container";
import { fieldLabel } from "../form-class";
import { Slider } from "@upstart.gg/style-system/system";
import { HelpIcon } from "../HelpIcon";

export const GridField: React.FC<FieldProps<GridSettings>> = (props) => {
  const {
    currentValue = {
      columns: 2,
      gap: "gap-1",
    } satisfies Partial<GridSettings>,
    onChange,
    description,
    schema,
    formData,
  } = props;

  if (formData.layoutType !== "grid") {
    return null;
  }

  const onSettingsChange = (newVal: Partial<GridSettings>) => onChange({ ...currentValue, ...newVal });

  return (
    <div className="grid-field">
      {description && (
        <Text as="p" color="gray" size="1">
          {description}
        </Text>
      )}
      <div className="flex items-start flex-wrap gap-x-4 gap-y-1">
        {/* Gap */}
        <div className="flex flex-col gap-1 flex-1">
          <div className="flex gap-1 items-center">
            <label className={fieldLabel}>Gap</label>
            <HelpIcon help="Gap between columns" />
          </div>
          <Select.Root
            defaultValue={currentValue.gap}
            size="2"
            onValueChange={(value) => onSettingsChange({ gap: value as GridSettings["gap"] })}
          >
            <Select.Trigger radius="large" variant="ghost" className="!mt-px" />
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
        <div className="flex flex-col gap-1 flex-1 basis-1/4">
          <div className="flex gap-1 items-center">
            <label className={fieldLabel}>
              Columns <span className="text-xs text-gray-500 font-normal">({currentValue.columns})</span>
            </label>
            <HelpIcon help="Number of columns" />
          </div>
          <Slider
            className="!mt-3 !mx-px"
            onValueChange={(value) => onSettingsChange({ columns: value[0] })}
            size="1"
            variant="soft"
            min={1}
            step={1}
            max={16}
            defaultValue={[currentValue.columns]}
          />
        </div>
      </div>
    </div>
  );
};

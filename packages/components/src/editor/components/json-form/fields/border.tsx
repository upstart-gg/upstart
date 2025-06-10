import type { FieldProps } from "./types";
import { Select } from "@upstart.gg/style-system/system";
import type { BorderSettings } from "@upstart.gg/sdk/shared/bricks/props/border";
import { fieldLabel } from "../form-class";
import { ColorPill } from "./color";
import { MdBorderBottom, MdBorderLeft, MdBorderRight, MdBorderTop } from "react-icons/md";
import { type FC, useState } from "react";
import { FieldTitle } from "../field-factory";
import { tx } from "@upstart.gg/style-system/twind";

export const BorderField: FC<FieldProps<BorderSettings>> = (props) => {
  const { currentValue, onChange, required, title, description, placeholder, schema } = props;
  const onSettingsChange = (newVal: Partial<BorderSettings>) => onChange({ ...currentValue, ...newVal });
  const [currentSide, setSide] = useState<string[]>(currentValue.sides ?? ["all"]);

  return (
    <div className="border-field flex flex-col gap-2 flex-1">
      <FieldTitle title={title} description={description} />
      <div className="flex items-center flex-wrap gap-x-6 gap-y-1.5">
        {/* border width */}
        <div className="flex flex-col gap-1 flex-1">
          <label className={fieldLabel}>Width</label>
          <Select.Root
            defaultValue={currentValue.width}
            size="2"
            onValueChange={(value) => onSettingsChange({ width: value as BorderSettings["width"] })}
          >
            <Select.Trigger radius="large" variant="ghost" />
            <Select.Content position="popper">
              <Select.Group>
                {/* biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
                {schema.properties.width.anyOf.map((item: any) => (
                  <Select.Item key={item.const} value={item.const}>
                    {item.title}
                  </Select.Item>
                ))}
              </Select.Group>
            </Select.Content>
          </Select.Root>
        </div>
        {/* border style */}
        <div className="flex flex-col gap-1 flex-1">
          <label className={fieldLabel}>Style</label>
          <Select.Root
            defaultValue={currentValue.style}
            size="2"
            onValueChange={(value) => onSettingsChange({ style: value as BorderSettings["style"] })}
          >
            <Select.Trigger radius="large" variant="ghost" className="ml-1" />
            <Select.Content position="popper">
              <Select.Group>
                {/* biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
                {schema.properties.style.anyOf.map((item: any) => (
                  <Select.Item key={item.const} value={item.const}>
                    {item.title}
                  </Select.Item>
                ))}
              </Select.Group>
            </Select.Content>
          </Select.Root>
        </div>
        {/* break */}
        <div className="basis-full w-0" />

        {/* border color */}
        <div className="flex flex-col gap-1 flex-1">
          <label className={fieldLabel}>Color</label>
          <ColorPill
            color={currentValue.color}
            elementColorType="border"
            onChange={(color) => {
              if (color) {
                onChange({ ...currentValue, color });
              }
            }}
          />
        </div>

        <div className="flex flex-col gap-1 flex-1">
          <label className={fieldLabel}>Side</label>
          <div className="inline-flex divide-x divide-gray-300 dark:divide-dark-500 rounded bg-gray-100 border grow-0 border-gray-300 max-w-min">
            {/* biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
            {schema.properties.side.items.anyOf.map((option: any) => (
              <button
                type="button"
                key={option.const}
                onClick={() => {
                  const sides = currentSide.includes(option.const)
                    ? currentSide.filter((s) => s !== option.const)
                    : [...currentSide, option.const];
                  setSide(sides);
                  onSettingsChange({
                    sides,
                  });
                }}
                className={tx(
                  "p-1 px-2 inline-flex  first:rounded-l last:rounded-r",
                  currentSide.includes(option.const)
                    ? "bg-upstart-500 text-white"
                    : "bg-gray-100 hover:bg-gray-300 dark:bg-dark-600 dark:hover:bg-dark-500 text-gray-500 dark:text-white/50 ",
                )}
              >
                {option.const === "border-t" && <MdBorderTop className="w-4 h-4" />}
                {option.const === "border-b" && <MdBorderBottom className="w-4 h-4" />}
                {option.const === "border-l" && <MdBorderLeft className="w-4 h-4" />}
                {option.const === "border-r" && <MdBorderRight className="w-4 h-4" />}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

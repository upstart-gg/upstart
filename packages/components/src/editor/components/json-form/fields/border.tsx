import type { FieldProps } from "./types";
import { Text, Select, SegmentedControl } from "@upstart.gg/style-system/system";
import type { BorderSettings } from "@upstart.gg/sdk/shared/bricks/props/border";
import { fieldLabel } from "../form-class";
import { ColorPill } from "./color";
import { tx } from "@upstart.gg/style-system/twind";
import {
  MdBorderOuter,
  MdBorderBottom,
  MdBorderAll,
  MdBorderLeft,
  MdBorderRight,
  MdBorderHorizontal,
  MdBorderVertical,
  MdBorderTop,
  MdOutlineBorderBottom,
} from "react-icons/md";
import { useEffect, useState } from "react";

export const BorderField: React.FC<FieldProps<BorderSettings>> = (props) => {
  const { currentValue, onChange, required, title, description, placeholder, schema } = props;

  const onSettingsChange = (newVal: Partial<BorderSettings>) => onChange({ ...currentValue, ...newVal });

  const [currentSide, setSide] = useState<string[]>(currentValue.side);

  return (
    <div className="border-field flex flex-col gap-2 flex-1">
      {title && <label className={fieldLabel}>{title}</label>}
      {description && (
        <Text as="p" color="gray" size="1">
          {description}
        </Text>
      )}
      <div className="flex items-center flex-wrap gap-x-6 gap-y-1">
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
        {/* border radius */}
        <div className="flex flex-col gap-1 flex-1">
          <label className={fieldLabel}>Rounding</label>
          <Select.Root
            defaultValue={currentValue.radius}
            size="2"
            onValueChange={(value) => onSettingsChange({ radius: value as BorderSettings["radius"] })}
          >
            <Select.Trigger radius="large" variant="ghost" />
            <Select.Content position="popper">
              <Select.Group>
                {/* biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
                {schema.properties.radius.anyOf.map((item: any) => (
                  <Select.Item key={item.const} value={item.const}>
                    {item.title}
                  </Select.Item>
                ))}
              </Select.Group>
            </Select.Content>
          </Select.Root>
        </div>
        {/* border color */}
        <div className="flex flex-col gap-1 flex-1">
          <label className={fieldLabel}>Color</label>
          <ColorPill
            color={currentValue.color}
            elementColorType="border"
            onChange={(e) => onChange({ ...currentValue, color: e })}
          />
        </div>
        {/* break */}
        <div className="basis-full w-0" />
        {/* border side */}
        <div className="flex flex-1 justify-between">
          <label className={fieldLabel}>Side</label>
          <div className="flex divide-x divide-gray-300 dark:divide-dark-500 rounded bg-gray-100 border border-gray-300">
            {/* biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
            {schema.properties.side.items.anyOf.map((option: any) => (
              <button
                type="button"
                key={option.const}
                onClick={() => {
                  if (option.const === "all") {
                    const side = ["all"];
                    setSide(side);
                    onSettingsChange({
                      side: ["all"],
                    });
                  } else {
                    const side = currentSide.includes(option.const)
                      ? currentSide.filter((s) => s !== option.const && s !== "all")
                      : [...currentSide.filter((s) => s !== "all"), option.const];
                    setSide(side);
                    onSettingsChange({
                      side,
                    });
                  }
                }}
                className={tx(
                  "p-1 px-2 flex items-center justify-center first:rounded-l last:rounded-r",
                  currentSide.includes(option.const)
                    ? "bg-upstart-500 text-white/80 "
                    : "bg-gray-100 hover:bg-gray-300 dark:bg-dark-600 dark:hover:bg-dark-500 text-gray-500 dark:text-white/50 ",
                )}
              >
                {option.const === "all" && <MdBorderAll className="w-4 h-4" />}
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

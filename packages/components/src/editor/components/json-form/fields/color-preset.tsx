import { Inset, Popover, Select, Tabs } from "@upstart.gg/style-system/system";
import type { FieldProps } from "./types";
import { FieldTitle } from "../field-factory";
import { tx } from "@upstart.gg/style-system/twind";
import { useCallback, useState, type FC } from "react";
import { RxCross2 } from "react-icons/rx";
import type { ColorPresetSettings } from "@upstart.gg/sdk/shared/bricks/props/color-preset";

const ColorPresetField: FC<FieldProps<ColorPresetSettings>> = (props) => {
  const { schema, currentValue, onChange, title, description } = props;
  const [gradientDir, setGradientDir] = useState<string>(
    currentValue?.gradientDirection ?? schema["ui:default-gradient-direction"] ?? "bg-gradient-to-tr",
  );
  const presets = schema["ui:presets"] as Record<string, { className: string; label: string }>;
  const hasGradientPresets =
    Object.entries(presets).filter(([key]) => key.includes("gradient") === true).length > 0;

  const [tab, setTab] = useState<"solid" | "gradient">(
    currentValue?.color?.includes("gradient") ? "gradient" : "solid",
  );
  const solidCols = schema["ui:solid-columns"] ?? 10;
  const gradientCols = schema["ui:gradient-columns"] ?? 8;

  const onGradientChange = useCallback(
    (value: string) => {
      setGradientDir(value);
      if (currentValue?.color?.includes("gradient")) {
        onChange({
          ...currentValue,
          gradientDirection: value as ColorPresetSettings["gradientDirection"],
        });
      }
    },
    [currentValue, onChange],
  );

  return (
    <div className="flex justify-between flex-1 gap-2 flex-wrap">
      <FieldTitle title={title} description={description} />
      <div>
        <Popover.Root>
          <Popover.Trigger>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className={tx(
                  "rounded-full w-6 h-6 ring ring-transparent hover:ring-upstart-400 border border-upstart-300",
                  presets[currentValue?.color ?? "none"]?.className,
                )}
              />
            </div>
          </Popover.Trigger>
          <Popover.Content side="bottom" align="center" maxWidth="372px">
            <Tabs.Root defaultValue={tab} onValueChange={(value) => setTab(value as typeof tab)}>
              <Inset clip="padding-box" side="top" pb="current">
                {hasGradientPresets && (
                  <Tabs.List size="1">
                    <Tabs.Trigger value="solid" className="!flex-1">
                      Solid
                    </Tabs.Trigger>
                    <Tabs.Trigger value="gradient" className="!flex-1">
                      Gradient
                    </Tabs.Trigger>
                  </Tabs.List>
                )}
              </Inset>
              <Tabs.Content value="solid">
                <div className={`grid grid-cols-${solidCols} items-center gap-x-2 gap-y-2`}>
                  {Object.entries(presets)
                    .filter(([key]) => key.includes("gradient") === false)
                    .map(([key, { className, label }], index) => (
                      <button
                        key={index}
                        onClick={(e) => {
                          e.preventDefault();
                          onChange({
                            ...currentValue,
                            color: key,
                          });
                          // onChange(className);
                        }}
                        type="button"
                        className={tx(
                          className,

                          "h-7 w-7 rounded-full outline outline-2 relative inline-flex items-center justify-center shadow-sm shadow-upstart-300",
                          currentValue?.color === key
                            ? "outline-upstart-600"
                            : "outline-transparent hover:scale-105",
                        )}
                      >
                        {key === "none" && <RxCross2 className="h-4 w-4 text-red-700 opacity-50" />}
                      </button>
                    ))}
                </div>
              </Tabs.Content>
              <Tabs.Content value="gradient">
                <Select.Root defaultValue={gradientDir} size="1" onValueChange={onGradientChange}>
                  <Select.Trigger className="!w-full !mb-3" />
                  <Select.Content>
                    <Select.Group>
                      <Select.Label>Gradient direction</Select.Label>
                      <Select.Item value="bg-gradient-to-t">To top</Select.Item>
                      <Select.Item value="bg-gradient-to-b">To bottom</Select.Item>
                      <Select.Item value="bg-gradient-to-l">To left</Select.Item>
                      <Select.Item value="bg-gradient-to-r">To right</Select.Item>
                      <Select.Item value="bg-gradient-to-tl">To top left</Select.Item>
                      <Select.Item value="bg-gradient-to-tr">To top right</Select.Item>
                      <Select.Item value="bg-gradient-to-bl">To bottom left</Select.Item>
                      <Select.Item value="bg-gradient-to-br">To bottom right</Select.Item>
                    </Select.Group>
                  </Select.Content>
                </Select.Root>
                <div className={`grid grid-cols-${gradientCols} items-center gap-x-2 gap-y-2`}>
                  {Object.entries(presets)
                    .filter(([key]) => key.includes("gradient") === true)
                    .map(([key, { className, label }], index) => {
                      return (
                        <button
                          key={index}
                          onClick={(e) => {
                            e.preventDefault();
                            onChange({
                              gradientDirection: gradientDir as ColorPresetSettings["gradientDirection"],
                              color: key,
                            });
                            // onChange(classNameWidthDir);
                          }}
                          type="button"
                          className={tx(
                            className,
                            gradientDir,
                            "h-7 w-7 rounded-full outline outline-2 relative inline-flex items-center justify-center shadow-sm shadow-upstart-300",
                            currentValue?.color === key
                              ? "outline-upstart-600"
                              : "outline-transparent hover:scale-105",
                          )}
                        >
                          {key === "none" && <RxCross2 className="h-4 w-4 text-red-700 opacity-50" />}
                        </button>
                      );
                    })}
                </div>
              </Tabs.Content>
            </Tabs.Root>
          </Popover.Content>
        </Popover.Root>
      </div>
    </div>
  );
};

export default ColorPresetField;

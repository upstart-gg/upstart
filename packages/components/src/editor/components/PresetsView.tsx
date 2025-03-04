import {
  getPresetStyles,
  type StylePreset,
  type StyleProperties,
  stylePreset,
} from "@upstart.gg/sdk/shared/bricks/props/all";
import { tx } from "@upstart.gg/style-system/twind";
import { fieldLabel } from "./json-form/form-class";
import { Button, Text, Select, Tooltip, IconButton, SegmentedControl } from "@upstart.gg/style-system/system";
import { useState } from "react";

type PresetsViewProps = {
  onChoose: (presetStyles: StyleProperties) => void;
};

export default function PresetsView({ onChoose }: PresetsViewProps) {
  const [variant, setVariant] = useState<StylePreset["variant"]>("primary");

  const styles = Object.entries(stylePreset.properties.style.anyOf).map(([name, value]) => {
    return {
      name: value.title,
      value: value.const,
    };
  });

  return (
    <>
      <div className="flex flex-col gap-1 flex-1">
        <label className={fieldLabel}>Main color</label>
        <SegmentedControl.Root
          onValueChange={(value) => setVariant(value as StylePreset["variant"])}
          defaultValue={variant}
          size="1"
          className="w-full mt-1"
          radius="large"
        >
          {["primary", "secondary", "accent"].map((option) => (
            <SegmentedControl.Item
              key={option}
              value={option}
              className={tx("[&_.rt-SegmentedControlItemLabel]:px-1")}
            >
              <span className="capitalize">{option}</span>
            </SegmentedControl.Item>
          ))}
        </SegmentedControl.Root>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {styles.map((style) => {
          const preset = getPresetStyles({ style: style.value, variant });
          return (
            <div
              key={`${style.name}-${variant}`}
              className="bg-gray-200 transition-all duration-100 hover:(scale-105) rounded-lg gap-2 flex items-stretch justify-center h-16 text-gray-800 cursor-pointer"
              onClick={() => onChoose(preset)}
            >
              <div
                className={tx(
                  "flex flex-1 flex-col items-center justify-center",
                  preset?.background?.color,
                  preset?.border?.color,
                  preset?.border?.radius,
                  preset?.border?.style,
                  preset?.border?.width,
                  preset?.text?.color,
                  preset?.effects?.shadow,
                )}
              >
                <h2 className="text-center text-xs font-medium select-none">{style.name}</h2>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

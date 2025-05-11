import type { StylePreset } from "@upstart.gg/sdk/shared/bricks/props/_style-presets";
import { fieldLabel } from "./json-form/form-class";
import { SegmentedControl } from "@upstart.gg/style-system/system";
import { useEffect, useRef, useState } from "react";
import type { Brick } from "@upstart.gg/sdk/shared/bricks";
import { useBrickManifest } from "~/shared/hooks/use-brick-manifest";
import { useDraftHelpers } from "../hooks/use-editor";
import { getTextContrastedColor } from "@upstart.gg/sdk/shared/themes/color-system";
import clsx from "clsx";

// type PresetsViewProps = {
//   onChoose: (presetStyles: StyleProperties) => void;
// };

type BrickPresetsViewProps = {
  brick: Brick;
};

/**
 * Deeply replace every <variant> and <tone> string in all values
 */
function processPresetProps(props: Brick["props"], variant: string) {
  const newProps = { ...props };
  for (const [key, value] of Object.entries(newProps)) {
    if (typeof value === "string") {
      newProps[key] = value.replace(/<variant>/g, variant);
    } else if (Array.isArray(value)) {
      newProps[key] = value.map((v) => {
        if (typeof v === "string") {
          return v.replace(/<variant>/g, variant);
        }
        return v;
      });
    } else if (typeof value === "object" && value !== null) {
      newProps[key] = processPresetProps(value as Brick["props"], variant);
    } else {
      newProps[key] = value;
    }
  }
  return newProps;
}

type Tone = "extralight" | "light" | "medium" | "dark" | "extradark";

const tones: Record<Tone, { label: string; value: number }> = {
  extralight: { label: "Extra Light", value: 50 },
  light: { label: "Light", value: 200 },
  medium: { label: "Medium", value: 400 },
  dark: { label: "Dark", value: 600 },
  extradark: { label: "Extra Dark", value: 800 },
};

export default function PresetsView({ brick }: BrickPresetsViewProps) {
  const [variant, setVariant] = useState<StylePreset["variant"]>("primary");
  const manifest = useBrickManifest(brick.type);
  const ref = useRef<HTMLDivElement>(null);
  const { updateBrickProps } = useDraftHelpers();

  const { presets } = manifest;

  const onChoose = (preset: { props: Brick["props"] }, variant: string) => {
    const styleProps = processPresetProps(preset.props, variant);
    updateBrickProps(brick.id, styleProps);
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (ref.current) {
      const elements = ref.current.querySelectorAll<HTMLElement>("[data-preset-preview]");
      elements.forEach((el) => {
        const chosenColor = getTextContrastedColor(el);
        el.style.setProperty("--up-color-auto", `${chosenColor}`);
      });
    }
  }, [variant]);

  return (
    <div className="flex flex-col gap-3 flex-1 p-10 justify-start" ref={ref}>
      <div className="flex justify-between items-center">
        <label className="text-lg font-bold">{manifest.name} Presets</label>
        <div className="flex gap-3">
          <div className="flex flex-col gap-1">
            <SegmentedControl.Root
              onValueChange={(value) => setVariant(value as StylePreset["variant"])}
              defaultValue={variant}
              size="1"
              className="w-full mt-1"
              radius="large"
            >
              {["primary", "secondary", "accent", "neutral"].map((option) => (
                <SegmentedControl.Item
                  key={option}
                  value={option}
                  className={clsx("[&_.rt-SegmentedControlItemLabel]:px-1.5")}
                >
                  <span className="capitalize">{option}</span>
                </SegmentedControl.Item>
              ))}
            </SegmentedControl.Root>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-5 mt-6">
        {Object.entries(presets ?? {}).map(([presetId, preset]) => {
          return (
            <div
              key={`${presetId}`}
              className="outline outline-primary-200 outline-offset-4 transition-all duration-100 hover:(scale-105) rounded gap-2 flex items-stretch justify-center h-16 text-gray-800 cursor-pointer"
              onClick={() => onChoose(preset, variant)}
            >
              <div
                data-preset-preview
                className={clsx(
                  "flex flex-1 flex-col items-center justify-center rounded text-center p-2",
                  preset.previewClasses.replace(/<variant>/g, variant),
                )}
              >
                <h2 className="text-center text-xs font-medium select-none text-pretty">{preset.label}</h2>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

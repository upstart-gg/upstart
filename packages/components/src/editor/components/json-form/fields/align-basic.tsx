import type { FieldProps } from "./types";
import type { AlignBasicSettings } from "@upstart.gg/sdk/shared/bricks/props/align";
import { fieldLabel } from "../form-class";
import { SegmentedControl } from "@upstart.gg/style-system/system";
import {
  PiAlignCenterVertical,
  PiAlignBottom,
  PiAlignTop,
  PiAlignLeft,
  PiAlignRight,
  PiAlignCenterHorizontal,
} from "react-icons/pi";
import type { FC } from "react";

export const AlignBasicField: FC<FieldProps<AlignBasicSettings>> = (props) => {
  const {
    currentValue = {
      horizontal: "justify-start",
      vertical: "items-center",
    },
    onChange,
    required,
    title,
    description,
    placeholder,
    schema,
  } = props;

  const onSettingsChange = (newVal: Partial<AlignBasicSettings>) => {
    const newProps = { ...currentValue, ...newVal };
    onChange(newProps);
  };

  return (
    <div className="layout-field basis-full">
      <div className="flex items-start flex-wrap gap-x-4 gap-y-1">
        {!schema["ui:no-horizontal-align"] && (
          <div className="flex flex-col gap-1 flex-1">
            <label className={fieldLabel}>{schema["ui:horizontal-align-label"] ?? "Horizontal align"}</label>
            <SegmentedControl.Root
              onValueChange={(value) =>
                onSettingsChange({ horizontal: value as AlignBasicSettings["horizontal"] })
              }
              defaultValue={currentValue.horizontal}
              size="1"
              className="w-full !max-w-full mt-0.5"
              radius="large"
            >
              {/* biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
              {schema.properties.horizontal.anyOf.map((option: any) => (
                <SegmentedControl.Item
                  key={option.const}
                  value={option.const}
                  className="[&_.rt-SegmentedControlItemLabel]:px-1"
                >
                  {option.const === "justify-start" && <PiAlignLeft className="w-4 h-4" />}
                  {option.const === "justify-center" && <PiAlignCenterHorizontal className="w-4 h-4" />}
                  {option.const === "justify-end" && <PiAlignRight className="w-4 h-4" />}
                </SegmentedControl.Item>
              ))}
            </SegmentedControl.Root>
          </div>
        )}

        {!schema["ui:no-vertical-align"] && (
          <div className="flex flex-col gap-1 flex-1">
            <label className={fieldLabel}>{schema["ui:vertical-align-label"] ?? "Vertical align"}</label>
            <SegmentedControl.Root
              onValueChange={(value) => onSettingsChange({ vertical: value as AlignBasicSettings["vertical"] })}
              defaultValue={currentValue.vertical}
              size="1"
              className="w-full !max-w-full mt-0.5"
              radius="large"
            >
              {/* biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
              {schema.properties.vertical.anyOf.map((option: any) => (
                <SegmentedControl.Item
                  key={option.const}
                  value={option.const}
                  className="[&_.rt-SegmentedControlItemLabel]:px-1"
                >
                  {option.const === "items-start" && <PiAlignTop className="w-4 h-4" />}
                  {option.const === "items-center" && <PiAlignCenterVertical className="w-4 h-4" />}
                  {option.const === "items-end" && <PiAlignBottom className="w-4 h-4" />}
                </SegmentedControl.Item>
              ))}
            </SegmentedControl.Root>
          </div>
        )}
      </div>
    </div>
  );
};

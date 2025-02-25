import type { FieldProps } from "./types";
import { Text, Select, Slider } from "@upstart.gg/style-system/system";
import type { LayoutSettings, AlignBasicSettings } from "@upstart.gg/sdk/shared/bricks/props/style-props";
import { fieldLabel } from "../form-class";
import { SegmentedControl } from "@upstart.gg/style-system/system";
import { tx } from "@upstart.gg/style-system/twind";
import {
  PiAlignCenterVertical,
  PiAlignBottom,
  PiAlignTop,
  PiAlignLeft,
  PiAlignRight,
  PiAlignCenterHorizontal,
} from "react-icons/pi";

export const AlignBasicField: React.FC<FieldProps<AlignBasicSettings>> = (props) => {
  const {
    currentValue = {
      horizontal: "start",
      vertical: "start",
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
    <div className="layout-field">
      {description && (
        <Text as="p" color="gray" size="1">
          {description}
        </Text>
      )}
      <div className="flex items-start flex-wrap gap-x-4 gap-y-1">
        <div className="flex flex-col gap-1 flex-1">
          <label className={fieldLabel}>Horizontal</label>

          <SegmentedControl.Root
            onValueChange={(value) =>
              onSettingsChange({ horizontal: value as AlignBasicSettings["horizontal"] })
            }
            defaultValue={currentValue.horizontal}
            size="1"
            className="w-full !max-w-full mt-1"
            radius="large"
          >
            {/* biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
            {schema.properties.horizontal.anyOf.map((option: any) => (
              <SegmentedControl.Item
                key={option.const}
                value={option.const}
                className={tx("[&_.rt-SegmentedControlItemLabel]:px-1")}
              >
                {option.const === "start" && <PiAlignLeft className="w-4 h-4" />}
                {option.const === "center" && <PiAlignCenterHorizontal className="w-4 h-4" />}
                {option.const === "end" && <PiAlignRight className="w-4 h-4" />}
              </SegmentedControl.Item>
            ))}
          </SegmentedControl.Root>
        </div>

        <div className="flex flex-col gap-1 flex-1">
          <label className={fieldLabel}>Vertical</label>
          <SegmentedControl.Root
            onValueChange={(value) => onSettingsChange({ vertical: value as AlignBasicSettings["vertical"] })}
            defaultValue={currentValue.vertical}
            size="1"
            className="w-full !max-w-full mt-1"
            radius="large"
          >
            {/* biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
            {schema.properties.vertical.anyOf.map((option: any) => (
              <SegmentedControl.Item
                key={option.const}
                value={option.const}
                className={tx("[&_.rt-SegmentedControlItemLabel]:px-1")}
              >
                {option.const === "start" && <PiAlignTop className="w-4 h-4" />}
                {option.const === "center" && <PiAlignCenterVertical className="w-4 h-4" />}
                {option.const === "end" && <PiAlignBottom className="w-4 h-4" />}
              </SegmentedControl.Item>
            ))}
          </SegmentedControl.Root>
        </div>
      </div>
    </div>
  );
};

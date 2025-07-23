import { Popover, Tooltip } from "@upstart.gg/style-system/system";
import type { FieldProps } from "./types";
import type { ColorPresets } from "@upstart.gg/sdk/bricks/props/preset";
import { FieldTitle } from "../field-factory";
import { tx } from "@upstart.gg/style-system/twind";
import type { FC } from "react";
import { RxCross2 } from "react-icons/rx";

const ColorPresetField: FC<FieldProps<string>> = (props) => {
  const { schema, currentValue, formData, onChange, required, title, description } = props;
  const presets = schema["ui:presets"] as ColorPresets;

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
                  "rounded-full w-6 h-6 ring ring-transparent hover:ring-upstart-400 border border-gray-200",
                  currentValue ? presets[currentValue]?.previewBgClass : "bg-transparent",
                )}
              />
            </div>
          </Popover.Trigger>
          <Popover.Content side="bottom" align="center" maxWidth="212px">
            <div className="flex items-center gap-x-[7px] gap-y-2 flex-wrap">
              {Object.entries(presets).map(([key, { previewBgClass: className, label }]) => (
                <Tooltip
                  key={key}
                  content={<span className="block text-xs p-0.5">{label}</span>}
                  className="!z-[10000]"
                  delayDuration={300}
                >
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      onChange(key);
                    }}
                    type="button"
                    className={tx(
                      className,
                      "h-6 w-6 rounded-full outline outline-offset-1  shadow-upstart-300 relative inline-flex items-center justify-center",
                      `hover:opacity-90`,
                      currentValue === key ? "outline-2 outline-upstart-500" : "outline-1 outline-gray-300",
                    )}
                  >
                    {!className && <RxCross2 className="h-4 w-4 text-red-700 opacity-50" />}
                  </button>
                </Tooltip>
              ))}
            </div>
          </Popover.Content>
          {/* <ColorBasePopover colorType={colorType} side={side} align={align} color={color} onChange={onChange} /> */}
        </Popover.Root>
      </div>
    </div>
  );
};

export default ColorPresetField;

import type { FieldProps } from "./types";
import { Text } from "@upstart.gg/style-system/system";
import type { BorderSettings } from "@upstart.gg/sdk/shared/bricks/props/border";
import { fieldLabel } from "../form-class";
import { tx } from "@upstart.gg/style-system/twind";
import { MdBorderBottom, MdBorderLeft, MdBorderRight, MdBorderTop } from "react-icons/md";
import { useState } from "react";

export const BorderSideField: React.FC<FieldProps<BorderSettings["side"]>> = (props) => {
  const { currentValue = [], onChange, title, description, schema } = props;
  const onSettingsChange = (newVal: Partial<BorderSettings>) => onChange({ ...currentValue, ...newVal });

  const [currentSide, setSide] = useState<string[]>(currentValue);

  return (
    <div className="border-side-field flex flex-1">
      <div className="flex justify-between items-center flex-1">
        <label className={fieldLabel}>{schema.title ?? "Sides"}</label>
        <div className="inline-flex divide-x divide-gray-300 dark:divide-dark-500 rounded bg-gray-100 border grow-0 border-gray-300 max-w-min">
          {/* biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
          {schema.items.anyOf.map((option: any) => (
            <button
              type="button"
              key={option.const}
              onClick={() => {
                const side = currentSide.includes(option.const)
                  ? currentSide.filter((s) => s !== option.const)
                  : [...currentSide, option.const];
                setSide(side);
                onSettingsChange({
                  side,
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
  );
};

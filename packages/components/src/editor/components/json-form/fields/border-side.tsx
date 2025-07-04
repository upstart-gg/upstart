import type { FieldProps } from "./types";
import type { BorderSettings } from "@upstart.gg/sdk/shared/bricks/props/border";
import { MdBorderBottom, MdBorderLeft, MdBorderRight, MdBorderTop } from "react-icons/md";
import { FieldTitle } from "../field-factory";
import { tx } from "@upstart.gg/style-system/twind";
import type { FC } from "react";
import { normalizeSchemaEnum } from "@upstart.gg/sdk/shared/utils/schema";

export const BorderSideField: FC<FieldProps<BorderSettings["sides"]>> = (props) => {
  const { currentValue = [], onChange, title, description, schema } = props;

  console.log("border side schema", schema);

  return (
    <div className="border-side-field flex flex-1">
      <div className="flex justify-between items-center flex-1">
        <FieldTitle title={title ?? "Sides"} description={description} />
        <div className="inline-flex divide-x divide-gray-300 dark:divide-dark-500 rounded bg-gray-100 border grow-0 border-gray-300 max-w-min">
          {/* biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
          {normalizeSchemaEnum(schema.items).map((option: any) => (
            <button
              type="button"
              key={option.const}
              onClick={() => {
                const side = currentValue.includes(option.const)
                  ? currentValue.filter((s) => s !== option.const)
                  : [...currentValue.filter((s) => s !== option.const), option.const];

                onChange(side);
              }}
              className={tx(
                "p-1 px-2 inline-flex  first:rounded-l last:rounded-r",
                currentValue.includes(option.const)
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

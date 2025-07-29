import { SegmentedControl, Tooltip } from "@upstart.gg/style-system/system";
import type { FieldProps } from "./types";
import { Select } from "@upstart.gg/style-system/system";
import { FieldTitle } from "../field-factory";
import { tx } from "@upstart.gg/style-system/twind";
import type { FC } from "react";
import { normalizeSchemaEnum } from "@upstart.gg/sdk/shared/utils/schema";
import { Icon } from "@iconify/react/dist/iconify.js";

interface EnumOption {
  const: string;
  title: string;
  description?: string;
  "ui:icon"?: string;
  "ui:hidden-option"?: boolean;
}

const EnumField: FC<FieldProps<string> & { noFieldGrow?: boolean }> = (props) => {
  const { schema, currentValue, formData, onChange, title, description, noFieldGrow } = props;

  // console.log("EnumField props", schema);
  // const context = formContext as { brickId: Brick["id"] };
  // const brick = draft.getBrick(context.brickId);

  // if (!brick) {
  //   return null;
  // }

  // Extract options from the schema
  const options: EnumOption[] = normalizeSchemaEnum(schema) ?? [];
  // (schema.anyOf ?? schema.oneOf ?? schema.enum)?.map((option: any, index: number) => ({
  //   const: typeof option === "string" ? option : option.const,
  //   title: typeof option === "string" ? (schema.enumNames ?? []).at(index) : option.title || option.const,
  //   description: option.description || "",
  //   icon: option.icon || "",
  //   "ui:hidden-option": option["ui:hidden-option"],
  // })) || [];

  const displayAs: "select" | "radio" | "button-group" | "icon-group" =
    schema["ui:display"] ?? (options.length > 3 ? "select" : "button-group");

  switch (displayAs) {
    case "radio":
      return (
        <div className="radio-field">
          <FieldTitle title={title} description={description} />
          <div className="flex flex-col gap-2">
            {options
              .filter((o) => !o["ui:hidden-option"])
              .map((option) => (
                <div key={option.const} className="">
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      value={option.const}
                      checked={currentValue === option.const}
                      onChange={() => onChange(option.const)}
                      className="form-radio mr-1 text-upstart-600 ring-upstart-600 focus:ring-transparent"
                    />
                    <span className="font-medium">{option.title}</span>
                  </label>
                  {option.description && (
                    <p className="text-sm text-gray-500 leading-tight select-none">{option.description}</p>
                  )}
                </div>
              ))}
          </div>
        </div>
      );

    case "button-group": {
      return (
        <div
          className={tx("button-group-field flex-1 flex justify-between gap-2", !noFieldGrow && "flex-grow")}
        >
          <FieldTitle title={title} description={description} />
          <SegmentedControl.Root
            onValueChange={onChange}
            defaultValue={currentValue as string}
            size="1"
            radius="medium"
            className="!h-[26px]"
          >
            {options
              .filter((o) => !o["ui:hidden-option"])
              .map((option) => (
                <SegmentedControl.Item
                  key={option.const}
                  value={option.const}
                  className={tx("[&_.rt-SegmentedControlItemLabel]:(px-[7px])")}
                >
                  {option.title}
                </SegmentedControl.Item>
              ))}
          </SegmentedControl.Root>
        </div>
      );
    }

    case "icon-group":
      return (
        <div
          className={tx(
            "icon-group-field flex flex-grow shrink-0 justify-between gap-2",
            !noFieldGrow && "flex-grow",
          )}
        >
          <FieldTitle title={title} description={description} />
          <SegmentedControl.Root
            onValueChange={onChange}
            defaultValue={currentValue}
            size="1"
            radius="medium"
            className="!h-[26px]"
          >
            {options
              .filter((o) => !o["ui:hidden-option"])
              .map((option) => (
                <SegmentedControl.Item
                  key={option.const}
                  value={option.const}
                  className={tx("[&_.rt-SegmentedControlItemLabel]:px-[6px]")}
                >
                  <Tooltip
                    content={<span className="block text-xs p-0.5">{option.title}</span>}
                    className="!z-[99999]"
                    key={option.const}
                  >
                    {/* KEEP THIS DIV OTHERWISE TOOLTIP WILL NOT WORK */}
                    <div>
                      {option["ui:icon"] ? (
                        <Icon icon={option["ui:icon"] as string} className="w-5 h-5 pointer-events-none" />
                      ) : (
                        option.title
                      )}
                    </div>
                  </Tooltip>
                </SegmentedControl.Item>
              ))}

            {/* </Tooltip> */}
          </SegmentedControl.Root>
        </div>
      );

    default:
      return (
        <div className={tx("flex justify-between pr-1 gap-4", !noFieldGrow && "flex-grow")}>
          <FieldTitle title={title} description={description} />
          <Select.Root defaultValue={currentValue} size="2" onValueChange={(value) => onChange(value)}>
            <Select.Trigger
              radius="large"
              variant="ghost"
              placeholder={schema["ui:placeholder"] ?? "Not specified"}
            />
            <Select.Content position="popper">
              <Select.Group>
                {options
                  .filter((o) => !o["ui:hidden-option"])
                  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                  .map((option: any) => (
                    <Select.Item key={option.const} value={option.const}>
                      {option.title}
                    </Select.Item>
                  ))}
              </Select.Group>
            </Select.Content>
          </Select.Root>
        </div>
      );
  }
};

export default EnumField;

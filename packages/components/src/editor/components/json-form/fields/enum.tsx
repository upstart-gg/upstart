import { SegmentedControl } from "@upstart.gg/style-system/system";
import type { FieldProps } from "./types";
import { Select } from "@upstart.gg/style-system/system";
import { FieldTitle } from "../field-factory";
import { tx } from "@upstart.gg/style-system/twind";
import type { FC } from "react";
import { normalizeSchemaEnum } from "@upstart.gg/sdk/shared/utils/schema";

interface EnumOption {
  const: string;
  title: string;
  description?: string;
  icon?: string;
  "ui:hidden-option"?: boolean;
}

const EnumField: FC<FieldProps<string>> = (props) => {
  const { schema, currentValue, formData, onChange, required, title, description } = props;

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
          <div className="flex flex-col gap-2 mt-1.5">
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
                      required={required}
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
        <div className="button-group-field flex-1 flex justify-between flex-wrap gap-1">
          <FieldTitle title={title} description={description} />
          <SegmentedControl.Root
            onValueChange={onChange}
            defaultValue={currentValue as string}
            size="1"
            radius="medium"
          >
            {options
              .filter((o) => !o["ui:hidden-option"])
              .map((option) => (
                <SegmentedControl.Item key={option.const} value={option.const}>
                  {option.title}
                </SegmentedControl.Item>
              ))}
          </SegmentedControl.Root>
        </div>
      );
    }

    case "icon-group":
      return (
        <div className="icon-group-field">
          <FieldTitle title={title} description={description} />
          <div className="flex divide-x divide-white dark:divide-dark-500">
            {options
              .filter((o) => !o["ui:hidden-option"])
              .map((option) => (
                <button
                  key={option.const}
                  type="button"
                  className={tx(
                    `text-sm first:rounded-l last:rounded-r py-0.5 flex-1 flex items-center justify-center`,
                    {
                      "bg-upstart-600 text-white": currentValue === option.const,
                      "bg-gray-200 hover:bg-gray-300 dark:bg-dark-600 dark:hover:bg-dark-500 text-gray-500 dark:text-white/50":
                        currentValue !== option.const,
                    },
                  )}
                  onClick={() => onChange(option.const)}
                >
                  <span
                    className="w-7 h-7 p-0.5"
                    /* biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation> */
                    dangerouslySetInnerHTML={{ __html: option.icon ?? "" }}
                  />
                </button>
              ))}
          </div>
        </div>
      );

    default:
      return (
        <div className="flex justify-between flex-1 pr-1 gap-1">
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

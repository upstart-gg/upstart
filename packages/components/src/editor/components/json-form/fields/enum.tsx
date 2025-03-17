import { SegmentedControl } from "@upstart.gg/style-system/system";
import { tx } from "@upstart.gg/style-system/twind";
import type { FieldProps } from "./types";
import { fieldLabel } from "../form-class";
import { Select } from "@upstart.gg/style-system/system";
import { HelpIcon } from "../HelpIcon";

interface EnumOption {
  const: string;
  title: string;
  description: string;
  icon: string;
  "ui:hidden-option"?: boolean;
}

const EnumField: React.FC<FieldProps<string>> = (props) => {
  const { schema, currentValue, formData, onChange, required, title, description } = props;
  // const context = formContext as { brickId: Brick["id"] };
  // const brick = draft.getBrick(context.brickId);

  // if (!brick) {
  //   return null;
  // }

  // Extract options from the schema
  const options: EnumOption[] =
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    (schema.anyOf ?? schema.oneOf)?.map((option: any) => ({
      const: option.const,
      title: option.title || option.const,
      description: option.description || "",
      icon: option.icon || "",
      min: option.minimum,
      max: option.maximum,
      "ui:hidden-option": option["ui:hidden-option"],
    })) || [];

  const displayAs: "select" | "radio" | "button-group" | "icon-group" =
    schema["ui:display"] ?? (options.length > 3 ? "select" : "button-group");

  switch (displayAs) {
    case "radio":
      return (
        <div className="radio-field">
          {title && (
            <div className="flex gap-1 items-center">
              <label className={fieldLabel}>{title}</label>
              {description && <HelpIcon help={description} />}
            </div>
          )}
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

    case "button-group":
      return (
        <div className="button-group-field flex-1 flex justify-between">
          {title && (
            <div className="flex gap-1 items-center flex-1">
              <label className={fieldLabel}>{title}</label>
              {/* {description && <HelpIcon help={description} />} */}
            </div>
          )}
          <SegmentedControl.Root
            onValueChange={onChange}
            defaultValue={currentValue as string}
            size="1"
            radius="large"
          >
            {options
              .filter((o) => !o["ui:hidden-option"])
              .map((option) => (
                <SegmentedControl.Item
                  key={option.const}
                  value={option.const}
                  className={tx("[&_.rt-SegmentedControlItemLabel]:px-1.5")}
                >
                  {option.title}
                </SegmentedControl.Item>
              ))}
          </SegmentedControl.Root>
        </div>
      );

    case "icon-group":
      return (
        <div className="icon-group-field">
          {title && (
            <div className="flex gap-1 items-center">
              <label className={fieldLabel}>{title}</label>
              {description && <HelpIcon help={description} />}
            </div>
          )}
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
                    dangerouslySetInnerHTML={{ __html: option.icon }}
                  />
                </button>
              ))}
          </div>
        </div>
      );

    default:
      return (
        <div className="flex justify-between flex-1 pr-1">
          <label className={fieldLabel}>{title}</label>
          <Select.Root defaultValue={currentValue} size="2" onValueChange={(value) => onChange(value)}>
            <Select.Trigger radius="large" variant="ghost" />
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

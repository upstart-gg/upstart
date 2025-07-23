import type { DatarecordSettings } from "@upstart.gg/sdk/shared/bricks/props/datarecord";
import { IconButton, Select } from "@upstart.gg/style-system/system";
import type { FC } from "react";
import { BsDatabaseAdd } from "react-icons/bs";
import { useDatarecord, useDatarecords } from "~/editor/hooks/use-datarecord";
import { useEditorHelpers } from "~/editor/hooks/use-editor";
import { fieldLabel } from "../form-class";
import type { FieldProps } from "./types";

export const DatarecordField: FC<FieldProps<DatarecordSettings | undefined>> = (props) => {
  const { currentValue, onChange, required, title, description, placeholder, schema } = props;
  const editorHelpers = useEditorHelpers();
  const { options } = useDatarecords();

  const onSettingsChange = (newVal: string) => {
    // console.log("DatarecordField onSettingsChange", newVal);
    onChange(newVal);
  };

  return (
    <div className="layout-field basis-full">
      <div className="flex items-start text-center flex-wrap gap-x-4 gap-y-1">
        <div className="flex justify-between gap-1 flex-1">
          <label className={fieldLabel}>Database</label>
          <Select.Root
            defaultValue={currentValue}
            size="2"
            onValueChange={(value: string) => onSettingsChange(value)}
          >
            <Select.Trigger
              radius="large"
              variant="ghost"
              placeholder={schema["ui:placeholder"] ?? "Select a database"}
            />
            <Select.Content position="popper">
              <Select.Group>
                {options
                  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                  .map((option: any) => (
                    <Select.Item key={option.value} value={option.value}>
                      {option.label}
                    </Select.Item>
                  ))}
              </Select.Group>
            </Select.Content>
          </Select.Root>
        </div>
        <IconButton
          type="button"
          onClick={() => {
            editorHelpers.onShowPopup?.("add-form-schema");
          }}
          variant="ghost"
          size="1"
          mr="2"
          radius="large"
          aria-label="Create new datarecord"
        >
          <BsDatabaseAdd size={20} />
        </IconButton>
      </div>
    </div>
  );
};

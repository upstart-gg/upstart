import type { DatarecordSettings } from "@upstart.gg/sdk/shared/bricks/props/datarecord";
import { IconButton, Select } from "@upstart.gg/style-system/system";
import type { FC } from "react";
import { BsDatabaseAdd } from "react-icons/bs";
import { useDraft, useEditorHelpers } from "~/editor/hooks/use-editor";
import { fieldLabel } from "../form-class";
import type { FieldProps } from "./types";

export const DatarecordField: FC<FieldProps<DatarecordSettings | undefined>> = (props) => {
  const { currentValue, onChange, required, title, description, placeholder, schema } = props;
  const editorHelpers = useEditorHelpers();

  const draft = useDraft();
  // console.log("DatarecordField draft", draft.datarecords);
  const options = draft.datarecords
    ? Object.values(draft.datarecords).map((record) => ({
        value: record.id,
        label: record.label,
      }))
    : [];
  // console.log("DatarecordField options", options);

  const onSettingsChange = (newVal: Partial<DatarecordSettings>) => {
    // onChange();
  };

  return (
    <div className="layout-field basis-full">
      <div className="flex items-start text-center flex-wrap gap-x-4 gap-y-1">
        <div className="flex justify-between gap-1 flex-1">
          <label className={fieldLabel}>Database</label>
          <Select.Root defaultValue={currentValue} size="2" onValueChange={(value) => onChange(value)}>
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
        <button
          type="button"
          onClick={() => {
            editorHelpers.onShowPopup?.("add-form-schema");
          }}
        >
          <IconButton variant="ghost" size="1" mr="2" radius="large" aria-label="Create new datarecord">
            <BsDatabaseAdd size={20} />
          </IconButton>
        </button>
      </div>
    </div>
  );
};

import type { FieldProps } from "./types";
import { TextField, TextArea } from "@upstart.gg/style-system/system";
import { TbSlash } from "react-icons/tb";
import { fieldLabel } from "../form-class";
import { Text } from "@upstart.gg/style-system/system";
import { HelpIcon } from "../HelpIcon";

export const StringField: React.FC<FieldProps<string>> = (props) => {
  const { currentValue, onChange, required, title, description, placeholder, schema } = props;

  return (
    <div className="field field-string basis-full">
      {title && (
        <div className="flex items-center justify-between">
          <label className={fieldLabel}>{title}</label>
          {description && <HelpIcon help={description} />}
        </div>
      )}
      {schema["ui:multiline"] ? (
        <TextArea
          defaultValue={currentValue}
          onChange={(e) => onChange(e.target.value)}
          className="!mt-1 scrollbar-thin"
          required={required}
          placeholder={placeholder}
          resize="vertical"
          spellCheck={!!schema["ui:spellcheck"]}
        />
      ) : (
        <TextField.Root
          defaultValue={currentValue}
          onChange={(e) => onChange(e.target.value)}
          className="!mt-1"
          required={required}
          placeholder={placeholder}
          spellCheck={!!schema["ui:spellcheck"]}
        />
      )}
    </div>
  );
};

export const PathField: React.FC<FieldProps<string>> = (props) => {
  const { currentValue, onChange, required, title, description, placeholder } = props;

  // remove leading slash
  const path = (currentValue || "").toString().replace(/^\//, "");

  return (
    <div className="field field-string">
      {title && (
        <div>
          <label className={fieldLabel}>{title}</label>
          {description && (
            <Text as="p" color="gray" size="1">
              {description}
            </Text>
          )}
        </div>
      )}
      <TextField.Root
        defaultValue={path}
        onChange={(e) => onChange(e.target.value)}
        className="!mt-1.5"
        required={required}
        placeholder={placeholder}
      >
        <TextField.Slot>
          <TbSlash className="bg-transparent h-5 w-5 rounded-md stroke-1 !-ml-1 !-mr-1" />
        </TextField.Slot>
      </TextField.Root>
    </div>
  );
};

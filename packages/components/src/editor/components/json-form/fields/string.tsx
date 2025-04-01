import type { FieldProps } from "./types";
import { TextField, TextArea } from "@upstart.gg/style-system/system";
import { TbSlash } from "react-icons/tb";
import { fieldLabel } from "../form-class";
import { Text } from "@upstart.gg/style-system/system";
import { HelpIcon } from "../HelpIcon";
import { useDebounceCallback } from "usehooks-ts";
import { FieldTitle } from "../field-factory";

export const StringField: React.FC<FieldProps<string>> = (props) => {
  const { currentValue, onChange, required, title, description, placeholder, schema } = props;

  const onChangeDebounced = useDebounceCallback(onChange, 300);

  return (
    <div className="field field-string basis-full">
      <FieldTitle title={title} description={description} />
      {schema["ui:multiline"] ? (
        <TextArea
          defaultValue={currentValue}
          onChange={(e) => onChangeDebounced(e.target.value)}
          className="!mt-1 scrollbar-thin"
          required={required}
          placeholder={placeholder}
          resize="vertical"
          spellCheck={!!schema["ui:spellcheck"]}
        />
      ) : (
        <TextField.Root
          defaultValue={currentValue}
          onChange={(e) => onChangeDebounced(e.target.value)}
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
  const onChangeDebounced = useDebounceCallback(onChange, 300);
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
        onChange={(e) => onChangeDebounced(e.target.value)}
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

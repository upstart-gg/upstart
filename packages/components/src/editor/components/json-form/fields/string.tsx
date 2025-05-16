import type { FieldProps } from "./types";
import { TextField, TextArea, SegmentedControl, Select } from "@upstart.gg/style-system/system";
import { TbSlash } from "react-icons/tb";
import { fieldLabel } from "../form-class";
import { Text } from "@upstart.gg/style-system/system";
import { HelpIcon } from "../HelpIcon";
import { useDebounceCallback } from "usehooks-ts";
import { FieldTitle } from "../field-factory";
import { tx } from "@upstart.gg/style-system/twind";
import type { UrlOrPageIdSettings } from "@upstart.gg/sdk/shared/bricks/props/string";
import { useState } from "react";
import { usePagesMap } from "~/editor/hooks/use-editor";

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
          className={tx("!mt-1 scrollbar-thin", schema["ui:textarea-class"])}
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
    <div className="field field-path basis-full">
      <FieldTitle title={title} description={description} />
      <TextField.Root
        defaultValue={path}
        onChange={(e) => onChangeDebounced(e.target.value)}
        className="!mt-1.5"
        required={required}
        placeholder={placeholder}
      >
        <TextField.Slot>
          <TbSlash className="bg-transparent h-5 w-5 rounded-md stroke-1 !-ml-1 !-mr-2 -rotate-[20deg]" />
        </TextField.Slot>
      </TextField.Root>
    </div>
  );
};

export const UrlOrPageIdField: React.FC<FieldProps<UrlOrPageIdSettings | null>> = (props) => {
  const { currentValue, onChange, required, title, description, placeholder, schema } = props;
  const pagesMap = usePagesMap();
  const [type, setType] = useState<"url" | "pageId">(
    currentValue?.startsWith("http") || pagesMap.length === 1 ? "url" : "pageId",
  );

  return (
    <div className="flex-1">
      <div className="flex justify-between flex-1 pr-1 gap-1">
        <FieldTitle title={title} description={description} />
        <SegmentedControl.Root
          onValueChange={(value) => setType(value as "url" | "pageId")}
          defaultValue={type}
          size="1"
          className="mt-0.5"
          radius="large"
        >
          <SegmentedControl.Item value="url">External URL</SegmentedControl.Item>
          <SegmentedControl.Item value="pageId">Internal page</SegmentedControl.Item>
        </SegmentedControl.Root>
      </div>
      {type === "url" ? (
        <TextField.Root
          defaultValue={currentValue?.startsWith("http") ? currentValue : ""}
          onChange={(e) => onChange(e.target.value)}
          className="!mt-2"
          required={required}
          placeholder="https://example.com"
          spellCheck={!!schema["ui:spellcheck"]}
        />
      ) : (
        <Select.Root
          defaultValue={currentValue ?? undefined}
          size="2"
          onValueChange={(value) => onChange(value)}
        >
          <Select.Trigger
            radius="large"
            variant="surface"
            className="!mt-2 !w-full"
            placeholder="Select a page"
          />
          <Select.Content position="popper">
            <Select.Group>
              {Object.entries(pagesMap).map(([, page]) => (
                <Select.Item key={page.id} value={page.label}>
                  {page.label}
                </Select.Item>
              ))}
            </Select.Group>
          </Select.Content>
        </Select.Root>
      )}
    </div>
  );
};

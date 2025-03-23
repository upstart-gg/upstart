import type { FieldProps } from "./types";
import { nanoid } from "nanoid";
import { Button, TextField, Tooltip, IconButton, Select } from "@upstart.gg/style-system/system";
import { useMemo, useState } from "react";
import ModalSearchImage from "~/editor/components/ModalSearchImage";
import type { ImageProps } from "@upstart.gg/sdk/shared/bricks/props/image";
import { IoIosHelpCircleOutline } from "react-icons/io";
import { fieldLabel } from "../form-class";
import trans from "./trans.svg?url";
import { debounce } from "lodash-es";

const ImageField: React.FC<FieldProps<ImageProps>> = (props) => {
  const { schema, formData, onChange, required, title, description, currentValue } = props;
  const [showSearch, setShowSearch] = useState(false);
  const id = useMemo(() => nanoid(), []);
  // const [src, setSrc] = useState<string | null>(currentValue.src);

  const onPropsChange = (newVal: Partial<ImageProps>) => {
    onChange({ ...(currentValue ?? {}), ...newVal });
  };

  const debouncedOnPropsChange = debounce(onPropsChange, 300);

  return (
    <>
      <div className="file-field flex items-center gap-1 flex-1">
        {title && (
          <div className="flex items-center justify-between">
            <label className={fieldLabel}>{title}</label>
          </div>
        )}
        <div className="flex gap-1 flex-1">
          <input
            id={id}
            type="file"
            className="overflow-hidden w-[0.1px] h-[0.1px] opacity-0 absolute -z-10"
            accept={schema["ui:accept"]}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const src = URL.createObjectURL(file);
                onPropsChange({ src: src });
              }
            }}
            required={required}
          />
          <span className="flex-1">&nbsp;</span>
          <Button variant="soft" size="1" radius="full">
            <label
              className="!leading-[inherit] !mb-0 !font-medium !text-inherit cursor-[inherit]"
              htmlFor={id}
            >
              Upload image
            </label>
          </Button>
          {schema["ui:show-img-search"] && (
            <Button variant="soft" size="1" radius="full" type="button" onClick={() => setShowSearch(true)}>
              <label className="!leading-[inherit] !mb-0 !font-medium !text-inherit cursor-[inherit]">
                Search
              </label>
            </Button>
          )}
        </div>
        {description && (
          <Tooltip content={description} className="!z-[10000]" align="end">
            <IconButton variant="ghost" size="1" radius="full" className="!p-0.5 group !cursor-help" disabled>
              <IoIosHelpCircleOutline className="text-upstart-400 w-5 h-5 group-hover:text-upstart-600" />
            </IconButton>
          </Tooltip>
        )}
      </div>
      {currentValue.src && (
        <>
          <div className="basis-full w-0" />
          <div
            className="border border-upstart-200 p-2 mt-3 ml-auto w-full h-auto"
            style={{
              backgroundImage: `url(${trans})`,
              backgroundSize: "12px 12px",
            }}
          >
            <img src={currentValue.src} alt="Preview" className="max-w-full h-auto" />
          </div>
          <div className="basis-full w-0" />
          <div className="flex justify-between gap-12 flex-1 items-center mt-3">
            <label className={fieldLabel}>Alt text</label>
            <TextField.Root
              defaultValue={currentValue.alt}
              className="!flex-1"
              onChange={(e) => debouncedOnPropsChange({ alt: e.target.value })}
              required={required}
              spellCheck={!!schema["ui:spellcheck"]}
            />
          </div>
          <div className="basis-full w-0" />
          <div className="flex justify-between gap-12 flex-1 items-center mt-3 pr-1.5">
            <label className={fieldLabel}>Fit</label>
            <Select.Root
              defaultValue={currentValue.fit}
              size="2"
              onValueChange={(value) => onPropsChange({ fit: value as ImageProps["fit"] })}
            >
              <Select.Trigger radius="large" variant="ghost" />
              <Select.Content position="popper">
                <Select.Group>
                  {/* biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
                  {schema.properties.fit.anyOf.map((item: any) => (
                    <Select.Item key={item.const} value={item.const}>
                      {item.title}
                    </Select.Item>
                  ))}
                </Select.Group>
              </Select.Content>
            </Select.Root>
          </div>
        </>
      )}
      <ModalSearchImage
        open={showSearch}
        onClose={() => {
          setShowSearch(false);
        }}
        onChoose={(url) => {
          onPropsChange({ src: url });
          setShowSearch(false);
        }}
      />
    </>
  );
};

export default ImageField;

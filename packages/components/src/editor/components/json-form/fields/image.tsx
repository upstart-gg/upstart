import type { FieldProps } from "./types";
import { nanoid } from "nanoid";
import { Button, TextField, Select, Tooltip, IconButton } from "@upstart.gg/style-system/system";
import { type FC, useMemo, useState } from "react";
import ModalSearchImage from "~/editor/components/ModalSearchImage";
import type { ImageProps } from "@upstart.gg/sdk/shared/bricks/props/image";
import { fieldLabel } from "../form-class";
import { debounce } from "lodash-es";
import { IoMdClose } from "react-icons/io";
import { FieldTitle } from "../field-factory";
import { useUploader } from "../../UploaderContext";
import { useDynamicTextEditor } from "~/editor/hooks/use-editable-text";
import { usePageQueries } from "~/editor/hooks/use-page-data";
import { normalizeSchemaEnum } from "@upstart.gg/sdk/shared/utils/schema";

const ImageField: FC<FieldProps<ImageProps | null>> = (props) => {
  const { schema, formData, onChange, title, description, currentValue, brickId, noDynamic } = props;
  const [showSearch, setShowSearch] = useState(false);
  const id = useMemo(() => nanoid(), []);
  const { onImageUpload } = useUploader();
  const pageQueries = usePageQueries();

  const onDynamicSrcChange = (newSrc: string) => {
    onPropsChange({ src: newSrc });
  };
  const DynamicTextEditor = useDynamicTextEditor({
    ...props,
    currentValue: currentValue?.src,
    onChange: onDynamicSrcChange,
  });

  const onPropsChange = (newVal: Partial<ImageProps>) => {
    onChange({ ...(currentValue ?? {}), ...newVal } as ImageProps);
  };

  const debouncedOnPropsChange = debounce(onPropsChange, 300);

  if (pageQueries.length > 0 && !noDynamic && !schema["ui:no-dynamic"]) {
    return (
      <div className="field field-string basis-full flex flex-col gap-1 max-w-full">
        <FieldTitle title={title} description={description} />
        <div className="field field-string flex items-start gap-1.5 max-w-full">{DynamicTextEditor}</div>
      </div>
    );
  }

  return (
    <>
      <div className="file-field flex items-center gap-1 flex-1">
        <FieldTitle title={title} description={description} />
        <div className="flex gap-1 flex-1">
          <input
            id={id}
            type="file"
            className="overflow-hidden w-[0.1px] h-[0.1px] opacity-0 absolute -z-10"
            accept={schema["ui:accept"]}
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (file) {
                const url = import.meta.env.DEV ? URL.createObjectURL(file) : await onImageUpload(file);
                // First assign the URL to src
                onPropsChange({ src: url });
              }
            }}
          />
          <span className="flex-1">&nbsp;</span>
          <Button
            variant="soft"
            size="1"
            radius="full"
            type="button"
            // onClick={(e) => e.preventDefault()}
          >
            <label
              className="!leading-[inherit] !mb-0 !font-medium !text-inherit cursor-[inherit]"
              htmlFor={id}
            >
              Upload image
            </label>
          </Button>
          {schema["ui:show-img-search"] && (
            <Button variant="soft" size="1" radius="full" type="button" onClick={() => setShowSearch(true)}>
              <span className="!leading-[inherit] !mb-0 !font-medium !text-inherit cursor-[inherit]">
                Search
              </span>
            </Button>
          )}
        </div>
      </div>
      {currentValue?.src && (
        <>
          <div className="basis-full w-0" />
          <div className="border border-upstart-200 p-1.5 bg-white mt-3 ml-auto w-full h-auto max-h-[120px] relative">
            <img src={currentValue.src} alt="Preview" className="w-full h-auto max-h-[100px] object-cover" />
            <div className="absolute flex items-center justify-center top-1 right-1 text-gray-500 p-0.5 bg-white cursor-pointer hover:(bg-red-800 text-white) rounded border border-gray-300 shadow-sm">
              <IoMdClose className="w-4 h-4 " onClick={() => onPropsChange({ src: "" })} />
            </div>
          </div>
          <div className="basis-full w-0" />
          {!schema["ui:no-alt-text"] && (
            <>
              <div className="flex justify-between gap-12 flex-1 items-center mt-3">
                <label className={fieldLabel}>Alt text</label>
                <TextField.Root
                  defaultValue={currentValue.alt}
                  className="!flex-1"
                  onChange={(e) => debouncedOnPropsChange({ alt: e.target.value })}
                  spellCheck={!!schema["ui:spellcheck"]}
                />
              </div>
              <div className="basis-full w-0" />
            </>
          )}

          {!schema["ui:no-object-options"] && (
            <div className="flex gap-12 flex-1 mt-3 pr-1.5">
              <div className="flex flex-col gap-1 flex-1 pl-1">
                <label className={fieldLabel}>Fit</label>
                <Select.Root
                  defaultValue={currentValue?.fit}
                  size="2"
                  onValueChange={(value) => onPropsChange({ fit: value as ImageProps["fit"] })}
                >
                  <Select.Trigger radius="large" variant="ghost" placeholder="Not specified" />
                  <Select.Content position="popper">
                    <Select.Group>
                      {/* biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
                      {normalizeSchemaEnum(schema.properties.fit).map((item: any) => (
                        <Select.Item key={item.const} value={item.const}>
                          {item.title}
                        </Select.Item>
                      ))}
                    </Select.Group>
                  </Select.Content>
                </Select.Root>
              </div>
              <div className="flex flex-col gap-1 flex-1">
                <label className={fieldLabel}>Position</label>
                <Select.Root
                  defaultValue={currentValue.position}
                  size="2"
                  onValueChange={(value) => onPropsChange({ position: value as ImageProps["position"] })}
                >
                  <Select.Trigger radius="large" variant="ghost" placeholder="Not specified" />
                  <Select.Content position="popper">
                    <Select.Group>
                      {normalizeSchemaEnum(schema.properties.position).map((item) => (
                        <Select.Item key={item.const} value={item.const}>
                          {item.title}
                        </Select.Item>
                      ))}
                    </Select.Group>
                  </Select.Content>
                </Select.Root>
              </div>
            </div>
          )}
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

import type { FieldProps } from "./types";
import { nanoid } from "nanoid";
import { Button, Text, Tooltip, IconButton } from "@upstart.gg/style-system/system";
import { useMemo, useState } from "react";
import ModalSearchImage from "~/editor/components/ModalSearchImage";
import type { ImageProps } from "@upstart.gg/sdk/shared/bricks/props/image";
import { IoIosHelpCircleOutline } from "react-icons/io";

const ImageField: React.FC<FieldProps<ImageProps>> = (props) => {
  const {
    schema,
    formData,
    onChange,
    required,
    title,
    description,
    currentValue = { src: "", alt: "" },
  } = props;
  const [showSearch, setShowSearch] = useState(false);
  const id = useMemo(() => nanoid(), []);
  // const [src, setSrc] = useState<string | null>(currentValue.src);

  const onPropsChange = (newVal: Partial<ImageProps>) => {
    onChange({ ...(currentValue ?? {}), ...newVal });
  };

  return (
    <>
      <div className="file-field flex items-center flex-wrap gap-1">
        {title && (
          <div className="flex items-center justify-between">
            <Text as="label" size="2" weight="medium">
              {title}
            </Text>
          </div>
        )}
        <div className="flex gap-1 flex-1">
          <input
            id={id}
            type="file"
            className="overflow-hidden w-[0.1px] h-[0.1px] opacity-0 absolute -z-10"
            accept={schema["ui:accept"]}
            onChange={(e) => {
              const src = e.target.files?.[0]?.name;
              if (src) {
                onChange({ ...currentValue, src: src as string });
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
        <div className="border border-upstart-200 p-2 mt-3">
          <img src={currentValue.src} alt="Preview" className="max-w-full h-auto" />
        </div>
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

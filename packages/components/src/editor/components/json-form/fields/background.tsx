import type { FieldProps } from "./types";
import { nanoid } from "nanoid";
import { Button, Text, Select, Tooltip, IconButton } from "@upstart.gg/style-system/system";
import { useMemo, useState } from "react";
import ModalSearchImage from "~/editor/components/ModalSearchImage";
import type { BackgroundSettings } from "@upstart.gg/sdk/shared/bricks/props/background";
import ColorField from "./color";
import { useUploader } from "../../UploaderContext";
import { IoCloseOutline } from "react-icons/io5";
import { HelpIcon } from "../HelpIcon";
import { IoSearch } from "react-icons/io5";
import { fieldLabel } from "../form-class";

const BackgroundField: React.FC<FieldProps<BackgroundSettings>> = (props) => {
  const { schema, formData, onChange, required, title, description, currentValue } = props;
  const [showSearch, setShowSearch] = useState(false);
  const id = useMemo(() => nanoid(), []);
  const { onImageUpload } = useUploader();
  const onPropsChange = (newVal: Partial<BackgroundSettings>) => onChange({ ...currentValue, ...newVal });

  return (
    <>
      <div className="background-field flex items-center justify-between flex-wrap gap-1 flex-1">
        <div className="flex items-center justify-between">
          <label className={fieldLabel}>{title ?? "Color / image"}</label>
        </div>
        <div className="flex justify-end gap-1.5">
          <ColorField
            {...props}
            currentValue={currentValue.color}
            title={undefined}
            onChange={(color) => {
              console.log("color", color);
              onChange({ ...currentValue, color: color as string });
            }}
            hideColorLabel={true}
          />
          <div>
            <input
              id={id}
              type="file"
              className="overflow-hidden w-[0.1px] h-[0.1px] opacity-0 absolute -z-10"
              accept={
                schema["ui:accept"] ??
                "image/png, image/jpeg, image/jpg, image/svg+xml, image/webp, image/gif"
              }
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                onImageUpload(file);
                const tempUrl = URL.createObjectURL(file);
                if (tempUrl) {
                  onChange({ ...currentValue, image: tempUrl as string });
                }
              }}
              required={required}
            />
            <Button variant="soft" size="1" radius="full" type="button">
              <label
                className="!leading-[inherit] !mb-0 !font-medium !text-inherit cursor-[inherit]"
                htmlFor={id}
              >
                {currentValue.image ? "Upload new" : "Upload image"}
              </label>
            </Button>

            {schema["ui:show-img-search"] && (
              <Button variant="soft" size="1" radius="full" type="button" onClick={() => setShowSearch(true)}>
                <label className="!leading-[inherit] !mb-0 !font-medium !text-inherit cursor-[inherit]">
                  <IoSearch className="text-upstart-700 w-4 h-4" />
                </label>
              </Button>
            )}
          </div>
        </div>
      </div>
      {currentValue.image && (
        <>
          <div className="flex justify-between items-center">
            <div className="flex flex-col flex-1 gap-1">
              <label className={fieldLabel}>Size</label>
              <div className="flex items-center gap-4">
                <Select.Root
                  defaultValue={currentValue.size ?? "auto"}
                  size="2"
                  onValueChange={(value) =>
                    onChange({ ...currentValue, size: value as BackgroundSettings["size"] })
                  }
                >
                  <Select.Trigger radius="large" variant="ghost" />
                  <Select.Content position="popper">
                    <Select.Group>
                      {/* biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
                      {schema.properties.size.anyOf.map((item: any) => (
                        <Select.Item key={item.const} value={item.const}>
                          {item.title}
                        </Select.Item>
                      ))}
                    </Select.Group>
                  </Select.Content>
                </Select.Root>
                <HelpIcon
                  help={`
              When "Auto", the background image will be displayed in its original size.
              "Cover" will make the background image cover the entire element,
              and "Contain" will make the background image contained within the element.
              `}
                />
              </div>
            </div>
            <div className="flex flex-col flex-1 gap-0.5">
              <label className={fieldLabel}>Repeat</label>
              <div className="flex items-center gap-4">
                <Select.Root
                  defaultValue={currentValue.repeat ?? "no-repeat"}
                  size="2"
                  onValueChange={(value) =>
                    onChange({ ...currentValue, repeat: value as BackgroundSettings["repeat"] })
                  }
                >
                  <Select.Trigger radius="large" variant="ghost" />
                  <Select.Content position="popper">
                    <Select.Group>
                      {/* biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
                      {schema.properties.repeat.anyOf.map((item: any) => (
                        <Select.Item key={item.const} value={item.const}>
                          {item.title}
                        </Select.Item>
                      ))}
                    </Select.Group>
                  </Select.Content>
                </Select.Root>
                <HelpIcon help={"Choose how the background image will be repeated."} />
              </div>
            </div>
          </div>
          {/* image preview */}
          <div className="border border-upstart-200 p-1.5 self-end relative">
            <img src={currentValue.image} alt={id} className="max-w-full h-auto" />
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                onChange({ ...currentValue, image: undefined });
              }}
              title="Close"
              size="1"
              variant="surface"
              color="gray"
              className="!absolute !top-1 !right-1 !text-upstart-700 hover:(!bg-red-700 !text-white)"
            >
              <IoCloseOutline />
            </IconButton>
          </div>
        </>
      )}
      <ModalSearchImage
        open={showSearch}
        onClose={() => {
          setShowSearch(false);
        }}
        onChoose={(url) => {
          onPropsChange({ image: url });
          setShowSearch(false);
        }}
      />
    </>
  );
};

export default BackgroundField;

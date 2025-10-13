import { Button } from "@radix-ui/themes";
import type { FaviconProps } from "@upstart.gg/sdk/shared/bricks/props/favicon";
import { Dialog } from "@upstart.gg/style-system/system";
import { tx } from "@upstart.gg/style-system/twind";
import { nanoid } from "nanoid";
import { useMemo, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { useUserConfig } from "~/editor/hooks/use-user-config";
import { useUploader } from "../../UploaderContext";
import { FieldTitle } from "../field-factory";
import type { FieldProps } from "./types";

export const FaviconField = ({
  title,
  description,
  currentValue,
  onChange,
  schema,
  ...props
}: FieldProps<FaviconProps>) => {
  const id = useMemo(() => nanoid(), []);
  const { onImageUpload } = useUploader();
  const userConfig = useUserConfig();
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);

  const isFaviconEnabled = !!userConfig.config.hasFavicon;

  const onPropsChange = (newVal: Partial<FaviconProps>) => {
    onChange({ ...(currentValue ?? {}), ...newVal } as FaviconProps);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (favicon should be small)
      if (file.size > 1024 * 1024) {
        // 1MB limit
        alert("Favicon file should be smaller than 1MB for optimal performance");
        return;
      }

      const url = import.meta.env.DEV ? URL.createObjectURL(file) : await onImageUpload(file);
      onPropsChange({ src: url });
    }
  };

  return (
    <>
      <div className="field field-favicon basis-full flex flex-col gap-1 max-w-full">
        <div className="flex justify-between">
          <FieldTitle title={title} description={description} />
          {isFaviconEnabled && (
            <div className="flex items-end gap-1">
              <input
                id={id}
                type="file"
                className="overflow-hidden w-[0.1px] h-[0.1px] opacity-0 absolute -z-10"
                accept="image/*"
                onChange={handleFileUpload}
              />
              <Button variant="soft" size="1" radius="full" type="button">
                <label
                  className="!leading-[inherit] !mb-0 !font-medium !text-inherit cursor-[inherit] flex items-center gap-1"
                  htmlFor={id}
                >
                  Upload icon
                </label>
              </Button>
            </div>
          )}
          {!isFaviconEnabled && (
            <div className="flex items-end gap-1">
              <Button variant="soft" size="1" radius="full" type="button">
                <label
                  className="!leading-[inherit] !mb-0 !font-medium !text-inherit cursor-[inherit] flex items-center gap-1"
                  onClick={() => {
                    console.log(
                      "Favicon upload blocked: User is on free plan. Upgrade required for custom favicon.",
                    );
                    setShowUpgradeDialog(true);
                  }}
                >
                  Upload icon
                </label>
              </Button>
            </div>
          )}
        </div>
      </div>

      {currentValue?.src && (
        <>
          <div className="basis-full w-0" />
          <div className="flex gap-4 items-center mt-3 px-2">
            <div className="border border-upstart-200 p-1.5 bg-white mx-auto w-[64px] h-[64px] min-w-[64px] max-w-[64px] min-h-[64px] max-h-[64px] flex-shrink-0">
              <img
                src={currentValue.src}
                alt="Favicon preview"
                className="w-full h-full object-contain bg-gray-50 rounded"
              />
            </div>
            <div className="flex items-center justify-center top-1 right-1 text-gray-500 p-0.5 bg-white cursor-pointer hover:(bg-red-800 text-white) rounded border border-gray-300 shadow-sm">
              <IoMdClose className="w-3 h-3" onClick={() => onPropsChange({ src: "" })} />
            </div>
          </div>
        </>
      )}

      {/* Upgrade Dialog */}
      <Dialog.Root open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <Dialog.Content style={{ maxWidth: 450 }}>
          <Dialog.Title>Upgrade Required</Dialog.Title>
          <Dialog.Description size="2" className="text-pretty mb-4">
            Upgrade your plan to customize your site's favicon and unlock other premium features.
          </Dialog.Description>

          <div className="flex mt-4 justify-between gap-3">
            <Dialog.Close>
              <Button variant="soft" color="gray">
                Cancel
              </Button>
            </Dialog.Close>
            <button
              type="button"
              className={tx(
                "rounded !bg-orange-500 text-white border border-orange-400 hover:opacity-90 text-center text-sm font-semibold py-1 px-4 cursor-pointer transition-opacity min-w-[80px]",
              )}
              onClick={() => {
                window.open("/dashboard/upgrade", "_blank");
                setShowUpgradeDialog(false);
              }}
            >
              Upgrade
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Root>
    </>
  );
};

export default FaviconField;

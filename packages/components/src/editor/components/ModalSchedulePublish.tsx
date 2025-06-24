import { Dialog } from "@upstart.gg/style-system/system";
import { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";

type ModalSchedulePublishProps = {
  onSchedule: (scheduleDateTime: string) => void;
  onClose: () => void;
  open: boolean;
};

export function ModalSchedulePublish({ onSchedule, onClose, open }: ModalSchedulePublishProps) {
  const [inputValue, setInputValue] = useState<string>("");

  // Reset input value when dialog closes
  useEffect(() => {
    if (!open) {
      setInputValue("");
    }
  }, [open]);

  const handleDateChange = (value: string) => {
    setInputValue(value);
    // onSchedule(value);
  };
  return (
    <Dialog.Root open={open} onOpenChange={() => {}}>
      <Dialog.Content className="overflow-y-clip">
        <div className="flex justify-between items-start mb-4">
          <Dialog.Title className="mt-2">Schedule Publication</Dialog.Title>
          <button
            onClick={onClose}
            className=" hover:bg-gray-100 rounded-full transition-colors"
            type="button"
            aria-label="Close dialog"
          >
            <RxCross2 className="h-4 w-4" />
          </button>
        </div>
        <Dialog.Description size="2" mb="4" className="text-pretty ">
          Choose when you'd like your content to go live. Your page will be automatically published at the
          scheduled time.
        </Dialog.Description>
        <div className="flex flex-1 justify-between items-baseline">
          <input
            id={"schedule-publish-input"}
            type="datetime-local"
            value={inputValue}
            min={new Date().toISOString().slice(0, 16)} // Prevent past dates
            onChange={(e) => {
              handleDateChange(e.target.value);
            }}
          />
          <button
            className="mt-4 px-4 py-2 rounded bg-upstart-600 text-white"
            type="button"
            onClick={() => {
              if (inputValue) {
                onSchedule(inputValue);
                onClose();
              }
            }}
          >
            Schedule Publication
          </button>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
}

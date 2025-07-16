import { Tooltip, IconButton } from "@upstart.gg/style-system/system";
import { IoIosHelpCircleOutline } from "react-icons/io";

export function HelpIcon({ help }: { help: string }) {
  return (
    <Tooltip content={<span className="text-xs block p-1">{help}</span>} className="!z-[10000]">
      <IconButton variant="ghost" size="3" radius="none" className="group !cursor-help !p-0 !mr-1">
        <IoIosHelpCircleOutline className="text-upstart-400 group-hover:text-upstart-600 h-6 w-6" />
      </IconButton>
    </Tooltip>
  );
}

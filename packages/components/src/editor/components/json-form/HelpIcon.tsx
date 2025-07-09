import { Tooltip, IconButton } from "@upstart.gg/style-system/system";
import { IoIosHelpCircleOutline } from "react-icons/io";

export function HelpIcon({ help }: { help: string }) {
  return (
    <Tooltip content={<div className="text-xs p-1">{help}</div>} className="!z-[10000]" align="end">
      <IconButton variant="ghost" size="2" radius="full" className="group !cursor-help" disabled>
        <IoIosHelpCircleOutline className="text-upstart-400 group-hover:text-upstart-600" />
      </IconButton>
    </Tooltip>
  );
}

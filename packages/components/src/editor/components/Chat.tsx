import { TextArea } from "@radix-ui/themes";
import { tx, css } from "@upstart.gg/style-system/twind";
import { BsStars } from "react-icons/bs";

export default function Chat() {
  return (
    <div className="flex flex-col ml-3 mb-4 gap-3">
      <div className="messages flex-1 overflow-y-auto bg-gray-100 text-gray-500 text-xl font-medium rounded flex items-center justify-center">
        Coming soon 🤓
      </div>
      <TextArea placeholder="Ask AI to modify your page" size="2" className={tx(" h-32 w-full !bg-white")} />
    </div>
  );
}

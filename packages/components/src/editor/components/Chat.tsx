import { TextArea } from "@radix-ui/themes";
import { tx, css } from "@upstart.gg/style-system/twind";
import { Button, Text, Switch } from "@upstart.gg/style-system/system";
import { BsStars } from "react-icons/bs";
import { TbSend2 } from "react-icons/tb";
import { IoIosAttach } from "react-icons/io";
import icon from "@creatives/favicon.svg";

const msgCommon = tx("rounded-lg ");
const aiMsgClass = tx("px-1 text-black/80 dark:text-upstart-200 text-base", css({ fontSize: "0.95rem" }));
const userMsgClass = tx(
  "px-2.5 py-2 text-sm opacity-80 bg-gradient-to-tr from-upstart-200/80 to-upstart-100 w-fit max-w-[90%] text-gray-800 dark:(bg-dark-900 text-white/70) self-end",
);

export default function Chat() {
  const messages = [
    {
      id: "1",
      content: "Hello, how can I help you?",
      role: "ai",
    },
    {
      id: "2",
      content: "Can you help me with my page?",
      role: "user",
    },
    {
      id: "3",
      content: "Sure, what do you need help with?",
      role: "ai",
    },
    {
      id: "4",
      content:
        "I need help with the layout. I'm not sure how to arrange the sections. Can you suggest something?",
      role: "user",
    },
    {
      id: "5",
      content: "I can help you with that. How about a two-column layout?",
      role: "ai",
    },
    {
      id: "6",
      content: "That sounds good. Can you show me an example?",
      role: "user",
    },
    {
      id: "7",
      content: "Sure! Here is an example of a two-column layout.",
      role: "ai",
    },
    {
      id: "8",
      content: "Looks good! Can you add a header and a footer?",
      role: "user",
    },
    {
      id: "9",
      content: "Of course! Here is the updated layout with a header and footer.",
      role: "ai",
    },
    {
      id: "10",
      content: "Great! Thank you for your help.",
      role: "user",
    },
    {
      id: "11",
      content: "You're welcome! If you need any more help, feel free to ask.",
      role: "ai",
    },
    {
      id: "12",
      content: "I will. Thanks again!",
      role: "user",
    },
    {
      id: "13",
      content: "No problem! Have a great day!",
      role: "ai",
    },
    {
      id: "14",
      content: "You too!",
      role: "user",
    },
    {
      id: "15",
      content: "Thanks!",
      role: "ai",
    },
    {
      id: "16",
      content: "You're welcome!",
      role: "user",
    },
    {
      id: "17",
      content: "Goodbye!",
      role: "ai",
    },
    {
      id: "18",
      content: "Goodbye!",
      role: "user",
    },
  ];
  return (
    <div className="flex flex-col rounded-tr-xl relative bg-gray-50">
      <div
        className={tx(
          `messages scrollbar-thin flex-grow overflow-y-auto h-full max-h-[calc(100cqh-250px)]
           text-xl py-2 pl-2 pr-3 pb-6 rounded flex flex-col gap-y-2.5
           shadow-inner scroll-smooth rounded-tr-xl
           `,
          css({
            scrollbarColor: "var(--violet-5) var(--violet-2)",
            scrollbarGutter: "stable",
          }),
        )}
      >
        {messages.map((msg) => (
          <div key={msg.id} className={tx(msg.role === "ai" ? aiMsgClass : userMsgClass, msgCommon)}>
            {msg.content}
          </div>
        ))}
      </div>
      <form className="flex flex-col flex-1 max-h-60 gap-1.5 p-2 justify-center bg-upstart-100 border-t border-upstart-300">
        <TextArea
          name="prompt"
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          placeholder="Add a section just below the navbar showing a large photo of space"
          size="2"
          className={tx("h-32 w-full scrollbar-thin p-2")}
        />
        <div className="flex justify-between items-center text-gray-500">
          <button type="button" className="hover:bg-upstart-200 p-1 rounded inline-flex text-sm gap-1 ">
            <IoIosAttach className="h-5 w-5" /> 3 files
          </button>
          <label className="inline-flex items-center gap-1 text-sm select-none">
            <Switch name="allow_web_search" size={"1"} /> Allow web search
          </label>
          <Button type="submit" size={"2"} className={tx("flex items-center gap-0.5")}>
            <span className="text-[80%] font-normal opacity-80">⌘⏎</span>
            <TbSend2 className="text-lg" />
          </Button>
        </div>
      </form>
    </div>
  );
}

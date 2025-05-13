import { TextArea } from "@radix-ui/themes";
import { tx, css } from "@upstart.gg/style-system/twind";
import { Button, Text } from "@upstart.gg/style-system/system";
import { BsStars } from "react-icons/bs";
import { TbSend2 } from "react-icons/tb";
import { IoIosAttach } from "react-icons/io";
import icon from "@creatives/favicon.svg";

const msgCommon = tx("p-2 rounded backdrop-blur-sm shadow-sm");
const aiMsgClass = tx(
  "bg-upstart-200 text-upstart-900 dark:(bg-upstart-900 text-upstart-200)",
  css({
    backgroundImage: `url(${icon})`,
    backgroundSize: "1.2rem",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "0.5rem 0.5rem",
    paddingLeft: "2.2rem",
  }),
);
const userMsgClass = tx("bg-gray-200 text-gray-700 dark:(bg-dark-900 text-white/70)");

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
  ];
  return (
    <div className="flex flex-col rounded-tr-xl relative bg-gray-100">
      <div
        className={tx(
          `messages scrollbar-thin scrollbar-color-upstart-500 flex-1 overflow-y-auto
            h-[calc(100cqh-246px)] max-h-[calc(100cqh-246px)]
           text-xl p-2 pb-6 rounded flex flex-col gap-y-2 items-start justify-start
           shadow-inner scroll-smooth rounded-tr-xl
           `,
        )}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={tx(
              msg.role === "ai" ? aiMsgClass : userMsgClass,
              msgCommon,
              "w-fit max-w-[90%] text-sm",
            )}
          >
            {msg.content}
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-1 p-2 justify-center bg-upstart-100 border-t border-upstart-300">
        <TextArea
          spellCheck={false}
          autoCorrect="off"
          placeholder="Add a section just below the navbar showing a large photo of space"
          size="2"
          className={tx("h-32 w-full scrollbar-thin p-2")}
        />
        <div className="flex justify-between items-center text-gray-500">
          <button type="button" className="hover:bg-upstart-200 p-1 rounded">
            <IoIosAttach className="h-5 w-5" />
          </button>
          <Text color="gray" size="1" className="inline-flex items-center gap-1">
            <BsStars className="text-sm text-upstart-400" /> Credits: 3500
          </Text>
          <Button type="button" size={"2"} className={tx("flex items-center gap-0.5")}>
            <span className="text-[80%] font-normal opacity-80">⌘⏎</span>
            <TbSend2 className="text-lg" />
          </Button>
        </div>
      </div>
    </div>
  );
}

import { createContext, useContext, type ReactNode, useState } from "react";
import { Chat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import type { UpstartUIMessage } from "@upstart.gg/sdk/ai";

interface ChatContextValue {
  // replace with your custom message type
  chat: Chat<UpstartUIMessage>;
  clearChat: () => void;
}

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

function createChat() {
  return new Chat<UpstartUIMessage>({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });
}

export function ChatProvider({ children }: { children: ReactNode }) {
  const [chat, setChat] = useState(() => createChat());

  const clearChat = () => {
    setChat(createChat());
  };

  return (
    <ChatContext.Provider
      value={{
        chat,
        clearChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useSharedChatContext() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useSharedChatContext must be used within a ChatProvider");
  }
  return context;
}

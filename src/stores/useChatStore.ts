import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ChatMessage = {
  id: number;
  sender: "me" | "other";
  content: string;
  timestamp: number;
};

type ChatStore = {
  messagesByChatId: Record<number, ChatMessage[]>;
  lastMessagesByChatId: Record<number, string>;
  addMessage: (chatId: number, message: ChatMessage) => void;
  setMessages: (chatId: number, messages: ChatMessage[]) => void;
};

export const useChatStore = create<ChatStore>()(
  persist(
    (set) => ({
      messagesByChatId: {},
      lastMessagesByChatId: {},
      addMessage: (chatId, message) =>
        set((state) => {
          const newMessages = [
            ...(state.messagesByChatId[chatId] || []),
            message,
          ];
          return {
            messagesByChatId: {
              ...state.messagesByChatId,
              [chatId]: newMessages,
            },
            lastMessagesByChatId: {
              ...state.lastMessagesByChatId,
              [chatId]: message.content,
            },
          };
        }),
      setMessages: (chatId, messages) =>
        set((state) => ({
          messagesByChatId: {
            ...state.messagesByChatId,
            [chatId]: messages,
          },
          lastMessagesByChatId: {
            ...state.lastMessagesByChatId,
            [chatId]: messages[messages.length - 1]?.content || "",
          },
        })),
    }),
    {
      name: "chat-storage",
    }
  )
);

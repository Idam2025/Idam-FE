import { create } from "zustand";

export type ChatMessage = {
  id: number;
  sender: "me" | "other";
  content: string;
  timestamp: number;
};

type ChatStore = {
  messagesByChatId: Record<number, ChatMessage[]>;
  addMessage: (chatId: number, message: ChatMessage) => void;
  setMessages: (chatId: number, messages: ChatMessage[]) => void;
};

export const useChatStore = create<ChatStore>((set) => ({
  messagesByChatId: {},
  addMessage: (chatId, message) =>
    set((state) => ({
      messagesByChatId: {
        ...state.messagesByChatId,
        [chatId]: [...(state.messagesByChatId[chatId] || []), message],
      },
    })),
  setMessages: (chatId, messages) =>
    set((state) => ({
      messagesByChatId: {
        ...state.messagesByChatId,
        [chatId]: messages,
      },
    })),
}));

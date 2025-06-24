import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ChatMessage = {
  id: number;
  roomId: number; // ✅ 추가
  sender: string;
  senderId?: number; // 👈 senderId도 있어야 read 처리 가능
  content: string;
  timestamp: number;
  type?: "TALK" | "ENTER" | "LEAVE";
  read?: boolean;
};

export type ChatRoom = {
  roomId: number;
  roomName: string;
  unreadCount: number;
  lastMessage: string;
};

type ChatStore = {
  messagesByChatId: Record<number, ChatMessage[]>;
  lastMessagesByChatId: Record<number, string>;
  chatRooms: ChatRoom[]; // ✅ 추가
  setChatRooms: (rooms: ChatRoom[]) => void; // ✅ 추가
  updateRoomMessage: (
    roomId: number,
    message: ChatMessage,
    myUserId: number
  ) => void; // ✅ 추가
  addMessage: (chatId: number, message: ChatMessage) => void;
  setMessages: (chatId: number, messages: ChatMessage[]) => void;
};

export const useChatStore = create<ChatStore>()(
  persist(
    (set) => ({
      messagesByChatId: {},
      lastMessagesByChatId: {},
      chatRooms: [],
      setChatRooms: (rooms) => set(() => ({ chatRooms: rooms })),
      updateRoomMessage: (roomId, message, myUserId) =>
        set((state) => ({
          chatRooms: state.chatRooms.map((room) =>
            room.roomId === roomId
              ? {
                  ...room,
                  lastMessage: message.content,
                  unreadCount:
                    message.senderId !== myUserId
                      ? room.unreadCount + 1
                      : room.unreadCount,
                }
              : room
          ),
        })),
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

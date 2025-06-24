// src/types/chat.ts

export interface ChatMessage {
  messageId: number;
  senderId: number;
  senderName: string;
  content: string;
  sentAt: string;
  read: boolean;
}

export interface ChatRoom {
  id: number; // ✅ 채팅방 ID
  name: string; // ✅ 상대 유저 이름
  project: string; // ✅ 프로젝트 이름
  avatar: string; // ✅ 상대 프로필 사진 URL
  lastMessage?: ChatMessage; // ✅ 마지막 메시지
  unreadCount?: number;
}

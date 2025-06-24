// 개별 채팅 메시지
export interface ChatMessage {
  messageId: number;
  senderId: number;
  senderName: string;
  content: string;
  sentAt: string; // ISO 날짜
  read: boolean;
  roomId: number;
}

// 채팅방 목록 (WebSocket summary 구조 기반)
export interface ChatRoom {
  id: number; // = roomId
  opponentId: number;
  opponentName: string;
  opponentProfileImage: string;
  project: string; // = projectTitle
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}

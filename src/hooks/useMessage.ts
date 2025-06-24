import { useEffect, useState } from "react";

interface ChatMessage {
  messageId: number;
  senderId: number;
  senderName: string;
  content: string;
  sentAt: string;
  read: boolean;
}

export function useMessages(roomId: number | null, token: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    if (!roomId) return;

    const fetchMessages = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/chat/room/${roomId}/messages`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data: ChatMessage[] = await res.json();
        setMessages(data);
      } catch (error) {
        console.error("❌ 메시지 불러오기 실패:", error);
      }
    };

    fetchMessages();
  }, [roomId, token]);

  return { messages, setMessages };
}

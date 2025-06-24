import { useEffect, useState } from "react";
import { ChatRoom } from "@/types/chat";

export function useChatRooms(accessToken: string) {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);

  const fetchChatRooms = async () => {
    const userType = localStorage.getItem("userType");
    const endpoint =
      userType === "STUDENT"
        ? "/api/chat/rooms/student"
        : "/api/chat/rooms/company";

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "채팅 목록 조회 실패");

      const rooms = await Promise.all(
        data.map(async (room: any) => {
          const messageRes = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/chat/room/${room.roomId}/messages`,
            { headers: { Authorization: `Bearer ${accessToken}` } }
          );
          const messages = await messageRes.json();
          const lastMessage = messages.at(-1);

          return {
            id: room.roomId,
            name: room.opponentName,
            project: room.projectTitle,
            avatar: room.opponentProfileImage,
            lastMessage,
            unreadCount: room.unreadCount,
          };
        })
      );

      setChatRooms(rooms);
    } catch (error) {
      console.error("❌ 채팅 목록 조회 오류:", error);
    }
  };

  useEffect(() => {
    fetchChatRooms();
  }, []);

  return { chatRooms, setChatRooms, fetchChatRooms };
}

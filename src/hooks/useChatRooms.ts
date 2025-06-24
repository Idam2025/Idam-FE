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
          // 방별 메시지 가져와서 마지막 메시지 추출
          const messageRes = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/chat/room/${room.roomId}/messages`,
            { headers: { Authorization: `Bearer ${accessToken}` } }
          );
          const messages = await messageRes.json();
          const lastMsg = messages.at(-1);

          // ChatRoom 타입에 맞게 필드 이름을 정확히 매핑
          return {
            id: room.roomId,
            opponentId: room.opponentId,
            opponentName: room.opponentName,
            opponentProfileImage: room.opponentProfileImage,
            project: room.projectTitle,
            lastMessage: lastMsg?.content ?? "",
            lastMessageAt: lastMsg?.sentAt ?? "",
            unreadCount: room.unreadCount,
          } as ChatRoom;
        })
      );

      setChatRooms(rooms);
    } catch (error) {
      console.error("❌ 채팅 목록 조회 오류:", error);
    }
  };

  useEffect(() => {
    if (accessToken) fetchChatRooms();
  }, [accessToken]);

  return { chatRooms, setChatRooms, fetchChatRooms };
}

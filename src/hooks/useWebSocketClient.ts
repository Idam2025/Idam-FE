import { useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { ChatRoom, ChatMessage } from "@/types/chat";

interface UseWebSocketClientProps {
  chatRooms: ChatRoom[];
  myUserId: number;
  accessToken: string;
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  setChatRooms: React.Dispatch<React.SetStateAction<ChatRoom[]>>;
}

export function useWebSocketClient({
  chatRooms,
  myUserId,
  accessToken,
  setMessages,
  setChatRooms,
}: UseWebSocketClientProps) {
  const clientRef = useRef<Client | null>(null);
  const subscribedSet = useRef<Set<string>>(new Set());

  // ✅ 읽음 처리, summary 갱신 구독 함수
  const subscribeToReadTopics = (client: Client, rooms: ChatRoom[]) => {
    rooms.forEach((room) => {
      const topic = `/sub/chat/read/${room.id}/${myUserId}`;
      if (subscribedSet.current.has(topic)) return;

      client.subscribe(topic, (message) => {
        if (message.body === "read") {
          console.log(`📖 채팅방 ${room.id}에서 상대방이 내 메시지를 읽음`);

          setMessages((prev) =>
            prev.map((msg) =>
              msg.senderId === myUserId && msg.roomId === room.id && !msg.read
                ? { ...msg, read: true }
                : msg
            )
          );

          setChatRooms((prevRooms) =>
            prevRooms.map((r) =>
              r.id === room.id ? { ...r, unreadCount: 0 } : r
            )
          );
        }
      });

      subscribedSet.current.add(topic);
    });
  };

  // ✅ summary 갱신 구독 함수
  const subscribeToSummaryTopic = (client: Client) => {
    const topic = `/sub/chat/summary/${myUserId}`;
    if (subscribedSet.current.has(topic)) return;

    client.subscribe(topic, (message) => {
      const updatedRoom = JSON.parse(message.body) as ChatRoom;
      console.log("🆕 채팅방 summary 갱신", updatedRoom);

      setChatRooms((prevRooms) =>
        prevRooms.map((room) =>
          room.id === updatedRoom.id
            ? {
                ...room,
                lastMessage: updatedRoom.lastMessage,
                lastMessageAt: updatedRoom.lastMessageAt,
                unreadCount: updatedRoom.unreadCount,
              }
            : room
        )
      );
    });

    subscribedSet.current.add(topic);
  };

  useEffect(() => {
    if (clientRef.current?.connected) {
      console.log("🟢 이미 연결되어 있음");
      return;
    }

    if (!accessToken || !myUserId) return;

    const socket = new SockJS(
      `${process.env.NEXT_PUBLIC_API_URL}/ws/chat?token=${accessToken}`
    );

    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      connectHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
      onConnect: () => {
        console.log("📡 WebSocket 연결됨");

        // ✅ 이 시점에만 구독을 수행
        subscribedSet.current = new Set(); // 구독 상태 초기화
        chatRooms.forEach((room) => {
          const topic = `/sub/chat/read/${room.id}/${myUserId}`;
          if (subscribedSet.current.has(topic)) return;

          client.subscribe(topic, (message) => {
            if (message.body === "read") {
              console.log(`📖 ${room.id} 메시지 읽음 처리`);
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.senderId === myUserId &&
                  msg.roomId === room.id &&
                  !msg.read
                    ? { ...msg, read: true }
                    : msg
                )
              );

              setChatRooms((prevRooms) =>
                prevRooms.map((r) =>
                  r.id === room.id ? { ...r, unreadCount: 0 } : r
                )
              );
            }
          });

          subscribedSet.current.add(topic);
        });
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      console.log("🔌 WebSocket 연결 종료");
      client.deactivate();
    };
  }, [accessToken, myUserId]);

  // ✅ chatRooms 바뀔 때마다 읽음 토픽 재구독
  useEffect(() => {
    const client = clientRef.current;
    if (!client || !client.connected) return;
    subscribeToReadTopics(client, chatRooms); // ✅ 올바른 호출
  }, [chatRooms]);

  return clientRef;
}

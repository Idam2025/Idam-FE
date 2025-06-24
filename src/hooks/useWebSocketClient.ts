"use client";

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

  useEffect(() => {
    const socket = new SockJS(
      `${process.env.NEXT_PUBLIC_API_URL}/ws/chat?token=${accessToken}`
    );
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      connectHeaders: { Authorization: `Bearer ${accessToken}` },
      onConnect: () => {
        console.log("📡 WebSocket 연결됨");
        chatRooms.forEach((room) => {
          client.subscribe(
            `/sub/chat/read/${room.id}/${myUserId}`,
            (message) => {
              if (message.body === "read") {
                console.log("📖 상대방이 내 메시지를 읽었음");

                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.senderId === myUserId && !msg.read
                      ? { ...msg, read: true }
                      : msg
                  )
                );

                setChatRooms((prevRooms) =>
                  prevRooms.map((r) =>
                    r.id === room.id &&
                    r.lastMessage?.senderId === myUserId &&
                    !r.lastMessage.read
                      ? {
                          ...r,
                          lastMessage: {
                            ...r.lastMessage,
                            read: true,
                          },
                          unreadCount: 0,
                        }
                      : r
                  )
                );
              }
            }
          );
        });
      },
    });
    client.activate();
    clientRef.current = client;
    return () => {
      client.deactivate();
    };
  }, [chatRooms]);

  return clientRef;
}

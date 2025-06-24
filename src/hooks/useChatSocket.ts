import { useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { ChatMessage } from "@/types/chat";

interface UseChatSocketProps {
  roomId: number;
  token: string;
  myUserId: number;
  onMessage: (msg: ChatMessage) => void;
  onRead: (roomId: number) => void;
}

export const useChatSocket = ({
  roomId,
  token,
  myUserId,
  onMessage,
  onRead,
}: UseChatSocketProps) => {
  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    if (!roomId || !token) return;

    const socket = new SockJS(
      `${process.env.NEXT_PUBLIC_API_URL}/ws/chat?token=${token}`
    );

    const client = new Client({
      webSocketFactory: () => socket,
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("📡 WebSocket 연결됨");

        client.subscribe(`/sub/chat/room/${roomId}`, (message) => {
          const body = JSON.parse(message.body);
          onMessage(body);
        });

        client.subscribe(`/sub/chat/read/${roomId}/${myUserId}`, (message) => {
          if (message.body === "read") {
            console.log("📖 상대방이 내 메시지를 읽었음");
            onRead(roomId);
          }
        });
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, [roomId, token, myUserId, onMessage, onRead]);

  return {
    publish: (destination: string, body: object) => {
      if (clientRef.current?.connected) {
        clientRef.current.publish({
          destination,
          body: JSON.stringify(body),
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    },
  };
};

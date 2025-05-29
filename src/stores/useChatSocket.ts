import { useEffect, useRef } from "react";
import { Client, IMessage, StompSubscription } from "@stomp/stompjs";
import SockJS from "sockjs-client";

interface UseChatSocketProps {
  roomId: number;
  token: string;
  onMessage: (msg: {
    messageId: number;
    senderId: number;
    senderName: string;
    content: string;
    sentAt: string;
    read: boolean;
  }) => void;
}

export function useChatSocket({
  roomId,
  token,
  onMessage,
}: UseChatSocketProps) {
  const clientRef = useRef<Client | null>(null);
  const subscriptionRef = useRef<StompSubscription | null>(null);

  useEffect(() => {
    if (!token) {
      console.warn("🟡 WebSocket: 토큰이 없어서 연결을 시도하지 않음");
      return;
    }

    const socketUrl = `https://www.smini.site/ws/chat?token=${token}`;
    console.log("🌐 WebSocket 연결 시도:", socketUrl);

    const client = new Client({
      webSocketFactory: () => new SockJS(socketUrl) as WebSocket,
      reconnectDelay: 5000, // 5초 간격 재시도
      debug: (msg: string) => console.log("[STOMP DEBUG]", msg),

      onConnect: () => {
        console.log(`✅ WebSocket 연결 완료: roomId = ${roomId}`);
        clientRef.current = client;
        (window as any).stompClient = client; // 전역 접근 허용

        // 이전 구독 제거 (roomId 변경 대응)
        subscriptionRef.current?.unsubscribe();

        // 메시지 구독
        subscriptionRef.current = client.subscribe(
          `/sub/chat/room/${roomId}`,
          (message: IMessage) => {
            try {
              const parsed = JSON.parse(message.body);
              if (parsed.messageId !== undefined) {
                onMessage(parsed);
              } else {
                console.warn("⚠️ 유효하지 않은 메시지 포맷:", parsed);
              }
            } catch (err) {
              console.error("❌ 메시지 파싱 실패:", err);
            }
          }
        );
      },

      onStompError: (frame) => {
        console.error("🔥 STOMP 오류:", frame.headers["message"]);
        client.deactivate();
      },

      onWebSocketError: (err) => {
        console.error("❌ WebSocket 오류:", err);
        client.deactivate();
      },

      onDisconnect: () => {
        console.log("🔌 WebSocket 연결 해제됨");
      },
    });

    client.activate();

    return () => {
      console.log("🧹 WebSocket 클린업 수행");
      subscriptionRef.current?.unsubscribe();
      client.deactivate();
    };
  }, [roomId, token, onMessage]);
}

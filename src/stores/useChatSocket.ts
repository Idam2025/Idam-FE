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
  const connectedOnceRef = useRef<boolean>(false);

  useEffect(() => {
    if (!token) {
      console.warn("🟡 WebSocket: 토큰이 없어서 연결을 시도하지 않음");
      return;
    }

    if (connectedOnceRef.current) {
      console.log("🔁 WebSocket: 이미 연결되어 있으므로 재시도하지 않음");
      return;
    }

    const socketUrl = `https://www.smini.site/ws/chat?token=${token}`;
    console.log("🌐 WebSocket 연결 시도:", socketUrl);

    const client = new Client({
      webSocketFactory: () => new SockJS(socketUrl) as WebSocket,
      reconnectDelay: 0,
      debug: (msg: string) => console.log("[STOMP DEBUG]", msg),

      onConnect: () => {
        connectedOnceRef.current = true;
        console.log(`✅ WebSocket 연결 완료: roomId = ${roomId}`);
        clientRef.current = client;
        (window as any).stompClient = client; // 전역 접근 허용

        // ✅ 메시지 구독
        subscriptionRef.current = client.subscribe(
          `/sub/chat/room/${roomId}`,
          (message: IMessage) => {
            console.log("📥 수신된 메시지:", message.body);
            try {
              const parsed = JSON.parse(message.body);

              // 메시지 구조 검증 (messageId가 있어야 유효)
              if (parsed.messageId !== undefined) {
                onMessage(parsed);
              } else {
                console.warn("⚠️ 유효하지 않은 메시지 포맷:", parsed);
              }
            } catch (err) {
              console.error("❌ 메시지 JSON 파싱 실패:", err);
            }
          }
        );
      },

      onStompError: (frame) => {
        console.error("🔥 STOMP 오류:", frame.headers["message"]);
        alert("STOMP 프로토콜 오류로 WebSocket 연결 실패");
        client.deactivate();
      },

      onWebSocketError: (err) => {
        console.error("❌ WebSocket 오류:", err);
        alert("WebSocket 연결 실패");
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

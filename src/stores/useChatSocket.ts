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
  onConnect?: () => void;
}

export function useChatSocket({
  roomId,
  token,
  onMessage,
  onConnect,
}: UseChatSocketProps) {
  const clientRef = useRef<Client | null>(null);
  const subscriptionRef = useRef<StompSubscription | null>(null);
  const onMessageRef = useRef(onMessage);
  const onConnectRef = useRef(onConnect);

  // ✅ 콜백 ref 동기화
  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    onConnectRef.current = onConnect;
  }, [onConnect]);

  useEffect(() => {
    if (!token) {
      console.warn("🟡 WebSocket: 토큰 없음 → 연결 시도 안함");
      return;
    }

    const socketUrl = `https://www.smini.site/ws/chat?token=${token}`;
    console.log("🌐 WebSocket 연결 시도:", socketUrl);

    const client = new Client({
      webSocketFactory: () => new SockJS(socketUrl) as WebSocket,
      reconnectDelay: 5000,
      debug: (msg: string) => console.log("[STOMP DEBUG]", msg),

      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },

      onConnect: () => {
        console.log(`✅ 연결 완료: roomId = ${roomId}`);
        clientRef.current = client;
        (window as any).stompClient = client;

        // ✅ 이전 구독 제거
        subscriptionRef.current?.unsubscribe();

        // ✅ 새 구독 설정
        subscriptionRef.current = client.subscribe(
          `/sub/chat/room/${roomId}`,
          (message: IMessage) => {
            try {
              const parsed = JSON.parse(message.body);
              if (parsed.messageId !== undefined) {
                onMessageRef.current(parsed);
              } else {
                console.warn("⚠️ 메시지 포맷 이상:", parsed);
              }
            } catch (err) {
              console.error("❌ 메시지 파싱 실패:", err);
            }
          }
        );

        onConnectRef.current?.();
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
        console.log("🔌 WebSocket 연결 종료");
      },
    });

    client.activate();

    return () => {
      console.log("🧹 WebSocket 클린업");
      subscriptionRef.current?.unsubscribe();
      client.deactivate();
    };
  }, [roomId, token]);

  const sendMessage = (payload: {
    roomId: number;
    senderId: number;
    content: string;
  }) => {
    if (clientRef.current && clientRef.current.connected) {
      clientRef.current.publish({
        destination: "/pub/chat/send",
        body: JSON.stringify(payload),
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } else {
      console.warn("❌ WebSocket 연결되지 않음 → 메시지 전송 실패");
    }
  };

  return {
    sendMessage,
  };
}

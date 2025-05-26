import { useEffect, useRef, useState } from "react";
import { Client, IMessage, StompSubscription } from "@stomp/stompjs";
import SockJS from "sockjs-client";

interface UseChatSocketProps {
  roomId: number;
  token: string;
  onMessage: (msg: any) => void;
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
      console.log("🔁 이미 연결 시도를 완료했으므로 재시도하지 않음");
      return;
    }

    const socketUrl = `https://www.smini.site/ws/chat?token=${token}`;
    console.log("🌐 WebSocket 연결 시도:", socketUrl);

    const client = new Client({
      webSocketFactory: () => new SockJS(socketUrl) as WebSocket,
      reconnectDelay: 0, // 재연결 없음
      debug: (msg: string) => console.log("[STOMP DEBUG]", msg),

      onConnect: () => {
        connectedOnceRef.current = true;
        console.log("✅ WebSocket 연결 완료 (roomId:", roomId, ")");
        (window as any).stompClient = client;

        subscriptionRef.current = client.subscribe(
          `/sub/chat/room/${roomId}`,
          (message: IMessage) => {
            console.log("📥 WebSocket 메시지 수신:", message.body);
            try {
              const parsed = JSON.parse(message.body);
              onMessage(parsed);
            } catch (err) {
              console.error("❌ 메시지 파싱 실패:", err);
            }
          }
        );
      },

      onStompError: (frame) => {
        console.error("🔥 STOMP 프로토콜 오류:", frame.headers["message"]);
        alert("WebSocket 연결 실패 (STOMP 오류)");
        client.deactivate();
      },

      onWebSocketError: (err) => {
        console.error("❌ WebSocket 레벨 오류 발생:", err);
        alert("WebSocket 연결 실패 (연결 불가)");
        client.deactivate();
      },

      onDisconnect: () => {
        console.log("🔌 WebSocket 연결 종료");
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      subscriptionRef.current?.unsubscribe();
      client.deactivate();
      console.log("🧹 WebSocket 클린업: 연결 해제됨");
    };
  }, [roomId, token, onMessage]);
}

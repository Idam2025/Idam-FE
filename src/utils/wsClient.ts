import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

let client: Client | null = null;

// wsClient.ts
export const connectWebSocket = (
  userId: number,
  onSummary?: (summary: any) => void // ← 두 번째 매개변수 추가
) => {
  const token = localStorage.getItem("accessToken");
  const socket = new SockJS(
    `${process.env.NEXT_PUBLIC_API_URL}/ws/chat?token=${token}`
  );

  client = new Client({
    webSocketFactory: () => socket,
    reconnectDelay: 5000,
    onConnect: () => {
      console.log("✅ WebSocket 연결 성공!!!!!!!");

      if (onSummary) {
        client?.subscribe(`/sub/chat/summary/${userId}`, (message) => {
          const summary = JSON.parse(message.body);
          console.log("📩 요약 수신:", summary);
          onSummary(summary); // 콜백 호출
        });
      }
    },
    onStompError: (frame) => {
      console.error("❌ STOMP 에러:", frame.headers["message"]);
    },
  });

  client.activate();
};

export const disconnectWebSocket = () => {
  if (client && client.active) {
    client.deactivate();
    console.log("🔌 WebSocket 연결 해제");
  }
};

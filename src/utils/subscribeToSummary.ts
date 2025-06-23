import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

export const subscribeToSummary = (userId: string) => {
  const socket = new SockJS(`${process.env.NEXT_PUBLIC_API_URL}/ws`);
  const client = new Client({
    webSocketFactory: () => socket,
    reconnectDelay: 5000,
    onConnect: () => {
      console.log("✅ WebSocket 연결 성공");
      client.subscribe(`/sub/chat/summary/${userId}`, (message) => {
        const summary = JSON.parse(message.body);
        console.log("📥 채팅 요약 수신:", summary);
        // 여기서 알림 상태 업데이트 등 작업 가능
      });
    },
    onStompError: (frame) => {
      console.error("❌ WebSocket STOMP 에러:", frame.headers["message"]);
    },
  });

  client.activate();
};

// src/stores/useChatSummary.ts

import { create } from "zustand"; // ① default 가 아닌 named export
import { ChatRoom } from "@/types/chat"; // ② ChatRoomSummary 대신 기존 ChatRoom 활용
import { connectWebSocket, disconnectWebSocket } from "@/utils/wsClient";

interface ChatSummaryState {
  summaries: ChatRoom[];
  connect: (userId: number) => void;
  disconnect: () => void;
}

export const useChatSummary = create<ChatSummaryState>((set) => ({
  summaries: [],

  // 로그인 직후 호출 → WebSocket summary 구독
  connect: (userId: number) => {
    connectWebSocket(userId, (summary: any) => {
      set((state) => {
        const list = Array.isArray(summary) ? summary : [summary];
        const next = [...state.summaries];

        list.forEach((s) => {
          // ChatRoom 타입으로 매핑
          const room: ChatRoom = {
            id: s.roomId,
            opponentId: s.opponentId,
            opponentName: s.opponentName,
            opponentProfileImage: s.opponentProfileImage,
            project: s.projectTitle,
            lastMessage: s.lastMessage,
            lastMessageAt: s.lastMessageAt,
            unreadCount: s.unreadCount,
          };

          const idx = next.findIndex((r) => r.id === room.id);
          if (idx >= 0) next[idx] = room;
          else next.push(room);
        });

        return { summaries: next };
      });
    });
  },

  // 로그아웃 등에서 호출 → WebSocket 해제 및 초기화
  disconnect: () => {
    disconnectWebSocket();
    set({ summaries: [] });
  },
}));

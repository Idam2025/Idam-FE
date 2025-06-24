"use client";

import { useEffect, useRef, useState } from "react";
import styles from "@/components/chat/chat.module.css";
import { useChatSocket } from "@/stores/useChatSocket";
import ChatList from "@/components/chat/ChatList";
import ChatView from "@/components/chat/ChatView";
import ChatBackground from "@/components/chat/ChatBackgorund";
import { useChatRooms } from "@/hooks/useChatRooms";
import { useWebSocketClient } from "@/hooks/useWebSocketClient";
import { connectWebSocket, disconnectWebSocket } from "@/utils/wsClient";
import { ChatMessage, ChatRoom } from "@/types/chat";

export default function ChatPage() {
  // State & refs
  const [isTyping, setIsTyping] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [showDeleteIcons, setShowDeleteIcons] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [wsConnected, setWsConnected] = useState(false);

  // User info
  const myUserId =
    typeof window !== "undefined"
      ? Number(localStorage.getItem("userId")) || 0
      : 0;
  const accessToken =
    typeof window !== "undefined"
      ? localStorage.getItem("accessToken") || ""
      : "";
  const userType =
    typeof window !== "undefined"
      ? localStorage.getItem("userType") || "STUDENT"
      : "STUDENT";

  // Chat rooms hook
  const { chatRooms, setChatRooms } = useChatRooms(accessToken);
  const selectedChat =
    chatRooms.find((room) => room.id === selectedRoomId) ?? null;

  // Persist unreadCount in localStorage
  // 1) Load saved unread counts on mount
  useEffect(() => {
    const saved = window.localStorage.getItem("unreadCounts");
    if (saved) {
      const map: Record<number, number> = JSON.parse(saved);
      setChatRooms((prev) =>
        prev.map((room) => ({
          ...room,
          unreadCount: map[room.id] ?? room.unreadCount,
        }))
      );
    }
  }, []);

  // 2) Save unread counts whenever chatRooms change
  useEffect(() => {
    const map: Record<number, number> = {};
    chatRooms.forEach((room) => {
      map[room.id] = room.unreadCount;
    });
    window.localStorage.setItem("unreadCounts", JSON.stringify(map));
  }, [chatRooms]);

  // 1) 초기 REST API 로딩 & 매핑
  useEffect(() => {
    if (!accessToken) return;
    const loadRooms = async () => {
      try {
        const endpoint =
          userType === "COMPANY"
            ? "/api/chat/rooms/company"
            : "/api/chat/rooms/student";
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        if (!res.ok) throw new Error("채팅방 불러오기 실패");
        const data = (await res.json()) as Array<{
          roomId: number;
          opponentId: number;
          opponentName: string;
          opponentProfileImage: string;
          lastMessage: string;
          lastMessageAt: string;
          projectTitle: string;
          unreadCount: number;
        }>;
        const rooms: ChatRoom[] = data.map((r) => ({
          id: r.roomId,
          opponentId: r.opponentId,
          opponentName: r.opponentName,
          opponentProfileImage: r.opponentProfileImage,
          project: r.projectTitle,
          lastMessage: r.lastMessage,
          lastMessageAt: r.lastMessageAt,
          unreadCount: r.unreadCount,
        }));
        setChatRooms(rooms);
      } catch (error) {
        console.error("초기 채팅방 불러오기 실패:", error);
      }
    };
    loadRooms();
  }, [accessToken, userType, setChatRooms]);

  // 2) WebSocket summary 업데이트
  useEffect(() => {
    if (!myUserId) return;
    connectWebSocket(myUserId, (summary) => {
      const list = Array.isArray(summary) ? summary : [summary];
      setChatRooms((prev) => {
        const updated = [...prev];
        list.forEach((s) => {
          const idx = updated.findIndex((c) => c.id === s.roomId);
          const mapped: ChatRoom = {
            id: s.roomId,
            opponentId: s.opponentId,
            opponentName: s.opponentName ?? "알 수 없어",
            opponentProfileImage:
              s.opponentProfileImage ?? "/profile/default.png",
            project: s.projectTitle ?? "",
            lastMessage: s.lastMessage ?? "",
            lastMessageAt: s.lastMessageAt ?? "",
            unreadCount: s.roomId === selectedRoomId ? 0 : s.unreadCount ?? 0,
          };
          if (idx >= 0) updated[idx] = { ...updated[idx], ...mapped };
          else updated.push(mapped);
        });
        return updated;
      });
    });
    setWsConnected(true);
    return () => {
      disconnectWebSocket();
      setWsConnected(false);
    };
  }, [myUserId, selectedRoomId, setChatRooms]);

  // Scroll to bottom helper
  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // WebSocket clientRef for subscriptions
  const clientRef = useWebSocketClient({
    chatRooms,
    myUserId,
    accessToken,
    setMessages,
    setChatRooms,
  });

  // 채팅방 선택
  const handleSelectChat = (chat: ChatRoom) => {
    setSelectedRoomId(chat.id);
    setMessages([]);
    // 로컬 unreadCount 리셋
    setChatRooms((prev) =>
      prev.map((r) => (r.id === chat.id ? { ...r, unreadCount: 0 } : r))
    );
    // 서버에 읽음 처리 전송
    const client = clientRef.current;
    if (client && client.connected) {
      client.publish({
        destination: "/pub/chat/read",
        body: JSON.stringify({ roomId: chat.id }),
        headers: { Authorization: `Bearer ${accessToken}` },
      });
    } else {
      console.warn("STOMP 연결 미완료: 읽음 처리 실패");
    }
  };

  // 채팅방 삭제
  const handleDeleteRoom = async (roomId: number) => {
    const endpoint =
      userType === "COMPANY"
        ? `/api/chat/room/${roomId}/company`
        : `/api/chat/room/${roomId}/student`;
    if (!confirm("정말로 삭제하시겠습니까?")) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) throw new Error("채팅방 삭제 실패");
      setChatRooms((prev) => prev.filter((r) => r.id !== roomId));
      if (selectedRoomId === roomId) setSelectedRoomId(null);
    } catch (error) {
      console.error("채팅방 삭제 오류:", error);
    }
  };

  // sendMessage 설정
  const { sendMessage } = useChatSocket(
    selectedRoomId
      ? {
          roomId: selectedRoomId,
          token: accessToken,
          onMessage: (msg) => {
            const fullMsg = { ...msg, roomId: selectedRoomId };
            setMessages((prev) => [...prev, fullMsg]);
            setChatRooms((prevRooms) =>
              prevRooms.map((room) =>
                room.id === selectedRoomId
                  ? {
                      ...room,
                      lastMessage: msg.content,
                      lastMessageAt: msg.sentAt,
                      unreadCount: 0,
                    }
                  : room
              )
            );
            if (msg.senderId !== myUserId) {
              clientRef.current?.publish({
                destination: "/pub/chat/read",
                body: JSON.stringify({ roomId: selectedRoomId }),
                headers: { Authorization: `Bearer ${accessToken}` },
              });
            }
          },
          onConnect: () => console.log("🟢 웹소켓 연결 완료!"),
        }
      : ({ roomId: -1, token: "", onMessage: () => {} } as any)
  );

  // 메시지 전송 핸들러
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || !selectedRoomId) return;
    sendMessage({
      roomId: selectedRoomId,
      senderId: myUserId,
      content: trimmed,
    });
    setInput("");
    const now = new Date().toISOString();
    setChatRooms((prev) =>
      prev.map((room) =>
        room.id === selectedRoomId
          ? { ...room, lastMessage: trimmed, lastMessageAt: now }
          : room
      )
    );
  };

  // 방별 메시지 로딩
  useEffect(() => {
    if (!selectedRoomId) return;
    (async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/chat/room/${selectedRoomId}/messages`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        const data: ChatMessage[] = await res.json();
        setMessages(data);
      } catch (error) {
        console.error("메시지 불러오기 실패:", error);
      }
    })();
  }, [selectedRoomId, accessToken]);

  // 읽음 자동 처리 & 구독 기능들은 기존과 동일
  // ... (생략 가능)

  // 자동 스크롤
  useEffect(scrollToBottom, [messages]);

  return (
    <div className={styles.page}>
      <ChatBackground />
      <div className={styles.chatContainer}>
        <ChatList
          chatRooms={chatRooms}
          showDeleteIcons={showDeleteIcons}
          onToggleDeleteIcons={() => setShowDeleteIcons((p) => !p)}
          onSelectChat={handleSelectChat}
          onDeleteRoom={handleDeleteRoom}
          selectedChatId={selectedRoomId}
        />
        <ChatView
          selectedChat={selectedChat}
          messages={messages}
          input={input}
          myUserId={myUserId}
          bottomRef={bottomRef}
          onChangeInput={setInput}
          onSendMessage={handleSendMessage}
          onTypingChange={setIsTyping}
        />
      </div>
    </div>
  );
}

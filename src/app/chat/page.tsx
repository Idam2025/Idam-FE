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
            opponentName: s.opponentName ?? "알 수 없음",
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
            // 메시지 화면 추가
            const fullMsg = { ...msg, roomId: selectedRoomId };
            setMessages((prev) => [...prev, fullMsg]);
            // 리스트 마지막 메시지 업데이트
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
            // 상대방 메시지면 자동 읽음 처리
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
    // UI에 즉시 반영
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
    const fetchMessages = async () => {
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
    };
    fetchMessages();
  }, [selectedRoomId, accessToken]);
  useEffect(() => {
    // 1) 방이 선택되어 있고, WebSocket이 연결되어 있을 때만
    const client = clientRef.current;
    if (!selectedRoomId || !client?.connected) return;

    // 2) 가장 마지막 메시지를 꺼내서
    const last = messages[messages.length - 1];
    if (!last) return;

    // 3) 내가 보낸 메시지가 아니고, 아직 read 플래그(!last.read)라면
    if (last.senderId !== myUserId && !last.read) {
      client.publish({
        destination: "/pub/chat/read",
        body: JSON.stringify({ roomId: selectedRoomId }),
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      // (선택) 로컬에서도 read 표시
      setMessages((prev) =>
        prev.map((m, i) => (i === prev.length - 1 ? { ...m, read: true } : m))
      );
      // 그리고 목록 배지도 0으로
      setChatRooms((prev) =>
        prev.map((r) =>
          r.id === selectedRoomId ? { ...r, unreadCount: 0 } : r
        )
      );
    }
  }, [messages, selectedRoomId]);

  // 읽음 구독
  useEffect(() => {
    const client = clientRef.current;
    if (!client?.connected) return;
    const subscribed = new Set<string>();
    chatRooms.forEach((room) => {
      const topic = `/sub/chat/read/${room.id}/${myUserId}`;
      if (subscribed.has(topic)) return;
      client.subscribe(topic, (message) => {
        if (message.body === "read") {
          if (selectedRoomId === room.id) {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.senderId === myUserId && !msg.read
                  ? { ...msg, read: true }
                  : msg
              )
            );
          }
          setChatRooms((prevRooms) =>
            prevRooms.map((r) =>
              r.id === room.id ? { ...r, unreadCount: 0 } : r
            )
          );
        }
      });
      subscribed.add(topic);
    });
  }, [chatRooms, clientRef.current, myUserId, selectedRoomId, setChatRooms]);

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

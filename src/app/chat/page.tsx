"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import styles from "@/components/chat/chat.module.css";
import { useChatSocket } from "@/stores/useChatSocket";
import { FaCog, FaTrash } from "react-icons/fa";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import ChatList from "@/components/chat/ChatList";
import ChatView from "@/components/chat/ChatView";
import ChatBackground from "@/components/chat/ChatBackgorund";
import { useChatRooms } from "@/hooks/useChatRooms";
import { useWebSocketClient } from "@/hooks/useWebSocketClient";

interface ChatMessage {
  messageId: number;
  senderId: number;
  senderName: string;
  content: string;
  sentAt: string;
  read: boolean;
}

interface ChatRoom {
  id: number;
  avatar: string;
  name: string;
  project: string;
  lastMessage?: ChatMessage;
  unreadCount?: number;
}

export default function ChatPage() {
  const [selectedChat, setSelectedChat] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [showDeleteIcons, setShowDeleteIcons] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const myUserId =
    typeof window !== "undefined"
      ? Number(localStorage.getItem("userId")) ?? 0
      : 0;
  const accessToken =
    typeof window !== "undefined"
      ? localStorage.getItem("accessToken") ?? ""
      : "";

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const { chatRooms, setChatRooms, fetchChatRooms } = useChatRooms(accessToken);

  const handleSelectChat = (chat: ChatRoom) => {
    setSelectedChat(chat);
    setMessages([]);

    // 읽음 처리 요청 (내가 읽었음을 서버에 알림)
    if (clientRef.current) {
      clientRef.current.publish({
        destination: "/pub/chat/read",
        body: JSON.stringify({ roomId: chat.id }),
        headers: { Authorization: `Bearer ${accessToken}` },
      });
    }
  };

  const handleDeleteRoom = async (roomId: number) => {
    const userType = localStorage.getItem("userType");
    const endpoint =
      userType === "STUDENT"
        ? `/api/chat/room/${roomId}/student`
        : `/api/chat/room/${roomId}/company`;

    if (!confirm("정말로 삭제하시겠습니까?")) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!res.ok) throw new Error("채팅방 삭제 실패");

      setChatRooms((prev) => prev.filter((room) => room.id !== roomId));
      if (selectedChat?.id === roomId) setSelectedChat(null);
    } catch (error) {
      console.error("❌ 채팅방 삭제 오류:", error);
    }
  };

  const { sendMessage } = useChatSocket(
    selectedChat
      ? {
          roomId: selectedChat.id,
          token: accessToken,
          onMessage: (msg) => {
            setMessages((prev) => [...prev, msg]);

            setChatRooms((prevRooms) =>
              prevRooms.map((room) =>
                room.id === selectedChat?.id
                  ? { ...room, lastMessage: msg, unreadCount: 0 }
                  : room
              )
            );
          },
          onConnect: () => console.log("🟢 웹소켓 연결 완료!"),
        }
      : ({ roomId: -1, token: "", onMessage: () => {} } as any)
  );

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || !selectedChat) return;

    sendMessage({
      roomId: selectedChat.id,
      senderId: myUserId,
      content: trimmed,
    });

    setInput("");
    setTimeout(fetchChatRooms, 500);
  };

  useEffect(() => {
    fetchChatRooms();
  }, []);

  useEffect(() => {
    if (!selectedChat) return;

    const fetchMessages = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/chat/room/${selectedChat.id}/messages`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        const data: ChatMessage[] = await res.json();
        setMessages(data);
      } catch (error) {
        console.error("❌ 메시지 불러오기 실패:", error);
      }
    };

    fetchMessages();
  }, [selectedChat]);

  const clientRef = useWebSocketClient({
    chatRooms,
    myUserId,
    accessToken,
    setMessages,
    setChatRooms,
  });

  const subscribedSet = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!clientRef.current || !myUserId) return;

    const client = clientRef.current;

    chatRooms.forEach((room) => {
      const topic = `/sub/chat/read/${room.id}/${myUserId}`;
      if (subscribedSet.current.has(topic)) return;

      client.subscribe(topic, (message) => {
        if (message.body === "read") {
          console.log(`📖 채팅방 ${room.id}에서 상대방이 내 메시지를 읽음`);

          if (selectedChat?.id === room.id) {
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
              r.id === room.id &&
              r.lastMessage?.senderId === myUserId &&
              !r.lastMessage.read
                ? {
                    ...r,
                    lastMessage: { ...r.lastMessage, read: true },
                    unreadCount: 0,
                  }
                : r
            )
          );
        }
      });

      subscribedSet.current.add(topic);
    });
  }, [chatRooms, clientRef.current, myUserId]);

  useEffect(scrollToBottom, [messages]);

  return (
    <div className={styles.page}>
      <ChatBackground />
      <div className={styles.chatContainer}>
        <ChatList
          chatRooms={chatRooms}
          showDeleteIcons={showDeleteIcons}
          onToggleDeleteIcons={() => setShowDeleteIcons((prev) => !prev)}
          onSelectChat={handleSelectChat}
          onDeleteRoom={handleDeleteRoom}
          selectedChatId={selectedChat?.id ?? null}
        />
        <ChatView
          selectedChat={selectedChat}
          messages={messages}
          input={input}
          myUserId={myUserId}
          bottomRef={bottomRef}
          onChangeInput={setInput}
          onSendMessage={handleSendMessage}
        />
      </div>
    </div>
  );
}

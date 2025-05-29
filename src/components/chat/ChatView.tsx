"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./ChatView.module.css";
import ChatInput from "./ChatInput";
import { useChatStore, ChatMessage } from "@/stores/useChatStore";
import { useChatSocket } from "@/stores/useChatSocket";

type Chat = {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
};

export default function ChatView({ chat }: { chat: Chat }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const addMessage = useChatStore((state) => state.addMessage);
  const getMessagesByChatId = useChatStore(
    (state) => state.messagesByChatId[chat.id] || []
  );

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const seenIds = useRef<Set<number>>(new Set());

  const userId =
    typeof window !== "undefined" ? localStorage.getItem("userId") || "0" : "0";
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("accessToken") || ""
      : "";

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/chat/room/${chat.id}/messages`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!res.ok) throw new Error("메시지 조회 실패");

        const data = await res.json();
        console.log("✅ 채팅 메시지 조회 결과:", data);

        const parsedMessages: ChatMessage[] = data.map((item: any) => ({
          id: item.messageId,
          sender: String(item.senderId),
          content: item.content,
          timestamp: new Date(item.sentAt).getTime(),
          type: "TALK",
        }));

        parsedMessages.forEach((msg) => seenIds.current.add(msg.id));
        useChatStore.getState().setMessages(chat.id, parsedMessages);
      } catch (err) {
        console.error("초기 메시지 조회 실패:", err);
      }
    };

    if (token) fetchMessages();
  }, [chat.id, token]);

  useChatSocket({
    roomId: chat.id,
    token,
    onMessage: (data) => {
      if (!data.messageId || seenIds.current.has(data.messageId)) return;
      seenIds.current.add(data.messageId);

      const newMsg: ChatMessage = {
        id: data.messageId,
        sender: String(data.senderId),
        content: data.content,
        timestamp: new Date(data.sentAt).getTime(),
        type: "TALK",
      };

      addMessage(chat.id, newMsg);
    },
    onConnect: () => {
      alert("✅ 구독 완료!");
    },
  });

  useEffect(() => {
    if ((window as any).stompClient?.connected) {
      (window as any).stompClient.publish({
        destination: "/pub/chat/send",
        body: JSON.stringify({
          roomId: chat.id,
          senderId: Number(userId),
          content: `${userId}님이 입장했습니다.`,
        }),
      });
    }
  }, [chat.id, userId]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const newMsg: ChatMessage = {
      id: Date.now(),
      sender: userId,
      content: text,
      timestamp: Date.now(),
      type: "TALK",
    };

    addMessage(chat.id, newMsg);

    const payload = {
      roomId: chat.id,
      senderId: Number(userId),
      content: text,
    };

    try {
      if ((window as any).stompClient?.connected) {
        (window as any).stompClient.publish({
          destination: "/pub/chat/send",
          body: JSON.stringify(payload),
        });
      } else {
        console.warn("❌ WebSocket 연결되지 않음");
      }
    } catch (err) {
      console.error("메시지 전송 실패:", err);
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [getMessagesByChatId]);

  return (
    <div className={styles.container_right}>
      <div className={styles.container_right_up}>
        <h3 style={{ color: "#fff" }}>{chat.name}</h3>
      </div>

      <div className={styles.chatPlace}>
        <div className={styles.comment}>
          <div className={styles.frame}>
            <div className={styles.top}>
              {getMessagesByChatId.map((msg) => (
                <div
                  key={msg.id}
                  className={
                    msg.type === "TALK"
                      ? msg.sender === userId
                        ? styles.messageMe
                        : styles.messageOther
                      : styles.systemMessage
                  }
                >
                  <div>{msg.content}</div>
                  {msg.type === "TALK" && (
                    <div className={styles.timestamp}>
                      {formatTime(msg.timestamp)}
                    </div>
                  )}
                </div>
              ))}
              <div ref={bottomRef} />
            </div>
          </div>
        </div>
      </div>

      <ChatInput onSend={handleSend} />
    </div>
  );
}

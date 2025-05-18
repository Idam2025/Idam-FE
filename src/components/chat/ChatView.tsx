"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./ChatView.module.css";
import Image from "next/image";
import ChatInput from "./ChatInput";
import { useChatStore, ChatMessage } from "@/stores/useChatStore";

type Chat = {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
};

export default function ChatView({ chat }: { chat: Chat }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const addMessage = useChatStore((state) => state.addMessage);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // ✅ 최초 메시지 수동 세팅
    const initial = useChatStore.getState().messagesByChatId[chat.id] || [];
    setMessages(initial);

    // ✅ 이후 구독 시작
    const unsubscribe = useChatStore.subscribe((state) => {
      const msgs: ChatMessage[] = state.messagesByChatId[chat.id] || [];
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [chat.id]);

  const handleSend = (text: string) => {
    const newMsg: ChatMessage = {
      id: Date.now(),
      sender: "me",
      content: text,
      timestamp: Date.now(),
    };
    addMessage(chat.id, newMsg);

    setTimeout(() => {
      addMessage(chat.id, {
        id: Date.now() + 1,
        sender: "other",
        content: "알겠습니다.",
        timestamp: Date.now() + 1,
      });
    }, 1000);
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
  }, [messages]);

  return (
    <div className={styles.container_right}>
      <div className={styles.container_right_up}>
        <h3 style={{ color: "#fff" }}>{chat.name}</h3>
      </div>

      <div className={styles.chatPlace}>
        <div className={styles.comment}>
          <div className={styles.frame}>
            <div className={styles.top}>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`${styles.message} ${
                    msg.sender === "me" ? styles.messageMe : styles.messageOther
                  }`}
                >
                  <div>{msg.content}</div>
                  <div className={styles.timestamp}>
                    {formatTime(msg.timestamp)}
                  </div>
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

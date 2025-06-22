"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import styles from "@/components/chat/chat.module.css";
import { useChatSocket } from "@/stores/useChatSocket";

interface ChatItem {
  id: number;
  name: string;
  project: string;
  avatar: string;
}

interface ChatMessage {
  messageId: number;
  senderId: number;
  senderName: string;
  content: string;
  sentAt: string;
  read: boolean;
}

const dummyChats: ChatItem[] = [
  {
    id: 1,
    name: "김윤아",
    project: "은하수 웹사이트",
    avatar: "/profile/default.png",
  },
  {
    id: 2,
    name: "이유니",
    project: "포트폴리오 개선",
    avatar: "/profile/default.png",
  },
  {
    id: 3,
    name: "박유니",
    project: "AI 자동분류기",
    avatar: "/profile/default.png",
  },
];

export default function ChatPage() {
  const [selectedChat, setSelectedChat] = useState<ChatItem | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");

  const handleSendMessage = () => {
    if (!input.trim() || !selectedChat) return;

    sendMessage({
      roomId: selectedChat.id,
      senderId: myUserId,
      content: input.trim(),
    });

    setMessages((prev) => [
      ...prev,
      {
        messageId: Date.now(),
        senderId: myUserId,
        senderName: "나",
        content: input.trim(),
        sentAt: new Date().toISOString(),
        read: true,
      },
    ]);

    setInput("");
    alert("📨 송신이 완료되었습니다!");
  };

  const myUserId =
    typeof window !== "undefined"
      ? Number(localStorage.getItem("userId")) ?? 0
      : 0;

  const accessToken =
    typeof window !== "undefined"
      ? localStorage.getItem("accessToken") ?? ""
      : "";

  const { sendMessage } = useChatSocket(
    selectedChat
      ? {
          roomId: selectedChat.id,
          token: accessToken,
          onMessage: (msg) => {
            setMessages((prev) => [...prev, msg]);
          },
          onConnect: () => {
            alert("🟢 웹소켓 연결 완료!");
          },
        }
      : // selectedChat이 null이면 훅을 실행하지 않도록 처리
        ({ roomId: -1, token: "", onMessage: () => {} } as any)
  );

  return (
    <div className={styles.page}>
      <div className={styles.background}>
        <Image
          src="/usual/resized_image.png"
          alt="background"
          fill
          priority
          style={{ objectFit: "cover", opacity: 0.9 }}
        />
      </div>

      <div className={styles.chatContainer}>
        {/* ✅ 채팅 목록 */}
        <motion.div className={styles.chatListBox}>
          <h2 className={styles.title}>채팅 목록</h2>
          {dummyChats.map((chat) => (
            <motion.div
              key={chat.id}
              className={styles.chatItem}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setSelectedChat(chat);
                setMessages([]);
              }}
            >
              <Image
                src={chat.avatar}
                alt={chat.name}
                width={40}
                height={40}
                className={styles.avatar}
              />
              <div>
                <div className={styles.name}>{chat.project}</div>
                <div className={styles.lastMessage}>{chat.name}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          key={selectedChat?.id || "empty"}
          className={styles.chatViewBox}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {selectedChat ? (
            <>
              <div className={styles.chatHeader}>
                <Image
                  src={selectedChat.avatar}
                  alt={selectedChat.name}
                  width={36}
                  height={36}
                  className={styles.avatar}
                />
                <span className={styles.name}>
                  {selectedChat.project} | {selectedChat.name}
                </span>
              </div>

              <div className={styles.chatMessages}>
                {messages.map((msg) => (
                  <div
                    key={msg.messageId}
                    className={
                      msg.senderId === myUserId
                        ? styles.myMessage
                        : styles.theirMessage
                    }
                  >
                    {msg.content}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className={styles.chatPlaceholder}></div>
          )}

          {selectedChat && (
            <div className={styles.chatInputBar}>
              <input
                className={styles.chatInput}
                placeholder="메시지를 입력하세요"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (
                    e.key === "Enter" &&
                    !e.shiftKey &&
                    !e.nativeEvent.isComposing
                  ) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />

              <button
                className={styles.sendBtn}
                onClick={() => {
                  if (!input.trim()) return;

                  sendMessage({
                    roomId: selectedChat.id,
                    senderId: myUserId,
                    content: input.trim(),
                  });

                  alert("📨 송신이 완료되었습니다!");
                  setInput("");
                }}
              >
                전송
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

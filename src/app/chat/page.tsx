"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import styles from "@/components/chat/chat.module.css";

interface ChatItem {
  id: number;
  name: string;
  project: string;
  avatar: string;
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
        <motion.div className={styles.chatListBox}>
          <h2 className={styles.title}>채팅 목록</h2>
          {dummyChats.map((chat) => (
            <motion.div
              key={chat.id}
              className={styles.chatItem}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedChat(chat)}
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
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
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
                <div className={styles.theirMessage}>안녕하세요!</div>
                <div className={styles.myMessage}>
                  안녕 {selectedChat.name}!
                </div>
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
              />
              <button className={styles.sendBtn}>전송</button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

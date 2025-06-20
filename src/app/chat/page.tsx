"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import styles from "@/components/chat/chat.module.css";

interface ChatItem {
  id: number;
  name: string;
  avatar: string;
}

const dummyChat: ChatItem = {
  id: 1,
  name: "SpaceBot",
  avatar: "/profile/default.png",
};

export default function ChatPage() {
  const [selectedChat, setSelectedChat] = useState<ChatItem | null>(null);
  const subscriptionRef = useRef<any>(null);

  const subscribeToRoom = (roomId: number) => {
    if (!(window as any).stompClient?.connected) {
      console.warn("❌ 웹소켓 연결 안 됨");
      return;
    }

    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
      console.log("🔄 이전 구독 해제");
    }

    const subscription = (window as any).stompClient.subscribe(
      `/sub/chat/room/${roomId}`,
      (message: any) => {
        const parsed = JSON.parse(message.body);
        console.log(`📩 [room ${roomId}] 새 메시지:`, parsed);
      }
    );

    subscriptionRef.current = subscription;
    console.log(`✅ roomId: ${roomId} 구독 완료`);
  };

  const handleClick = (chat: ChatItem) => {
    subscribeToRoom(chat.id); // ✅ STOMP 구독
    setSelectedChat(chat); // ✅ SPA 화면 전환
  };

  return (
    <div className={styles.page}>
      <div className={styles.background} />

      {/* 채팅 목록 */}
      <motion.div
        className={styles.chatListBox}
        animate={{
          x: selectedChat ? "-30vw" : "0vw",
          height: selectedChat ? "100vh" : "200px",
        }}
        transition={{ duration: 0.5 }}
      >
        <h2 className={styles.title}>채팅 목록</h2>
        <motion.div
          key={dummyChat.id}
          className={styles.chatItem}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleClick(dummyChat)} // ✅ 페이지 이동 제거
        >
          <Image
            src={dummyChat.avatar}
            alt={dummyChat.name}
            width={40}
            height={40}
            className={styles.avatar}
          />
          <div>
            <div className={styles.name}>{dummyChat.name}</div>
            <div className={styles.lastMessage}>우주에 대해 알려줘!</div>
          </div>
        </motion.div>
      </motion.div>

      {/* 채팅창 뷰 */}
      <AnimatePresence>
        {selectedChat && (
          <motion.div
            key="chatView"
            className={styles.chatViewBox}
            initial={{ y: 200, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 200, opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className={styles.chatHeader}>
              <Image
                src={selectedChat.avatar}
                alt={selectedChat.name}
                width={36}
                height={36}
                className={styles.avatar}
              />
              <span className={styles.name}>{selectedChat.name}</span>
            </div>

            <div className={styles.chatMessages}>
              {/* 메시지 예시 */}
              <div className={styles.theirMessage}>안녕하세요!</div>
              <div className={styles.myMessage}>안녕 SpaceBot!</div>
            </div>

            <div className={styles.chatInputBar}>
              <input
                className={styles.chatInput}
                placeholder="메시지를 입력하세요"
              />
              <button className={styles.sendBtn}>전송</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

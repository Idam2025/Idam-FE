"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import styles from "@/components/chat/chat.module.css";
import { ChatMessage, ChatRoom } from "@/types/chat";
import { RefObject } from "react";

interface ChatViewProps {
  selectedChat: ChatRoom | null;
  messages: ChatMessage[];
  input: string;
  myUserId: number;
  bottomRef: RefObject<HTMLDivElement | null>;
  onChangeInput: (val: string) => void;
  onSendMessage: () => void;
}

export default function ChatView({
  selectedChat,
  messages,
  input,
  myUserId,
  bottomRef,
  onChangeInput,
  onSendMessage,
}: ChatViewProps) {
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, bottomRef]);

  return (
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
              src={
                selectedChat.avatar?.trim()
                  ? selectedChat.avatar
                  : "/profile/default.png"
              }
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
            {messages.map((msg) => {
              const isMine = msg.senderId === myUserId;
              return (
                <div
                  key={msg.messageId}
                  className={
                    isMine
                      ? styles.myMessageWrapper
                      : styles.theirMessageWrapper
                  }
                >
                  {isMine ? (
                    <>
                      <div className={styles.messageMeta}>
                        <span className={styles.readStatus}>
                          {msg.senderId === myUserId && !msg.read ? "1" : ""}
                        </span>
                        <span className={styles.timestamp}>
                          {new Date(msg.sentAt).toLocaleTimeString("ko-KR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <div className={styles.myMessage}>{msg.content}</div>
                    </>
                  ) : (
                    <>
                      <div className={styles.theirMessage}>{msg.content}</div>
                      <div className={styles.messageMeta}>
                        <span className={styles.timestamp}>
                          {new Date(msg.sentAt).toLocaleTimeString("ko-KR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>

          <div className={styles.chatInputBar}>
            <input
              className={styles.chatInput}
              placeholder="메시지를 입력하세요"
              value={input}
              onChange={(e) => onChangeInput(e.target.value)}
              onKeyDown={(e) => {
                if (
                  e.key === "Enter" &&
                  !e.shiftKey &&
                  !e.nativeEvent.isComposing
                ) {
                  e.preventDefault();
                  onSendMessage();
                }
              }}
            />
            <button className={styles.sendBtn} onClick={onSendMessage}>
              전송
            </button>
          </div>
        </>
      ) : (
        <div className={styles.chatPlaceholder}></div>
      )}
    </motion.div>
  );
}

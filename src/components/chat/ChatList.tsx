"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { FaCog, FaTrash } from "react-icons/fa";
import styles from "@/components/chat/chat.module.css";
import { ChatRoom } from "@/types/chat";
import defaultAvatar from "/public/profile/default.png";

interface ChatListProps {
  chatRooms: ChatRoom[];
  showDeleteIcons: boolean;
  onToggleDeleteIcons: () => void;
  onSelectChat: (chat: ChatRoom) => void;
  onDeleteRoom: (roomId: number) => void;
  selectedChatId: number | null;
}

export default function ChatList({
  chatRooms,
  showDeleteIcons,
  onToggleDeleteIcons,
  onSelectChat,
  onDeleteRoom,
  selectedChatId,
}: ChatListProps) {
  return (
    <motion.div className={styles.chatListBox}>
      <div className={styles.titleRow}>
        <h2 className={styles.title}>채팅 목록</h2>
        <FaCog
          className={styles.settingsIconGlobal}
          onClick={onToggleDeleteIcons}
        />
      </div>

      {chatRooms.map((chat) => {
        const {
          id,
          opponentProfileImage: rawImg,
          opponentName: rawName,
          project: rawProject,
          lastMessage,
          lastMessageAt,
          unreadCount = 0,
        } = chat;

        // undefined 일 때만 기본값 사용
        const avatarSrc =
          typeof rawImg === "string" && rawImg.trim() !== ""
            ? rawImg.trim()
            : defaultAvatar;
        const opponentName = rawName ?? "알 수 없음";
        const project = rawProject ?? "";
        const titleText = project
          ? `${project} | ${opponentName}`
          : opponentName;
        const messageText =
          typeof lastMessage === "string" ? lastMessage : String(lastMessage);
        const timeText = lastMessageAt
          ? new Date(lastMessageAt).toLocaleTimeString("ko-KR", {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "";

        return (
          <motion.div
            key={id}
            className={`
              ${styles.chatItem}
              ${showDeleteIcons ? styles.showDelete : ""}
              ${id === selectedChatId ? styles.active : ""}
            `}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            {showDeleteIcons && (
              <FaTrash
                className={styles.deleteIcon}
                onClick={() => onDeleteRoom(id)}
              />
            )}

            <div className={styles.chatItemRow}>
              <div
                className={styles.chatItemContent}
                onClick={() => onSelectChat(chat)}
              >
                <Image
                  src={avatarSrc}
                  alt={opponentName}
                  width={40}
                  height={40}
                  className={styles.avatar}
                />

                <div className={styles.chatTextGroup}>
                  <div className={styles.row1}>
                    <div className={styles.projectTitle}>{titleText}</div>
                    <div className={styles.lastTime}>{timeText}</div>
                  </div>

                  <div className={styles.row2}>
                    <div className={styles.lastMessage}>
                      {messageText ? messageText : <em>메시지 없음</em>}
                    </div>
                    {unreadCount > 0 && id !== selectedChatId && (
                      <div className={styles.unreadBadge}>{unreadCount}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

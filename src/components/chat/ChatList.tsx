"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { FaCog, FaTrash } from "react-icons/fa";
import styles from "@/components/chat/chat.module.css";
import { ChatRoom } from "@/types/chat";

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

      {chatRooms.map((chat) => (
        <motion.div
          key={chat.id}
          className={`${styles.chatItem} ${
            showDeleteIcons ? styles.showDelete : ""
          } ${chat.id === selectedChatId ? styles.active : ""}`}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          {showDeleteIcons && (
            <FaTrash
              className={styles.deleteIcon}
              onClick={() => onDeleteRoom(chat.id)}
            />
          )}
          <div className={styles.chatItemRow}>
            <div
              className={styles.chatItemContent}
              onClick={() => onSelectChat(chat)}
            >
              <Image
                src={chat.avatar?.trim() ? chat.avatar : "/profile/default.png"}
                alt={chat.name}
                width={40}
                height={40}
                className={styles.avatar}
              />
              <div className={styles.chatTextGroup}>
                <div className={styles.row1}>
                  <div className={styles.projectTitle}>
                    {chat.project} | {chat.name}
                  </div>
                  <div className={styles.lastTime}>
                    {chat.lastMessage?.sentAt &&
                      new Date(chat.lastMessage.sentAt).toLocaleTimeString(
                        "ko-KR",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                  </div>
                </div>
                <div className={styles.row2}>
                  <div className={styles.lastMessage}>
                    {chat.lastMessage?.content ?? ""}
                  </div>
                  {(chat.unreadCount ?? 0) > 0 && (
                    <div className={styles.unreadBadge}>{chat.unreadCount}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

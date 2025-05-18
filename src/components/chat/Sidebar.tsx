"use client";

import styles from "./Sidebar.module.css";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { dummyChats } from "@/lib/data";
import { useChatStore } from "@/stores/useChatStore";

export default function Sidebar() {
  const router = useRouter();
  const lastMessages = useChatStore((s) => s.lastMessagesByChatId);

  return (
    <div className={styles.sidebar}>
      <div className={styles.fontSpace}>
        <input
          type="text"
          placeholder="채팅 검색"
          className={styles.searchInput}
        />
        <div className={styles.chatList}>
          {dummyChats.map((chat) => (
            <div
              key={chat.id}
              className={styles.chatItemBox}
              onClick={() => router.push(`/chat/${chat.id}`)}
            >
              <Image
                src={chat.avatar}
                alt={chat.name}
                width={32}
                height={32}
                className={styles.chatAvatarRounded}
              />
              <div className={styles.chatTextBright}>
                <div className={styles.chatName}>{chat.name}</div>
                <div className={styles.chatLast}>
                  {lastMessages[chat.id] ?? "대화를 시작해보세요!"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.lowfontSpace}>
        <div className={styles.font1}>설정</div>
        <div className={styles.font1} onClick={() => router.push(`/chat`)}>
          뒤로가기
        </div>
      </div>
    </div>
  );
}

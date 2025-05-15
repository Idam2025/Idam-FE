"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./chatPage.module.css";
import { useMemo } from "react";

const chatMap: Record<number, { name: string; avatar: string }> = {
  1: { name: "Alice", avatar: "/default-profile.png" },
  2: { name: "Bob", avatar: "/default-profile.png" },
  3: { name: "Charlie", avatar: "/default-profile.png" },
  4: { name: "Diana", avatar: "/default-profile.png" },
  5: { name: "Ethan", avatar: "/default-profile.png" },
};

export default function ChatDetailPage() {
  const params = useParams();
  const router = useRouter();
  const chatId = Number(params.id);
  const chat = chatMap[chatId];

  const chatList = useMemo(() => Object.entries(chatMap), []);

  if (!chat)
    return <div style={{ color: "white", padding: 40 }}>Chat not found</div>;

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <div className={styles.fontSpace}>
          <input
            type="text"
            placeholder="Search..."
            className={styles.searchInput}
          />

          <div className={styles.chatList}>
            {chatList.map(([id, c]) => (
              <div
                key={id}
                className={styles.chatItemBox}
                onClick={() => router.push(`/chat/${id}`)}
              >
                <Image
                  src={c.avatar}
                  alt={c.name}
                  width={36}
                  height={36}
                  className={styles.chatAvatarRounded}
                />
                <div className={styles.chatTextBright}>
                  <div className={styles.chatName}>{c.name}</div>
                  <div className={styles.chatLast}>Message preview</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.container_right}>
        <div className={styles.container_right_up}></div>
        <div className={styles.chatPlace}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginBottom: 24,
            }}
          >
            <Image
              src={chat.avatar}
              alt={chat.name}
              width={48}
              height={48}
              style={{ borderRadius: "50%" }}
            />
            <h2 style={{ color: "#f8fafc", fontSize: 20 }}>{chat.name}</h2>
          </div>
          <div className={styles.comment}>
            <div className={styles.frame}>
              <div className={styles.top}>
                <div className={`${styles.messageBubble} ${styles.userBubble}`}>
                  Hey {chat.name}, how are you?
                </div>
                <div
                  className={`${styles.messageBubble} ${styles.partnerBubble}`}
                >
                  I'm good! Just working on a project.
                </div>
                <div className={`${styles.messageBubble} ${styles.userBubble}`}>
                  Did you get my message?
                </div>
                <div
                  className={`${styles.messageBubble} ${styles.partnerBubble}`}
                >
                  Yes! Let’s catch up soon!
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.chatBarPlace}>
          <div className={styles.chatBar}>
            <Image
              src="/chatplace/Image.svg"
              alt="image"
              width={20}
              height={20}
            />
            <input
              placeholder={`Message ${chat.name}`}
              className={styles.darkInput}
            ></input>
          </div>
        </div>
      </div>
    </div>
  );
}

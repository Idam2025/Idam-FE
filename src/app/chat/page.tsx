"use client";

import { useEffect, useState } from "react";
import styles from "@/components/chat/chat.module.css";
import ChatView from "@/components/chat/ChatView";
import { useChatStore } from "@/stores/useChatStore";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface ChatItem {
  id: number;
  name: string;
  lastMessage: string;
  avatar: string;
}

function Sidebar({
  chats,
  onSelectChat,
}: {
  chats: ChatItem[];
  onSelectChat: (chat: ChatItem) => void;
}) {
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
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={styles.chatItemBox}
              onClick={() => onSelectChat(chat)}
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
                  {lastMessages[chat.id] ??
                    chat.lastMessage ??
                    "대화를 시작해보세요!"}
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

function EmptyChatView() {
  return (
    <div className={styles.container_right}>
      <div className={styles.container_right_up}></div>
      <div className={styles.chatPlace}>
        <Image src="/usual/logo.svg" alt="로고" width={61} height={57} />
        <div className={styles.comment}>
          {["Chats", "Star", "ShieldWarning"].map((icon, i) => (
            <div className={styles.frame} key={icon + i}>
              <div className={styles.top}>
                <Image
                  src={`/chatplace/${icon}.svg`}
                  alt={icon}
                  width={32}
                  height={32}
                />
                {[1, 2, 3].map((n) => (
                  <div key={n} className={styles.fontFrame}>
                    "Got any creative ideas for a 10 year old's birthday?"
                  </div>
                ))}
              </div>
            </div>
          ))}
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
          <input placeholder="message" className={styles.darkInput} />
        </div>
      </div>
    </div>
  );
}

export default function ChatPage() {
  const [chatList, setChatList] = useState<ChatItem[]>([]);
  const [selectedChat, setSelectedChat] = useState<ChatItem | null>(null);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const userType = localStorage.getItem("userType");
    if (!accessToken || !userType) return;

    const fetchChats = async () => {
      try {
        const endpoint =
          userType === "STUDENT"
            ? "/api/chat/rooms/student"
            : "/api/chat/rooms/company";

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!res.ok) throw new Error("채팅방 목록 로딩 실패");

        const data = await res.json();
        const chats = data.map((item: any) => ({
          id: item.roomId,
          name: item.opponentName,
          lastMessage: item.lastMessage || "새로운 채팅입니다",
          avatar: item.opponentProfileImage || "/profile/default.png",
        }));

        setChatList(chats);
      } catch (err) {
        console.error(err);
      }
    };

    fetchChats();
  }, []);

  return (
    <div className={styles.container}>
      <Sidebar chats={chatList} onSelectChat={setSelectedChat} />
      {selectedChat ? <ChatView chat={selectedChat} /> : <EmptyChatView />}
    </div>
  );
}

"use client";

import { useParams } from "next/navigation";
import styles from "./chatPage.module.css";
import ChatView from "@/components/chat/ChatView";
import { dummyChats } from "@/lib/data";

export default function ChatRoomPage() {
  const params = useParams();
  const chatId = Number(params.id);
  const chat = dummyChats.find((c) => c.id === chatId);

  if (!chat) return <div>채팅방이 존재하지 않습니다.</div>;

  return (
    <div className={styles.container}>
      <ChatView chat={chat} />
    </div>
  );
}

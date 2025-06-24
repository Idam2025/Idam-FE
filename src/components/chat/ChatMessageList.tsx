import styles from "./chat.module.css";
import { RefObject } from "react";
interface ChatMessageListProps {
  messages: ChatMessage[];
  myUserId: number;
  bottomRef: RefObject<HTMLDivElement>;
}

export default function ChatMessageList({
  messages,
  myUserId,
  bottomRef,
}: ChatMessageListProps) {
  return (
    <div className={styles.messages}>
      {messages.map((msg) => (
        <div
          key={msg.messageId}
          className={
            msg.senderId === myUserId ? styles.myMessage : styles.otherMessage
          }
        >
          <div className={styles.messageContent}>{msg.content}</div>
          <div className={styles.messageTime}>
            {new Date(msg.sentAt).toLocaleTimeString("ko-KR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
            {msg.senderId === myUserId && msg.read && <span>✔</span>}
          </div>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}

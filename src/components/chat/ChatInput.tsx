"use client";

import { useState } from "react";
import styles from "./ChatView.module.css";
import Image from "next/image";

interface ChatInputProps {
  onSend: (message: string) => void;
}

export default function ChatInput({ onSend }: ChatInputProps) {
  const [input, setInput] = useState("");
  const [isComposing, setIsComposing] = useState(false);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setInput("");
  };

  return (
    <div className={styles.chatBarPlace}>
      <div className={styles.chatBar}>
        <Image src="/chatplace/Image.svg" alt="image" width={20} height={20} />
        <input
          placeholder="Type a message..."
          className={styles.darkInput}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => setIsComposing(false)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !isComposing) {
              handleSend();
            }
          }}
        />
      </div>
    </div>
  );
}

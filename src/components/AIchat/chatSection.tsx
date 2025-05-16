"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./ChatSection.module.css";

export default function ChatInput() {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  // domain, price → query로 유지
  const domain = searchParams.get("domain");
  const price = searchParams.get("price");

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    autoResize();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.key === "Enter" || e.key === "NumpadEnter") && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (input.trim() === "") return;

    if (!domain || !price) {
      alert("카테고리 또는 가격 정보를 먼저 선택해주세요.");
      router.push("/ai-helper/next/choice");
      return;
    }

    // ✅ AIChat에서는 API 호출 없이 → 바로 result 페이지로 prompt 포함 redirect
    if (confirm("AI 매칭 결과 페이지로 이동할까요?")) {
      router.push(
        `/result?domain=${encodeURIComponent(
          domain
        )}&price=${encodeURIComponent(price)}&prompt=${encodeURIComponent(
          input
        )}`
      );
    }

    setInput(""); // 입력창 초기화
    if (textareaRef.current) {
      textareaRef.current.style.height = "40px"; // 높이 초기화
    }
  };

  const autoResize = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "40px"; // reset
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    autoResize();
  }, []);

  return (
    <div className={styles.chatInputContainer}>
      <div className={styles.inputWrapper}>
        <textarea
          ref={textareaRef}
          className={styles.textarea}
          placeholder="메시지를 입력하세요..."
          value={input}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          rows={1}
        />
        <button className={styles.sendButton} onClick={handleSend}>
          ➤
        </button>
      </div>
    </div>
  );
}

"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./ChatSection.module.css";

export default function ChatInput() {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const domain = searchParams?.get("domain") ?? "";

  useEffect(() => {
    autoResize();
    console.log("📦 searchParams domain:", domain);
  }, [domain]);

  const autoResize = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "40px";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const resetInput = () => {
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "40px";
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInput(value);
    autoResize();
  };

  const handleSend = async () => {
    const trimmed = input.trim();
    if (isLoading || !trimmed) return;

    if (!domain) {
      alert(
        "카테고리를 선택하지 않으셨습니다. 카테고리 선택 창으로 이동합니다."
      );
      router.push("/ai-helper/next");
      return;
    }

    sessionStorage.setItem("prompt", trimmed);

    // 브라우저에 prompt 저장이 완료되었는지 확인하고 이동
    requestAnimationFrame(() => {
      const encodedDomain = encodeURIComponent(domain);
      router.push(`/result?domain=${encodedDomain}`);
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.inputBox}>
        <textarea
          ref={textareaRef}
          className={styles.textArea}
          placeholder="요청사항을 입력하세요..."
          value={input}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          rows={1}
          disabled={isLoading}
        />
        <button
          type="button"
          className={styles.sendBtn}
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
        >
          {isLoading ? "..." : "➤"}
        </button>
      </div>
    </div>
  );
}

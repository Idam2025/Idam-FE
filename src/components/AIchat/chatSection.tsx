"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./ChatSection.module.css";

export default function ChatInput() {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const domain = searchParams.get("domain");

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

  const postPrompt = async () => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) throw new Error("Access Token이 없습니다.");

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ai-match`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: "include",
      body: JSON.stringify({ domain, prompt: input }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err?.message || "AI 매칭 요청 실패");
    }

    const data = await res.json();
    router.push("/result");
  };

  const handleSend = async () => {
    setErrorMsg("");

    if (!input.trim()) return;
    if (!domain) {
      setErrorMsg("도메인 정보가 없습니다. 다시 선택해주세요.");
      router.push("/ai-helper/next/choice");
      return;
    }

    const confirmed = confirm("AI 검색을 시작할까요?");
    if (!confirmed) return;

    setIsLoading(true);
    try {
      // 여기에 API 요청 제거
      router.push(
        `/result?domain=${encodeURIComponent(
          domain
        )}&prompt=${encodeURIComponent(input)}`
      );
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "페이지 이동 중 오류 발생");
    } finally {
      setIsLoading(false);
      resetInput();
    }
  };

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

  useEffect(() => {
    autoResize();
  }, []);

  return (
    <div className={styles.container}>
      {errorMsg && <div className={styles.error}>{errorMsg}</div>}

      <div className={styles.inputBox}>
        <textarea
          ref={textareaRef}
          className={styles.textArea}
          placeholder="메시지를 입력하세요..."
          value={input}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          rows={1}
          disabled={isLoading}
        />
        <button
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

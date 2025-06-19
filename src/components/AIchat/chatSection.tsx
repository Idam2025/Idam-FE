"use client";

import { useState, useRef, useEffect } from "react";
import { flushSync } from "react-dom";
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

  const postPrompt = async () => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      setErrorMsg("Access Token이 없습니다.");
      return;
    }

    if (!input.trim()) {
      setErrorMsg("프롬프트 내용을 입력해주세요.");
      return;
    }

    if (!domain) {
      setErrorMsg("도메인 정보가 없습니다. 다시 선택해주세요.");
      router.push("/ai-helper/next");
      return;
    }

    const confirmed = confirm("AI 검색을 시작할까요?");
    if (!confirmed) return;

    setIsLoading(true);
    try {
      const promptToSend = input.trim();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/matching/by-ai`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          credentials: "include",
          body: JSON.stringify({ domain, prompt: promptToSend }),
        }
      );

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err?.message || "AI 매칭 요청 실패");
      }

      const encodedDomain = encodeURIComponent(domain);
      const encodedPrompt = encodeURIComponent(promptToSend);
      router.push(`/result?domain=${encodedDomain}&prompt=${encodedPrompt}`);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "AI 요청 처리 중 오류 발생");
    } finally {
      setIsLoading(false);
      resetInput();
    }
  };

  const inputRef = useRef("");

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInput(value);
    inputRef.current = value; // 항상 최신 문자열 저장
    autoResize();
  };

  const handleSend = async () => {
    setErrorMsg("");

    const trimmed = input.trim();

    if (!trimmed) {
      setErrorMsg("프롬프트 내용을 입력해주세요.");
      return;
    }

    if (!domain) {
      setErrorMsg("도메인 정보가 없습니다. 다시 선택해주세요.");
      router.push("/ai-helper/next");
      return;
    }

    const confirmed = confirm("AI 검색을 시작할까요?");
    if (!confirmed) return;

    setIsLoading(true);
    resetInput();

    // 상태 업데이트 및 리렌더링 후 300ms 기다린 뒤 push
    setTimeout(() => {
      const encodedPrompt = encodeURIComponent(trimmed);
      const encodedDomain = encodeURIComponent(domain);
      router.push(`/result?domain=${encodedDomain}&prompt=${encodedPrompt}`);
      setIsLoading(false);
    }, 300);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.key === "Enter" || e.key === "NumpadEnter") && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

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

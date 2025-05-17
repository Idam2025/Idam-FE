"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./ChatSection.module.css";

export default function ChatInput() {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

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

  const handleSend = async () => {
    if (input.trim() === "") return;

    if (!domain) {
      alert("도메인 정보가 없습니다. 이전 페이지부터 다시 선택해주세요.");
      router.push("/ai-helper/next/choice");
      return;
    }

    if (confirm("AI 검색을 시작할까요?")) {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) throw new Error("Access Token이 없습니다.");

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/ai-match`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            credentials: "include", // refreshToken 쿠키 자동 포함
            body: JSON.stringify({
              domain,
              prompt: input,
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData?.message || "AI 매칭 요청 실패");
        }

        const data = await response.json();
        console.log("AI 매칭 결과:", data);

        // ➡ 결과 페이지로 이동 (필요하다면 데이터 전달 가능)
        router.push("/result");
      } catch (error: any) {
        console.error(error);
        alert(error.message || "AI 매칭 중 오류 발생");
      }
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

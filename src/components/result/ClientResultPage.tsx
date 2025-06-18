"use client";

import { useEffect, useState } from "react";
import ResultSection from "@/components/result/section";
import SuspensePage from "@/components/result/suspense";

import styles from "./section.module.css";

type Props = {
  domain: string;
  prompt: string;
};

export default function ClientResultPage({ domain, prompt }: Props) {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAiMatchResult = async () => {
      if (!domain || !prompt) {
        setError("❗ 도메인 또는 프롬프트 누락");
        setLoading(false);
        return;
      }

      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        setError("❗ 로그인 정보가 없습니다.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/matching/by-ai`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ domain, prompt }),
          }
        );

        if (!res.ok) {
          const errText = await res.text();
          console.error("🚨 API Error Response:", errText);
          setError("❗ AI 매칭 요청 실패");
          return;
        }

        const result = await res.json();
        console.log("✅ AI 매칭 결과:", result.data);
        setData(result.data);
      } catch (err: any) {
        console.error("🚨 예외 발생:", err);
        setError(err.message || "❗ 알 수 없는 에러 발생");
      } finally {
        setLoading(false);
      }
    };

    fetchAiMatchResult();
  }, [domain, prompt]);

  if (loading) return <SuspensePage />;
  if (error) return <div className={styles.errorMessage}>{error}</div>;
  if (!data || data.length === 0)
    return <div className={styles.emptyMessage}>매칭 결과가 없습니다.</div>;

  return <ResultSection data={data} />;
}

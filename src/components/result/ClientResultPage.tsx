"use client";

import { useEffect, useState } from "react";
import ResultSection from "@/components/result/section";
import SuspensePage from "@/components/result/suspense";

type Props = {
  domain: string;
  prompt: string;
};

export default function ClientResultPage({ domain, prompt }: Props) {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  console.log("✅ domain:", domain);
  console.log("✅ prompt:", prompt);

  useEffect(() => {
    const fetchAiTag = async () => {
      try {
        if (!domain || !prompt) {
          setError("도메인 또는 프롬프트 누락");
          return;
        }

        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          setError("Access Token이 없습니다.");
          return;
        }

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
          const err = await res.text();
          console.error("API Error Response:", err);
          setError("AI 매칭 API 호출 실패");
          return;
        }

        const result = await res.json();
        setData(result.data);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "에러 발생");
      } finally {
        setLoading(false);
      }
    };

    fetchAiTag();
  }, [domain, prompt]);

  if (loading) return <SuspensePage />;
  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!data) return <div>결과 없음</div>;

  return <ResultSection data={data} />;
}

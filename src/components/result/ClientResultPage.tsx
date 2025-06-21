"use client";

import { useEffect, useState } from "react";
import ResultSection from "@/components/result/section";
import SuspensePage from "@/components/result/suspense";
import { useRouter } from "next/navigation";
import styles from "./section.module.css";

type Props = {
  domain: string;
  prompt: string;
};

export default function ClientResultPage({ domain, prompt }: Props) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchAiMatchResult = async () => {
      if (!domain || !prompt) {
        alert("❗ 도메인 또는 프롬프트가 누락되었습니다.");
        router.push("/");
        return;
      }

      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        alert("❗ 로그인 정보가 없습니다. 홈으로 이동합니다.");
        router.push("/");
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
          alert("❗ AI 매칭 요청에 실패했습니다. 홈으로 이동합니다.");
          router.push("/");
          return;
        }

        const result = await res.json();
        console.log("✅ AI 매칭 결과:", result.data);
        setData(result.data);
      } catch (err: any) {
        console.error("🚨 예외 발생:", err);
        alert(
          err.message || "❗ 알 수 없는 오류가 발생했습니다. 홈으로 이동합니다."
        );
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    fetchAiMatchResult();
  }, [domain, prompt, router]);

  if (loading) return <SuspensePage />;
  if (!data || data.length === 0)
    return <div className={styles.emptyMessage}>매칭 결과가 없습니다.</div>;

  return <ResultSection data={data} />;
}

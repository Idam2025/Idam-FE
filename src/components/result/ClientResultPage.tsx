"use client";

import { useEffect, useState, useRef } from "react";
import ResultSection from "@/components/result/section";
import SuspensePage from "@/components/result/suspense";
import { useRouter } from "next/navigation";
import styles from "./section.module.css";
import NavigationBar from "../navigationbar/Home/mainNavigationBar";

type Props = {
  domain: string;
};

export default function ClientResultPage({ domain }: Props) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const hasFetchedRef = useRef(false); // ✅ useRef로 변경

  // 스크롤 막기
  useEffect(() => {
    const originalOverflow = document.body.style.overflowY;
    document.body.style.overflowY = "hidden";
    return () => {
      document.body.style.overflowY = originalOverflow;
    };
  }, []);

  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;

    const fetchAiMatchResult = async () => {
      if (!domain) {
        alert("❗ 도메인이 누락되었습니다.");
        router.push("/");
        return;
      }

      let prompt: string | null = null;
      const maxRetries = 10;
      let retries = 0;

      while (!prompt && retries < maxRetries) {
        prompt = sessionStorage.getItem("prompt");
        if (prompt) break;
        await new Promise((resolve) => setTimeout(resolve, 50));
        retries++;
      }

      if (!prompt) {
        alert("❗ 프롬프트가 없습니다.");
        router.push("/");
        return;
      }

      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        alert("❗ 로그인 정보가 없습니다.");
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
          console.error("🚨 API 오류:", errText);
          alert("❗ 매칭 실패. 홈으로 이동합니다.");
          router.push("/");
          return;
        }

        const result = await res.json();
        console.log("✅ 매칭 성공:", result.data);
        setData(result.data || []);
      } catch (err: any) {
        console.error("❌ 예외 발생:", err);
        alert(err.message || "❗ 알 수 없는 오류입니다.");
        router.push("/");
      } finally {
        sessionStorage.removeItem("prompt");
        setLoading(false);
      }
    };

    fetchAiMatchResult();
  }, [domain, router]);

  if (loading) return <SuspensePage />;
  if (!data || data.length === 0)
    return <div className={styles.emptyMessage}>매칭 결과가 없습니다.</div>;

  return (
    <div className={styles.section}>
      <NavigationBar />
      <ResultSection data={data} />
    </div>
  );
}

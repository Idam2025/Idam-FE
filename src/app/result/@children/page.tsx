import { Suspense } from "react";
import ResultSection from "@/components/result/section";
import SuspensePage from "@/components/result/suspense";
import { cookies } from "next/headers";

async function fetchAiTag(domain: string, prompt: string) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ai-tag`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: "include",
    body: JSON.stringify({ domain, prompt }),
    cache: "no-store",
  });

  if (!res.ok) throw new Error("AI 매칭 API 호출 실패");

  return res.json();
}

export default async function ResultPage({
  searchParams,
}: {
  searchParams: { domain?: string; prompt?: string };
}) {
  const { domain, prompt } = searchParams;

  if (!domain || !prompt) return <div>도메인 또는 프롬프트 누락</div>;

  const dataPromise = fetchAiTag(domain, prompt);
  return (
    <Suspense fallback={<SuspensePage />}>
      <ResultSection dataPromise={dataPromise} />
    </Suspense>
  );
}

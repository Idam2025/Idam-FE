import ClientResultPage from "@/components/result/ClientResultPage";

export default async function ResultPage({
  searchParams,
}: {
  searchParams: { domain?: string; prompt?: string };
}) {
  const domainParam = await searchParams.domain;
  const promptParam = await searchParams.prompt;

  const domain = typeof domainParam === "string" ? domainParam : "";
  const prompt = typeof promptParam === "string" ? promptParam : "";

  return <ClientResultPage domain={domain} prompt={prompt} />;
}

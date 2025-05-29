import ClientResultPage from "@/components/result/ClientResultPage";

export default function ResultPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const domain =
    typeof searchParams.domain === "string" ? searchParams.domain : "";
  const prompt =
    typeof searchParams.prompt === "string" ? searchParams.prompt : "";

  return <ClientResultPage domain={domain} prompt={prompt} />;
}

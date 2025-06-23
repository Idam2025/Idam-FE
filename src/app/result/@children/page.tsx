import ClientResultPage from "@/components/result/ClientResultPage";

export default function ResultPage({
  searchParams,
}: {
  searchParams: { domain?: string };
}) {
  const domain =
    typeof searchParams.domain === "string" ? searchParams.domain : "";
  return <ClientResultPage domain={domain} />;
}

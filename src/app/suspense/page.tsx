import { Suspense } from "react";
import SuspenseClient from "@/components/result/suspense";

export default function Page() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <SuspenseClient />
    </Suspense>
  );
}

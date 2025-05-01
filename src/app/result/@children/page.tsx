import { Suspense } from "react";
import SuspensePage from "@/components/result/suspense";

import ResultSection from "@/components/result/section";

export default function Page() {
  return (
    <>
      <Suspense fallback={<SuspensePage />}>
        <ResultSection />
      </Suspense>
    </>
  );
}

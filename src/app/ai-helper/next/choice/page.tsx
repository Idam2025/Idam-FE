"use client";
import ChoiceSection from "@/components/choice/section";
import style from "./choice.module.css";
import { Suspense } from "react";
export default function Page() {
  return (
    <>
      <div className={style.container}>
        <Suspense fallback={<div>AI Chat 로딩 중...</div>}>
          <ChoiceSection />
        </Suspense>
      </div>
    </>
  );
}

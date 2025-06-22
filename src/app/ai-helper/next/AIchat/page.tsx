"use client";
import AiSection from "@/components/AIchat/section";
import style from "./AIchat.module.css";
import { Suspense } from "react";
import NavigationBar from "@/components/navigationbar/Home/mainNavigationBar";
import BackButton from "@/components/next/BackButton";

export default function Page() {
  return (
    <>
      <div className={style.container}>
        <Suspense fallback={<div>AI Chat 로딩 중...</div>}>
          <NavigationBar />
          <AiSection />
          <BackButton />
        </Suspense>
      </div>
    </>
  );
}

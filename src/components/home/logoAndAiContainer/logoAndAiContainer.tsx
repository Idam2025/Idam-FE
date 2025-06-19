"use client";

import Image from "next/image";
import style from "./logoAndAiContainer.module.css";
import Link from "next/link";
import { motion } from "framer-motion";

const SLOGANS = [
  "필요는 인재를 부르고, 이담은 연결합니다.",
  "AI 매칭으로 더 빠르게, 더 정확하게",
];

export default function LogoAndAiContainer() {
  return (
    <motion.div
      className={style.container}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <LogoSection />
      <AiMatchSection />
    </motion.div>
  );
}

function LogoSection() {
  return (
    <div className={style.logo_container}>
      <Image src="/usual/logo.svg" alt="logo" width={76} height={71} />
      <div className={style.font1}>IDAM connects, Idam reflects.</div>
      {SLOGANS.map((line, idx) => (
        <motion.div
          className={style.font2}
          key={idx}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 + idx * 0.4 }}
        >
          {line}
        </motion.div>
      ))}
    </div>
  );
}

function AiMatchSection() {
  return (
    <div className={style.ai_container}>
      <Link href="/ai-helper" className={style.textArea}>
        <div className={style.font}>작업 의뢰</div>
      </Link>
    </div>
  );
}

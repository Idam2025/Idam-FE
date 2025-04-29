"use client";

import Image from "next/image";
import styles from "./section.module.css";
import ChatInput from "./chatSection";
export default function AiSection() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <Image src="/logo.svg" alt="logo" width={120} height={120} />
        <div className={styles.title}>Talk to your AI Partner IDAM</div>
        <ChatInput />
      </div>
    </div>
  );
}

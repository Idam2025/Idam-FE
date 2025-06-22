"use client";

import { useRouter } from "next/navigation";
import styles from "./BackButton.module.css";
import { ArrowLeft } from "lucide-react"; // 아이콘 라이브러리 사용 시

export default function BackButton() {
  const router = useRouter();

  return (
    <button className={styles.backButton} onClick={() => router.back()}>
      <ArrowLeft size={18} />
      <span>Back</span>
    </button>
  );
}

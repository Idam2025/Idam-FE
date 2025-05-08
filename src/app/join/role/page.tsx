"use client";

import { useRouter } from "next/navigation";
import styles from "./role.module.css";
import Image from "next/image";

export default function RoleSelectPage() {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>회원가입 유형을 선택하세요</h2>
      <div className={styles.cardContainer}>
        <div
          className={styles.card}
          onClick={() => router.push("/join/student")}
        >
          <img
            className={styles.cardImage}
            src="/role/student.jpg"
            alt="학생 이미지"
          />
          <div className={styles.roleTitle}>학생</div>
          <div className={styles.description}>
            포트폴리오와 실력을 등록해 외주 제안을 받아보세요.
          </div>
        </div>
        <div
          className={styles.card}
          onClick={() => router.push("/join/company")}
        >
          <img
            className={styles.cardImage}
            src="/role/company.jpg"
            alt="기업 이미지"
          />
          <div className={styles.roleTitle}>기업</div>
          <div className={styles.description}>
            전문 학생 인재를 찾고 직접 제안해보세요.
          </div>
        </div>
      </div>
    </div>
  );
}

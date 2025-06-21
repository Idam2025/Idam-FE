"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import styles from "./section.module.css";
import ProfileClientModal from "@/components/modal/ProfileClientModal";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

export default function ResultSection({ data }: { data: any[] }) {
  const fallback = "/profile/default.png";
  const sortedStudents = [...(data ?? [])].sort((a, b) => b.score - a.score);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const handleSeeMore = () => {
    const domain = searchParams.get("domain");
    const prompt = searchParams.get("prompt");

    console.log("🔁 See more clicked!", { domain, prompt });

    if (!domain || !prompt) {
      alert("❗ 도메인 또는 프롬프트 정보가 없습니다.");
      router.push("/ai-helper/next");
      return;
    }

    const encodedDomain = encodeURIComponent(domain);
    const encodedPrompt = encodeURIComponent(prompt);
    router.push(`/suspense?domain=${encodedDomain}&prompt=${encodedPrompt}`);
  };

  const rankedStudents = sortedStudents.map((student, index) => ({
    ...student,
    rank: index + 1,
  }));

  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.textContainer}>
          <div className={styles.font1}>Meet our team members at IDam</div>
          <div className={styles.font2}>
            They are passionate and skilled professionals, ready to bring your
            vision to life through creativity, technology, and collaboration.
          </div>
          <div
            className={styles.group}
            onClick={handleSeeMore}
            style={{
              opacity: isLoading ? 0.6 : 1,
              pointerEvents: isLoading ? "none" : "auto",
            }}
          >
            {isLoading ? (
              <div className={styles.loader}></div>
            ) : (
              <>
                <div className={styles.font3}>See more</div>
                <Image
                  src="/usual/arrow2.svg"
                  alt="arrow2"
                  width={20}
                  height={20}
                />
              </>
            )}
          </div>
        </div>

        <div className={styles.center}>
          <div className={styles.carousel}>
            {rankedStudents.map((student, index) => {
              const isFocused = index === (hoverIndex ?? 0);
              return (
                <motion.div
                  key={student.userId}
                  className={styles.slideItem}
                  onMouseEnter={() => setHoverIndex(index)}
                  onClick={() => setSelectedStudent(student)}
                  animate={{
                    scale: isFocused ? 1.1 : 1,
                    opacity: isFocused ? 1 : 0.4,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    src={student.profileImage?.trim() || fallback}
                    alt={student.name}
                    className={styles.profileImage}
                  />
                  <div className={styles.caption}>
                    <div className={styles.name}>{student.name}</div>
                    <div className={styles.score}>{student.score}점</div>
                    <div className={styles.rank}>
                      {student.rank === 1 && "👑 "}
                      {student.rank === 2 && "🥈 "}
                      {student.rank === 3 && "🥉 "}
                      {student.rank}위
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {selectedStudent && (
        <ProfileClientModal
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
        />
      )}
    </>
  );
}

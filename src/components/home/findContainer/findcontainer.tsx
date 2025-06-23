"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import style from "./findContainer.module.css";

type Student = {
  userId: number;
  name: string;
  profileImage: string | null;
  tags: string[];
  categoryId: number;
};

type SectionData = {
  title: string;
  description: string;
  direction: string;
  students: Student[];
};

const categoryMap: Record<number, Omit<SectionData, "students">> = {
  1: {
    title: "IT·프로그래밍",
    description:
      "전문 백엔드부터 프론트엔드까지 다양한 개발 인재를 찾을 수 있어요.",
    direction: "left",
  },
  2: {
    title: "디자인",
    description:
      "UX/UI부터 브랜드 디자인까지 감각적인 디자이너들을 만날 수 있어요.",
    direction: "right",
  },
  3: {
    title: "마케팅",
    description:
      "컨텐츠 기획, 광고 전략 등 실전 마케팅까지 경험을 가지고 있는 인재들이 모여있어요.",
    direction: "left",
  },
};

export default function FindContainer() {
  const [sections, setSections] = useState<SectionData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = () => {
      setIsLoading(true);
      const loadingStart = Date.now();

      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/students/preview`)
        .then((res) => res.json())
        .then((res) => {
          const categorized: Record<number, Student[]> = {
            1: [],
            2: [],
            3: [],
          };
          for (const student of res.data) {
            const catId = student.categoryId;
            if (categorized[catId] && categorized[catId].length < 4) {
              categorized[catId].push(student);
            }
            if (
              categorized[1].length >= 4 &&
              categorized[2].length >= 4 &&
              categorized[3].length >= 4
            ) {
              break;
            }
          }
          const newSections: SectionData[] = Object.entries(categorized).map(
            ([catId, students]) => ({
              ...categoryMap[+catId],
              students,
            })
          );
          setSections(newSections);
        })
        .finally(() => {
          const elapsed = Date.now() - loadingStart;
          const remaining = 1000 - elapsed;
          if (remaining > 0) {
            setTimeout(() => setIsLoading(false), remaining);
          } else {
            setIsLoading(false);
          }
        });
    };

    fetchData();
    const interval = setInterval(fetchData, 15 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={style.findContainerWrapper}>
      {sections.map((section, idx) => (
        <motion.div
          key={idx}
          className={style.card}
          initial={{ x: section.direction === "left" ? -20 : 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <div className={style.left}>
            <div className={style.sectionTitle}>{section.title}</div>
            <div className={style.sectionDesc}>{section.description}</div>
          </div>
          <div className={style.right}>
            {section.students.map((student, idx) => (
              <div className={style.profileWrapper}>
                <div className={style.imageWrapper}>
                  <Image
                    src={student.profileImage || "/profile/default.png"}
                    alt={student.name || "프로필 이미지"}
                    className={style.image}
                    width={170}
                    height={170}
                  />
                </div>
                <div className={style.name}>{student.name}</div>
                <div className={style.tagList}>
                  {student.tags.slice(0, 3).map((tag, i) => (
                    <span key={i} className={style.tag}>
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

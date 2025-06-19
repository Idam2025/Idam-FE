"use client";
import Image from "next/image";
import style from "./findContainer.module.css";
import { motion } from "framer-motion";

const sections = [
  {
    title: "IT·프로그래밍",
    description:
      "전문 백엔드부터 프론트엔드까지 다양한 개발 인재를 찾을 수 있어요.",
    images: [
      "/profile/default.png",
      "/profile/default.png",
      "/profile/default.png",
      "/profile/default.png",
    ],
    direction: "left",
  },
  {
    title: "디자인",
    description:
      "UX/UI부터 브랜드 디자인까지 감각적인 디자이너들을 만나보세요.",
    images: [
      "/profile/default.png",
      "/profile/default.png",
      "/profile/default.png",
      "/profile/default.png",
    ],
    direction: "right",
  },
  {
    title: "마케팅",
    description:
      "콘텐츠 기획, 광고 전략 등 실전 마케팅 경험을 갖춘 인재들이 모였어요.",
    images: [
      "/profile/default.png",
      "/profile/default.png",
      "/profile/default.png",
      "/profile/default.png",
    ],
    direction: "left",
  },
];

type SectionProps = {
  title: string;
  description: string;
  images: string[];
  direction: string;
};

function Section({ title, description, images, direction }: SectionProps) {
  const moveX = direction === "left" ? -20 : 20;

  return (
    <motion.div
      className={style.card}
      initial={{ x: moveX, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
    >
      <div className={style.left}>
        <div className={style.sectionTitle}>{title}</div>
        <div className={style.sectionDesc}>{description}</div>
      </div>
      <div className={style.right}>
        {images.slice(0, 4).map((src, idx) => (
          <Image
            key={idx}
            src={src}
            alt={`example-${idx}`}
            width={200}
            height={200}
            className={style.image}
          />
        ))}
      </div>
    </motion.div>
  );
}

export default function FindContainer() {
  return (
    <div className={style.findContainerWrapper}>
      {sections.map((section, idx) => (
        <Section
          key={idx}
          title={section.title}
          description={section.description}
          images={section.images}
          direction={section.direction}
        />
      ))}
    </div>
  );
}

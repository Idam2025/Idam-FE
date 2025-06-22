import Image from "next/image";
import style from "./section.module.css";
import Link from "next/link";

const categories = [
  {
    img: "/imgContainer/design.avif",
    alt: "디자인",
    label: "디자인",
    desc: "디자인 카테고리로 검색을 시도합니다.",
  },
  {
    img: "/imgContainer/programming.jpg",
    alt: "프로그래밍",
    label: "IT·프로그래밍",
    desc: "IT 카테고리로 검색을 시도합니다.",
  },
  {
    img: "/imgContainer/marketing.jpeg",
    alt: "마케팅",
    label: "마케팅",
    desc: "마케팅 카테고리로 검색을 시도합니다.",
  },
];

export default function Img() {
  return (
    <>
      {categories.map((cat) => (
        <div className={style.element} key={cat.label}>
          <Link
            href={`/ai-helper/next/AIchat?domain=${encodeURIComponent(
              cat.label
            )}`}
          >
            <Image src={cat.img} alt={cat.alt} width={180} height={180} />
          </Link>
          <div className={style.cardTitle}>{cat.label}</div>
          <div className={style.cardDesc}>{cat.desc}</div>
        </div>
      ))}
    </>
  );
}

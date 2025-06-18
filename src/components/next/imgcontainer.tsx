import Image from "next/image";
import style from "./section.module.css";
import Link from "next/link";

const categories = [
  {
    img: "/ImgContainer/design.avif",
    alt: "디자인",
    label: "디자인",
    desc: "디자인 카테고리로 검색을 시도합니다.",
  },
  {
    img: "/ImgContainer/programming.jpg",
    alt: "프로그래밍",
    label: "IT·프로그래밍",
    desc: "IT 카테고리로 검색을 시도합니다.",
  },
  {
    img: "/ImgContainer/marketing.jpg",
    alt: "마케팅",
    label: "마케팅",
    desc: "마케팅 카테고리로 검색을 시도합니다.",
  },
  {
    img: "/ImgContainer/adobeae.svg",
    alt: "adobeAe",
    label: "Video design",
    desc: "Script",
  },
  {
    img: "/ImgContainer/3d.png",
    alt: "3D/Game",
    label: "3D/Game Graphics",
    desc: "Script",
  },
  {
    img: "/ImgContainer/figma.svg",
    alt: "Figma",
    label: "UX/UI design",
    desc: "Script",
  },
  {
    img: "/ImgContainer/hand.png",
    alt: "handDrawing",
    label: "hand-drawing",
    desc: "Script",
  },
  {
    img: "/ImgContainer/engine.png",
    alt: "Engine",
    label: "UNREAL ENGINE",
    desc: "Script",
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

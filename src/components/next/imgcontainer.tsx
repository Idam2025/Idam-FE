import Image from "next/image";
import style from "./section.module.css";
import Link from "next/link";

const categories = [
  {
    img: "/ImgContainer/adobe.svg",
    alt: "adobe",
    label: "Design",
    desc: "디자인 카테고리로 검색을 시도합니다.",
  },
  {
    img: "/ImgContainer/photo.png",
    alt: "photography",
    label: "Translation",
    desc: "번역 카테고리로 검색을 시도합니다.",
  },
  {
    img: "/ImgContainer/adobeps.svg",
    alt: "adobePs",
    label: "IT",
    desc: "IT 카테고리로 검색을 시도합니다.",
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
            href={`/ai-helper/next/choice?domain=${encodeURIComponent(
              cat.label
            )}`}
          >
            <Image src={cat.img} alt={cat.alt} width={180} height={180} />
          </Link>
          <div className={style.font1}>{cat.label}</div>
          <div className={style.font2}>{cat.desc}</div>
        </div>
      ))}
    </>
  );
}

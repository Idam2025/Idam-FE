import Image from "next/image";
import style from "./section.module.css";
import Link from "next/link";

export default function StyleSection() {
  const styleGroup = (text: string, text2: string) => {
    return (
      <Link
        href="/ai-helper/next/choice/style/result"
        className={style.style_group}
      >
        <div className={style.imageWrapper}>
          <Image
            src="/BG.svg"
            alt="Cycle"
            width={80}
            height={80}
            className={style.bgImage}
          />
          <Image
            src="/example2.svg"
            alt="ex"
            width={32}
            height={28}
            className={style.overlayImage}
          />
        </div>
        <div className={style.font3}>{text}</div>
        <div className={style.font4}>{text2}</div>
      </Link>
    );
  };
  return (
    <>
      <div className={style.container}>
        <div className={style.font}>Style</div>
        <div className={style.font2}>
          Lorem ipsum dolor sit amet consectetur adipiscing elit volutpat
          gravida malesuada quam commodo id integer nam.
        </div>
        <div className={style.styleContainer}>
          {styleGroup("John Carter", "CEO & Co-Founder")}
          {styleGroup("John Carter", "CEO & Co-Founder")}
          {styleGroup("John Carter", "CEO & Co-Founder")}
          {styleGroup("John Carter", "CEO & Co-Founder")}
          {styleGroup("John Carter", "CEO & Co-Founder")}

          {styleGroup("John Carter", "CEO & Co-Founder")}
          {styleGroup("John Carter", "CEO & Co-Founder")}
          {styleGroup("John Carter", "CEO & Co-Founder")}
          {styleGroup("John Carter", "CEO & Co-Founder")}
          {styleGroup("John Carter", "CEO & Co-Founder")}
        </div>
      </div>
    </>
  );
}

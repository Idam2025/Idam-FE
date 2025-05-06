import Image from "next/image";
import style from "./section.module.css";
import Link from "next/link";

export default function ChoiceSection() {
  const imgContainer = (text: string, text2: string) => {
    return (
      <Link href="/ai-helper/next/choice/AIchat" className={style.choiceBlock}>
        <div className={style.imageWrapper}>
          <Image
            src="/usual/BG.svg"
            alt="Cycle"
            width={80}
            height={80}
            className={style.bgImage}
          />
          <Image
            src="/usual/example2.svg"
            alt="ex"
            width={32}
            height={28}
            className={style.overlayImage}
          />
        </div>
        <div className={style.textContainer}>
          <div className={style.font}>{text}</div>
          <div className={style.font2}>{text2}</div>
        </div>
      </Link>
    );
  };
  return (
    <>
      <div className={style.container}>
        <div className={style.contentContainer}>
          <div className={style.font}>$</div>
          <div className={style.font2}>
            Lorem ipsum dolor sit amet consectetur adipiscing elit volutpat
            gravida malesuada quam commodo id integer nam.
          </div>
          <div className={style.choiceContainer}>
            {imgContainer("up to 100$", "CEO & Co-Founder")}
            {imgContainer("up to 100$", "CTO & Co-Founder")}
            {imgContainer("up to 100$", "VP of Marketing")}
            {imgContainer("the lowest price", "VP of Sales")}
            {imgContainer("recommend me", "VP of Design")}
            {imgContainer("the maximum price", "VP of Product")}
          </div>
        </div>
      </div>
    </>
  );
}

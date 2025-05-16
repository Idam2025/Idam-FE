"use client";
import Image from "next/image";
import style from "./section.module.css";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function ChoiceSection() {
  const searchParams = useSearchParams();
  const domain = searchParams.get("domain");

  const imgContainer = (price: string, role: string) => {
    // ✅ domain도 query에 유지, 선택한 price도 같이 넘김
    return (
      <Link
        href={`/ai-helper/next/choice/AIchat?domain=${encodeURIComponent(
          domain || ""
        )}&price=${encodeURIComponent(price)}`}
        className={style.choiceBlock}
      >
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
          <div className={style.font}>{price}</div>
          <div className={style.font2}>{role}</div>
        </div>
      </Link>
    );
  };

  return (
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
  );
}

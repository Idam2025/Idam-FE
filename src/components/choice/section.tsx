"use client";
import Image from "next/image";
import style from "./section.module.css";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const priceOptions = [
  { price: "up to 100$", role: "CEO & Co-Founder" },
  { price: "up to 100$", role: "CTO & Co-Founder" },
  { price: "up to 100$", role: "VP of Marketing" },
  { price: "the lowest price", role: "VP of Sales" },
  { price: "recommend me", role: "VP of Design" },
  { price: "the maximum price", role: "VP of Product" },
];

export default function ChoiceSection() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const domain = searchParams.get("domain");

  useEffect(() => {
    if (!domain) {
      alert("카테고리 정보가 없습니다. 처음부터 다시 선택해주세요.");
      router.push("/ai-helper/next");
    }
  }, [domain, router]);

  return (
    <div className={style.container}>
      <div className={style.content}>
        <h2 className={style.sectionTitle}>$</h2>
        <p className={style.sectionDescription}>
          Lorem ipsum dolor sit amet consectetur adipiscing elit volutpat
          gravida malesuada quam commodo id integer nam.
        </p>

        <div className={style.cardGrid}>
          {priceOptions.map((item) => (
            <Link
              key={item.role}
              href={`/ai-helper/next/choice/AIchat?domain=${encodeURIComponent(
                domain || ""
              )}&price=${encodeURIComponent(item.price)}`}
              className={style.card}
            >
              <div className={style.cardImageWrapper}>
                <Image
                  src="/usual/BG.svg"
                  alt="Background"
                  width={80}
                  height={80}
                  className={style.cardBgImage}
                />
                <Image
                  src="/usual/example2.svg"
                  alt="Overlay Icon"
                  width={32}
                  height={28}
                  className={style.cardIcon}
                />
              </div>
              <div className={style.cardText}>
                <div className={style.priceText}>{item.price}</div>
                <div className={style.roleText}>{item.role}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

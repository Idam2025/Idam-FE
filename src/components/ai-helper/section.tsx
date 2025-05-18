import Link from "next/link";
import style from "./section.module.css";
import Image from "next/image";

const quotes = [
  `"Cats don't speak our language, yet somehow they understand when we’re sad, tired or"`,
  `"just need a quiet friend. Maybe that’s the magic of them—they heal in silence."`,
];

export default function Section() {
  return (
    <div className={style.section}>
      <div className={style.left}>
        <div className={style.titleBlock}>
          <h2 className={style.title}>
            I:DAM <Image src="/usual/AI.svg" alt="AI" width={51} height={51} />
          </h2>
          <h2 className={style.title}>AI Assistant</h2>
        </div>

        <div className={style.quoteBlock}>
          {quotes.map((line, idx) => (
            <p key={idx} className={style.quote}>
              {line}
            </p>
          ))}
        </div>

        <div className={style.buttonGroup}>
          <Link href="/ai-helper/next" className={style.primaryBtn}>
            Get started
          </Link>
          <Link href="/" className={style.secondaryBtn}>
            HOME
          </Link>
        </div>
      </div>
    </div>
  );
}

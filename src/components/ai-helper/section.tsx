import Link from "next/link";
import style from "./section.module.css";
import Image from "next/image";

export default function Section() {
  return (
    <>
      <div className={style.section}>
        <div className={style.left}>
          <div className={style.fontContainer}>
            <div className={style.font1}>
              I:DAM
              <Image src="/AI.svg" alt="AI" width={51} height={51} />
            </div>
            <div className={style.font1}>AI Assistant</div>
          </div>

          <div className={style.fontContainer}>
            <div className={style.font2}>
              "Cats don't speak our language, yet somehow they understand when
              we’re sad, tired or
            </div>
            <div className={style.font2}>
              just need a quiet friend. Maybe that’s the magic of them—they heal
              in silence."
            </div>
          </div>

          <div className={style.btnGroup}>
            <Link href="/ai-helper/next" className={style.btn1}>
              Get started
            </Link>

            <Link href="/" className={style.btn2}>
              <div className={style.font}>HOME</div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

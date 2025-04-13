import Link from "next/link";
import style from "./section.module.css";

export default function Section() {
  return (
    <>
      <div className={style.section}>
        <div className={style.left}>
          <div className={style.fontContainer}>
            <div className={style.font1}>I:DAM</div>
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
            <div className={style.btn1}>
              <div className={style.font}>Get started</div>
            </div>

            <Link href="/" className={style.btn2}>
              <div className={style.font}>HOME</div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

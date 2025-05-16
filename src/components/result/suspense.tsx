"use client";
import Image from "next/image";
import style from "./suspense.module.css";
import { useRouter } from "next/navigation";

export default function SuspensePage() {
  const router = useRouter();
  const moveHome = () => {
    console.log("clicked");
    router.push("/");
  };
  const Left = () => {
    return (
      <div className={style.textContainer}>
        <div className={style.font1}>
          <Image src="/usual/AI.svg" alt="AI" width={51} height={51} /> Working
          ...
        </div>
        <div className={style.font2}>로딩중</div>
        <div className={style.button}>
          <div className={style.group} onClick={moveHome}>
            Home
            <Image src="/usual/arrow.svg" alt="arrow" width={20} height={20} />
          </div>
        </div>
      </div>
    );
  };

  const imgSample = (text: string, hide: boolean) => {
    if (hide) return null;

    return (
      <div className={style.imgContainer}>
        <div className={style.imgSample}>
          <Image src="/usual/example2.svg" alt="ex" width={92} height={81} />
        </div>
        <div className={style.font}>{text}</div>
      </div>
    );
  };

  return (
    <>
      <div className={style.container}>
        {Left()}
        <div className={style.right}>
          <div className={style.imgLine1}>
            {imgSample("John Carther", false)}
            {imgSample("John Carther", false)}
          </div>
          <div className={style.imgLine2}>
            {imgSample("하주", false)}
            {imgSample("하주", false)}
          </div>
        </div>
      </div>
    </>
  );
}

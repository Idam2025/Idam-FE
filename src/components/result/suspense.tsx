// components/result/suspense/SuspensePage.tsx
"use client";

import Image from "next/image";
import style from "./suspense.module.css";
import { useRouter } from "next/navigation";

export default function SuspensePage() {
  const router = useRouter();

  const moveHome = () => {
    router.push("/");
  };

  const Left = () => (
    <div className={style.textContainer}>
      <div className={style.font1}>
        <Image src="/usual/AI.svg" alt="AI" width={70} height={70} />
        I:DAM AI Working...
      </div>
      <div className={style.button}>
        <div className={style.group} onClick={moveHome}>
          Cancel
          <Image src="/usual/arrow.svg" alt="arrow" width={20} height={20} />
        </div>
      </div>
    </div>
  );

  const imgSample = (hide: boolean, imgAddress: string) => {
    if (hide) return null;
    return (
      <div className={style.imgContainer}>
        <div className={style.imgSample}>
          <Image src={imgAddress} alt="ex" width={328.395} height={415.966} />
        </div>
      </div>
    );
  };

  return (
    <div className={style.container}>
      {Left()}
      <div className={style.right}>
        <div className={style.imgLine1}>
          {imgSample(false, "/suspense/suspenseImg1.png")}
          {imgSample(false, "/suspense/suspenseImg2.png")}
        </div>
        <div className={style.imgLine2}>
          {imgSample(false, "/suspense/suspenseImg3.png")}
          {imgSample(false, "/suspense/suspenseImg4.png")}
        </div>
      </div>
    </div>
  );
}

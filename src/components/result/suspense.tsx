"use client";
import Image from "next/image";
import style from "./suspense.module.css";
import { useRouter } from "next/navigation";

export default function SuspensePage() {
  const router = useRouter();
  const moveHome = () => {
    console.log("clicked");
    router.push("/ai-helper");
  };
  const Left = () => {
    return (
      <div className={style.textContainer}>
        <div className={style.font1}>
          <Image src="/usual/AI.svg" alt="AI" width={51} height={51} /> Working
          ...
        </div>
        <div className={style.button}>
          <div className={style.group} onClick={moveHome}>
            Cancel
            <Image src="/usual/arrow.svg" alt="arrow" width={20} height={20} />
          </div>
        </div>
      </div>
    );
  };

  const imgSample = (text: string, hide: boolean, imgAddress: string) => {
    if (hide) return null;

    return (
      <div className={style.imgContainer}>
        <div className={style.imgSample}>
          <Image src={imgAddress} alt="ex" width={328.395} height={415.966} />
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
            {imgSample("John Carther", false, "/suspense/suspenseImg1.png")}
            {imgSample("John Carther", false, "/suspense/suspenseImg2.png")}
          </div>
          <div className={style.imgLine2}>
            {imgSample("아아", false, "/suspense/suspenseImg3.png")}
            {imgSample("하주", false, "/suspense/suspenseImg4.png")}
          </div>
        </div>
      </div>
    </>
  );
}

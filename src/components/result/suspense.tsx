"use client";

import Image from "next/image";
import style from "./suspense.module.css";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function SuspensePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const domain = searchParams?.get("domain") ?? "";
  const prompt = searchParams?.get("prompt") ?? "";

  useEffect(() => {
    if (!domain || !prompt) {
      alert("잘못된 접근입니다.");
      router.push("/");
      return;
    }

    const encodedDomain = encodeURIComponent(domain);
    const encodedPrompt = encodeURIComponent(prompt);

    router.replace(`/result?domain=${encodedDomain}&prompt=${encodedPrompt}`);
  }, [domain, prompt, router]);

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

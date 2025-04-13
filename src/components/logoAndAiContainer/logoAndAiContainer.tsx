import Image from "next/image";
import style from "./logoAndAiContainer.module.css";

export default function LogoAndAiContainer() {
  return (
    <>
      <div className={style.logo_container}>
        <Image src={"/logo.svg"} alt="logo" width={76} height={71}></Image>
        <div className={style.font1}>IDAM connects, Idam reflects.</div>
        <div className={style.font2}>
          필요는 인재를 부르고, 이담은 연결합니다.
        </div>
        <div className={style.font2}>AI 매칭으로 더 빠르게, 더 정확하게</div>
      </div>
      <div className={style.ai_container}>
        <Image src={"/AI.svg"} alt="AI" width={25} height={25}></Image>
        <div className={style.textArea}>
          <div className={style.font}>작업 의뢰</div>
        </div>
      </div>
    </>
  );
}

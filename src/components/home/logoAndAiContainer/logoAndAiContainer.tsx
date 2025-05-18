import Image from "next/image";
import style from "./logoAndAiContainer.module.css";
import Link from "next/link";

// UI 텍스트는 추후 i18n 고려해서 상수화
const SLOGANS = [
  "필요는 인재를 부르고, 이담은 연결합니다.",
  "AI 매칭으로 더 빠르게, 더 정확하게",
];

export default function LogoAndAiContainer() {
  return (
    <div className={style.container}>
      <LogoSection />
      <AiMatchSection />
    </div>
  );
}

function LogoSection() {
  return (
    <div className={style.logo_container}>
      <Image src="/usual/logo.svg" alt="logo" width={76} height={71} />
      <div className={style.font1}>IDAM connects, Idam reflects.</div>
      {SLOGANS.map((line, idx) => (
        <div className={style.font2} key={idx}>
          {line}
        </div>
      ))}
    </div>
  );
}

function AiMatchSection() {
  return (
    <div className={style.ai_container}>
      <Image src="/usual/AI.svg" alt="AI" width={25} height={25} />
      <Link href="/ai-helper" className={style.textArea}>
        <div className={style.font}>작업 의뢰</div>
      </Link>
    </div>
  );
}

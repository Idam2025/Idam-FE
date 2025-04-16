import Image from "next/image";
import style from "./suspense.module.css";

export default function SuspensePage() {
  const left = () => {
    return (
      <div className={style.textContainer}>
        <div className={style.font1}>
          <Image src="/AI.svg" alt="AI" width={51} height={51} /> Working ...
        </div>
        <div className={style.font2}>로딩중</div>
        <div className={style.button}>
          <div className={style.group}>
            Home
            <Image src="/arrow.svg" alt="arrow" width={20} height={20} />
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
          <Image src="/example2.svg" alt="ex" width={92} height={81} />
        </div>
        <div className={style.font}>{text}</div>
      </div>
    );
  };

  return (
    <>
      <div className={style.header}></div>
      <div className={style.container}>
        {left()}
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
      <div className={style.footer}></div>
    </>
  );
}

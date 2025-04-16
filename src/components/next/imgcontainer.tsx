import Image from "next/image";
import style from "./section.module.css";
import Link from "next/link";

export default function Img() {
  return (
    <>
      <div className={style.element}>
        <Link href="/ai-helper/next/choice">
          <Image
            src="/ImgContainer/adobe.svg"
            alt="adobe"
            width={180}
            height={180}
          />
        </Link>
        <div className={style.font1}>Visual design</div>
        <div className={style.font2}>Script</div>
      </div>
      <div className={style.element}>
        <Link href="/ai-helper/next/choice">
          <Image
            src="/ImgContainer/photo.png"
            alt="photography"
            width={180}
            height={180}
          />
        </Link>
        <div className={style.font1}>Photography</div>
        <div className={style.font2}>Script</div>
      </div>
      <div className={style.element}>
        <Link href="/ai-helper/next/choice">
          <Image
            src="/ImgContainer/adobeps.svg"
            alt="adobePs"
            width={180}
            height={180}
          />
        </Link>
        <div className={style.font1}>Product design</div>
        <div className={style.font2}>Script</div>
      </div>
      <div className={style.element}>
        <Link href="/ai-helper/next/choice">
          <Image
            src="/ImgContainer/adobeae.svg"
            alt="adobeAe"
            width={180}
            height={180}
          />
        </Link>
        <div className={style.font1}>Video design</div>
        <div className={style.font2}>Script</div>
      </div>
      <div className={style.element}>
        <Link href="/ai-helper/next/choice">
          <Image
            src="/ImgContainer/3d.png"
            alt="3D/Game"
            width={180}
            height={180}
          />
        </Link>
        <div className={style.font1}>3D/Game Graphics</div>
        <div className={style.font2}>Script</div>
      </div>
      <div className={style.element}>
        <Link href="/ai-helper/next/choice">
          <Image
            src="/ImgContainer/figma.svg"
            alt="Figma"
            width={180}
            height={180}
          />
        </Link>
        <div className={style.font1}>UX/UI design</div>
        <div className={style.font2}>Script</div>
      </div>
      <div className={style.element}>
        <Link href="/ai-helper/next/choice">
          <Image
            src="/ImgContainer/hand.png"
            alt="handDrawing"
            width={180}
            height={180}
          />
        </Link>
        <div className={style.font1}>hand-drawing</div>
        <div className={style.font2}>Script</div>
      </div>
      <div className={style.element}>
        <Link href="/ai-helper/next/choice">
          <Image
            src="/ImgContainer/engine.png"
            alt="Engine"
            width={180}
            height={180}
          />
        </Link>
        <div className={style.font1}>UNREAL ENGINE</div>
        <div className={style.font2}>Script</div>
      </div>
    </>
  );
}

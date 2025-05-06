import Image from "next/image";
import style from "./findContainer.module.css";

export default function FindContainer() {
  return (
    <div className={style.find_container}>
      <div className={style.textArea}>
        <div className={style.font}>원하는 인재 찾기</div>
      </div>
      <div className={style.section}>
        <div className={style.left}>
          <div className={style.text}>Graphic Design</div>
          <div className={style.text2}>
            Welcome to Burger Bliss, where we take your cravings to a whole new
            level! Our mouthwatering burgers are made from 100% beef and are
            served on freshly baked buns.
          </div>
        </div>
        <div className={style.right}>
          <Image
            src={"/usual/example.svg"}
            alt="ex"
            width={312}
            height={312}
          ></Image>
          <Image
            src={"/usual/example.svg"}
            alt="ex"
            width={312}
            height={312}
          ></Image>
          <Image
            src={"/usual/example.svg"}
            alt="ex"
            width={312}
            height={312}
          ></Image>
        </div>
      </div>

      <div className={style.section}>
        <div className={style.left}>
          <div className={style.text}>3D/Modeling</div>
          <div className={style.text2}>
            Welcome to Burger Bliss, where we take your cravings to a whole new
            level! Our mouthwatering burgers are made from 100% beef and are
            served on freshly baked buns.
          </div>
        </div>
        <div className={style.right}>
          <Image
            src={"/usual/example.svg"}
            alt="ex"
            width={312}
            height={312}
          ></Image>
          <Image
            src={"/usual/example.svg"}
            alt="ex"
            width={312}
            height={312}
          ></Image>
          <Image
            src={"/usual/example.svg"}
            alt="ex"
            width={312}
            height={312}
          ></Image>
        </div>
      </div>

      <div className={style.section}>
        <div className={style.left}>
          <div className={style.text}>3D/Modeling</div>
          <div className={style.text2}>
            Welcome to Burger Bliss, where we take your cravings to a whole new
            level! Our mouthwatering burgers are made from 100% beef and are
            served on freshly baked buns.
          </div>
        </div>
        <div className={style.right}>
          <Image
            src={"/usual/example.svg"}
            alt="ex"
            width={312}
            height={312}
          ></Image>
          <Image
            src={"/usual/example.svg"}
            alt="ex"
            width={312}
            height={312}
          ></Image>
          <Image
            src={"/usual/example.svg"}
            alt="ex"
            width={312}
            height={312}
          ></Image>
        </div>
      </div>
    </div>
  );
}

import Image from "next/image";
import style from "./companyInfo.module.css";
export default function Section() {
  return (
    <>
      <div className={style.section}>
        <div className={style.left}>
          <div className={style.font1}>Best burger in town</div>
          <div className={style.font2}>
            Welcome to Burger Bliss, where we take your cravings to a whole new
            level! Our mouthwatering burgers are made from 100% beef and are
            served on freshly baked buns.
          </div>
          <div className={style.button}>
            <div className={style.font}>Idam</div>
          </div>
        </div>

        <div className={style.right}>
          <div className={style.imgStyle}>
            <Image
              src="/usual/example.svg"
              alt="example"
              fill
              style={{ objectFit: "contain" }}
            />
          </div>
        </div>
      </div>
    </>
  );
}

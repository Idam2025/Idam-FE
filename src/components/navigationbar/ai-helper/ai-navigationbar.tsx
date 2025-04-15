import Image from "next/image";
import style from "./ai-navigationbar.module.css";

export default function NavigationBar() {
  return (
    <div className={style.container}>
      <Image src={"/logo.svg"} alt="logo" width={41} height={38} />
      <div className={style.row}>
        <div className={style.font}>Home</div>
        <div className={style.font}>Artist</div>
        <div className={style.font}>Contact</div>
      </div>
    </div>
  );
}

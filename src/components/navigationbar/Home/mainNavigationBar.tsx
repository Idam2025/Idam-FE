"use client";

import { useRouter } from "next/navigation";
import style from "./mainNavigationbar.module.css";

export default function NavigationBar() {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/join");
  };

  return (
    <div className={style.container}>
      <div></div>
      <div className={style.font_container}>
        <div className={style.title}>IDAM</div>
        <div className={style.row}>
          <div className={style.font}>Home</div>
          <div className={style.font}>Artist</div>
          <div className={style.font}>Contact</div>
        </div>
      </div>
      <div className={style.login_container}>
        <div className={style.font} onClick={handleLogin}>
          Login
        </div>
        <div className={style.font}>Logout</div>
      </div>
    </div>
  );
}

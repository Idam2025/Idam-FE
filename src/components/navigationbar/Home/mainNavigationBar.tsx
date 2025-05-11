"use client";

import { useRouter } from "next/navigation";
import style from "./mainNavigationbar.module.css";

export default function NavigationBar() {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/join");
  };

  const handleHome = () => {
    router.push("/");
  };

  const handleProfile = () => {
    router.push("/profile");
  };

  return (
    <div className={style.container}>
      <div></div>
      <div className={style.font_container}>
        <div className={style.title}>IDAM</div>
        <div className={style.row}>
          <div onClick={handleHome} className={style.font}>
            Home
          </div>
          <div className={style.font}>Artist</div>
          <div className={style.font}>Contact</div>
        </div>
      </div>
      <div className={style.login_container}>
        <div className={style.font} onClick={handleLogin}>
          Login
        </div>
        <div onClick={handleProfile} className={style.font}>
          프로필
        </div>
      </div>
    </div>
  );
}

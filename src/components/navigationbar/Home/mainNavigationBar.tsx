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

  const handleChat = () => {
    router.push("/chat");
  };

  const handleEditProfile = () => {
    router.push("/profile");
  };

  const Content = (content: string) => {
    return <div className={style.font}>{content}</div>;
  };

  return (
    <>
      <div className={style.container}>
        <div className={style.title}>IDAM</div>
        <div className={style.font_container}>
          <div className={style.row}>
            <div onClick={handleHome} className={style.font}>
              Home
            </div>
            {Content("Artist")}
            {Content("Contact")}
          </div>
        </div>
        <div className={style.login_container}>
          <div className={style.font} onClick={handleLogin}>
            Login
          </div>
          <div className={style.profileWrapper}>
            {Content("프로필")}
            <div className={style.dropdownMenu}>
              <div className={style.dropdownItem} onClick={handleChat}>
                💬 채팅
              </div>
              <div className={style.dropdownItem} onClick={handleEditProfile}>
                ✏️ 프로필 수정
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

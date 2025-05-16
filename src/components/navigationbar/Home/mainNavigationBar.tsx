"use client";

import { useRouter } from "next/navigation";
import style from "./mainNavigationbar.module.css";
import { useAccessToken } from "@/hooks/useAccessToken"; // ✅ 커스텀 훅 사용 권장

export default function NavigationBar() {
  const router = useRouter();
  const { isLoggedIn, removeToken } = useAccessToken();

  const handleLogin = () => router.push("/join");
  const handleLogout = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const userId = localStorage.getItem("userId");
      const deviceId = localStorage.getItem("deviceId");

      if (!accessToken || !userId || !deviceId) {
        alert("로그아웃 정보가 부족합니다.");
        return;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/logout?userId=${userId}&deviceId=${deviceId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`, // ✅ Authorization header 추가
          },
          credentials: "include", // ✅ 쿠키 기반 refreshToken 포함
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData?.message || "로그아웃 실패");
      }

      const data = await res.json();
      console.log("로그아웃 성공:", data.message);

      // ✅ 로컬 토큰 및 유저 정보 삭제
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken"); // 혹시 localStorage에도 남아있다면 삭제 (안전)
      localStorage.removeItem("userId");

      alert("로그아웃 성공!");
      router.push("/");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "로그아웃 중 오류 발생");
    }
  };

  const handleHome = () => router.push("/");
  const handleChat = () => router.push("/chat");
  const handleEditProfile = () => router.push("/profile");

  const NavItem = ({
    text,
    onClick,
  }: {
    text: string;
    onClick?: () => void;
  }) => (
    <div className={style.font} onClick={onClick}>
      {text}
    </div>
  );

  return (
    <div className={style.container}>
      <div className={style.title}>IDAM</div>
      <div className={style.font_container}>
        <div className={style.row}>
          <NavItem text="Home" onClick={handleHome} />
          <NavItem text="Artist" />
          <NavItem text="Contact" />
        </div>
      </div>
      <div className={style.login_container}>
        {isLoggedIn ? (
          <NavItem text="Logout" onClick={handleLogout} />
        ) : (
          <NavItem text="Login" onClick={handleLogin} />
        )}
        <div className={style.profileWrapper}>
          <NavItem text="프로필" />
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
  );
}

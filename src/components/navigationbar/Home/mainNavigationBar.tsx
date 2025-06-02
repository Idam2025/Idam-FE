"use client";

import { useRouter } from "next/navigation";
import style from "./mainNavigationbar.module.css";
import { useAccessToken } from "@/hooks/useAccessToken";
import { useEffect, useState } from "react";

export default function NavigationBar() {
  const router = useRouter();
  const { isLoggedIn, removeToken, setIsLoggedIn } = useAccessToken();
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const token =
      typeof window !== "undefined" && localStorage.getItem("accessToken");
    setIsLoggedIn(!!token);
    setIsAuthReady(true);
  }, [setIsLoggedIn]);

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

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
        body: JSON.stringify({ deviceId }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data?.message || "로그아웃 실패");
      }

      removeToken();
      alert("로그아웃 성공!");
      router.push("/");
    } catch (err: any) {
      console.error("로그아웃 오류:", err);
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
          <NavItem text="Chat" onClick={handleChat} />
        </div>
      </div>
      <div className={style.login_container}>
        {isAuthReady &&
          (isLoggedIn ? (
            <NavItem text="Logout" onClick={handleLogout} />
          ) : (
            <NavItem text="Login" onClick={handleLogin} />
          ))}
        <NavItem text="프로필" onClick={handleEditProfile} />
      </div>
    </div>
  );
}

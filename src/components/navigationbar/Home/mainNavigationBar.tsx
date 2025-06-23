"use client";
import { HiMenu } from "react-icons/hi";
import { useRouter } from "next/navigation";
import { useAccessToken } from "@/hooks/useAccessToken";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { disconnectWebSocket } from "@/utils/wsClient";
import style from "./mainNavigationbar.module.css";

export default function NavigationBar() {
  const router = useRouter();
  const { isLoggedIn, removeToken, setIsLoggedIn } = useAccessToken();
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showMenuDropdown, setShowMenuDropdown] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const token =
      typeof window !== "undefined" && localStorage.getItem("accessToken");
    setIsLoggedIn(!!token);
    setIsAuthReady(true);
  }, [setIsLoggedIn]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        !target.closest(".profileWrapper") &&
        !target.closest(`.${style.dropdownMenu}`)
      ) {
        setShowProfileDropdown(false);
        setShowMenuDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogin = () => router.push("/join");
  const handleLogout = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const deviceId = localStorage.getItem("deviceId");
      if (!accessToken || !deviceId) {
        return alert("로그아웃 정보가 부족합니다.");
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
        router.push("/join");
        throw new Error(data?.message || "로그아웃 실패");
      }
      disconnectWebSocket();
      removeToken();
      alert("로그아웃 성공!");
      router.push("/");
    } catch (err: any) {
      alert(err.message || "로그아웃 중 오류 발생");
    }
  };

  const handleHome = () => router.push("/");
  const handleChat = () => router.push("/chat");
  const handleEditProfile = () => router.push("/profile");

  const toggleProfileDropdown = () => {
    setShowProfileDropdown((prev) => !prev);
    setShowMenuDropdown(false);
  };

  const toggleMenuDropdown = () => {
    setShowMenuDropdown((prev) => !prev);
    setShowProfileDropdown(false);
  };
  const NavItem = ({
    text,
    onClick,
  }: {
    text: string;
    onClick?: () => void;
  }) => {
    if (text === "Login") {
      return (
        <div className={style.loginItem} onClick={onClick}>
          {text}
        </div>
      );
    }

    return (
      <div className={style.font} onClick={onClick}>
        {text}
      </div>
    );
  };

  const Dropdown = ({
    isOpen,
    items,
  }: {
    isOpen: boolean;
    items: { label: string; onClick: () => void }[];
  }) => (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={style.dropdownMenu}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {items.map((item, idx) => (
            <div
              key={idx}
              className={style.dropdownItem}
              onClick={item.onClick}
            >
              {item.label}
            </div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className={`${style.container} ${isScrolled ? style.scrolled : ""}`}>
      <div className={style.title} onClick={handleHome}>
        I:DAM
      </div>

      <div className={style.login_container}>
        {isAuthReady &&
          (isLoggedIn ? (
            <>
              <div className="profileWrapper">
                <NavItem text="프로필" onClick={toggleProfileDropdown} />
                <Dropdown
                  isOpen={showProfileDropdown}
                  items={[
                    { label: "내 정보 수정", onClick: handleEditProfile },
                    { label: "로그아웃", onClick: handleLogout },
                  ]}
                />
              </div>

              <div
                className={style.notificationWrapper}
                onClick={() => router.push("/notifications")}
              >
                <img
                  src="/usual/logo.svg"
                  alt="알림"
                  className={style.notificationIcon}
                />
              </div>

              <div className="profileWrapper">
                <HiMenu
                  size={28}
                  onClick={toggleMenuDropdown}
                  className={style.navList}
                />
                <Dropdown
                  isOpen={showMenuDropdown}
                  items={[
                    {
                      label: "채팅방",
                      onClick: handleChat,
                    },
                  ]}
                />
              </div>
            </>
          ) : (
            <NavItem text="Login" onClick={handleLogin} />
          ))}
      </div>
    </div>
  );
}

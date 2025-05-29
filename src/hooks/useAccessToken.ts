import { useEffect, useState } from "react";

export const useAccessToken = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setAccessToken(token);
    setIsLoggedIn(!!token); // 초기 로그인 상태 설정
  }, []);

  const saveToken = (token: string) => {
    localStorage.setItem("accessToken", token);
    setAccessToken(token);
    setIsLoggedIn(true);
  };

  const removeToken = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("deviceId");
    setAccessToken(null);
    setIsLoggedIn(false);
  };

  return { accessToken, saveToken, removeToken, isLoggedIn, setIsLoggedIn };
};

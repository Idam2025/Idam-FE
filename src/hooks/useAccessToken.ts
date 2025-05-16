import { useEffect, useState } from "react";

export const useAccessToken = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setAccessToken(token);
  }, []);

  const saveToken = (token: string) => {
    localStorage.setItem("accessToken", token);
    setAccessToken(token);
  };

  const removeToken = () => {
    localStorage.removeItem("accessToken");
    setAccessToken(null);
  };

  return { accessToken, saveToken, removeToken, isLoggedIn: !!accessToken };
};

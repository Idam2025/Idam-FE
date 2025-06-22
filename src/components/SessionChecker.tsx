"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";

export default function SessionChecker() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkSession = () => {
      const userId = localStorage.getItem("userId");
      const deviceId = localStorage.getItem("deviceId");
      const tokenExp = localStorage.getItem("tokenExp");
      const lastActive = localStorage.getItem("lastActive");
      const now = Date.now();

      if (!lastActive) {
        localStorage.setItem("lastActive", now.toString());
      }

      if (lastActive && now - parseInt(lastActive) > 1 * 60 * 1000) {
        localStorage.clear();
        alert("세션 만료");
        router.push("/login");
        return;
      }

      if (tokenExp && !isNaN(parseInt(tokenExp)) && now > parseInt(tokenExp)) {
        if (userId && deviceId) {
          axios
            .post(
              `${process.env.NEXT_PUBLIC_API_URL}/api/refresh?userId=${userId}&deviceId=${deviceId}`,
              {},
              { withCredentials: true }
            )
            .then((res) => {
              const { accessToken, tokenExp } = res.data;
              localStorage.setItem("accessToken", accessToken);
              localStorage.setItem("tokenExp", tokenExp.toString());
              alert("🔄 AccessToken이 자동으로 재발급되었습니다.");
            })
            .catch(() => {
              alert("❌ 세션이 만료되었습니다. 다시 로그인해주세요.");
              router.push("/join");
            });
        }
      }

      localStorage.setItem("lastActive", now.toString());
    };

    const interval = setInterval(checkSession, 10000);
    return () => clearInterval(interval);
  }, [pathname]);

  return null;
}

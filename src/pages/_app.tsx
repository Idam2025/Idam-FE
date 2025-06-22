"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { AppProps } from "next/app";
import axios from "axios";

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkSession = () => {
      const userId = localStorage.getItem("userId");
      const deviceId = localStorage.getItem("deviceId");
      const tokenExp = localStorage.getItem("tokenExp");
      const lastActive = localStorage.getItem("lastActive");
      const now = Date.now();

      console.log("📌 now:", now);
      console.log("📌 tokenExp:", tokenExp);
      console.log("📌 lastActive:", lastActive);

      // 최초 진입 시 lastActive 설정
      if (!lastActive) {
        localStorage.setItem("lastActive", now.toString());
      }

      // 세션 만료 (1분 테스트용)
      if (lastActive && now - parseInt(lastActive) > 1 * 60 * 1000) {
        console.log("🟡 세션 만료 조건 충족");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("tokenExp");
        localStorage.removeItem("lastActive");
        localStorage.removeItem("userId");
        localStorage.removeItem("userType");
        alert("세션 만료");
        router.push("/login");
        return;
      }

      // AccessToken 자동 재발급
      if (tokenExp && !isNaN(parseInt(tokenExp)) && now > parseInt(tokenExp)) {
        console.log("🔁 AccessToken 재발급 조건 충족");
        if (userId && deviceId) {
          console.log("📨 재발급 요청 시도");
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
              router.push("/login");
            });
        } else {
          console.log("⚠️ userId 또는 deviceId 없음");
        }
      }

      // 사용자 활동 갱신
      localStorage.setItem("lastActive", now.toString());
    };

    const interval = setInterval(checkSession, 10 * 1000);
    return () => clearInterval(interval);
  }, [pathname]);

  return <Component {...pageProps} />;
}

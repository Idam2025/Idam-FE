"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

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
        return;
      }

      const inactiveTime = now - parseInt(lastActive);

      if (inactiveTime > 30 * 60 * 1000) {
        localStorage.clear();
        alert("세션 만료되었습니다. 로그인 페이지로 이동합니다.");
        router.push("/join");
        return;
      }

      // 🔄 AccessToken 만료 시 재발급 시도
      if (tokenExp && !isNaN(parseInt(tokenExp)) && now > parseInt(tokenExp)) {
        if (userId && deviceId) {
          axios
            .post(
              `${process.env.NEXT_PUBLIC_API_URL}/api/refresh?userId=${userId}&deviceId=${deviceId}`,
              {}, // ✅ POST body는 비움
              {
                withCredentials: true, // ✅ 쿠키 포함
                headers: {
                  "Content-Type": "application/json",
                },
              }
            )
            .then((res) => {
              const { accessToken } = res.data;

              localStorage.setItem("accessToken", accessToken);

              try {
                const decoded = jwtDecode<{ exp: number }>(accessToken);
                const expMillis = decoded.exp * 1000;
                localStorage.setItem("tokenExp", expMillis.toString());
                console.log("🔄 AccessToken 재발급 성공");
                console.log("📦 저장된 tokenExp:", expMillis);
              } catch (err) {
                console.error("❌ accessToken 디코딩 실패:", err);
                alert("AccessToken 형식이 잘못되었습니다.");
                localStorage.clear();
                router.push("/join");
              }
            })

            .catch((err) => {
              console.error("❌ 재발급 실패:", err);
              localStorage.clear();
              alert("❌ 세션이 만료되었습니다. 다시 로그인해주세요.");
              router.push("/join");
            });
        }
      }

      localStorage.setItem("lastActive", now.toString());
    };

    checkSession();
    const interval = setInterval(checkSession, 10 * 1000);
    return () => clearInterval(interval);
  }, [pathname]);

  return null;
}

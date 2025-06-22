"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";

export default function ExpireTokenButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const expireAndRefreshToken = async () => {
    const userId = localStorage.getItem("userId");
    const deviceId = localStorage.getItem("deviceId");

    // AccessToken 강제 만료
    localStorage.removeItem("accessToken");
    localStorage.setItem("tokenExp", (Date.now() - 1000).toString());

    if (!userId || !deviceId) {
      alert("❌ userId 또는 deviceId가 없습니다.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/refresh?userId=${userId}&deviceId=${deviceId}`,
        {
          withCredentials: true,
        }
      );

      const { accessToken, tokenExp } = res.data;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("tokenExp", tokenExp.toString());

      alert(
        `✅ 재발급 성공!\n\nAccessToken: ${accessToken}\n만료시간: ${new Date(
          parseInt(tokenExp)
        ).toLocaleString()}`
      );
    } catch (err) {
      console.error("재발급 요청 실패:", err);
      alert("❌ 재발급 실패: 다시 로그인해주세요.");
      router.push("/join");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={expireAndRefreshToken}
      disabled={loading}
      style={{
        padding: "10px 20px",
        backgroundColor: "#34495e",
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: loading ? "not-allowed" : "pointer",
        opacity: loading ? 0.7 : 1,
        marginTop: "20px",
      }}
    >
      {loading ? "재발급 요청 중..." : "토큰 강제 만료 + 재발급 요청"}
    </button>
  );
}

"use client";

import { useState } from "react";
import style from "@/components/join/join.module.css";
import { useRouter } from "next/navigation";
import { useDeviceId } from "@/hooks/useDeviceId"; // ✅ import
import { useAccessToken } from "@/hooks/useAccessToken";

const { saveToken } = useAccessToken();

export default function Page() {
  const router = useRouter();
  const deviceId = useDeviceId(); // ✅ 커스텀 훅 사용

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const moveSignup = () => {
    router.push("/join/role");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading || !deviceId) return;

    setIsLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          deviceId,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData?.message || "로그인 실패");
      }

      const data = await res.json();
      console.log("로그인 성공:", data);

      saveToken(data.accessToken); // ✅ 커스텀 훅으로 저장
      localStorage.setItem("refreshToken", data.refreshToken);

      alert("로그인 성공!");
      router.push("/");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "로그인 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={style.container}>
      <div className={style.login_container}>
        <div className={style.font_container}>
          <div className={style.font1}>Log In to Idam</div>
          <div className={style.font2}>
            Quick & Simple way to Automate your payment
          </div>
        </div>
        <form className={style.form} onSubmit={handleLogin}>
          <div className={style.inputWrapper}>
            <input
              type="email"
              placeholder="이메일"
              className={style.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className={style.inputWrapper}>
            <input
              type="password"
              placeholder="비밀번호"
              className={style.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            className={style.loginButton}
            disabled={isLoading || !deviceId}
          >
            {isLoading ? "로그인 중..." : "로그인"}
          </button>
        </form>
        <div className={style.signupBox}>
          <span>계정이 없으신가요?</span>
          <button onClick={moveSignup} className={style.signupButton}>
            회원가입
          </button>
        </div>
      </div>
    </div>
  );
}

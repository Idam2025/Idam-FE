"use client";

import { useState } from "react";
import style from "@/components/join/join.module.css";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const moveSignup = () => {
    router.push("join/role");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const deviceId = navigator.userAgent; // 간단하게 userAgent 사용
    console.log(deviceId);

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

      if (!res.ok) throw new Error("로그인 실패");

      const data = await res.json();
      console.log("로그인 성공:", data);

      alert("로그인 성공!");
      router.push("/"); // 홈으로 이동
    } catch (err) {
      console.error(err);
      alert("로그인 중 오류가 발생했습니다.");
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
            />
          </div>
          <button type="submit" className={style.loginButton}>
            로그인
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

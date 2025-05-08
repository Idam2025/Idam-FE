"use client";

import style from "@/components/join/join.module.css";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  const moveSignup = () => {
    router.push("join/role");
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
        <form className={style.form}>
          <div className={style.inputWrapper}>
            <input
              type="text"
              placeholder="아이디"
              className={style.input}
              required
            />
          </div>
          <div className={style.inputWrapper}>
            <input
              type="password"
              placeholder="비밀번호"
              className={style.input}
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

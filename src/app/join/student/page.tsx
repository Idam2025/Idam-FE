"use client";

import { useState } from "react";
import styles from "./studentJoin.module.css";

export default function StudentJoinPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
    nickname: "",
    schoolName: "",
    major: "",
    schoolId: "",
    phone: "",
    gender: "",
    profileImage: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("회원가입 요청:", form);
  };

  return (
    <div className={styles.bg}>
      <div className={styles.container}>
        <h1 className={styles.title}>학생 회원가입</h1>
        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="이메일"
            value={form.email}
            onChange={handleChange}
            className={styles.inputField}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="비밀번호"
            value={form.password}
            onChange={handleChange}
            className={styles.inputField}
            required
          />
          <input
            type="text"
            name="name"
            placeholder="이름"
            value={form.name}
            onChange={handleChange}
            className={styles.inputField}
            required
          />
          <input
            type="text"
            name="nickname"
            placeholder="닉네임"
            value={form.nickname}
            onChange={handleChange}
            className={styles.inputField}
          />
          <input
            type="text"
            name="schoolName"
            placeholder="학교명"
            value={form.schoolName}
            onChange={handleChange}
            className={styles.inputField}
            required
          />
          <input
            type="text"
            name="major"
            placeholder="전공"
            value={form.major}
            onChange={handleChange}
            className={styles.inputField}
            required
          />
          <input
            type="text"
            name="schoolId"
            placeholder="학교 포털 아이디"
            value={form.schoolId}
            onChange={handleChange}
            className={styles.inputField}
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="휴대폰 번호"
            value={form.phone}
            onChange={handleChange}
            className={styles.inputField}
          />
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className={styles.selectField}
            required
          >
            <option value="">성별 선택</option>
            <option value="MALE">남성</option>
            <option value="FEMALE">여성</option>
          </select>
          <button type="submit" className={styles.submitButton}>
            회원가입
          </button>
        </form>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import styles from "./businessJoin.module.css";

export default function BusinessJoinPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    businessRegistrationNumber: "",
    companyName: "",
    address: "",
    website: "",
    phone: "",
    profileImage: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("기업 회원가입 요청:", form);
    // TODO: 실제 API 연결
  };

  return (
    <div className={styles.bg}>
      <div className={styles.container}>
        <h1 className={styles.title}>기업 회원가입</h1>
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
            name="businessRegistrationNumber"
            placeholder="사업자 등록번호"
            value={form.businessRegistrationNumber}
            onChange={handleChange}
            className={styles.inputField}
            required
          />
          <input
            type="text"
            name="companyName"
            placeholder="회사명"
            value={form.companyName}
            onChange={handleChange}
            className={styles.inputField}
            required
          />
          <input
            type="text"
            name="address"
            placeholder="주소"
            value={form.address}
            onChange={handleChange}
            className={styles.inputField}
          />
          <input
            type="text"
            name="website"
            placeholder="홈페이지"
            value={form.website}
            onChange={handleChange}
            className={styles.inputField}
          />
          <input
            type="tel"
            name="phone"
            placeholder="연락처"
            value={form.phone}
            onChange={handleChange}
            className={styles.inputField}
          />
          <input
            type="text"
            name="profileImage"
            placeholder="프로필 이미지 URL"
            value={form.profileImage}
            onChange={handleChange}
            className={styles.inputField}
          />
          <button type="submit" className={styles.submitButton}>
            회원가입
          </button>
        </form>
      </div>
    </div>
  );
}

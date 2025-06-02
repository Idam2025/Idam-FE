"use client";

import { useEffect, useState } from "react";
import styles from "./UserProfile.module.css";
import { CompanyProfile } from "@/types/company";

export default function CompanyProfilePage() {
  const [company, setCompany] = useState<CompanyProfile | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false); // hydration-safe

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedId = localStorage.getItem("userId");
      const storedToken = localStorage.getItem("accessToken");
      console.log("✅ userId:", storedId);
      console.log("✅ accessToken:", storedToken);
      setUserId(storedId);
      setToken(storedToken);
      setMounted(true);
    }
  }, []);

  useEffect(() => {
    if (!mounted || !userId || !token) return;

    const fetchCompanyProfile = async () => {
      console.log("📡 API 호출 시작");

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/company/${userId}/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const json = await res.json();
        console.log("📦 응답 데이터:", json);

        if (!json.success || !json.data) {
          throw new Error("기업 프로필 조회 실패");
        }

        setCompany(json.data); // ✅ 여기!
      } catch (err) {
        console.error("❌ 기업 프로필 불러오기 실패:", err);
      }
    };

    fetchCompanyProfile();
  }, [mounted, userId, token]);

  if (!mounted || !company) return <div>불러오는 중...</div>;

  return (
    <div className={styles.bg}>
      <div className={styles.container}>
        <h2 className={styles.title}>{company.companyName}</h2>
        <img
          src={company.profileImage}
          alt="프로필 이미지"
          className={styles.image}
        />
        <p>사업자등록번호: {company.businessRegistrationNumber}</p>
        <p>주소: {company.address}</p>
        <p>웹사이트: {company.website}</p>
        <p>이메일: {company.email}</p>
        <p>전화번호: {company.phone}</p>
      </div>
    </div>
  );
}

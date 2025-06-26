"use client";

import style from "./companyInfo.module.css";
import Section from "./section";
import { useEffect, useState } from "react";

type Company = {
  userId: number;
  companyName: string;
  profileImage: string;
  companyDescription: string;
  website: string;
};

const dummyCompanies: Company[] = [
  {
    userId: -1,
    companyName: "더미 컴퍼니",
    profileImage: "/Home/company_default.jpg",
    companyDescription: "기업 소개 정보가 없습니다.",
    website: "https://example.com",
  },
  {
    userId: -2,
    companyName: "가짜 주식회사",
    profileImage: "/Home/company_default.jpg",
    companyDescription: "이곳은 더미 데이터를 보여주는 영역입니다.",
    website: "https://dummycorp.dev",
  },
];

export default function CompanyInfo() {
  const [companies, setCompanies] = useState<Company[]>([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/company/preview`
        );
        if (!res.ok) throw new Error("기업 조회 실패");

        const json = await res.json();
        setCompanies(Array.isArray(json.data) ? json.data : dummyCompanies);
      } catch (err) {
        console.error("기업 불러오기 실패:", err);
        setCompanies(dummyCompanies);
      }
    };

    fetchCompanies();

    const intervalId = setInterval(fetchCompanies, 15000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className={style.container}>
      <div className={style.text}>COMPANY INFORMATION</div>
      {companies.map((company) => (
        <Section
          key={company.userId}
          title={company.companyName}
          description={company.companyDescription}
          imageSrc={company.profileImage}
          website={company.website}
        />
      ))}
    </div>
  );
}

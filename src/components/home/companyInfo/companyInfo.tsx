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
        setCompanies(json.data);
      } catch (err) {
        console.error("기업 불러오기 실패:", err);
      }
    };

    fetchCompanies();
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

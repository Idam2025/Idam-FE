"use client";

import { useEffect, useState } from "react";
import StudentProfilePage from "@/components/profile/UserProfile";
import CompanyProfilePage from "@/components/profile/CompanyProfilePage";

export default function ProfilePage() {
  const [userType, setUserType] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false); // SSR 방지용

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("userType");
      console.log("🔍 userType:", stored);
      setUserType(stored);
      setMounted(true); // 클라이언트 마운트 완료
    }
  }, []);

  if (!mounted || !userType) {
    return <div>불러오는 중...</div>;
  }

  return userType === "COMPANY" ? (
    <CompanyProfilePage />
  ) : (
    <StudentProfilePage />
  );
}

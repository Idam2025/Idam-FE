"use client";

import { useEffect, useState } from "react";
import StudentProfilePage from "@/components/profile/UserProfile";
import CompanyProfilePage from "@/components/profile/CompanyProfilePage";
import NavigationBar from "@/components/navigationbar/Home/mainNavigationBar";
import style from "./profile.module.css";

export default function ProfilePage() {
  const [userType, setUserType] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("userType");
      console.log("🔍 userType:", stored);
      setUserType(stored);
      setMounted(true);
    }
  }, []);

  if (!mounted || !userType) {
    return <div>불러오는 중...</div>;
  }

  return (
    <>
      <div className={style.container}>
        <NavigationBar />
        {userType === "COMPANY" ? (
          <CompanyProfilePage />
        ) : (
          <StudentProfilePage />
        )}
      </div>
    </>
  );
}

"use client";

import { useEffect, useState } from "react";
import StudentProfilePage from "@/components/profile/UserProfile";
import CompanyProfilePage from "@/components/profile/CompanyProfilePage";
import NavigationBar from "@/components/navigationbar/Home/mainNavigationBar";
import styles from "@/components/profile/StudentProfilePage.module.css";
import style from "./profile.module.css";
import { FaSpinner } from "react-icons/fa";

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
    return (
      <div className={styles.loadingContainer}>
        <FaSpinner className={styles.spinnerIcon} />
      </div>
    );
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

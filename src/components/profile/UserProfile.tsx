"use client";

import { useEffect, useState } from "react";
import styles from "./UserProfile.module.css";
import ProfileHeader from "./ProfileHeader";
import PortfolioSection from "./PortfoiloSection";
import PdfModal from "./PdfModal";
import { UserProfile } from "@/types/user";
import { motion } from "framer-motion";

const mockUser: UserProfile = {
  name: "홍길동",
  major: "컴퓨터공학과",
  nickname: "webdev123",
  profileImage: "/profile/default.png",
  email: "test@example.com",
  phone: "010-1234-5678",
  portfolios: [],
  categoryId: 1,
  gender: "남자",
};

export default function StudentProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(mockUser);
  const [editMode, setEditMode] = useState(false);
  const [pdfModalUrl, setPdfModalUrl] = useState<string | null>(null);
  const [newPortfolioLink, setNewPortfolioLink] = useState("");

  const userId =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  useEffect(() => {
    if (!userId) return;

    const fetchUserProfile = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/students/${userId}/profile`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            credentials: "include",
          }
        );
        const json = await res.json();
        if (!json.success) throw new Error("프로필 조회 실패");

        setUser({
          ...json.data,
          portfolios: json.data.portfolios ?? [],
        });
      } catch (err) {
        console.error("프로필 불러오기 실패:", err);
      }
    };

    fetchUserProfile();
  }, [userId]);

  if (!user) return <div className={styles.loading}>불러오는 중...</div>;

  return (
    <motion.div
      className={styles.bg}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className={styles.container}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <ProfileHeader
          user={{
            ...user,
            profileImage: user.profileImage ?? "/profile/default.png",
          }}
          setUser={setUser}
          editMode={editMode}
          setEditMode={setEditMode}
        />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <PortfolioSection
            user={user}
            setUser={setUser}
            editMode={editMode}
            newPortfolioLink={newPortfolioLink}
            setNewPortfolioLink={setNewPortfolioLink}
            setPdfModalUrl={setPdfModalUrl}
          />
        </motion.div>

        {pdfModalUrl && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <PdfModal url={pdfModalUrl} onClose={() => setPdfModalUrl(null)} />
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}

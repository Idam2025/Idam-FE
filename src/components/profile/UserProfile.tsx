"use client";

import { useEffect, useState } from "react";
import styles from "./UserProfile.module.css";
import ProfileHeader from "./ProfileHeader";
import PortfolioSection from "./PortfoiloSection";
import PdfModal from "./PdfModal";
import { UserProfile, Portfolio } from "@/types/user";

const mockUser: UserProfile = {
  name: "홍길동",
  major: "컴퓨터공학과",
  nickname: "webdev123",
  profile_image: "/profile/default.png",
  profileImage: "/profile/default.png",
  email: "test@example.com",
  phone: "010-1234-5678",
  portfolios: [],
  categoryId: 1,
  gender: "남자",
};

export default function UserProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(mockUser);
  const [editMode, setEditMode] = useState(false);
  const [pdfModalUrl, setPdfModalUrl] = useState<string | null>(null);
  const [newPortfolioLink, setNewPortfolioLink] = useState("");

  const userId =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  useEffect(() => {
    if (!userId) return;

    const fetchUserProfile = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/students/${userId}/profile`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const json = await res.json();
        if (!json.success) throw new Error("프로필 조회 실패");
        setUser(json.data);
      } catch (err) {
        console.error("프로필 불러오기 실패:", err);
      }
    };

    fetchUserProfile();
  }, [userId]);

  if (!user) return <div>불러오는 중...</div>;

  return (
    <div className={styles.bg}>
      <div className={styles.container}>
        <ProfileHeader
          user={user}
          setUser={setUser}
          editMode={editMode}
          setEditMode={setEditMode}
        />

        <PortfolioSection
          user={user}
          setUser={setUser}
          editMode={editMode}
          newPortfolioLink={newPortfolioLink}
          setNewPortfolioLink={setNewPortfolioLink}
          setPdfModalUrl={setPdfModalUrl}
        />

        {pdfModalUrl && (
          <PdfModal url={pdfModalUrl} onClose={() => setPdfModalUrl(null)} />
        )}
      </div>
    </div>
  );
}

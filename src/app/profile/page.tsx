"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "./UserProfile.module.css";

interface Portfolio {
  portfolio_id: number;
  portfolio: string;
}

interface UserProfileData {
  name: string;
  schoolName: string;
  major: string;
  schoolId: string;
  nickname: string;
  gender: string;
  profileImage: string;
  email: string;
  phone: string;
  categoryId: number;
  portfolios: Portfolio[];
}

const mockUser: UserProfileData = {
  name: "홍길동",
  schoolName: "테스트대학교",
  major: "컴퓨터공학과",
  schoolId: "20240001",
  nickname: "webdev123",
  gender: "남자",
  profileImage: "/profile/default.png",
  email: "test@example.com",
  phone: "010-1234-5678",
  categoryId: 1,
  portfolios: [
    {
      portfolio_id: 1,
      portfolio: "https://github.com/webdev123/project1",
    },
    {
      portfolio_id: 2,
      portfolio:
        "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    },
  ],
};

export default function UserProfile() {
  const [user, setUser] = useState<UserProfileData | null>(mockUser);
  const [editMode, setEditMode] = useState(false);
  const [pdfModalUrl, setPdfModalUrl] = useState<string | null>(null);
  const [newPortfolioLink, setNewPortfolioLink] = useState("");

  const userId =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  useEffect(() => {
    if (!userId) return;

    const fetchUserProfile = async () => {
      try {
        const res = await fetch(`/api/students/${userId}/profile`, {
          method: "GET",
          credentials: "include",
        });
        const json = await res.json();
        if (!json.success) throw new Error("프로필 조회 실패");

        setUser({
          ...json.data,
          portfolios: [],
        });
      } catch (err) {
        console.error("프로필 불러오기 실패:", err);
      }
    };

    fetchUserProfile();
  }, [userId]);

  const handleProfileUpdate = async () => {
    if (!user || !userId) return;

    try {
      const res = await fetch(`/api/students/${userId}/profile`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nickname: user.nickname,
          gender: user.gender,
        }),
      });

      const result = await res.json();
      if (!res.ok || !result.success) throw new Error("프로필 수정 실패");

      alert("프로필이 성공적으로 수정되었습니다.");
      setEditMode(false);
    } catch (err) {
      console.error("프로필 수정 오류:", err);
      alert("프로필 수정에 실패했습니다.");
    }
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || file.type !== "application/pdf" || !user) return;

    const formData = new FormData();
    formData.append("portfolio", file);

    try {
      const res = await fetch("/api/profile/student/portfolios", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("업로드 실패");

      const data = await res.json();
      setUser(
        (prev) =>
          prev && {
            ...prev,
            portfolios: [...prev.portfolios, data],
          }
      );
    } catch (err) {
      console.error("파일 업로드 오류:", err);
      alert("PDF 업로드에 실패했습니다.");
    }
  };

  const handleLinkSubmit = async () => {
    if (!newPortfolioLink || !user) return;

    try {
      const res = await fetch("/api/profile/student/portfolios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ portfolio: newPortfolioLink }),
      });

      if (!res.ok) throw new Error("링크 업로드 실패");

      const data = await res.json();
      setUser(
        (prev) =>
          prev && {
            ...prev,
            portfolios: [...prev.portfolios, data],
          }
      );
      setNewPortfolioLink("");
    } catch (err) {
      console.error("링크 업로드 오류:", err);
      alert("링크 업로드에 실패했습니다.");
    }
  };

  const handleDelete = (id: number) => {
    if (!confirm("정말 삭제하시겠어요?") || !user) return;
    setUser({
      ...user,
      portfolios: user.portfolios.filter((p) => p.portfolio_id !== id),
    });
  };

  if (!user) return <div>불러오는 중...</div>;

  return (
    <div className={styles.bg}>
      <div className={styles.container}>
        <div className={styles.profile}>
          <button
            className={styles.editBtn}
            onClick={() => {
              if (editMode) {
                handleProfileUpdate();
              } else {
                setEditMode(true);
              }
            }}
          >
            {editMode ? "✅ 저장" : "✏️ 프로필 수정"}
          </button>

          <div className={styles.avatarWrapper}>
            {editMode ? (
              <label htmlFor="profileImage" className={styles.avatarLabel}>
                <Image
                  src={user.profileImage}
                  alt="프로필 이미지"
                  width={120}
                  height={120}
                  className={styles.avatar}
                />
                <input
                  type="file"
                  id="profileImage"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const url = URL.createObjectURL(file);
                      setUser((prev) => prev && { ...prev, profileImage: url });
                    }
                  }}
                />
              </label>
            ) : (
              <Image
                src={user.profileImage}
                alt="프로필 이미지"
                width={120}
                height={120}
                className={styles.avatar}
              />
            )}
            {editMode && (
              <label htmlFor="profileImage" className={styles.avatarPlus}>
                ＋
              </label>
            )}
          </div>

          <div className={styles.info}>
            {editMode ? (
              <>
                <div className={styles.inputGroup}>
                  <label htmlFor="nickname">닉네임</label>
                  <input
                    id="nickname"
                    className={styles.input}
                    value={user.nickname}
                    onChange={(e) =>
                      setUser(
                        (prev) => prev && { ...prev, nickname: e.target.value }
                      )
                    }
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="gender">성별</label>
                  <select
                    id="gender"
                    className={styles.input}
                    value={user.gender}
                    onChange={(e) =>
                      setUser(
                        (prev) => prev && { ...prev, gender: e.target.value }
                      )
                    }
                  >
                    <option value="남자">남자</option>
                    <option value="여자">여자</option>
                    <option value="기타">기타</option>
                  </select>
                </div>
              </>
            ) : (
              <>
                <h2 className={styles.nickname}>{user.nickname}</h2>
                <p className={styles.email}>{user.email}</p>
                <p className={styles.textRow}>
                  <span>이름:</span> {user.name}
                </p>
                <p className={styles.textRow}>
                  <span>전화번호:</span> {user.phone}
                </p>
                <p className={styles.textRow}>
                  <span>전공:</span> {user.major}
                </p>
              </>
            )}
          </div>
        </div>

        <div className={styles.portfolioSection}>
          <h3 className={styles.portfolioTitle}>📁 내 포트폴리오</h3>
          <div className={styles.portfolioList}>
            {user.portfolios.map((item) => (
              <div key={item.portfolio_id} className={styles.portfolioItemBox}>
                {item.portfolio.endsWith(".pdf") ? (
                  <div
                    className={styles.pdfPreviewContainer}
                    onClick={() => setPdfModalUrl(item.portfolio)}
                  >
                    <iframe
                      src={item.portfolio}
                      width="100%"
                      height="160"
                      className={styles.pdfPreview}
                    />
                    <div className={styles.overlay}>🔍 클릭하여 크게 보기</div>
                  </div>
                ) : (
                  <a
                    href={item.portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.portfolioItem}
                  >
                    🔗 {item.portfolio}
                  </a>
                )}
                <button
                  className={styles.deleteBtn}
                  onClick={() => handleDelete(item.portfolio_id)}
                >
                  ❌ 삭제
                </button>
              </div>
            ))}
          </div>

          {editMode && (
            <>
              <form className={styles.uploadForm}>
                <label htmlFor="pdfUpload">📎 PDF 추가:</label>
                <input
                  type="file"
                  id="pdfUpload"
                  accept="application/pdf"
                  onChange={handlePdfUpload}
                />
              </form>

              <div className={styles.linkForm}>
                <label htmlFor="portfolioLink">🔗 링크 추가:</label>
                <input
                  type="url"
                  id="portfolioLink"
                  placeholder="https://github.com/username/project"
                  className={styles.input}
                  value={newPortfolioLink}
                  onChange={(e) => setNewPortfolioLink(e.target.value)}
                />
                <button
                  type="button"
                  className={styles.linkSubmitBtn}
                  onClick={handleLinkSubmit}
                >
                  추가
                </button>
              </div>
            </>
          )}
        </div>

        {pdfModalUrl && (
          <div
            className={styles.modalBackdrop}
            onClick={() => setPdfModalUrl(null)}
          >
            <div
              className={styles.modalContent}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className={styles.closeBtn}
                onClick={() => setPdfModalUrl(null)}
              >
                ❌ 닫기
              </button>
              <iframe src={pdfModalUrl} width="100%" height="100%" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import Image from "next/image";
import { useState } from "react";
import styles from "./UserProfile.module.css";

const mockUser = {
  email: "test@example.com",
  nickname: "webdev123",
  name: "홍길동",
  phone: "010-1234-5678",
  major: "컴퓨터공학과",
  profile_image: "/profile/default.png",
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
  const [user, setUser] = useState(mockUser);
  const [editMode, setEditMode] = useState(false);
  const [pdfModalUrl, setPdfModalUrl] = useState<string | null>(null);
  const [newPortfolioLink, setNewPortfolioLink] = useState("");

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || file.type !== "application/pdf") return;

    const formData = new FormData();
    formData.append("portfolio", file);

    try {
      const res = await fetch("/api/profile/student/portfolios", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("업로드 실패");

      const data = await res.json();
      setUser((prev) => ({
        ...prev,
        portfolios: [...prev.portfolios, data],
      }));
    } catch (err) {
      console.error("파일 업로드 오류:", err);
      alert("PDF 업로드에 실패했습니다.");
    }
  };

  const handleLinkSubmit = async () => {
    if (!newPortfolioLink) return;

    try {
      const res = await fetch("/api/profile/student/portfolios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ portfolio: newPortfolioLink }),
      });

      if (!res.ok) throw new Error("링크 업로드 실패");

      const data = await res.json();
      setUser((prev) => ({
        ...prev,
        portfolios: [...prev.portfolios, data],
      }));
      setNewPortfolioLink("");
    } catch (err) {
      console.error("링크 업로드 오류:", err);
      alert("링크 업로드에 실패했습니다.");
    }
  };

  const handleDelete = (id: number) => {
    if (!confirm("정말 삭제하시겠어요?")) return;
    setUser((prev) => ({
      ...prev,
      portfolios: prev.portfolios.filter((p) => p.portfolio_id !== id),
    }));
  };

  return (
    <div className={styles.bg}>
      <div className={styles.container}>
        <div className={styles.profile}>
          <button
            className={styles.editBtn}
            onClick={() => setEditMode(!editMode)}
          >
            ✏️ 프로필 수정
          </button>

          <div className={styles.avatarWrapper}>
            {editMode ? (
              <label htmlFor="profileImage" className={styles.avatarLabel}>
                <Image
                  src={user.profile_image}
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
                      setUser((prev) => ({ ...prev, profile_image: url }));
                    }
                  }}
                />
              </label>
            ) : (
              <Image
                src={user.profile_image}
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
  );
}

"use client";

import styles from "./UserProfile.module.css";
import { UserProfile } from "@/types/user";
import { Dispatch, SetStateAction, ChangeEvent } from "react";

interface Props {
  user: UserProfile;
  setUser: Dispatch<SetStateAction<UserProfile | null>>;
  editMode: boolean;
  newPortfolioLink: string;
  setNewPortfolioLink: Dispatch<SetStateAction<string>>;
  setPdfModalUrl: Dispatch<SetStateAction<string | null>>;
}

export default function PortfolioSection({
  user,
  setUser,
  editMode,
  newPortfolioLink,
  setNewPortfolioLink,
  setPdfModalUrl,
}: Props) {
  const handlePdfUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || file.type !== "application/pdf") return;

    const formData = new FormData();
    formData.append("portfolio", file);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/profile/student/portfolios`,
        {
          method: "POST",
          body: formData,
        }
      );
      if (!res.ok) throw new Error("업로드 실패");
      const data = await res.json();

      setUser((prev) =>
        prev ? { ...prev, portfolios: [...prev.portfolios, data] } : prev
      );
    } catch (err) {
      console.error("파일 업로드 오류:", err);
      alert("PDF 업로드에 실패했습니다.");
    }
  };

  const handleLinkSubmit = async () => {
    if (!newPortfolioLink) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/profile/student/portfolios`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ portfolio: newPortfolioLink }),
        }
      );
      if (!res.ok) throw new Error("링크 업로드 실패");
      const data = await res.json();

      setUser((prev) =>
        prev ? { ...prev, portfolios: [...prev.portfolios, data] } : prev
      );
      setNewPortfolioLink("");
    } catch (err) {
      console.error("링크 업로드 오류:", err);
      alert("링크 업로드에 실패했습니다.");
    }
  };

  const handleDelete = (id: number) => {
    if (!confirm("정말 삭제하시겠어요?")) return;
    setUser((prev) =>
      prev
        ? {
            ...prev,
            portfolios: prev.portfolios.filter((p) => p.portfolio_id !== id),
          }
        : prev
    );
  };

  return (
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
  );
}

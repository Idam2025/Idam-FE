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
  const accessToken =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  const userId =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  const appendPortfolio = (newItem: { id: number; url: string }) => {
    setUser((prev) =>
      prev ? { ...prev, portfolios: [...prev.portfolios, newItem] } : prev
    );
  };

  const handlePdfUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || file.type !== "application/pdf" || !accessToken || !userId)
      return;

    const formData = new FormData();
    formData.append("portfolioFile", file);

    try {
      const res = await fetch(
        `https://www.smini.site/api/students/${userId}/portfolios`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: formData,
        }
      );

      if (!res.ok) throw new Error("PDF 업로드 실패");
      const data = await res.json();
      appendPortfolio(data.data);
    } catch (err) {
      console.error("파일 업로드 오류:", err);
      alert("PDF 업로드에 실패했습니다.");
    }
  };

  const handleLinkSubmit = async () => {
    if (!newPortfolioLink || !accessToken || !userId) return;

    try {
      new URL(newPortfolioLink); // 링크 유효성 검증
    } catch {
      alert("올바른 링크를 입력해주세요 (http/https 포함)");
      return;
    }

    const formData = new FormData();
    formData.append("portfolioUrl", newPortfolioLink);

    try {
      const res = await fetch(
        `https://www.smini.site/api/students/${userId}/portfolios`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: formData,
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        console.error("❌ 서버 응답:", errorText);
        throw new Error("링크 업로드 실패");
      }

      const data = await res.json();
      appendPortfolio(data.data);
      setNewPortfolioLink("");
    } catch (err) {
      console.error("링크 업로드 오류:", err);
      alert("링크 업로드에 실패했습니다.");
    }
  };

  const handleDelete = (id: number) => {
    if (!confirm("정말 삭제하시겠어요?") || !accessToken || !userId) return;

    fetch(`https://www.smini.site/api/students/${userId}/portfolios/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("삭제 실패");
        return res.json();
      })
      .then(() => {
        setUser((prev) =>
          prev
            ? {
                ...prev,
                portfolios: prev.portfolios.filter(
                  (portfolio) => portfolio.id !== id
                ),
              }
            : prev
        );
      })
      .catch((err) => {
        console.error("삭제 오류:", err);
        alert("삭제에 실패했습니다.");
      });
  };

  return (
    <div className={styles.portfolioSection}>
      <h3 className={styles.portfolioTitle}>📁 내 포트폴리오</h3>

      <div className={styles.portfolioList}>
        {user.portfolios.map((item) =>
          item?.url ? (
            <div key={item.id} className={styles.portfolioItemBox}>
              {item.url.endsWith(".pdf") ? (
                <div
                  className={styles.pdfPreviewContainer}
                  onClick={() => setPdfModalUrl(item.url)}
                >
                  <iframe
                    src={item.url}
                    width="100%"
                    height="160"
                    className={styles.pdfPreview}
                  />
                  <div className={styles.overlay}>🔍 클릭하여 크게 보기</div>
                </div>
              ) : (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.portfolioItem}
                >
                  🔗 {item.url}
                </a>
              )}
              <button
                className={styles.deleteBtn}
                onClick={() => handleDelete(item.id)}
              >
                ❌ 삭제
              </button>
            </div>
          ) : null
        )}
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

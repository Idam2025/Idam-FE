"use client";

import { useEffect, useState } from "react";
import styles from "@/components/result/profile/profile.module.css";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import PdfModal from "@/components/profile/PdfModal";

interface StudentProfile {
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
  tags: string[];
  portfolios: { title: string; url: string }[];
}

export default function Page() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const id = pathname ? pathname.split("/").pop() ?? "" : "";

  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!id) return;
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) return;

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/students/${id}/profile`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!res.ok) throw new Error("프로필 조회 실패");

        const result = await res.json();
        setStudent(result.data);
      } catch (err) {
        console.error("❌ 프로필 조회 실패:", err);
      }
    };

    fetchProfile();
  }, [id]);

  const moveChat = async () => {
    if (isLoading || !id) return;

    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      alert("로그인이 필요합니다.");
      return;
    }

    if (!projectName.trim()) {
      alert("프로젝트명을 입력해주세요.");
      return;
    }

    try {
      setIsLoading(true); // ✅ 중복 방지
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/chat/room?targetUserId=${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ projectTitle: projectName.trim() }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "채팅방 생성 실패");

      if (data.roomId) {
        router.push(`/chat`);
      }
    } catch (error) {
      console.error("채팅방 이동 오류:", error);
      alert("채팅방 생성에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.profile_container}>
        <div className={styles.profile_content}>
          <Image
            src="/usual/profileBox.png"
            alt="Rectangle"
            width={1200}
            height={95}
          />
          <div className={styles.profile_content_Title}>
            <img
              className={styles.profile_image}
              src={student?.profileImage || "/profile/default.png"}
              alt={student?.name || "Profile"}
            />
            <div className={styles.profile_font_container}>
              <div className={styles.profile_font}>{student?.name}</div>
              <div className={styles.profile_font2}>{student?.email}</div>
              <button
                onClick={() => setShowModal(true)}
                className={styles.fancyButton}
              >
                Chat
              </button>
            </div>
          </div>

          <div className={styles.detail_info_container}>
            <div className={styles.infoBox}>
              <div>
                <strong>학교</strong>
                <p>{student?.schoolName}</p>
              </div>
              <div>
                <strong>전공</strong>
                <p>{student?.major}</p>
              </div>
              <div>
                <strong>닉네임</strong>
                <p>{student?.nickname}</p>
              </div>
              <div>
                <strong>성별</strong>
                <p>{student?.gender}</p>
              </div>
              <div>
                <strong>전화번호</strong>
                <p>{student?.phone}</p>
              </div>
              <div>
                <strong>기술 스택</strong>
                <div className={styles.tagList}>
                  {student?.tags?.map((tag, i) => (
                    <span key={i} className={styles.tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {Array.isArray(student?.portfolios) &&
            student.portfolios.length > 0 && (
              <div className={styles.portfolioSection}>
                <h3>포트폴리오</h3>
                <div className={styles.portfolioGrid}>
                  {student.portfolios.map((p, i) => (
                    <div key={i} className={styles.portfolioCard}>
                      <div className={styles.portfolioTitle}>{p.title}</div>
                      <div
                        onClick={() => setPdfUrl(p.url)}
                        className={styles.portfolioPreviewWrapper}
                      >
                        {p.url.endsWith(".pdf") ? (
                          <iframe
                            src={p.url}
                            className={styles.portfolioPreview}
                            title={p.title}
                          />
                        ) : (
                          <img
                            src={p.url}
                            alt={p.title}
                            className={styles.portfolioPreview}
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
        </div>
      </div>

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>프로젝트명을 입력해주세요</h2>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              onKeyUp={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  moveChat();
                }
              }}
              className={styles.modalInput}
            />
            <div className={styles.modalButtons}>
              <button onClick={() => setShowModal(false)}>취소</button>
              <button onClick={moveChat} disabled={isLoading}>
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      {pdfUrl && <PdfModal url={pdfUrl} onClose={() => setPdfUrl(null)} />}
    </div>
  );
}

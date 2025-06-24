"use client";

import { useEffect, useState } from "react";
import styles from "./UserProfile.module.css";
import { CompanyProfile } from "@/types/company";
import { FaCog } from "react-icons/fa";

export default function CompanyProfilePage() {
  const [company, setCompany] = useState<CompanyProfile | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [intro, setIntro] = useState<string>("");
  const [website, setWebsite] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedId = localStorage.getItem("userId");
      const storedToken = localStorage.getItem("accessToken");
      setUserId(storedId);
      setToken(storedToken);
      setMounted(true);
    }
  }, []);

  useEffect(() => {
    if (!mounted || !userId || !token) return;

    const fetchCompanyProfile = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/company/${userId}/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const json = await res.json();
        if (!json.success || !json.data) {
          throw new Error("기업 프로필 조회 실패");
        }
        setCompany(json.data);
        setIntro(json.data.companyDescription || "");
        setWebsite(json.data.website || "");
      } catch (err) {
        console.error("❌ 기업 프로필 불러오기 실패:", err);
      }
    };

    fetchCompanyProfile();
  }, [mounted, userId, token]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleImageUpload = async () => {
    if (!selectedFile || !userId || !token) return;
    const formData = new FormData();
    formData.append("profileImage", selectedFile);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/company/${userId}/profile/image`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );
      const json = await res.json();
      if (json.success) {
        alert(json.message);
        setSelectedFile(null);
        setPreviewImage(null);
        window.location.reload();
      }
    } catch (err) {
      console.error("❌ 이미지 업로드 실패:", err);
    }
  };

  const handleProfileSave = async () => {
    if (!userId || !token) return;

    const body: Record<string, string> = {};
    if (intro.trim()) body.companyDescription = intro.trim();
    if (website.trim()) body.website = website.trim();

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/company/${userId}/profile`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );
      const json = await res.json();
      if (json.success) {
        alert("기업 정보가 저장되었습니다.");
        setIsEditMode(false);
        window.location.reload();
      }
    } catch (err) {
      console.error("❌ 기업 정보 저장 실패:", err);
    }
  };

  if (!mounted || !company) return <div>불러오는 중...</div>;

  return (
    <div className={styles.bg}>
      <div className={styles.container}>
        {/* 우측 상단 설정 아이콘 */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <FaCog
            className={styles.settingIcon}
            onClick={() => setIsEditMode(!isEditMode)}
          />
        </div>

        {/* 프로필 */}
        <div className={styles.profile}>
          <div className={styles.avatarWrapper}>
            <img
              src={previewImage || company.profileImage || undefined} // ✅ null or undefined
              alt="프로필 이미지"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <div>
            <div className={styles.nickname}>{company.companyName}</div>
          </div>
        </div>

        {/* 수정 모드 */}
        {isEditMode && (
          <div className={styles.uploadForm}>
            <label htmlFor="imageUpload">프로필 이미지 변경</label>
            <input
              type="file"
              id="imageUpload"
              accept="image/*"
              onChange={handleFileChange}
            />
            <button
              className={styles.linkSubmitBtn}
              onClick={handleImageUpload}
            >
              이미지 저장
            </button>

            <label htmlFor="website">웹사이트 주소</label>
            <input
              id="website"
              type="text"
              className={styles.input}
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://example.com"
            />

            <label htmlFor="intro">기업 소개글</label>
            <textarea
              id="intro"
              className={styles.input}
              rows={4}
              placeholder="기업 소개글을 입력하세요..."
              value={intro}
              onChange={(e) => setIntro(e.target.value)}
            />

            <div style={{ display: "flex", gap: "8px" }}>
              <button
                className={styles.linkSubmitBtn}
                onClick={handleProfileSave}
              >
                저장
              </button>
              <button
                className={styles.deleteBtn}
                onClick={() => {
                  setIsEditMode(false);
                  setSelectedFile(null);
                  setPreviewImage(null);
                  setIntro(company.companyDescription || "");
                  setWebsite(company.website || "");
                }}
              >
                취소
              </button>
            </div>
          </div>
        )}

        {/* 기본 정보 */}
        <p className={styles.textRow}>
          사업자등록번호: {company.businessRegistrationNumber}
        </p>
        <p className={styles.textRow}>주소: {company.address}</p>
        <p className={styles.textRow}>웹사이트: {company.website}</p>
        <p className={styles.textRow}>이메일: {company.email}</p>
        <p className={styles.textRow}>전화번호: {company.phone}</p>

        {/* 소개글 */}
        <div className={styles.portfolioSection}>
          <div className={styles.portfolioTitle}>기업 소개</div>
          <p className={styles.textRow}>
            {company.companyDescription?.trim()
              ? company.companyDescription
              : "기업 소개글을 작성해주세요."}
          </p>
        </div>
      </div>
    </div>
  );
}

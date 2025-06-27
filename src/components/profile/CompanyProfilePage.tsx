"use client";

import { useEffect, useState } from "react";
import styles from "./StudentProfilePage.module.css";
import { CompanyProfile } from "@/types/company";
import { FaCog, FaPlus, FaSpinner } from "react-icons/fa";

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

  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    if (company) {
      setPhone(company.phone || "");
      setEmail(company.email || "");
    }
  }, [company]);

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
    if (email.trim()) body.email = email.trim();
    if (phone.trim()) body.phone = phone.trim();

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/company/${userId}/profile`,
        {
          method: "PATCH", // ✅ API 명세에 따르면 PATCH 사용
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

  if (!mounted || !company) {
    return (
      <div className={styles.loadingContainer}>
        <FaSpinner className={styles.spinnerIcon} />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.profile_container}>
        <div className={styles.profile_content_Title}>
          {/* 프로필 이미지 */}
          <div className={styles.profile_image_wrapper}>
            <img
              src={
                previewImage ||
                company.profileImage ||
                "/Home/company_default.jpg"
              }
              alt="프로필 이미지"
              className={styles.profile_image}
            />

            {isEditMode && (
              <label className={styles.plusIcon} htmlFor="imageUpload">
                <FaPlus />
                <input
                  type="file"
                  id="imageUpload"
                  accept="image/*"
                  onChange={handleFileChange}
                  className={styles.hiddenInput} // 안 보이게 처리
                />
              </label>
            )}
          </div>

          {/* 기업명 + 기본 정보 */}
          <div className={styles.profile_font_container}>
            <div className={styles.profile_font}>{company.companyName}</div>
          </div>

          {/* 설정 버튼 */}
          <div className={styles.profile_button_container}>
            <button
              className={styles.fancyButton}
              onClick={() => {
                if (isEditMode) {
                  // ✅ 완료 눌렀을 때 저장 요청
                  handleProfileSave();
                } else {
                  // ✅ 수정 모드 진입
                  setIsEditMode(true);
                }
              }}
            >
              {isEditMode ? "완료" : "수정"}
            </button>
          </div>
        </div>

        <div className={styles.infoBox}>
          <div>
            <strong>사업자 등록번호</strong>
            <p>{company.businessRegistrationNumber}</p> {/* 수정 불가 항목 */}
          </div>
          <div>
            <strong>주소</strong>
            <p>{company.address}</p> {/* 수정 불가 항목 */}
          </div>
          <div>
            <strong>이메일</strong>
            {isEditMode ? (
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={company.email || "example@company.com"}
                className={styles.editInput}
              />
            ) : (
              <p>{company.email}</p>
            )}
          </div>
          <div>
            <strong>전화번호</strong>
            {isEditMode ? (
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={company.phone || "010-1234-5678"}
                className={styles.editInput}
              />
            ) : (
              <p>{company.phone}</p>
            )}
          </div>
          <div>
            <strong>웹사이트 주소</strong>
            {isEditMode ? (
              <input
                type="text"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder={company.website || "https://example.com"}
                className={styles.editInput}
              />
            ) : (
              <p>{company.website}</p>
            )}
          </div>
          <div style={{ flex: 1 }}>
            <strong>기업 소개</strong>
            {isEditMode ? (
              <textarea
                rows={4}
                value={intro}
                onChange={(e) => setIntro(e.target.value)}
                placeholder={
                  company.companyDescription || "기업 소개글을 입력하세요..."
                }
                className={styles.editInput_company}
              />
            ) : (
              <p>
                {company.companyDescription?.trim()
                  ? company.companyDescription
                  : "기업 소개글을 작성해주세요."}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

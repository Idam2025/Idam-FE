"use client";

import styles from "@/components/result/profile/profile.module.css";
import PdfModal from "./PdfModal";
import useStudentProfile from "@/hooks/profile/useStudentProfile";
import { useState } from "react";

export default function StudentProfilePage() {
  const {
    student,
    isLoading,
    editMode,
    setEditMode,
    formData,
    setFormData,
    handleChange,
    handleSave,
    handlePreview,
    pdfUrl,
    showModal,
    setShowModal,
    fetchTags,
  } = useStudentProfile();
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [showCategorySelect, setShowCategorySelect] = useState(false);
  const [fetchedTags, setFetchedTags] = useState<string[]>([]);

  if (isLoading || !student)
    return <div className={styles.loading}>불러오는 중...</div>;

  return (
    <div className={styles.bg}>
      <div className={styles.container}>
        <div className={styles.profile_container}>
          <div className={styles.scrollContainer}>
            <div className={styles.scrollContent}>
              <div className={styles.profile_content_Title}>
                <img
                  src={student.profileImage || "/default-profile.png"}
                  alt="Profile"
                  className={styles.profile_image}
                />
                <div className={styles.profile_font_container}>
                  {editMode ? (
                    <input
                      type="text"
                      name="nickname"
                      value={formData.nickname}
                      onChange={handleChange}
                      className={styles.editInput}
                    />
                  ) : (
                    <div className={styles.profile_font}>
                      {student.nickname}
                    </div>
                  )}
                  <div className={styles.profile_font2}>{student.email}</div>
                </div>
                <div className={styles.profile_button_container}>
                  <button
                    className={styles.fancyButton}
                    onClick={editMode ? handleSave : () => setEditMode(true)}
                  >
                    {editMode ? "저장" : "수정"}
                  </button>
                  {editMode && (
                    <>
                      <button
                        className={styles.fancyButton}
                        onClick={() => setShowCategorySelect((prev) => !prev)}
                      >
                        태그 조회
                      </button>

                      {showCategorySelect && (
                        <div style={{ marginTop: "10px" }}>
                          <select
                            className={styles.editInput}
                            onChange={(e) => {
                              const categoryId = Number(e.target.value);
                              setSelectedCategoryId(categoryId);
                              fetchTags(categoryId);
                            }}
                          >
                            <option value="">카테고리 선택</option>
                            <option value="1">IT·프로그래밍</option>
                            <option value="2">디자인</option>
                            <option value="3">마케팅</option>
                          </select>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              <div className={styles.detail_info_container}>
                <div className={styles.infoBox}>
                  <div>
                    <strong>이름</strong>
                    <p>{student.name}</p>
                  </div>
                  <div>
                    <strong>학교</strong>
                    <p>{student.schoolName}</p>
                  </div>
                  <div>
                    <strong>학번</strong>
                    <p>{student.schoolId}</p>
                  </div>
                  <div>
                    <strong>전화번호</strong>
                    {editMode ? (
                      <input
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={styles.editInput}
                      />
                    ) : (
                      <p>{student.phone}</p>
                    )}
                  </div>
                  <div>
                    <strong>성별</strong>
                    <p>{student.gender === "MALE" ? "남성" : "여성"}</p>
                    <br />
                    <strong>학과</strong>
                    {editMode ? (
                      <input
                        name="major"
                        value={formData.major}
                        onChange={handleChange}
                        className={styles.editInput}
                      />
                    ) : (
                      <p>{student.major}</p>
                    )}
                  </div>
                  <div>
                    <strong>기술 스택</strong>
                    {editMode ? (
                      <input
                        name="tags"
                        value={formData.tags}
                        onChange={handleChange}
                        className={styles.editInput}
                      />
                    ) : (
                      <div className={styles.tagList}>
                        {student.tags.map((tag, index) => (
                          <span key={index} className={styles.tag}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className={styles.portfolioSection}>
                <h3>포트폴리오</h3>
                <div className={styles.portfolioGrid}>
                  {student.portfolios.map((p, idx) => (
                    <div key={idx} className={styles.portfolioCard}>
                      <div className={styles.portfolioTitle}>{p.title}</div>
                      {p.url.endsWith(".pdf") ? (
                        <embed
                          src={p.url}
                          type="application/pdf"
                          width="100%"
                          height="200px"
                          onClick={() => handlePreview(p.url)}
                          style={{ cursor: "pointer" }}
                        />
                      ) : (
                        <img
                          src={p.url}
                          alt={p.title}
                          className={styles.portfolioImage}
                          onClick={() => handlePreview(p.url)}
                        />
                      )}
                      <a
                        href={p.url}
                        className={styles.buttonLikeLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        자세히 보기
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showModal && pdfUrl && (
        <PdfModal url={pdfUrl} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}

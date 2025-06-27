import { useEffect, useRef, useState } from "react";
import styles from "./StudentProfilePage.module.css";
import { FaPlus, FaMinus } from "react-icons/fa";
import Draggable from "react-draggable";

export default function UserProfile() {
  const [student, setStudent] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    nickname: "",
    gender: "",
    email: "",
    phone: "",
  });

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isValidPhone = (phone: string) =>
    /^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/.test(phone);

  const [emailValid, setEmailValid] = useState(true);
  const [phoneValid, setPhoneValid] = useState(true);

  const [showTagDeleteModal, setShowTagDeleteModal] = useState(false);

  const [tagModalPosition, setTagModalPosition] = useState({ x: 200, y: 200 });
  const handleOpenTagDeleteModal = () => {
    setSelectedTags([]);

    if (student?.tags) {
      setStudentTags(student.tags);
    }

    if (student?.categoryId) {
      setCategoryId(student.categoryId); // ✅ 프로필에서 받은 카테고리 ID 사용
    }

    setTimeout(() => {
      setShowTagDeleteModal(true);
    }, 0);
  };

  const [profileImage, setProfileImage] = useState<File | null>(null);

  const [studentTags, setStudentTags] = useState<string[]>(student?.tags ?? []);

  const profileImageInputRef = useRef<HTMLInputElement | null>(null);

  const [showTagModal, setShowTagModal] = useState(false);

  const tagModalRef = useRef<HTMLDivElement>(null);

  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  );
  const [tagOptions, setTagOptions] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const [userId, setUserId] = useState<number | null>(null);
  const [portfolioFile, setPortfolioFile] = useState<File | null>(null);
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [showPortfolioModal, setShowPortfolioModal] = useState(false);

  const tagDeleteModalRef = useRef<HTMLDivElement>(null); // Draggable용 ref

  const [portfolios, setPortfolios] = useState<{ id: number; url: string }[]>(
    []
  );

  const [selectedPortfolio, setSelectedPortfolio] = useState<string | null>(
    null
  );

  const [portfolioModalPosition, setPortfolioModalPosition] = useState({
    x: 0,
    y: 0,
  });
  const portfolioModalRef = useRef(null);

  const handleDeleteTags = async () => {
    console.log("🔥 삭제 버튼 클릭됨");
    console.log(categoryId, selectedTags.length);
    // 이렇게 바꾸기
    if (selectedTags.length === 0) return;

    console.log("🔥 삭제 버튼 클릭됨");

    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/students/${userId}/categories/${categoryId}/tags`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ tags: selectedTags }),
        }
      );
      const json = await res.json();
      if (json.success) {
        setShowTagDeleteModal(false);
        setSelectedTags([]);
        await getStudentProfile(); // ✅ 프로필 데이터 다시 불러오기
      } else {
        throw new Error(json.message);
      }
    } catch (err) {
      console.error("태그 삭제 실패:", err);
      alert("태그 삭제 중 오류 발생");
    }
  };

  useEffect(() => {
    if (showPortfolioModal) {
      const modalWidth = 400; // 대략적인 모달 크기
      const modalHeight = 300;
      const centerX = window.innerWidth / 2 - modalWidth / 2;
      const centerY = window.innerHeight / 2 - modalHeight / 2;
      setPortfolioModalPosition({ x: centerX, y: centerY });
    }
  }, [showPortfolioModal]);

  const handleUploadPortfolio = async () => {
    if (!userId || !portfolioFile) {
      alert("포트폴리오 파일을 선택해주세요.");
      return;
    }

    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      alert("로그인이 필요합니다.");
      return;
    }

    const formData = new FormData();
    formData.append("portfolioFile", portfolioFile); // PDF 파일
    formData.append("portfolioUrl", portfolioUrl); // 선택적 URL

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/students/${userId}/portfolios`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: formData,
        }
      );

      const json = await res.json();
      if (json.success) {
        await getStudentProfile();
        setShowPortfolioModal(false);
        setPortfolioFile(null);
        setPortfolioUrl("");
      } else {
        alert("등록 실패: " + json.message);
      }
    } catch (err) {
      console.error("포트폴리오 등록 오류:", err);
      alert("오류가 발생했습니다.");
    }
  };

  const handleDeletePortfolio = async (portfolioId: number) => {
    if (!userId) return;
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) return;

    const confirmed = window.confirm("정말 삭제하시겠습니까?");
    if (!confirmed) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/students/${userId}/portfolios/${portfolioId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const json = await res.json();
      if (json.success) {
        setPortfolios((prev) => prev.filter((p) => p.id !== portfolioId));
      } else {
        alert("삭제 실패: " + json.message);
      }
    } catch (err) {
      console.error("삭제 오류:", err);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) setUserId(Number(storedUserId));
  }, []);

  useEffect(() => {
    if (userId) {
      getStudentProfile();
    }
  }, [userId]);

  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (showTagModal) {
      const modalWidth = 400; // 예상 모달 너비
      const modalHeight = 400; // 예상 모달 높이
      const centerX = window.innerWidth / 2 - modalWidth / 2;
      const centerY = window.innerHeight / 2 - modalHeight / 2;
      setModalPosition({ x: centerX, y: centerY });
    }
  }, [showTagModal]);

  const getStudentProfile = async () => {
    if (!userId) return;
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) return;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/students/${userId}/profile`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    const json = await res.json();
    if (json.success) {
      const data = json.data;
      setStudent(data);
      setFormData({
        nickname: data.nickname,
        gender: data.gender,
        email: data.email,
        phone: data.phone,
      });

      setPortfolios(data.portfolios);
      setStudentTags(data.tags);
    }
  };

  const handleSave = async () => {
    if (!userId) return;
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) return;
    console.log(formData.phone, formData.email);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/students/${userId}/profile`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            nickname: formData.nickname,
            phone: formData.phone,
            email: formData.email,
            gender: formData.gender,
          }),
        }
      );

      const json = await res.json();
      console.log(json);
      if (json.success) {
        await getStudentProfile();
        setEditMode(false);
      } else {
        alert("수정 실패: " + json.message);
      }
    } catch (err) {
      console.error("프로필 수정 오류:", err);
      alert("서버 오류 발생");
    }
  };

  const handleUploadImage = async (file: File) => {
    if (!userId || !file) return;

    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) return;

    const fd = new FormData();
    fd.append("profileImage", file);

    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/students/${userId}/profile/image`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${accessToken}` },
          body: fd,
        }
      );
      await getStudentProfile();
    } catch (err) {
      console.error("프로필 이미지 업로드 오류:", err);
      alert("업로드 중 오류가 발생했습니다.");
    }
  };

  const handleDeleteImage = async () => {
    if (!userId) return;
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) return;

    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/students/${userId}/profile/image`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    await getStudentProfile();
  };

  const handleFetchTags = async () => {
    if (!categoryId) return;
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) return;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/categories/${categoryId}/tags`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    const json = await res.json();
    if (json.success) {
      const tagNames = json.data.map((tag: { tagName: string }) => tag.tagName);
      setTagOptions(tagNames);
    }
  };

  const handleTagClick = (tagName: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagName)
        ? prev.filter((tag) => tag !== tagName)
        : [...prev, tagName]
    );
  };

  const handleUploadUrlOnly = async () => {
    if (!portfolioUrl) {
      alert("URL을 입력해주세요.");
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      const formData = new FormData();
      formData.append("portfolioUrl", portfolioUrl);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/students/${userId}/portfolios`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const json = await res.json();
      if (json.success) {
        alert("포트폴리오 URL이 등록되었습니다.");
        setPortfolioUrl(""); // 입력창 초기화
        // TODO: 프로필 다시 fetch
      } else {
        throw new Error(json.message);
      }
    } catch (err) {
      console.error("URL 등록 실패:", err);
      alert("URL 등록 중 오류 발생");
    }
  };
  /* ---------------------------------------태그 모달 ------------------*/
  useEffect(() => {
    if (showTagModal) {
      const modalWidth = 400; // 너 모달 width에 맞게 조정
      const modalHeight = 300; // 너 모달 height에 맞게 조정
      const x = window.innerWidth / 2 - modalWidth / 2;
      const y = window.innerHeight / 2 - modalHeight / 2;
      setModalPosition({ x, y });
    }
  }, [showTagModal]);
  /* ---------------------------------------------------------------*/
  const handleAddTags = async () => {
    if (!userId || !categoryId || selectedTags.length === 0) return;

    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/students/${userId}/categories/${categoryId}/tags`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ tags: selectedTags }),
        }
      );

      const json = await res.json();
      if (json.success) {
        setSelectedTags([]);
        setShowTagModal(false);
        await getStudentProfile();
      } else {
        alert("태그 추가 실패: " + json.message);
      }
    } catch (err) {
      console.error("태그 추가 오류:", err);
      alert("오류 발생");
    }
  };

  if (!student) return <div className={styles.profile_font}></div>;
  return (
    <div className={styles.container}>
      <div className={styles.profile_container}>
        <div className={styles.profile_content_Title}>
          <div className={styles.profile_image_wrapper}>
            <img
              src={student.profileImage || "/profile/default.png"}
              className={styles.profile_image}
              alt="Profile"
              onClick={() => {
                if (editMode) profileImageInputRef.current?.click();
              }}
              style={{ cursor: editMode ? "pointer" : "default" }}
            />

            {editMode && (
              <>
                <div
                  className={styles.plusIcon}
                  onClick={() => profileImageInputRef.current?.click()}
                >
                  <FaPlus />
                </div>

                <input
                  type="file"
                  accept="image/*"
                  ref={profileImageInputRef}
                  style={{ display: "none" }}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setProfileImage(file);
                      handleUploadImage(file);
                    }
                  }}
                />
              </>
            )}
          </div>

          <div className={styles.profile_font_container}>
            <div className={styles.profile_font}>{student.name}</div>
            <div className={styles.profile_font2}>{student.schoolName}</div>
          </div>

          <div className={styles.profile_button_container}>
            <button
              className={styles.fancyButton}
              disabled={!emailValid || !phoneValid}
              onClick={() => {
                if (editMode) {
                  handleSave();
                } else {
                  setEditMode(true);
                }
              }}
            >
              {editMode ? "완료" : "수정"}
            </button>
          </div>
        </div>

        <div className={styles.infoBox}>
          <div>
            <strong>학번</strong>
            <p>{student.schoolId}</p>
          </div>
          <div>
            <strong>전공</strong>
            <p>{student.major}</p>
          </div>
          <div>
            <strong>이메일</strong>
            {editMode ? (
              <input
                className={styles.editInput}
                value={formData.email}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData((prev) => ({ ...prev, email: value }));
                  setEmailValid(isValidEmail(value));
                }}
                placeholder={student.email}
              />
            ) : (
              <p>{student.email}</p>
            )}
            <>
              {!emailValid && (
                <p className={styles.error}>유효한 이메일 주소를 입력하세요.</p>
              )}
            </>
          </div>

          <div>
            <strong>전화번호</strong>
            {editMode ? (
              <input
                className={styles.editInput}
                value={formData.phone}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData((prev) => ({ ...prev, phone: value }));
                  setPhoneValid(isValidPhone(value));
                }}
                placeholder={student.phone}
              />
            ) : (
              <p>{student.phone}</p>
            )}
            {!phoneValid && (
              <p className={styles.error}>유효한 전화번호 형식을 입력하세요.</p>
            )}
          </div>
          <div>
            <strong>닉네임</strong>
            {editMode ? (
              <input
                className={styles.editInput}
                value={formData.nickname}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, nickname: e.target.value }))
                }
                placeholder={student.nickname}
              />
            ) : (
              <p>{student.nickname}</p>
            )}
          </div>
          <div>
            <div className={styles.stackTitleRow}>
              <strong>기술 스택</strong>
              {editMode && (
                <div className={styles.tagIconGroup}>
                  <div
                    className={styles.plusButton}
                    onClick={() => setShowTagModal(true)}
                    title="태그 추가"
                  >
                    <FaPlus />
                  </div>
                </div>
              )}
              {editMode && (
                <div
                  className={styles.minusButton}
                  onClick={handleOpenTagDeleteModal}
                  title="태그 삭제"
                >
                  <FaMinus />
                </div>
              )}

              {showTagDeleteModal && (
                <Draggable
                  nodeRef={tagDeleteModalRef}
                  defaultPosition={tagModalPosition}
                >
                  <div ref={tagDeleteModalRef} className={styles.modal_delete}>
                    <h3 className={styles.modalHeader}>기술 스택 삭제</h3>

                    <div className={styles.tagContainer_delete}>
                      {studentTags.map((tag, idx) => (
                        <span
                          key={idx}
                          className={`${styles.tagItem} ${
                            selectedTags.includes(tag) ? styles.selected : ""
                          }`}
                          onClick={() => handleTagClick(tag)}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className={styles.buttonRow}>
                      <button
                        className={styles.fancyButton2}
                        onClick={handleDeleteTags}
                        disabled={selectedTags.length === 0}
                      >
                        선택한 태그 삭제
                      </button>
                      <button
                        className={styles.cancelButton}
                        onClick={() => setShowTagDeleteModal(false)}
                      >
                        닫기
                      </button>
                    </div>
                  </div>
                </Draggable>
              )}

              {showTagModal && (
                <Draggable
                  nodeRef={tagModalRef}
                  defaultPosition={tagModalPosition}
                >
                  <div ref={tagModalRef} className={styles.modal}>
                    <h3 className={styles.modalHeader}>기술 스택 선택</h3>

                    <label className={styles.label}>카테고리 선택</label>
                    <select
                      className={styles.editInput}
                      value={categoryId ?? ""}
                      onChange={(e) => setCategoryId(Number(e.target.value))}
                    >
                      <option value="" disabled>
                        카테고리를 선택하세요
                      </option>
                      <option value={1}>IT·프로그래밍</option>
                      <option value={2}>디자인</option>
                      <option value={3}>마케팅</option>
                    </select>

                    <button
                      className={styles.fancyButton}
                      onClick={handleFetchTags}
                      style={{ marginTop: "12px" }}
                    >
                      태그 불러오기
                    </button>

                    <div className={styles.tagContainer}>
                      {tagOptions.map((tag, idx) => (
                        <span
                          key={idx}
                          className={`${styles.tagItem} ${
                            selectedTags.includes(tag) ? styles.selected : ""
                          }`}
                          onClick={() => handleTagClick(tag)}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className={styles.buttonRow}>
                      <button
                        className={styles.fancyButton2}
                        onClick={handleAddTags}
                      >
                        태그 추가
                      </button>
                      <button
                        className={styles.cancelButton}
                        onClick={() => setShowTagModal(false)}
                      >
                        닫기
                      </button>
                    </div>
                  </div>
                </Draggable>
              )}
            </div>

            <div className={styles.tagContainer}>
              {student?.tags?.map((tag: string, idx: number) => (
                <span key={idx} className={styles.tagItem}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
        {editMode && (
          <>
            {showPortfolioModal && (
              <Draggable
                nodeRef={portfolioModalRef}
                defaultPosition={tagModalPosition}
              >
                <div ref={portfolioModalRef} className={styles.modal}>
                  <h3>포트폴리오 업로드</h3>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) =>
                      setPortfolioFile(e.target.files?.[0] ?? null)
                    }
                  />
                  <input
                    type="text"
                    placeholder="포트폴리오 URL (선택)"
                    value={portfolioUrl}
                    onChange={(e) => setPortfolioUrl(e.target.value)}
                  />
                  <button
                    className={styles.fancyButton_port}
                    onClick={handleUploadPortfolio}
                  >
                    업로드
                  </button>
                  <button
                    className={styles.cancelButton}
                    onClick={() => setShowPortfolioModal(false)}
                  >
                    닫기
                  </button>
                </div>
              </Draggable>
            )}
          </>
        )}
        <div className={styles.infoBox_port}>
          <div className={styles.portfolioContainer}>
            <strong>포트폴리오</strong>
            <div className={styles.editForm}>
              {editMode && (
                <button
                  className={styles.fancyButton}
                  onClick={() => setShowPortfolioModal(true)}
                >
                  포트폴리오 추가
                </button>
              )}
            </div>
            {portfolios.length === 0 ? (
              <p>등록된 포트폴리오가 없습니다.</p>
            ) : (
              <div className={styles.portfolioList}>
                {portfolios.map((p) => (
                  <div key={p.id} className={styles.portfolioItem}>
                    <embed
                      src={`${p.url}#toolbar=0`}
                      type="application/pdf"
                      width="100%"
                      height="80%"
                    />

                    <div className={styles.buttonRow}>
                      <button
                        className={styles.fancyButton}
                        onClick={() => window.open(p.url, "_blank")}
                      >
                        자세히 보기
                      </button>

                      {editMode && (
                        <button
                          className={styles.cancelButton}
                          onClick={() => handleDeletePortfolio(p.id)}
                        >
                          삭제
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

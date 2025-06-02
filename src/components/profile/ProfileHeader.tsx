"use client";

import Image from "next/image";
import styles from "./UserProfile.module.css";
import { UserProfile } from "@/types/user";
import {
  Dispatch,
  SetStateAction,
  ChangeEvent,
  useEffect,
  useState,
} from "react";
import TagEditorModal from "./TagEditor";

interface ProfileHeaderProps {
  user: UserProfile & {
    gender?: string;
    categoryId: number;
    profileImage: string;
    tags?: string[];
    portfolios?: any[];
  };
  setUser: Dispatch<SetStateAction<UserProfile | null>>;
  editMode: boolean;
  setEditMode: Dispatch<SetStateAction<boolean>>;
}

export default function ProfileHeader({
  user,
  setUser,
  editMode,
  setEditMode,
}: ProfileHeaderProps) {
  const [showTagEditor, setShowTagEditor] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [userId, setUserId] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId") || "";
    const storedAccessToken = localStorage.getItem("accessToken") || "";
    setUserId(storedUserId);
    setAccessToken(storedAccessToken);
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleProfileUpdate = async () => {
    if (!user || !userId || !accessToken) return;

    try {
      if (uploadFile) {
        const formData = new FormData();
        formData.append("profileImage", uploadFile);

        const uploadRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/students/${userId}/profile/image`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            body: formData,
          }
        );

        const uploadJson = await uploadRes.json();
        if (!uploadRes.ok || !uploadJson.success) {
          throw new Error(uploadJson.message || "프로필 이미지 업로드 실패");
        }
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/students/${userId}/profile`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            nickname: user.nickname,
            gender: user.gender,
          }),
        }
      );

      const json = await res.json();
      if (!res.ok || !json.success)
        throw new Error(json.message || "프로필 수정 실패");

      alert("프로필이 성공적으로 수정되었습니다.");
      setEditMode(false);
      setUploadFile(null);
      setPreviewImage(null);

      const refetch = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/students/${userId}/profile`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          credentials: "include",
        }
      );

      const result = await refetch.json();
      if (result.success) {
        setUser({
          ...result.data,
          portfolios: result.data.portfolios ?? [],
        });
      }
    } catch (err) {
      console.error("프로필 수정 오류:", err);
      alert("프로필 수정에 실패했습니다.");
    }
  };

  return (
    <div className={styles.profile}>
      <div className={styles.buttonRow}>
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
        {editMode && (
          <button onClick={() => setShowTagEditor(true)}>📌 태그 조회</button>
        )}
      </div>

      {showTagEditor && (
        <TagEditorModal
          userId={userId}
          onClose={() => setShowTagEditor(false)}
        />
      )}

      <div className={styles.avatarWrapper}>
        {editMode ? (
          <label htmlFor="profileImage" className={styles.avatarLabel}>
            <Image
              src={
                previewImage ||
                user.profileImage?.trim() ||
                "/profile/default.png"
              }
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
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                const file = e.target.files?.[0];
                if (file) {
                  setUploadFile(file);
                  const url = URL.createObjectURL(file);
                  setPreviewImage(url);
                }
              }}
            />
          </label>
        ) : (
          <Image
            src={user.profileImage?.trim() || "/profile/default.png"}
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
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setUser((prev) =>
                    prev ? { ...prev, nickname: e.target.value } : prev
                  )
                }
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="gender">성별</label>
              <select
                id="gender"
                className={styles.input}
                value={user.gender || ""}
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                  setUser((prev) =>
                    prev ? { ...prev, gender: e.target.value } : prev
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
            <div className={styles.textRow}>
              <span>태그:</span>
              <div className={styles.tagList}>
                {user.tags?.map((tag, idx) => (
                  <span key={idx} className={styles.tag}>
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

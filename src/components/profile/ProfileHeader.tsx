"use client";

import Image from "next/image";
import styles from "./UserProfile.module.css";
import { UserProfile } from "@/types/user";
import { Dispatch, SetStateAction, ChangeEvent, useState } from "react";
import TagEditorModal from "./TagEditor";

interface ProfileHeaderProps {
  user: UserProfile & {
    gender?: string;
    categoryId: number;
    profileImage: string;
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
  const userId =
    typeof window !== "undefined" ? localStorage.getItem("userId") || "" : "";
  const accessToken =
    typeof window !== "undefined"
      ? localStorage.getItem("accessToken") || ""
      : "";

  const handleProfileUpdate = async () => {
    if (!user || !userId || !accessToken) return;

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
            nickname: user.nickname,
            gender: user.gender,
          }),
        }
      );
      const result = await res.json();
      if (!res.ok || !result.success) throw new Error("프로필 수정 실패");

      alert("프로필이 성공적으로 수정되었습니다.");
      setEditMode(false);
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
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                const file = e.target.files?.[0];
                if (file) {
                  const url = URL.createObjectURL(file);
                  setUser((prev) =>
                    prev ? { ...prev, profileImage: url } : prev
                  );
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
          </>
        )}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import styles from "@/components/profile/EditProfileModal.module.css";

interface EditProfileModalProps {
  student: any;
  onClose: () => void;
  onSave: () => void;
}

export default function EditProfileModal({
  student,
  onClose,
  onSave,
}: EditProfileModalProps) {
  const [nickname, setNickname] = useState(student?.nickname || "");
  const [gender, setGender] = useState(student?.gender || "MALE");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [tags, setTags] = useState<string[]>(student?.tags || []);

  const userId =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setProfileImage(e.target.files[0]);
    }
  };

  const handleTagChange = (index: number, value: string) => {
    const newTags = [...tags];
    newTags[index] = value;
    setTags(newTags);
  };

  const handleAddTag = () => {
    setTags([...tags, ""]);
  };

  const handleRemoveTag = (index: number) => {
    const newTags = tags.filter((_, i) => i !== index);
    setTags(newTags);
  };

  const handleSubmit = async () => {
    if (!userId || !token) return;

    // PATCH 닉네임/성별
    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/students/${userId}/profile`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nickname, gender }),
      }
    );

    // PUT 프로필 이미지
    if (profileImage) {
      const formData = new FormData();
      formData.append("profileImage", profileImage);

      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/students/${userId}/profile/image`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );
    }

    // PUT 태그
    if (student?.categoryId) {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/students/${userId}/categories/${student.categoryId}/tags`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ tags }),
        }
      );
    }

    onSave();
    onClose();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>프로필 수정</h2>
        <input
          type="text"
          placeholder="닉네임"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
        <select value={gender} onChange={(e) => setGender(e.target.value)}>
          <option value="MALE">남성</option>
          <option value="FEMALE">여성</option>
        </select>

        <input type="file" accept="image/*" onChange={handleImageChange} />

        <div className={styles.tagsSection}>
          <label>태그</label>
          {tags.map((tag, index) => (
            <div key={index} className={styles.tagRow}>
              <input
                type="text"
                value={tag}
                onChange={(e) => handleTagChange(index, e.target.value)}
              />
              <button onClick={() => handleRemoveTag(index)}>삭제</button>
            </div>
          ))}
          <button onClick={handleAddTag}>태그 추가</button>
        </div>

        <div className={styles.modalButtons}>
          <button onClick={handleSubmit}>저장</button>
          <button onClick={onClose}>취소</button>
        </div>
      </div>
    </div>
  );
}

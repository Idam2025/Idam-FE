import React, { useState } from "react";
import styles from "@/components/result/profile/profile.module.css";
import { UserProfile } from "@/types/user";

interface Props {
  student: UserProfile;
  onCancel: () => void;
}

export default function EditProfileForm({ student, onCancel }: Props) {
  const [formData, setFormData] = useState({
    nickname: student.nickname,
    phone: student.phone,
    major: student.major,
    tags: student.tags.join(", "),
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/students/${student.id}/profile`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...formData,
            tags: formData.tags.split(",").map((tag) => tag.trim()),
          }),
        }
      );

      const json = await res.json();
      if (!json.success) throw new Error("수정 실패");
      alert("프로필이 수정되었습니다.");
      window.location.reload();
    } catch (err) {
      console.error("수정 실패:", err);
      alert("수정 중 오류가 발생했습니다.");
    }
  };

  return (
    <form className={styles.editForm} onSubmit={handleSubmit}>
      <label>
        닉네임
        <input
          name="nickname"
          value={formData.nickname}
          onChange={handleChange}
        />
      </label>
      <label>
        전화번호
        <input name="phone" value={formData.phone} onChange={handleChange} />
      </label>
      <label>
        전공
        <input name="major" value={formData.major} onChange={handleChange} />
      </label>
      <label>
        관심분야 (콤마로 구분)
        <input name="tags" value={formData.tags} onChange={handleChange} />
      </label>
      <div className={styles.buttonRow}>
        <button type="submit" className={styles.fancyButton}>
          저장
        </button>
        <button
          type="button"
          className={styles.cancelButton}
          onClick={onCancel}
        >
          취소
        </button>
      </div>
    </form>
  );
}

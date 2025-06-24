"use client";

import { useEffect, useState } from "react";
import { UserProfile } from "@/types/user";

interface UseStudentProfileResult {
  student: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => void;

  editMode: boolean;
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>;

  formData: {
    nickname: string;
    phone: string;
    major: string;
    tags: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSave: () => Promise<void>;

  pdfUrl: string | null;
  handlePreview: (url: string) => void;
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;

  fetchTags: (categoryId: number) => Promise<void>;
}

export default function useStudentProfile(): UseStudentProfileResult {
  const [student, setStudent] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    nickname: "",
    phone: "",
    major: "",
    tags: "",
  });

  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const userId =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  const fetchProfile = async () => {
    if (!userId) return;
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    try {
      setIsLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/students/${userId}/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const json = await res.json();
      if (!json.success) throw new Error("프로필 조회 실패");

      const data = json.data;
      setStudent(data);
      setFormData({
        nickname: data.nickname || "",
        phone: data.phone || "",
        major: data.major || "",
        tags: data.tags?.join(", ") || "",
      });
    } catch (err) {
      console.error("프로필 불러오기 실패:", err);
      setError("불러오기 실패");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!userId) return;
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/students/${userId}/profile`,
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
      setEditMode(false);
      fetchProfile();
    } catch (err) {
      console.error("수정 실패:", err);
      alert("수정 중 오류가 발생했습니다.");
    }
  };

  const handlePreview = (url: string) => {
    setPdfUrl(url);
    setShowModal(true);
  };

  const fetchTags = async (categoryId: number) => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/categories/${categoryId}/tags`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const json = await res.json();
      if (!json.success) throw new Error("태그 불러오기 실패");

      const tagNames = json.data.map((tag: { tagName: string }) => tag.tagName);
      setFormData((prev) => ({ ...prev, tags: tagNames.join(", ") }));
    } catch (err) {
      console.error("태그 조회 실패:", err);
      alert("태그 조회 중 오류 발생");
    }
  };

  return {
    student,
    isLoading,
    error,
    refresh: fetchProfile,

    editMode,
    setEditMode,
    formData,
    setFormData,
    handleChange,
    handleSave,

    pdfUrl,
    handlePreview,
    showModal,
    setShowModal,

    fetchTags,
  };
}

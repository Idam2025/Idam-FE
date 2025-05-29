"use client";

import { useState } from "react";

interface Tag {
  id: number;
  tagName: string;
}

interface Props {
  userId: string;
  onClose: () => void;
}

const CATEGORIES = [
  { id: 1, name: "IT·프로그래밍" },
  { id: 2, name: "디자인" },
  { id: 3, name: "마케팅" },
];

export default function TagEditorModal({ userId, onClose }: Props) {
  const [step, setStep] = useState<"category" | "tags">("category");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selected, setSelected] = useState<string[]>([]);

  const handleCategorySelect = async (id: number) => {
    setCategoryId(id);
    const token = localStorage.getItem("accessToken");
    if (!token) return alert("로그인이 필요합니다.");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/categories/${id}/tags`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const json = await res.json();
      if (!json.success) throw new Error();
      setTags(json.data);
      setSelected([]);
      setStep("tags");
    } catch {
      alert("태그 불러오기 실패");
    }
  };

  const toggle = (tag: string) => {
    setSelected((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async () => {
    if (!categoryId) return;
    const token = localStorage.getItem("accessToken");
    if (!token) return alert("로그인이 필요합니다.");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/students/${userId}/categories/${categoryId}/tags`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ tags: selected }),
        }
      );
      const json = await res.json();
      if (!json.success) throw new Error();
      alert("태그 저장 완료");
      onClose();
    } catch {
      alert("저장 실패");
    }
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: "16px" }}>
      {step === "category" && (
        <div>
          <h3>카테고리를 선택하세요</h3>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategorySelect(cat.id)}
              style={{ margin: "8px", padding: "8px 12px" }}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {step === "tags" && (
        <div>
          <h3>태그를 선택하세요</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {tags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => toggle(tag.tagName)}
                style={{
                  padding: "6px 12px",
                  borderRadius: "20px",
                  border: selected.includes(tag.tagName)
                    ? "2px solid #0070f3"
                    : "1px solid #ccc",
                  background: selected.includes(tag.tagName)
                    ? "#e6f0ff"
                    : "#fff",
                  color: selected.includes(tag.tagName) ? "#0070f3" : "#333",
                  cursor: "pointer",
                }}
              >
                {tag.tagName}
              </button>
            ))}
          </div>
          <button
            onClick={handleSubmit}
            style={{ marginTop: "16px", padding: "8px 16px" }}
          >
            완료
          </button>
        </div>
      )}
    </div>
  );
}

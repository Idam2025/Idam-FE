"use client";

import styles from "./TagEditor.module.css";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
  const [search, setSearch] = useState("");

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("accessToken") || ""
      : "";

  const handleCategorySelect = async (id: number) => {
    if (!token) return alert("로그인이 필요합니다.");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/categories/${id}/tags`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const json = await res.json();
      if (!json.success) throw new Error("태그 불러오기 실패");
      setCategoryId(id);
      setTags(json.data);
      setSelected([]);
      setSearch("");
      setStep("tags");
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const toggle = (tag: string) => {
    setSelected((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async () => {
    console.log("선택된 태그:", selected);

    if (!token || !categoryId)
      return alert("카테고리 또는 로그인 정보가 없습니다.");

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
      if (!json.success) throw new Error("태그 저장 실패");

      alert("태그 저장 완료");
      onClose();
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const filteredTags = tags.filter((tag) =>
    tag.tagName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <AnimatePresence mode="wait">
        {step === "category" && (
          <motion.div
            key="category"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            <h3 className={styles.categoryTitle}>카테고리를 선택하세요</h3>
            {CATEGORIES.map((cat) => (
              <motion.button
                key={cat.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCategorySelect(cat.id)}
                className={`${styles.categoryButton} ${
                  categoryId === cat.id ? styles.active : ""
                }`}
              >
                {cat.name}
              </motion.button>
            ))}
          </motion.div>
        )}

        {step === "tags" && (
          <motion.div
            key="tags"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            <h3 className={styles.tagTitle}>태그를 선택하세요</h3>

            <input
              type="text"
              placeholder="태그 검색"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={styles.searchInput}
            />

            {selected.length > 0 && (
              <div className={styles.selectedPreview}>
                <strong>선택된 태그:</strong>
                <div className={styles.selectedTagList}>
                  {selected.map((tag) => (
                    <motion.span
                      key={tag}
                      className={styles.selectedTag}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                    >
                      {tag}
                    </motion.span>
                  ))}
                </div>
              </div>
            )}

            <div className={styles.tagContainer}>
              {filteredTags.map((tag) => (
                <motion.button
                  key={tag.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggle(tag.tagName)}
                  className={`${styles.tagButton} ${
                    selected.includes(tag.tagName) ? styles.selected : ""
                  }`}
                >
                  {tag.tagName}
                </motion.button>
              ))}
            </div>

            <motion.button
              onClick={handleSubmit}
              className={styles.submitButton}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              완료
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

import { FC } from "react";

interface Props {
  categoryId: number;
}

interface Tag {
  id: number;
  tagName: string;
}

const TagButton: FC<Props> = ({ categoryId }) => {
  const handleFetchTags = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

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
      if (!json.success) {
        throw new Error("태그 응답 실패");
      }

      const tags: Tag[] = json.data;
      const tagList = tags.map((tag) => tag.tagName).join(", ");
      alert(`태그 목록: ${tagList}`);
    } catch (err) {
      console.error("태그 조회 오류:", err);
      alert("태그 조회에 실패했습니다.");
    }
  };

  return <button onClick={handleFetchTags}>📌 태그 조회</button>;
};

export default TagButton;

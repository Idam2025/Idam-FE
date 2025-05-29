import { FC } from "react";

interface Props {
  categoryId: number;
}

const TagButton: FC<Props> = ({ categoryId }) => {
  const handleFetchTags = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      const res = await fetch(`/api/categories/${categoryId}/tags`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const json = await res.json();
      if (!json.success) throw new Error();

      alert(json.data.map((tag: any) => tag.tagName).join(", "));
    } catch {
      alert("태그 조회 실패");
    }
  };

  return <button onClick={handleFetchTags}>📌 태그 조회</button>;
};

export default TagButton;

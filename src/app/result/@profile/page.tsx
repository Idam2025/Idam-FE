// app/result/@profile/page.tsx

"use client";
import { useSearchParams } from "next/navigation";
import ProfileClientModal from "@/components/profile/ProfileClientModal";

export default function ProfileModal() {
  const searchParams = useSearchParams();
  const id = searchParams.get("profile"); // ⬅️ 쿼리로 전달받은 값

  if (!id) return null;

  return <ProfileClientModal id={id} />;
}

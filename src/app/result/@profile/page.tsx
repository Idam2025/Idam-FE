"use client";

import { useSearchParams, useRouter } from "next/navigation";
import ProfileClientModal from "@/components/modal/ProfileClientModal";
import { Student } from "@/types/student";

const dummyStudents: Student[] = [
  {
    userId: 1,
    name: "Sophie Moore",
    profileImage: "/profiles/sophie.png",
    score: 87,
  },
  {
    userId: 2,
    name: "John Smith",
    profileImage: "/profiles/john.png",
    score: 93,
  },
  // 다른 더미 데이터도 동일하게 수정
];

export default function ProfileModal() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("profile");

  // userId는 number이므로 id를 숫자로 변환
  const student = dummyStudents.find((s) => s.userId === Number(id));

  if (!student) return null;

  return <ProfileClientModal student={student} onClose={() => router.back()} />;
}

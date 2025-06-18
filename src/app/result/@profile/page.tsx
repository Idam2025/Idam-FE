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
];

export default function ProfileModal() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("profile");

  const student = dummyStudents.find((s) => s.userId === Number(id));

  if (!student) return null;

  return <ProfileClientModal student={student} onClose={() => router.back()} />;
}

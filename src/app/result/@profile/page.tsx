"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ProfileClientModal from "@/components/modal/ProfileClientModal";
import { Student } from "@/types/student";

export default function ProfileModal() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams?.get("profile") ?? "";

  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchStudent = async () => {
      try {
        const res = await fetch(`/api/students/${id}/profile`);
        if (!res.ok) throw new Error("Failed to fetch student");
        const data = await res.json();
        setStudent(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id]);

  if (!id || loading) return null;
  if (!student) return null;

  return <ProfileClientModal student={student} onClose={() => router.back()} />;
}

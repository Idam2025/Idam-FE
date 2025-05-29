import { useEffect, useState } from "react";
import { UserProfile } from "@/types/user";

export function useUserProfile(userId: string | null) {
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchProfile = async () => {
      try {
        const res = await fetch(`/api/students/${userId}/profile`, {
          method: "GET",
          credentials: "include",
        });
        const json = await res.json();
        if (!json.success) throw new Error("프로필 조회 실패");

        setUser(json.data); // portfolios도 포함돼 있다고 가정
      } catch (err) {
        console.error("프로필 조회 오류:", err);
      }
    };

    fetchProfile();
  }, [userId]);

  return { user, setUser };
}

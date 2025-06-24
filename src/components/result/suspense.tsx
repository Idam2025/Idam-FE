// SuspensePage.tsx
"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import style from "./suspense.module.css";
import { useRouter } from "next/navigation";

interface Student {
  userId: number;
  nickname: string;
  profileImage: string;
}

export default function SuspensePage() {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;
        const res = await fetch(`${baseUrl}/api/students/preview`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) return console.error("API 오류:", res.status);
        const { data } = await res.json();
        setStudents(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const moveHome = () => router.push("/");

  if (loading) return <div className={style.container}>Loading…</div>;

  // 6명씩 잘라서
  const group1 = students.slice(0, 6);
  const group2 = students.slice(6, 12);
  // 각각 두 번 이어붙이기
  const loop1 = [...group1, ...group1];
  const loop2 = [...group2, ...group2];

  return (
    <div className={style.container}>
      <div className={style.textContainer}>
        <div className={style.font1}>
          <Image src="/usual/AI.svg" alt="AI" width={70} height={70} />
          I:DAM AI Working...
        </div>
        <div className={style.button}>
          <div className={style.group} onClick={moveHome}>
            Cancel
            <Image src="/usual/arrow.svg" alt="arrow" width={20} height={20} />
          </div>
        </div>
      </div>

      <div className={style.right}>
        <div className={style.imgLine1}>
          {loop1.map((stu, i) => (
            <div key={`${stu.userId}-${i}`} className={style.imgContainer}>
              <div className={style.imgSample}>
                <Image
                  src={stu.profileImage}
                  alt={stu.nickname}
                  width={328}
                  height={416}
                />
              </div>
              <div className={style.nickname}>{stu.nickname}</div>
            </div>
          ))}
        </div>

        <div className={style.imgLine2}>
          {loop2.map((stu, i) => (
            <div key={`${stu.userId}-${i}`} className={style.imgContainer}>
              <div className={style.imgSample}>
                <Image
                  src={stu.profileImage}
                  alt={stu.nickname}
                  width={328}
                  height={416}
                />
              </div>
              <div className={style.nickname}>{stu.nickname}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import styles from "./profile.module.css";

const dummyStudents = [
  {
    id: "1",
    name: "Sophie Moore",
    role: "VISUAL DESIGNER",
    image: "/profiles/sophie.png",
  },
  {
    id: "2",
    name: "John Smith",
    role: "UX ENGINEER",
    image: "/profiles/john.png",
  },
  {
    id: "3",
    name: "John Smith",
    role: "UX ENGINEER",
    image: "/profiles/john.png",
  },
  {
    id: "4",
    name: "John Smith",
    role: "UX ENGINEER",
    image: "/profiles/john.png",
  },
  {
    id: "5",
    name: "John Smith",
    role: "UX ENGINEER",
    image: "/profiles/john.png",
  },
];

export default function ProfileClientModal({ id }: { id: string }) {
  const router = useRouter();
  const student = dummyStudents.find((s) => s.id === id);

  if (!student) return <div>존재하지 않는 프로필입니다.</div>;

  const handleClose = () => router.back();

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.title}>Here's designer for your company</div>
        <div className={styles.subtitle}>
          Lorem ipsum dolor sit amet consectetur adipiscing elit volutpat
          gravida malesuada quam commodo id integer nam.
        </div>

        <div className={styles.cardRow}>
          <div className={styles.card} />
          <div className={`${styles.card} ${styles.active}`}>
            <img
              src={student.image}
              alt={student.name}
              className={styles.profileImg}
            />
            <div className={styles.name}>{student.name}</div>
            <div className={styles.role}>{student.role}</div>
          </div>
          <div className={styles.card} />
        </div>

        <button className={styles.closeButton}>See More →</button>
      </div>
    </div>
  );
}

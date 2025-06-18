"use client";

import { useRouter } from "next/navigation";
import styles from "./profile.module.css";

interface Student {
  userId: number;
  name: string;
  profileImage: string;
  score: number;
  rank: number;
}

interface ProfileClientModalProps {
  student: Student;
  onClose: () => void;
}

export default function ProfileClientModal({
  student,
  onClose,
}: ProfileClientModalProps) {
  const router = useRouter();

  const moveProfile = () => {
    router.push(`/result/profile/${student.userId}`);
  };

  let title = "Top 5 Recommended by IDam";
  let subtitle = "We hope this will be of great help to your company.";

  if (student.rank === 1) {
    title = "IDam’s No.1 Recommended Talent";
  } else if (student.rank === 2) {
    title = "IDam’s No.2 Recommended Talent";
  } else if (student.rank === 3) {
    title = "IDam’s No.3 Recommended Talent";
  } else if (student.rank === 4) {
    title = "IDam’s No.4 Recommended Talent";
  } else if (student.rank === 5) {
    title = "IDam’s No.5 Recommended Talent";
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.title}>{title}</div>
        <div className={styles.subtitle}>{subtitle}</div>

        <div className={styles.cardRow}>
          <div className={`${styles.card} ${styles.active}`}>
            <img
              src={student.profileImage || "/profile/default.png"}
              alt={student.name}
              className={styles.profileImg}
            />

            <div className={styles.name}>{student.name}</div>
            <div className={styles.role}>
              Score: {student.score} | Rank: {student.rank}
            </div>
          </div>
        </div>

        <button className={styles.moveProfile} onClick={moveProfile}>
          See More →
        </button>
      </div>
    </div>
  );
}

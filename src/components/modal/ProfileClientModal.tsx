"use client";

import { useRouter } from "next/navigation";
import styles from "./profile.module.css";

interface Student {
  userId: number;
  name: string;
  profileImage: string;
  score: number;
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

  return (
    <div className={styles.overlay} onClick={onClose}>
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
              src={student.profileImage}
              alt={student.name}
              className={styles.profileImg}
            />
            <div className={styles.name}>{student.name}</div>
            <div className={styles.role}>Score: {student.score}</div>
          </div>
          <div className={styles.card} />
        </div>

        <button className={styles.moveProfile} onClick={moveProfile}>
          See More →
        </button>
      </div>
    </div>
  );
}

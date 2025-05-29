"use client";

import styles from "./UserProfile.module.css";

export default function PdfModal({
  url,
  onClose,
}: {
  url: string;
  onClose: () => void;
}) {
  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>
          ❌ 닫기
        </button>
        <iframe src={url} width="100%" height="100%" />
      </div>
    </div>
  );
}

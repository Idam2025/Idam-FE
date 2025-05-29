"use client";

import styles from "./UserProfile.module.css";

interface PdfModalProps {
  url: string;
  onClose: () => void;
}

export default function PdfModal({ url, onClose }: PdfModalProps) {
  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>
          ❌ 닫기
        </button>
        <iframe
          src={url}
          title="PDF 미리보기"
          width="100%"
          height="100%"
          className={styles.modalIframe}
        />
      </div>
    </div>
  );
}

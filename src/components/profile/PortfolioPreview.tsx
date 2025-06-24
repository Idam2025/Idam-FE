"use client";

import styles from "./profile.module.css";
import { useState } from "react";

interface PortfolioPreviewProps {
  url: string;
  title: string;
  onClick?: () => void;
}

export default function PortfolioPreview({
  url,
  title,
  onClick,
}: PortfolioPreviewProps) {
  const [imageError, setImageError] = useState(false);

  const isPdf = url.endsWith(".pdf");

  return (
    <div className={styles.portfolioPreviewWrapper} onClick={onClick}>
      {isPdf ? (
        <iframe
          src={`${url}#toolbar=0&view=FitH&page=1`}
          className={styles.portfolioPreview}
          title={title}
        />
      ) : (
        <img
          src={imageError ? "/profile/default.png" : url}
          alt={title}
          onError={() => setImageError(true)}
          className={styles.portfolioPreview}
        />
      )}
    </div>
  );
}

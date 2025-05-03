"use client";

import styles from "@/components/result/profile/profile.module.css";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const pathname = usePathname(); // 👈 현재 경로 가져오기
  const id = pathname.split("/").pop(); // 👈 마지막 segment가 id

  const moveChat = () => {
    if (id) {
      router.push(`/result/profile/${id}/chat`);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.profile_container}>
        <div className={styles.profile_content}>
          <Image
            src="/profileBox.png"
            alt="Rectangle"
            width={1200}
            height={95}
          />
          <div className={styles.profile_content_Title}>
            <div className={styles.profile_image}></div>
            <div className={styles.profile_font_container}>
              <div className={styles.profile_font}>이다미들</div>
              <div className={styles.profile_font2}>alexarawles@gmail.com</div>
              <button onClick={moveChat} className={styles.fancyButton}>
                Chat
              </button>
            </div>
          </div>
          <div className={styles.detail_info_container}></div>
        </div>
      </div>
    </div>
  );
}

"use client";

import styles from "@/components/result/profile/profile.module.css";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const pathname = usePathname();
  const id = pathname.split("/").pop(); // 현재 사용자 ID

  const moveChat = async () => {
    if (!id) return;

    try {
      const res = await fetch(`/api/chat/room?targetUserId=${id}`, {
        method: "POST", // 서버가 POST를 요구할 수도 있음
      });

      if (!res.ok) {
        throw new Error("채팅방 생성 실패");
      }

      const data = await res.json();
      const roomId = data.roomId;

      if (roomId) {
        router.push(`/chat/${roomId}`);
      }
    } catch (error) {
      console.error("채팅방 이동 오류:", error);
      alert("채팅방 생성에 실패했습니다.");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.profile_container}>
        <div className={styles.profile_content}>
          <Image
            src="/usual/profileBox.png"
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

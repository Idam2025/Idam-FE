import Image from "next/image";
import styles from "./chat.module.css";

export default function ChatBackground() {
  return (
    <div className={styles.background}>
      <Image
        src="/usual/resized_image.png"
        alt="background"
        fill
        priority
        style={{ objectFit: "cover", opacity: 0.9 }}
      />
    </div>
  );
}

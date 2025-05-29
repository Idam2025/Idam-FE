// components/result/ProfileCircle.tsx
import Image from "next/image";
import style from "./section.module.css";

type Props = {
  imageUrl: string;
  name: string;
  size?: number; // 원 크기 (기본값: 80)
};

export default function ProfileCircle({ imageUrl, name, size = 80 }: Props) {
  return (
    <div className={style.profileCircle} style={{ width: size, height: size }}>
      <Image
        src={imageUrl}
        alt={name}
        width={size}
        height={size}
        className={style.profileImage}
      />
      <div className={style.profileName}>{name}</div>
    </div>
  );
}

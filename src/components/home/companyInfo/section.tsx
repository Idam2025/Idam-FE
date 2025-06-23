import Image from "next/image";
import style from "./companyInfo.module.css";

type CompanyInfoProps = {
  title: string;
  description: string;
  imageSrc: string;
  website: string;
};

export default function CompanyInfo({
  title,
  description,
  imageSrc,
}: CompanyInfoProps) {
  return (
    <div className={style.section}>
      <div className={style.left}>
        <div className={style.font1}>{title}</div>
        <div className={style.font2}>{description}</div>
      </div>

      <div className={style.right}>
        <div className={style.imgStyle}>
          <Image
            src={imageSrc}
            alt="company"
            width={500}
            height={281}
            unoptimized
          />
        </div>
      </div>
    </div>
  );
}

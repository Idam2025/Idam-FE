import Image from "next/image";
import style from "./findContainer.module.css";

const sections = [
  {
    title: "Graphic Design",
    description:
      "Welcome to Burger Bliss, where we take your cravings to a whole new level! Our mouthwatering burgers are made from 100% beef and are served on freshly baked buns.",
    images: ["/usual/example.svg", "/usual/example.svg", "/usual/example.svg"],
  },
  {
    title: "3D/Modeling",
    description:
      "Welcome to Burger Bliss, where we take your cravings to a whole new level! Our mouthwatering burgers are made from 100% beef and are served on freshly baked buns.",
    images: ["/usual/example.svg", "/usual/example.svg", "/usual/example.svg"],
  },
  {
    title: "3D/Modeling",
    description:
      "Welcome to Burger Bliss, where we take your cravings to a whole new level! Our mouthwatering burgers are made from 100% beef and are served on freshly baked buns.",
    images: ["/usual/example.svg", "/usual/example.svg", "/usual/example.svg"],
  },
];

export default function FindContainer() {
  return (
    <div className={style.findContainerWrapper}>
      <div className={style.header}>
        <div className={style.headerText}>원하는 인재 찾기</div>
      </div>

      {sections.map((section, idx) => (
        <Section
          key={idx}
          title={section.title}
          description={section.description}
          images={section.images}
        />
      ))}
    </div>
  );
}

type SectionProps = {
  title: string;
  description: string;
  images: string[];
};

function Section({ title, description, images }: SectionProps) {
  return (
    <div className={style.section}>
      <div className={style.left}>
        <div className={style.sectionTitle}>{title}</div>
        <div className={style.sectionDesc}>{description}</div>
      </div>
      <div className={style.right}>
        {images.map((src, idx) => (
          <Image
            key={idx}
            src={src}
            alt={`example-${idx}`}
            width={312}
            height={312}
          />
        ))}
      </div>
    </div>
  );
}

"use client";

import Image from "next/image";
import style from "./section.module.css";
import Circle1 from "@/asset/circle/circle1.svg";
import Circle2 from "@/asset/circle/circle2.svg";
import Circle3 from "@/asset/circle/circle3.svg";
import Circle4 from "@/asset/circle/circle4.svg";
import Circle5 from "@/asset/circle/circle5.svg";

export default function ResultSection({ data }: { data: any }) {
  const tags: string[] = data.tag ?? [];

  const left = () => (
    <div className={style.textContainer}>
      <div className={style.font1}>Meet our team members</div>
      <div className={style.font2}>
        Lorem ipsum dolor sit amet consectetur adipiscing elit volutpat gravida
        malesuada quam commodo id integer nam.
      </div>
      <div className={style.group}>
        <div className={style.font3}>See more</div>
        <Image src="/usual/arrow2.svg" alt="arrow2" width={20} height={20} />
      </div>
    </div>
  );

  const center = () => (
    <div className={style.center}>
      <div className={style.circleContainer}>
        <Circle4 />
        <Circle1 />
      </div>
      <div className={style.button}>
        <div className={style.font}>
          Done
          <Image
            src="/usual/arrow2.svg"
            alt="arrow2"
            width={13.5}
            height={12.7}
          />
        </div>
      </div>
      <div className={style.circleContainer}>
        <Circle2 />
        <Circle5 />
        <Circle3 />
      </div>
    </div>
  );

  const imgSample = (text: string) => (
    <div className={style.imgBlock} key={text}>
      <div className={style.imgSample}>
        <Image src="/usual/example2.svg" alt="ex" width={92} height={81} />
      </div>
      <div className={style.font}>{text}</div>
    </div>
  );

  return (
    <div className={style.container}>
      {left()}
      {center()}
      <div className={style.right}>
        <div className={style.imgContainer}>
          {tags.slice(0, 2).map(imgSample)}
        </div>
        <div className={style.imgContainer2}>
          {tags.slice(2, 4).map(imgSample)}
        </div>
      </div>
    </div>
  );
}

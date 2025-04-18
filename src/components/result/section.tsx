import Image from "next/image";
import style from "./section.module.css";
import Circle1 from "@/asset/circle/circle1.svg";
import Circle2 from "@/asset/circle/circle2.svg";
import Circle3 from "@/asset/circle/circle3.svg";
import Circle4 from "@/asset/circle/circle4.svg";
import Circle5 from "@/asset/circle/circle5.svg";

export default function ResultSection() {
  const left = () => {
    return (
      <div className={style.textContainer}>
        <div className={style.font1}>Meet our team members</div>
        <div className={style.font2}>
          Lorem ipsum dolor sit amet consectetur adipiscing elit volutpat
          gravida malesuada quam commodo id integer nam.
        </div>
        <div className={style.group}>
          <div className={style.font3}>See more</div>
          <Image src="/arrow2.svg" alt="arrow2" width={20} height={20} />
        </div>
      </div>
    );
  };

  const center = () => {
    return (
      <div className={style.center}>
        <div className={style.circleContainer}>
          <Circle4 className={style.circleSvg4} />
          <Circle1 className={style.circleSvg} />
        </div>
        <div className={style.button}>
          <div className={style.font}>
            Done
            <Image src="/arrow2.svg" alt="arrow2" width={13.5} height={12.7} />
          </div>
        </div>
        <div className={style.circleContainer}>
          <Circle2 className={style.circleSvg2} />
          <Circle5 className={style.circleSvg5} />
          <Circle3 className={style.circleSvg3} />
        </div>
      </div>
    );
  };

  const imgSample = (text: string, hide: boolean) => {
    if (hide) return null;

    return (
      <div className={style.imgContainer}>
        <div className={style.imgSample}>
          <Image src="/example2.svg" alt="ex" width={92} height={81} />
        </div>
        <div className={style.font}>{text}</div>
      </div>
    );
  };

  const imgSample2 = (text: string, hide: boolean) => {
    if (hide) return null;

    return (
      <div className={style.imgContainer2}>
        <div className={style.imgSample}>
          <Image src="/example2.svg" alt="ex" width={92} height={81} />
        </div>
        <div className={style.font}>{text}</div>
      </div>
    );
  };

  return (
    <>
      <div className={style.container}>
        {left()}
        {center()}
        <div className={style.right}>
          {imgSample("성민", false)}
          {imgSample2("재영", false)}
        </div>
      </div>
    </>
  );
}

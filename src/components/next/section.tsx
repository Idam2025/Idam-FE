import Image from "next/image";
import style from "./section.module.css";
import Img from "./imgcontainer";

export default function NextSection() {
  return (
    <div className={style.container}>
      <div className={style.content}>
        <div className={style.heading}>
          <Image src="/usual/AI2.svg" alt="AI" width={37} height={37} />
          Choose Work Type / Design Tool
        </div>
        <div className={style.description}>
          Lorem ipsum dolor sit amet consectetur adipiscing elit volutpat
          gravida malesuada quam commodo id integer nam.
        </div>
        <div className={style.grid}>
          <Img />
        </div>
      </div>
    </div>
  );
}

import style from "./test.module.css";
import Image from "next/image";

export default function Page() {
  const ImageCreate = (src: string, content: string) => {
    return (
      <>
        <div className={style.container}>
          <div>
            <Image src={src} alt="AI" width={51} height={51} />
          </div>
          <div>{content}</div>
        </div>
      </>
    );
  };

  return <div>{ImageCreate("/usual/logo.svg", "hihi")}</div>;
}

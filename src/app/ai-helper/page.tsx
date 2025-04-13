import Section from "@/components/ai-helper/section";
import style from "./ai-helper.module.css";

export default function Page() {
  return (
    <>
      <div className={style.container}>
        <Section />
      </div>
      <div className={style.footer}></div>
    </>
  );
}

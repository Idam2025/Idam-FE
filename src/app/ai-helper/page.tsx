import Section from "@/components/ai-helper/section";
import style from "./ai-helper.module.css";
import NavigationBar from "@/components/navigationbar/Home/mainNavigationBar";

export default function Page() {
  return (
    <>
      <div className={style.container}>
        <NavigationBar />
        <Section />
      </div>
    </>
  );
}

import style from "./home.module.css";
import FindContainer from "@/components/findContainer/findcontainer";
import LogoAndAiContainer from "@/components/logoAndAiContainer/logoAndAiContainer";

export default function Page() {
  return (
    <div className={style.container}>
      <LogoAndAiContainer />
      <FindContainer />
    </div>
  );
}

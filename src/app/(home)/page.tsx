import CompanyInfo from "@/components/home/companyInfo/companyInfo";
import style from "./home.module.css";
import FindContainer from "@/components/home/findContainer/findcontainer";
import LogoAndAiContainer from "@/components/home/logoAndAiContainer/logoAndAiContainer";

export default function Page() {
  return (
    <div className={style.container}>
      <LogoAndAiContainer />
      <FindContainer />
      <CompanyInfo />
    </div>
  );
}

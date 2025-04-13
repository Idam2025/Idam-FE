import style from "./companyInfo.module.css";
import Section from "./section";

export default function CompanyInfo() {
  return (
    <div className={style.container}>
      <div className={style.text}>COMPANY INFORMATION</div>
      <Section />
      <Section />
      <Section />
    </div>
  );
}

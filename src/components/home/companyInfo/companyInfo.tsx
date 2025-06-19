import style from "./companyInfo.module.css";
import Section from "./section";

export default function CompanyInfo() {
  return (
    <div className={style.container}>
      <div className={style.text}>COMPANY INFORMATION</div>

      <Section
        title="ClearTechnologies"
        description="ClearTechnologies는 2017년 설립 이후, 정밀 교정 및 보철 솔루션을 전 세계 5개국 이상에 제공하며 치과 산업을 선도하고 있습니다."
        imageSrc="/Home/company/Clear.png"
      />

      <Section
        title="Creative Talk"
        description="크리에이티브톡은 다년간의 실무 경험을 바탕으로 각 분야의 노하우를 가진 전문가들로 구성되어 있습니다  
우리는 클라이언트의 의도와 목적을 이해하고 브랜드 커뮤니케이션 목표를 성공적으로 이끌기 위한 전략적인 솔루션을 제공합니다  
폭넓은 마케팅 영역과 디자인 분야를 아우르며 국내 주요기업들과 파트너십을 맺고 다양한 프로젝트를 수행하고 있습니다"
        imageSrc="/Home/company/creative.png"
      />

      <Section
        title="BMC"
        description="신뢰로 시작해, 결과로 완성하다  
혁신적인 온라인 마케팅, B.M.C 와 함께하세요."
        imageSrc="/Home/company/BMC.png"
      />
    </div>
  );
}

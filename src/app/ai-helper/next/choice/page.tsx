import ChoiceSection from "@/components/choice/section";
import style from "./choice.module.css";
export default function Page() {
  return (
    <>
      <div className={style.container}>
        <ChoiceSection />
      </div>
    </>
  );
}

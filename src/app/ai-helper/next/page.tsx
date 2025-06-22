import NextSection from "@/components/next/section";
import styles from "./next.module.css";
import NavigationBar from "@/components/navigationbar/Home/mainNavigationBar";

export default function Page() {
  return (
    <>
      <div className={styles.container}>
        <NavigationBar />
        <NextSection />
      </div>
    </>
  );
}

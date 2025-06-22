"use client";

import CompanyInfo from "@/components/home/companyInfo/companyInfo";
import FindContainer from "@/components/home/findContainer/findcontainer";
import LogoAndAiContainer from "@/components/home/logoAndAiContainer/logoAndAiContainer";
import style from "./home.module.css";
import { motion } from "framer-motion";
import ExpireTokenButton from "@/components/Dev/ExpireTokenButton";

const itemVariants = (delay: number) => ({
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay,
    },
  },
});

export default function Page() {
  return (
    <div className={style.container}>
      <div className={style.background} />

      <motion.div
        className={style.content}
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.2,
            },
          },
        }}
      >
        <motion.div variants={itemVariants(0.2)}>
          <LogoAndAiContainer />
        </motion.div>
        <motion.div variants={itemVariants(0.4)}>
          <FindContainer />
        </motion.div>
        <motion.div variants={itemVariants(0.6)}>
          <CompanyInfo />
        </motion.div>
      </motion.div>
    </div>
  );
}

"use client";

import CompanyInfo from "@/components/home/companyInfo/companyInfo";
import FindContainer from "@/components/home/findContainer/findcontainer";
import LogoAndAiContainer from "@/components/home/logoAndAiContainer/logoAndAiContainer";
import style from "./home.module.css";
import { motion } from "framer-motion";

const backgroundVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
    },
  },
};

const itemVariants = (delay: number) => ({
  hidden: { opacity: 0, y: 30 },
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
    <motion.div
      className={style.container}
      variants={backgroundVariants}
      initial="hidden"
      animate="visible"
    >
      {/* 요소들은 배경 위에 순차적으로 등장 */}
      <motion.div variants={itemVariants(0.4)}>
        <LogoAndAiContainer />
      </motion.div>
      <motion.div variants={itemVariants(0.6)}>
        <FindContainer />
      </motion.div>
      <motion.div variants={itemVariants(0.8)}>
        <CompanyInfo />
      </motion.div>
    </motion.div>
  );
}

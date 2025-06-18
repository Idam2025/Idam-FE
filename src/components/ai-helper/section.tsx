"use client";

import Link from "next/link";
import style from "./section.module.css";
import Image from "next/image";
import { motion } from "framer-motion";

const quotes = [
  `\"Cats don't speak our language, yet somehow they understand when we’re sad, tired or\"`,
  `\"just need a quiet friend. Maybe that’s the magic of them—they heal in silence.\"`,
];

export default function Section() {
  return (
    <motion.div
      className={style.section}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className={style.left}
        initial={{ x: -30, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <div className={style.titleBlock}>
          <h2 className={style.title}>
            I:DAM
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
            >
              <Image src="/usual/AI.svg" alt="AI" width={48} height={48} />
            </motion.span>
          </h2>
          <h2 className={style.title}>AI Assistant</h2>
        </div>

        <div className={style.quoteBlock}>
          {quotes.map((line, idx) => (
            <motion.p
              key={idx}
              className={style.quote}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + idx * 0.2 }}
            >
              {line}
            </motion.p>
          ))}
        </div>

        <motion.div
          className={style.buttonGroup}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <Link href="/ai-helper/next" className={style.primaryBtn}>
            Get started
          </Link>
          <Link href="/" className={style.secondaryBtn}>
            HOME
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

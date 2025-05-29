"use client";

import { useState } from "react";
import ProfileClientModal from "@/components/modal/ProfileClientModal";
import Image from "next/image";
import style from "./section.module.css";
import ProfileCircle from "@/components/result/ProfileCircle";

import Circle1 from "@/asset/circle/circle1.svg";
import Circle2 from "@/asset/circle/circle2.svg";
import Circle3 from "@/asset/circle/circle3.svg";
import Circle4 from "@/asset/circle/circle4.svg";
import Circle5 from "@/asset/circle/circle5.svg";

export default function ResultSection({ data }: { data: any[] }) {
  const students = data ?? [];
  const fallback = "/profile/default.png";
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);

  const left = () => (
    <div className={style.textContainer}>
      <div className={style.font1}>Meet our team members</div>
      <div className={style.font2}>
        Lorem ipsum dolor sit amet consectetur adipiscing elit volutpat gravida
        malesuada quam commodo id integer nam.
      </div>
      <div className={style.group}>
        <div className={style.font3}>See more</div>
        <Image src="/usual/arrow2.svg" alt="arrow2" width={20} height={20} />
      </div>
    </div>
  );

  const center = () => (
    <div className={style.center}>
      <div className={style.circleContainer}>
        {students.slice(0, 2).map((student, index) => (
          <div
            key={student.userId}
            onClick={() => setSelectedStudent(student)}
            className={style[`circleSvg${index + 1}`]} // circleSvg1, circleSvg2
          >
            <ProfileCircle
              imageUrl={student.profileImage?.trim() || fallback}
              name={`${student.name} (${student.score})`}
            />
          </div>
        ))}
      </div>

      <div className={style.button}>
        <div className={style.font}>
          Done
          <Image
            src="/usual/arrow2.svg"
            alt="arrow2"
            width={13.5}
            height={12.7}
          />
        </div>
      </div>

      <div className={style.circleContainer}>
        {students.slice(2, 5).map((student, index) => (
          <div
            key={student.userId}
            onClick={() => setSelectedStudent(student)}
            className={style[`circleSvg${index + 3}`]} // circleSvg3, 4, 5
          >
            <ProfileCircle
              imageUrl={student.profileImage?.trim() || fallback}
              name={`${student.name} (${student.score})`}
            />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <div className={style.container}>
        {left()}
        {center()}
        <div className={style.right}>
          {/* 태그 관련 요소 생략됨, 필요 시 복원 가능 */}
        </div>
      </div>

      {selectedStudent && (
        <ProfileClientModal
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
        />
      )}
    </>
  );
}

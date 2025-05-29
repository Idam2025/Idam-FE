// src/types/student.ts
export type Student = {
  userId: number;
  name: string;
  profileImage: string;
  score: number;
};

export type ProfileClientModalProps = {
  student: Student;
  onClose: () => void;
};

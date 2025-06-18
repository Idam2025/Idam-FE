export interface Student {
  userId: number;
  name: string;
  profileImage: string;
  score: number;
  rank: number;
}

export type ProfileClientModalProps = {
  student: Student;
  onClose: () => void;
};

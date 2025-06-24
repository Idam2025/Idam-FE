export interface Portfolio {
  title: string; // ✅ 추가
  url: string;
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  nickname: string;
  schoolName: string;
  major: string;
  schoolId: string; // ✅ 이 줄 추가
  phone: string;
  gender: "MALE" | "FEMALE";
  profileImage: string;
  tags: string[];
  portfolios: { title: string; url: string }[];
}

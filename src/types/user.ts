export interface Portfolio {
  id: number;
  url: string;
}

export interface UserProfile {
  name: string;
  major: string;
  nickname: string;
  email: string;
  phone: string;
  gender: string;
  categoryId: number;
  profileImage: string | null;
  portfolios: Portfolio[];
}

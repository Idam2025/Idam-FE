export interface Portfolio {
  portfolio_id: number;
  portfolio: string;
}

export interface UserProfile {
  name: string;
  major: string;
  nickname: string;
  profile_image?: string; // optional
  profileImage: string;
  email: string;
  phone: string;
  portfolios: any[];
  categoryId: number;
  gender: string;
  tags?: string[];
}

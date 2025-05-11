export interface Portfolio {
  portfolio_id: number;
  portfolio: string;
}

export interface UserProfile {
  email: string;
  nickname: string;
  name: string;
  phone: string;
  major: string;
  profile_image: string;
  portfolios: Portfolio[];
}

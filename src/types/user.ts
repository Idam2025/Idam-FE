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
  profile_image: string; // 서버에서 오는 원본 필드
  profileImage: string; // 클라이언트에서 가공하여 사용 (선택적으로 사용)
  portfolios: Portfolio[];
  gender?: string; // PATCH 시 사용
  categoryId: number; // 태그 조회용 필수
}

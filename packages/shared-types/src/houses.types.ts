export interface CreateHouseDto {
  name: string;
  description?: string;
  address?: string;
}

export interface JoinHouseDto {
  inviteCode: string;
}

export interface HouseResponse {
  id: string;
  name: string;
  inviteCode: string;
  description: string | null;
  address: string | null;
  createdAt: Date;
}

export interface HouseMemberResponse {
  userId: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  role: string;
  joinedAt: Date;
  active: boolean;
}

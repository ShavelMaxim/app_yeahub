export interface Role {
  id: number;
  name: string;
  permissions?: Array<{ id: number; name: string }>;
}

export interface ProfileSkill {
  id: number;
  title: string;
  description?: string;
}

export interface Profile {
  id: string;
  userId?: string;
  profileType: number;
  specializationId: number;
  description?: string;
  image_src?: string;
  isActive?: boolean;
  markingWeight: number;
  ratingPoints?: number;
  profileSkills: ProfileSkill[];
}

export interface User {
  id: string;
  username: string;
  email: string;
  phone?: string;
  country?: string;
  city?: string;
  birthday?: string;
  address?: string;
  avatarUrl?: string;
  isVerified?: boolean;
  userRoles?: Role[];
  profiles?: Profile[];
}

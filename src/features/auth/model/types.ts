import type { User } from '@/entities/user';

export interface AuthResponse {
  access_token: string;
  user?: User;
}

export interface RefreshResponse {
  access_token?: string;
  accessToken?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest extends LoginRequest {
  email: string;
}

import { User } from './index';

export interface LoginDto {
  email: string;
  password: string;
  rememberMe: boolean;
  twoFactorCode?: string;
}

export interface LoginResponseDto {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  user: User;
  requiresTwoFactor: boolean;
}

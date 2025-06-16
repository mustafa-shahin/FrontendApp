import { UserDto } from './index';

export interface UserSession {
  userId: number;
  user: UserDto;
  refreshToken: string;
  ipAddress: string;
  userAgent: string;
  expiresAt: string;
  isRevoked: boolean;
}

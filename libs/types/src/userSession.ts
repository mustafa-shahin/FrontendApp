import { BaseEntity } from './baseEntity';
import { User } from './user';

export interface UserSession extends BaseEntity {
  userId: number;
  user: User;
  refreshToken: string;
  ipAddress: string;
  userAgent: string;
  expiresAt: string;
  isRevoked: boolean;
}

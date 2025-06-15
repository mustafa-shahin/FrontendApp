import { PasswordResetToken } from './auth';
import {
  ContactDetailsDto,
  CreateContactDetailsDto,
  UpdateContactDetailsDto,
} from './contactDetail';
import {
  UserRole,
  Address,
  ContactDetails,
  AddressDto,
  CreateAddressDto,
  UpdateAddressDto,
  BaseEntity,
} from './index';
import { UserSession } from './userSession';
export interface User extends BaseEntity {
  email: string;
  username: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  isLocked: boolean;
  lastLoginAt: string | null;
  failedLoginAttempts: number;
  lockoutEnd: string | null;
  twoFactorEnabled: boolean;
  twoFactorSecret: string | null;
  recoveryCodes: string[];
  avatarFileId: number | null;
  emailVerifiedAt: string | null;
  emailVerificationToken: string | null;
  passwordChangedAt: string | null;
  dateOfBirth: string | null;
  gender: string | null;
  preferences: { [key: string]: unknown };
  sessions: UserSession[];
  passwordResetTokens: PasswordResetToken[];
  addresses: Address[];
  contactDetails: ContactDetails[];
  userPermissions: UserSession[];
  externalLogins: UserExternalLogin[];
  externalId: string | null;
  isExternalUser: boolean;
  lastExternalSync: string | null;

  // isAdmin: boolean;
  // isCustomer: boolean;
  // fullName: string;
  // roleDisplayName: string;
  // avatarUrl: string | null;
}
export interface UserDto {
  id: number;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  isLocked: boolean;
  lastLoginAt: string | null;
  avatarFileId: number | null;
  avatarUrl: string | null;
  timezone: string | null;
  language: string | null;
  emailVerifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
  role: UserRole;
  roleName: string;
  preferences: { [key: string]: unknown };
  addresses: AddressDto[];
  contactDetails: ContactDetailsDto[];
}

export interface CreateUserDto {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  avatarFileId: number | null;
  timezone: string | null;
  language: string | null;
  role: UserRole;
  preferences: { [key: string]: unknown };
  addresses: CreateAddressDto[];
  contactDetails: CreateContactDetailsDto[];
  avatar: File | null;
}

export interface UpdateUserDto {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  avatarFileId: number | null;
  timezone: string | null;
  language: string | null;
  role: UserRole;
  preferences: { [key: string]: unknown };
  addresses: UpdateAddressDto[];
  contactDetails: UpdateContactDetailsDto[];
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface RefreshTokenDto {
  refreshToken: string;
}

export interface UserListDto {
  id: number;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  isLocked: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  avatarUrl: string | null;
  role: UserRole;
  roleName: string;
  addresses: AddressDto[];
  contactDetails: ContactDetailsDto[];
  language: string | null;
  timezone: string | null;
}
export interface UserExternalLogin extends BaseEntity {
  userId: number;
  user: User;
  provider: string;
  externalUserId: string;
  email: string | null;
  name: string | null;
  claims: { [key: string]: unknown };
  accessToken: string | null;
  refreshToken: string | null;
  tokenExpiry: string | null;
}

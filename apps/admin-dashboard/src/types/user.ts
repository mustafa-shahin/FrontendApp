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
  recoveryCodes: string[]; // List<string> in C#
  avatarFileId: number | null;
  // Assuming FileEntity would also have a TS interface, but here we just reference the ID
  // avatarFile: FileEntity | null; // This would be a nested object if FileEntity was fully exposed
  timezone: string | null;
  language: string | null;
  emailVerifiedAt: string | null;
  emailVerificationToken: string | null;
  passwordChangedAt: string | null;
  dateOfBirth: string | null; // DateTime in C#
  gender: string | null;
  preferences: { [key: string]: any };
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
  preferences: { [key: string]: any };
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
  preferences: { [key: string]: any };
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
  preferences: { [key: string]: any };
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
}
export interface UserExternalLogin extends BaseEntity {
  userId: number;
  user: User;
  provider: string;
  externalUserId: string;
  email: string | null;
  name: string | null;
  claims: { [key: string]: any };
  accessToken: string | null;
  refreshToken: string | null;
  tokenExpiry: string | null;
}

import {
  ContactDetailsDto,
  CreateContactDetailsDto,
  UpdateContactDetailsDto,
} from './contactDetail';
import {
  UserRole,
  AddressDto,
  CreateAddressDto,
  UpdateAddressDto,
} from './index';

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

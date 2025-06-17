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
  pictureFileId: number | null;
  pictureUrl: string | null;
  emailVerifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
  role: UserRole;
  roleName: string;
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
  pictureFileId: number | null;
  role: UserRole;
  addresses: CreateAddressDto[];
  contactDetails: CreateContactDetailsDto[];
  picture: File | null;
}

export interface UpdateUserDto {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  pictureFileId: number | null;
  role: UserRole;
  preferences: { [key: string]: unknown };
  addresses: UpdateAddressDto[];
  contactDetails: UpdateContactDetailsDto[];
  picture: File | null;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface RefreshTokenDto {
  refreshToken: string;
}

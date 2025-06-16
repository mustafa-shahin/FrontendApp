import {
  UserDto,
  CreateUserDto,
  UpdateUserDto,
  ChangePasswordDto,
  PagedResult,
} from '@frontend-app/types';
import { apiService } from './api.service';
import {
  CreateUserFormData,
  UpdateUserFormData,
  ChangePasswordFormData,
} from '../schemas';

class UserService {
  private readonly basePath = '/user';

  async getUsers(
    page = 1,
    pageSize = 20,
    search?: string
  ): Promise<PagedResult<UserDto>> {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
    });

    if (search) {
      params.append('search', search);
    }

    return apiService.get<PagedResult<UserDto>>(
      `${this.basePath}?${params.toString()}`
    );
  }

  async getUserById(id: number): Promise<UserDto> {
    return apiService.get<UserDto>(`${this.basePath}/${id}`);
  }

  async createUser(userData: CreateUserFormData): Promise<UserDto> {
    const createUserDto: CreateUserDto = {
      email: userData.email,
      username: userData.username,
      password: userData.password,
      firstName: userData.firstName,
      lastName: userData.lastName,
      isActive: userData.isActive,
      avatarFileId: userData.avatarFileId ?? null,
      timezone: userData.timezone ?? null,
      language: userData.language ?? null,
      role: userData.role,
      preferences: userData.preferences,
      addresses: userData.addresses.map((addr) => ({
        street: addr.street,
        street2: addr.street2 ?? null,
        city: addr.city,
        state: addr.state,
        country: addr.country,
        postalCode: addr.postalCode,
        region: addr.region ?? null,
        district: addr.district ?? null,
        isDefault: addr.isDefault,
        addressType: addr.addressType ?? null,
        notes: addr.notes ?? null,
      })),
      contactDetails: userData.contactDetails.map((contact) => ({
        primaryPhone: contact.primaryPhone ?? null,
        secondaryPhone: contact.secondaryPhone ?? null,
        mobile: contact.mobile ?? null,
        fax: contact.fax ?? null,
        email: contact.email ?? null,
        secondaryEmail: contact.secondaryEmail ?? null,
        website: contact.website ?? null,
        linkedInProfile: contact.linkedInProfile ?? null,
        twitterProfile: contact.twitterProfile ?? null,
        facebookProfile: contact.facebookProfile ?? null,
        instagramProfile: contact.instagramProfile ?? null,
        whatsAppNumber: contact.whatsAppNumber ?? null,
        telegramHandle: contact.telegramHandle ?? null,
        additionalContacts: contact.additionalContacts ?? null,
        isDefault: contact.isDefault,
        contactType: contact.contactType ?? null,
      })),
      avatar: userData.avatar ?? null,
    };

    return apiService.post<UserDto>(this.basePath, createUserDto);
  }

  async updateUser(id: number, userData: UpdateUserFormData): Promise<UserDto> {
    // Convert form data to DTO format
    const updateUserDto: UpdateUserDto = {
      email: userData.email,
      username: userData.username,
      firstName: userData.firstName,
      lastName: userData.lastName,
      isActive: userData.isActive,
      avatarFileId: userData.avatarFileId ?? null,
      timezone: userData.timezone ?? null,
      language: userData.language ?? null,
      role: userData.role,
      preferences: userData.preferences,
      addresses: userData.addresses.map((addr) => ({
        id: addr.id,
        street: addr.street,
        street2: addr.street2 ?? null,
        city: addr.city,
        state: addr.state,
        country: addr.country,
        postalCode: addr.postalCode,
        region: addr.region ?? null,
        district: addr.district ?? null,
        isDefault: addr.isDefault,
        addressType: addr.addressType ?? null,
        notes: addr.notes ?? null,
      })),
      contactDetails: userData.contactDetails.map((contact) => ({
        id: contact.id,
        primaryPhone: contact.primaryPhone ?? null,
        secondaryPhone: contact.secondaryPhone ?? null,
        mobile: contact.mobile ?? null,
        fax: contact.fax ?? null,
        email: contact.email ?? null,
        secondaryEmail: contact.secondaryEmail ?? null,
        website: contact.website ?? null,
        linkedInProfile: contact.linkedInProfile ?? null,
        twitterProfile: contact.twitterProfile ?? null,
        facebookProfile: contact.facebookProfile ?? null,
        instagramProfile: contact.instagramProfile ?? null,
        whatsAppNumber: contact.whatsAppNumber ?? null,
        telegramHandle: contact.telegramHandle ?? null,
        additionalContacts: contact.additionalContacts ?? null,
        isDefault: contact.isDefault,
        contactType: contact.contactType ?? null,
      })),
      avatar: userData.avatar ?? null,
    };

    return apiService.put<UserDto>(`${this.basePath}/${id}`, updateUserDto);
  }

  async deleteUser(id: number): Promise<void> {
    return apiService.delete<void>(`${this.basePath}/${id}`);
  }

  async activateUser(id: number): Promise<void> {
    return apiService.post<void>(`${this.basePath}/${id}/activate`);
  }

  async deactivateUser(id: number): Promise<void> {
    return apiService.post<void>(`${this.basePath}/${id}/deactivate`);
  }

  async lockUser(id: number): Promise<void> {
    return apiService.post<void>(`${this.basePath}/${id}/lock`);
  }

  async unlockUser(id: number): Promise<void> {
    return apiService.post<void>(`${this.basePath}/${id}/unlock`);
  }

  async changePassword(
    id: number,
    passwordData: ChangePasswordFormData
  ): Promise<void> {
    const changePasswordDto: ChangePasswordDto = {
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
      confirmPassword: passwordData.confirmPassword,
    };

    return apiService.post<void>(
      `${this.basePath}/${id}/change-password`,
      changePasswordDto
    );
  }

  async resetPassword(id: number): Promise<void> {
    return apiService.post<void>(`${this.basePath}/${id}/reset-password`);
  }

  async updateUserPreferences(
    id: number,
    preferences: Record<string, any>
  ): Promise<UserDto> {
    return apiService.put<UserDto>(
      `${this.basePath}/${id}/preferences`,
      preferences
    );
  }

  async sendEmailVerification(id: number): Promise<void> {
    return apiService.post<void>(`${this.basePath}/${id}/send-verification`);
  }

  async updateUserAvatar(
    id: number,
    avatarFileId: number | null
  ): Promise<UserDto> {
    return apiService.put<UserDto>(`${this.basePath}/${id}/avatar`, {
      avatarFileId,
    });
  }

  async removeUserAvatar(id: number): Promise<UserDto> {
    return apiService.delete<UserDto>(`${this.basePath}/${id}/avatar`);
  }

  // Utility methods
  getUserAvatarUrl(user: UserDto): string | null {
    if (user.avatarFileId && user.avatarFileId > 0) {
      return apiService.getFileUrl(user.avatarFileId);
    }
    return null;
  }

  getFullName(user: UserDto): string {
    return `${user.firstName} ${user.lastName}`.trim();
  }

  getDefaultAddress(user: UserDto) {
    return user.addresses.find((addr) => addr.isDefault) || user.addresses[0];
  }

  getDefaultContactDetails(user: UserDto) {
    return (
      user.contactDetails.find((contact) => contact.isDefault) ||
      user.contactDetails[0]
    );
  }
}

export const userService = new UserService();

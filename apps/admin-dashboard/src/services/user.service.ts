import { apiService } from './api.service';
import {
  UserDto,
  CreateUserDto,
  UpdateUserDto,
  ChangePasswordDto,
  PagedResult,
} from '@frontend-app/types';

class UserService {
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

    return apiService.get<PagedResult<UserDto>>(`/user?${params.toString()}`);
  }

  async getUserById(id: number): Promise<UserDto> {
    return apiService.get<UserDto>(`/user/${id}`);
  }

  async createUser(userData: CreateUserDto): Promise<UserDto> {
    return apiService.post<UserDto>('/user', userData);
  }

  async updateUser(id: number, userData: UpdateUserDto): Promise<UserDto> {
    return apiService.put<UserDto>(`/user/${id}`, userData);
  }

  async deleteUser(id: number): Promise<void> {
    return apiService.delete<void>(`/user/${id}`);
  }

  async activateUser(id: number): Promise<void> {
    return apiService.post<void>(`/user/${id}/activate`);
  }

  async deactivateUser(id: number): Promise<void> {
    return apiService.post<void>(`/user/${id}/deactivate`);
  }

  async lockUser(id: number): Promise<void> {
    return apiService.post<void>(`/user/${id}/lock`);
  }

  async unlockUser(id: number): Promise<void> {
    return apiService.post<void>(`/user/${id}/unlock`);
  }

  async changePassword(
    id: number,
    passwordData: ChangePasswordDto
  ): Promise<void> {
    return apiService.post<void>(`/user/${id}/change-password`, passwordData);
  }

  async updateUserAvatar(
    id: number,
    avatarFileId: number | null
  ): Promise<UserDto> {
    return apiService.put<UserDto>(`/user/${id}/avatar`, { avatarFileId });
  }

  async removeUserAvatar(id: number): Promise<UserDto> {
    return apiService.delete<UserDto>(`/user/${id}/avatar`);
  }

  async sendEmailVerification(id: number): Promise<void> {
    return apiService.post<void>(`/user/${id}/send-verification`);
  }
}

export const userService = new UserService();

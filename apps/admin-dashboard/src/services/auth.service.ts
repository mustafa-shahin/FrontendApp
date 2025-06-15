import { LoginDto, LoginResponseDto, User, RefreshTokenDto } from '../types';
import { apiService } from './api.service';

class AuthService {
  async login(credentials: LoginDto): Promise<LoginResponseDto> {
    return apiService.post<LoginResponseDto>('/auth/login', credentials);
  }

  async logout(refreshTokenDto: RefreshTokenDto): Promise<void> {
    return apiService.post<void>('/auth/logout', refreshTokenDto);
  }

  async refreshToken(
    refreshTokenDto: RefreshTokenDto
  ): Promise<LoginResponseDto> {
    return apiService.post<LoginResponseDto>('/auth/refresh', refreshTokenDto);
  }

  async getCurrentUser(): Promise<User> {
    return apiService.get<User>('/auth/me');
  }

  async generateDownloadToken(
    fileId: number
  ): Promise<{ token: string; expiresIn: number }> {
    return apiService.post<{ token: string; expiresIn: number }>(
      `/file/${fileId}/download-token`
    );
  }
}

export const authService = new AuthService();

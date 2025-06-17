import { apiService } from './api.service';
import { PagedResult } from '@frontend-app/types';
import {
  FolderDto,
  CreateFolderDto,
  UpdateFolderDto,
  MoveFolderDto,
  CopyFolderDto,
  FolderTreeDto,
} from '../types';
class FolderService {
  // Read operations
  async getFolders(
    parentFolderId?: number,
    page = 1,
    pageSize = 20
  ): Promise<PagedResult<FolderDto>> {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
    });

    if (parentFolderId) {
      params.append('parentFolderId', parentFolderId.toString());
    }

    return apiService.get<PagedResult<FolderDto>>(
      `/folder?${params.toString()}`
    );
  }

  async getAllFolders(parentFolderId?: number): Promise<FolderDto[]> {
    const params = new URLSearchParams();
    if (parentFolderId) {
      params.append('parentFolderId', parentFolderId.toString());
    }

    return apiService.get<FolderDto[]>(`/folder/all?${params.toString()}`);
  }

  async getFolderById(id: number): Promise<FolderDto> {
    return apiService.get<FolderDto>(`/folder/${id}`);
  }

  async getFolderTree(rootFolderId?: number): Promise<FolderTreeDto> {
    const params = rootFolderId ? `?rootFolderId=${rootFolderId}` : '';
    return apiService.get<FolderTreeDto>(`/folder/tree${params}`);
  }

  async getFolderByPath(path: string): Promise<FolderDto> {
    const params = new URLSearchParams({ path });
    return apiService.get<FolderDto>(`/folder/by-path?${params.toString()}`);
  }

  async searchFolders(searchTerm: string): Promise<FolderDto[]> {
    const params = new URLSearchParams({ searchTerm });
    return apiService.get<FolderDto[]>(`/folder/search?${params.toString()}`);
  }

  async getFolderPath(id: number): Promise<{ path: string }> {
    return apiService.get<{ path: string }>(`/folder/${id}/path`);
  }

  async getFolderBreadcrumbs(id: number): Promise<FolderDto[]> {
    return apiService.get<FolderDto[]>(`/folder/${id}/breadcrumbs`);
  }

  async getFolderStatistics(id: number): Promise<Record<string, any>> {
    return apiService.get<Record<string, any>>(`/folder/${id}/statistics`);
  }

  // Create operations
  async createFolder(createData: CreateFolderDto): Promise<FolderDto> {
    return apiService.post<FolderDto>('/folder', createData);
  }

  // Update operations
  async updateFolder(
    id: number,
    updateData: UpdateFolderDto
  ): Promise<FolderDto> {
    return apiService.put<FolderDto>(`/folder/${id}`, updateData);
  }

  async moveFolder(moveData: MoveFolderDto): Promise<FolderDto> {
    return apiService.post<FolderDto>('/folder/move', moveData);
  }

  async renameFolder(id: number, newName: string): Promise<boolean> {
    try {
      await apiService.post(`/folder/${id}/rename`, { newName });
      return true;
    } catch {
      return false;
    }
  }

  async copyFolder(copyData: CopyFolderDto): Promise<FolderDto> {
    return apiService.post<FolderDto>('/folder/copy', copyData);
  }

  // Delete operations
  async deleteFolder(id: number, deleteFiles = false): Promise<boolean> {
    try {
      const params = new URLSearchParams({
        deleteFiles: deleteFiles.toString(),
      });
      await apiService.delete(`/folder/${id}?${params.toString()}`);
      return true;
    } catch {
      return false;
    }
  }

  // Validation
  async validateFolderName(
    name: string,
    parentFolderId?: number,
    excludeFolderId?: number
  ): Promise<{ isValid: boolean }> {
    const params = new URLSearchParams({ name });
    if (parentFolderId)
      params.append('parentFolderId', parentFolderId.toString());
    if (excludeFolderId)
      params.append('excludeFolderId', excludeFolderId.toString());

    return apiService.get<{ isValid: boolean }>(
      `/folder/validate-name?${params.toString()}`
    );
  }

  async folderExists(id: number): Promise<{ exists: boolean }> {
    return apiService.get<{ exists: boolean }>(`/folder/${id}/exists`);
  }

  // Utility methods
  getFolderIcon(folderType: number): string {
    const iconMap: Record<number, string> = {
      0: 'folder', // General
      1: 'images', // Images
      2: 'file-alt', // Documents
      3: 'video', // Videos
      4: 'music', // Audio
      5: 'user-circle', // User Avatars
      6: 'building', // Company Assets
      7: 'clock', // Temporary
    };
    return iconMap[folderType] || 'folder';
  }

  formatFolderPath(path: string): string {
    return path.startsWith('/') ? path : `/${path}`;
  }
}

export const folderService = new FolderService();

import {
  Folder,
  CreateFolderDto,
  UpdateFolderDto,
  MoveFolderDto,
  CopyFolderDto,
} from '../types';
import { PagedResult } from '@frontend-app/types';
import { apiService } from './api.service';

class FolderService {
  async getFolders(
    parentFolderId?: number,
    page = 1,
    pageSize = 20
  ): Promise<PagedResult<Folder>> {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
    });

    if (parentFolderId) {
      params.append('parentFolderId', parentFolderId.toString());
    }

    return apiService.get<PagedResult<Folder>>(`/folder?${params.toString()}`);
  }

  async getAllFolders(parentFolderId?: number): Promise<Folder[]> {
    const params = parentFolderId ? `?parentFolderId=${parentFolderId}` : '';
    return apiService.get<Folder[]>(`/folder/all${params}`);
  }

  async getFolderById(id: number): Promise<Folder> {
    return apiService.get<Folder>(`/folder/${id}`);
  }

  async createFolder(folderData: CreateFolderDto): Promise<Folder> {
    return apiService.post<Folder>('/folder', folderData);
  }

  async updateFolder(id: number, updateData: UpdateFolderDto): Promise<Folder> {
    return apiService.put<Folder>(`/folder/${id}`, updateData);
  }

  async deleteFolder(id: number, deleteFiles = false): Promise<void> {
    return apiService.delete<void>(`/folder/${id}?deleteFiles=${deleteFiles}`, {
      fileIds: [],
    });
  }

  async moveFolder(moveData: MoveFolderDto): Promise<Folder> {
    return apiService.post<Folder>('/folder/move', moveData);
  }

  async copyFolder(copyData: CopyFolderDto): Promise<Folder> {
    return apiService.post<Folder>('/folder/copy', copyData);
  }

  async renameFolder(id: number, newName: string): Promise<void> {
    return apiService.post<void>(`/folder/${id}/rename`, { newName });
  }

  async getFolderTree(rootFolderId?: number): Promise<Folder> {
    const params = rootFolderId ? `?rootFolderId=${rootFolderId}` : '';
    return apiService.get<Folder>(`/folder/tree${params}`);
  }

  async getFolderPath(id: number): Promise<{ path: string }> {
    return apiService.get<{ path: string }>(`/folder/${id}/path`);
  }

  async getFolderBreadcrumbs(id: number): Promise<Folder[]> {
    return apiService.get<Folder[]>(`/folder/${id}/breadcrumbs`);
  }

  async getFolderByPath(path: string): Promise<Folder> {
    return apiService.get<Folder>(
      `/folder/by-path?path=${encodeURIComponent(path)}`
    );
  }

  async searchFolders(searchTerm: string): Promise<Folder[]> {
    return apiService.get<Folder[]>(
      `/folder/search?searchTerm=${encodeURIComponent(searchTerm)}`
    );
  }

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

  async getFolderStatistics(id: number): Promise<Record<string, any>> {
    return apiService.get<Record<string, any>>(`/folder/${id}/statistics`);
  }

  async folderExists(id: number): Promise<{ exists: boolean }> {
    return apiService.get<{ exists: boolean }>(`/folder/${id}/exists`);
  }
}

export const folderService = new FolderService();

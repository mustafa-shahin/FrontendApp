import {
  FileDto,
  FileUploadDto,
  UpdateFileDto,
  FileSearchDto,
  MoveFileDto,
  CopyFileDto,
} from '../types';
import { PagedResult } from '@frontend-app/types';
import { apiService } from './api.service';
class FileService {
  async getFiles(
    searchParams?: Partial<FileSearchDto>
  ): Promise<PagedResult<FileDto>> {
    const params = new URLSearchParams();

    if (searchParams) {
      Object.entries(searchParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach((v) => params.append(key, v.toString()));
          } else {
            params.append(key, value.toString());
          }
        }
      });
    }

    const query = params.toString();
    return apiService.get<PagedResult<FileDto>>(
      `/file${query ? `?${query}` : ''}`
    );
  }

  async getFileById(id: number): Promise<FileDto> {
    return apiService.get<FileDto>(`/file/${id}`);
  }

  async uploadFile(uploadData: FileUploadDto): Promise<FileDto> {
    const formData = new FormData();
    formData.append('file', uploadData.file);

    if (uploadData.description)
      formData.append('description', uploadData.description);
    if (uploadData.alt) formData.append('alt', uploadData.alt);
    if (uploadData.folderId)
      formData.append('folderId', uploadData.folderId.toString());
    formData.append('isPublic', uploadData.isPublic.toString());
    formData.append(
      'generateThumbnail',
      uploadData.generateThumbnail.toString()
    );
    formData.append('tags', JSON.stringify(uploadData.tags));

    return apiService.uploadFile<FileDto>('/file/upload', formData);
  }

  async uploadMultipleFiles(
    files: File[],
    folderId?: number,
    isPublic = false
  ): Promise<FileDto[]> {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append('files', file);
    });

    if (folderId) formData.append('folderId', folderId.toString());
    formData.append('isPublic', isPublic.toString());
    formData.append('generateThumbnails', 'true');

    return apiService.uploadFile<FileDto[]>('/file/upload/multiple', formData);
  }

  async updateFile(id: number, updateData: UpdateFileDto): Promise<FileDto> {
    return apiService.put<FileDto>(`/file/${id}`, updateData);
  }

  async deleteFile(id: number): Promise<void> {
    return apiService.delete<void>(`/file/${id}`, {
      fileIds: [],
    });
  }

  async moveFile(moveData: MoveFileDto): Promise<FileDto> {
    return apiService.post<FileDto>('/file/move', moveData);
  }

  async copyFile(copyData: CopyFileDto): Promise<FileDto> {
    return apiService.post<FileDto>('/file/copy', copyData);
  }

  async searchFiles(searchData: FileSearchDto): Promise<FileDto[]> {
    return apiService.post<FileDto[]>('/file/search', searchData);
  }

  async getRecentFiles(count = 10): Promise<FileDto[]> {
    return apiService.get<FileDto[]>(`/file/recent?count=${count}`);
  }

  async getFileStatistics(): Promise<Record<string, any>> {
    return apiService.get<Record<string, any>>('/file/statistics');
  }

  async generateThumbnail(id: number): Promise<void> {
    return apiService.post<void>(`/file/${id}/generate-thumbnail`);
  }

  async bulkDeleteFiles(fileIds: number[]): Promise<void> {
    return apiService.delete<void>('/file/bulk-delete', { fileIds });
  }

  async bulkMoveFiles(
    fileIds: number[],
    destinationFolderId?: number
  ): Promise<void> {
    return apiService.post<void>('/file/bulk-move', {
      fileIds,
      destinationFolderId,
    });
  }

  async bulkCopyFiles(
    fileIds: number[],
    destinationFolderId?: number
  ): Promise<FileDto[]> {
    return apiService.post<FileDto[]>('/file/bulk-copy', {
      fileIds,
      destinationFolderId,
    });
  }

  getDownloadUrl(fileId: number): string {
    return apiService.getFileUrl(fileId);
  }

  getThumbnailUrl(fileId: number): string {
    return apiService.getThumbnailUrl(fileId);
  }
  getAvatarUrl(user: {
    avatarFileId?: number | null;
    firstName?: string;
    lastName?: string;
  }): string | null {
    if (user.avatarFileId && user.avatarFileId > 0) {
      return this.getImageUrl(user.avatarFileId, 'download');
    }
    return null;
  }
  getImageUrl(
    fileId: number | null | undefined,
    type: 'download' | 'thumbnail' = 'download'
  ): string | null {
    if (!fileId || fileId <= 0) return null;
    if (type === 'thumbnail') {
      return this.getThumbnailUrl(fileId);
    } else {
      return this.getDownloadUrl(fileId);
    }
  }
}

export const fileService = new FileService();

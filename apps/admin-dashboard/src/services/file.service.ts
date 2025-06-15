import {
  FileEntity,
  FileUploadDto,
  UpdateFileDto,
  FileSearchDto,
  PagedResult,
  MoveFileDto,
  CopyFileDto,
} from '../types';
import { apiService } from './api.service';

class FileService {
  async getFiles(
    searchParams?: Partial<FileSearchDto>
  ): Promise<PagedResult<FileEntity>> {
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
    return apiService.get<PagedResult<FileEntity>>(
      `/file${query ? `?${query}` : ''}`
    );
  }

  async getFileById(id: number): Promise<FileEntity> {
    return apiService.get<FileEntity>(`/file/${id}`);
  }

  async uploadFile(uploadData: FileUploadDto): Promise<FileEntity> {
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

    return apiService.uploadFile<FileEntity>('/file/upload', formData);
  }

  async uploadMultipleFiles(
    files: File[],
    folderId?: number,
    isPublic = false
  ): Promise<FileEntity[]> {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append('files', file);
    });

    if (folderId) formData.append('folderId', folderId.toString());
    formData.append('isPublic', isPublic.toString());
    formData.append('generateThumbnails', 'true');

    return apiService.uploadFile<FileEntity[]>(
      '/file/upload/multiple',
      formData
    );
  }

  async updateFile(id: number, updateData: UpdateFileDto): Promise<FileEntity> {
    return apiService.put<FileEntity>(`/file/${id}`, updateData);
  }

  async deleteFile(id: number): Promise<void> {
    return apiService.delete<void>(`/file/${id}`, {
      fileIds: [],
    });
  }

  async moveFile(moveData: MoveFileDto): Promise<FileEntity> {
    return apiService.post<FileEntity>('/file/move', moveData);
  }

  async copyFile(copyData: CopyFileDto): Promise<FileEntity> {
    return apiService.post<FileEntity>('/file/copy', copyData);
  }

  async searchFiles(searchData: FileSearchDto): Promise<FileEntity[]> {
    return apiService.post<FileEntity[]>('/file/search', searchData);
  }

  async getRecentFiles(count = 10): Promise<FileEntity[]> {
    return apiService.get<FileEntity[]>(`/file/recent?count=${count}`);
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
  ): Promise<FileEntity[]> {
    return apiService.post<FileEntity[]>('/file/bulk-copy', {
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
}

export const fileService = new FileService();

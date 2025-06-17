import { apiService } from './api.service';
import {
  FileDto,
  FileUploadDto,
  UpdateFileDto,
  FileSearchDto,
  MultipleFileUploadDto,
  MoveFileDto,
  CopyFileDto,
  PagedResult,
  UserDto,
  FileType,
} from '../types';

class FileService {
  // Upload operations
  async uploadFile(uploadData: FileUploadDto): Promise<FileDto> {
    const formData = new FormData();
    formData.append('file', uploadData.file);

    if (uploadData.description) {
      formData.append('description', uploadData.description);
    }
    if (uploadData.alt) {
      formData.append('alt', uploadData.alt);
    }
    if (uploadData.folderId) {
      formData.append('folderId', uploadData.folderId.toString());
    }
    formData.append('isPublic', uploadData.isPublic.toString());
    formData.append(
      'generateThumbnail',
      uploadData.generateThumbnail.toString()
    );
    formData.append('tags', JSON.stringify(uploadData.tags));

    return apiService.uploadFile<FileDto>('/file/upload', formData);
  }

  async uploadMultipleFiles(
    uploadData: MultipleFileUploadDto
  ): Promise<FileDto[]> {
    const formData = new FormData();

    uploadData.files.forEach((file) => {
      formData.append('files', file);
    });

    if (uploadData.folderId) {
      formData.append('folderId', uploadData.folderId.toString());
    }
    formData.append('isPublic', uploadData.isPublic.toString());
    formData.append(
      'generateThumbnails',
      uploadData.generateThumbnails.toString()
    );

    return apiService.uploadFile<FileDto[]>('/file/upload/multiple', formData);
  }

  // Read operations
  async getFiles(
    page = 1,
    pageSize = 20,
    folderId?: number,
    search?: string,
    fileType?: FileType
  ): Promise<PagedResult<FileDto>> {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
    });

    if (folderId) params.append('folderId', folderId.toString());
    if (search) params.append('search', search);
    if (fileType !== undefined) params.append('fileType', fileType.toString());

    return apiService.get<PagedResult<FileDto>>(`/file?${params.toString()}`);
  }

  async getFileById(id: number): Promise<FileDto> {
    return apiService.get<FileDto>(`/file/${id}`);
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

  // Update operations
  async updateFile(id: number, updateData: UpdateFileDto): Promise<FileDto> {
    return apiService.put<FileDto>(`/file/${id}`, updateData);
  }

  async moveFile(moveData: MoveFileDto): Promise<FileDto> {
    return apiService.post<FileDto>('/file/move', moveData);
  }

  async copyFile(copyData: CopyFileDto): Promise<FileDto> {
    return apiService.post<FileDto>('/file/copy', copyData);
  }

  // Delete operations
  async deleteFile(id: number): Promise<boolean> {
    try {
      await apiService.delete(`/file/${id}`);
      return true;
    } catch {
      return false;
    }
  }

  async deleteMultipleFiles(fileIds: number[]): Promise<boolean> {
    try {
      await apiService.delete('/file/bulk-delete', { fileIds });
      return true;
    } catch {
      return false;
    }
  }

  // Bulk operations
  async bulkUpdateFiles(
    fileIds: number[],
    updateData: UpdateFileDto
  ): Promise<boolean> {
    try {
      await apiService.post('/file/bulk-update', {
        fileIds,
        updateDto: updateData,
      });
      return true;
    } catch {
      return false;
    }
  }

  async bulkMoveFiles(
    fileIds: number[],
    destinationFolderId: number | null
  ): Promise<boolean> {
    try {
      await apiService.post('/file/bulk-move', {
        fileIds,
        destinationFolderId,
      });
      return true;
    } catch {
      return false;
    }
  }

  async bulkCopyFiles(
    fileIds: number[],
    destinationFolderId: number | null
  ): Promise<FileDto[]> {
    return apiService.post<FileDto[]>('/file/bulk-copy', {
      fileIds,
      destinationFolderId,
    });
  }

  // URL generation methods
  getDownloadUrl(fileId: number): string {
    return `${apiService['baseUrl']}/file/${fileId}/download`;
  }

  getThumbnailUrl(fileId: number): string {
    return `${apiService['baseUrl']}/file/${fileId}/thumbnail`;
  }

  getImageUrl(
    fileId: number,
    size: 'thumbnail' | 'original' = 'original'
  ): string | null {
    if (size === 'thumbnail') {
      return this.getThumbnailUrl(fileId);
    }
    return this.getDownloadUrl(fileId);
  }

  getAvatarUrl(user: UserDto): string | null {
    if (user.pictureFileId) {
      return this.getImageUrl(user.pictureFileId, 'thumbnail');
    }
    return null;
  }

  // File preview and thumbnail operations
  async generateThumbnail(fileId: number): Promise<boolean> {
    try {
      await apiService.post(`/file/${fileId}/generate-thumbnail`);
      return true;
    } catch {
      return false;
    }
  }

  async getFilePreview(fileId: number): Promise<any> {
    return apiService.get(`/file/${fileId}/preview`);
  }

  // Download token operations
  async generateDownloadToken(
    fileId: number
  ): Promise<{ token: string; expiresIn: number }> {
    return apiService.post(`/file/${fileId}/download-token`);
  }

  getDownloadUrlWithToken(token: string): string {
    return `${apiService['baseUrl']}/file/download/${token}`;
  }

  // Utility methods
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  getFileTypeIcon(fileType: FileType): string {
    switch (fileType) {
      case FileType.Image:
        return 'image';
      case FileType.Video:
        return 'video';
      case FileType.Audio:
        return 'music';
      case FileType.Document:
        return 'file-alt';
      case FileType.Archive:
        return 'file-archive';
      default:
        return 'file';
    }
  }

  isImageFile(contentType: string): boolean {
    return contentType.startsWith('image/');
  }

  isVideoFile(contentType: string): boolean {
    return contentType.startsWith('video/');
  }

  isAudioFile(contentType: string): boolean {
    return contentType.startsWith('audio/');
  }
}

export const fileService = new FileService();

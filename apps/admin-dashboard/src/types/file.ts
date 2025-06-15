import { FileType } from './index';
export interface FileEntity {
  id: number;
  originalFileName: string;
  storedFileName: string;
  contentType: string;
  fileSize: number;
  fileExtension: string;
  fileType: FileType;
  description?: string;
  alt?: string;
  metadata: Record<string, any>;
  isPublic: boolean;
  folderId?: number;
  downloadCount: number;
  lastAccessedAt?: string;
  width?: number;
  height?: number;
  duration?: string;
  hash?: string;
  isProcessed: boolean;
  processingStatus?: string;
  tags: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}
export interface FileUploadDto {
  file: File;
  description?: string;
  alt?: string;
  folderId?: number;
  isPublic: boolean;
  tags: Record<string, any>;
  generateThumbnail: boolean;
}
export interface UpdateFileDto {
  description?: string;
  alt?: string;
  isPublic: boolean;
  tags: Record<string, any>;
  folderId?: number;
}

export interface FileSearchDto {
  searchTerm?: string;
  fileType?: FileType;
  folderId?: number;
  isPublic?: boolean;
  createdFrom?: string;
  createdTo?: string;
  minSize?: number;
  maxSize?: number;
  tags: string[];
  page: number;
  pageSize: number;
  sortBy: string;
  sortDirection: string;
}
export interface FileDto {
  id: number;
  originalFileName: string;
  storedFileName: string;
  contentType: string;
  fileSize: number;
  fileExtension: string;
  fileType: FileType;
  description: string | null;
  alt: string | null;
  metadata: { [key: string]: any };
  isPublic: boolean;
  folderId: number | null;
  downloadCount: number;
  lastAccessedAt: string | null;
  width: number | null;
  height: number | null;
  duration: string | null; // TimeSpan in C# maps to string in TS (e.g., "00:00:00")
  hash: string | null;
  isProcessed: boolean;
  processingStatus: string | null;
  tags: { [key: string]: any };
  createdAt: string;
  updatedAt: string;
}
export interface MultipleFileUploadDto {
  files: File[];
  folderId: number | null;
  isPublic: boolean;
  generateThumbnails: boolean;
}
export interface MoveFileDto {
  fileId: number;
  newFolderId: number | null;
}

export interface CopyFileDto {
  fileId: number;
  destinationFolderId: number | null;
  newName: string | null;
}

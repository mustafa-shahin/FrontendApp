import { FileDto, FileEntity, FileType, FolderType } from './index';
export interface Folder {
  id: number;
  name: string;
  description?: string;
  path: string;
  parentFolderId?: number;
  parentFolderPath?: string;
  subFolders: Folder[];
  files: FileEntity[];
  isPublic: boolean;
  metadata: Record<string, any>;
  folderType: FolderType;
  createdAt: string;
  updatedAt: string;
  fileCount: number;
  subFolderCount: number;
  totalSize: number;
  totalSizeFormatted: string;
}
export interface CreateFolderDto {
  name: string;
  description?: string;
  parentFolderId?: number;
  isPublic: boolean;
  folderType: FolderType;
  metadata: Record<string, any>;
}

export interface UpdateFolderDto {
  name: string;
  description?: string;
  isPublic: boolean;
  metadata: Record<string, any>;
}
export interface FolderDto {
  id: number;
  name: string;
  description: string | null;
  path: string;
  parentFolderId: number | null;
  parentFolderPath: string | null;
  subFolders: FolderDto[];
  files: FileDto[];
  isPublic: boolean;
  metadata: { [key: string]: any };
  folderType: FolderType;
  createdAt: string;
  updatedAt: string;
  fileCount: number;
  subFolderCount: number;
  totalSize: number;
  totalSizeFormatted: string;
}
export interface MoveFolderDto {
  folderId: number;
  newParentFolderId: number | null;
}

export interface FolderTreeDto {
  id: number;
  name: string;
  path: string;
  parentFolderId: number | null;
  children: FolderTreeDto[];
  folderType: FolderType;
  isPublic: boolean;
  fileCount: number;
  hasSubFolders: boolean;
}

export interface FilePreviewDto {
  id: number;
  originalFileName: string;
  contentType: string;
  fileType: FileType;
  fileUrl: string;
  thumbnailUrl: string | null;
  width: number | null;
  height: number | null;
  duration: string | null;
  canPreview: boolean;
  previewHtml: string | null;
}

export interface RenameFolderDto {
  newName: string;
}

export interface CopyFolderDto {
  folderId: number;
  destinationFolderId: number | null;
  newName: string | null;
}

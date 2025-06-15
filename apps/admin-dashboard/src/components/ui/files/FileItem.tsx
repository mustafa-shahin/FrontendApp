import React from 'react';
import { FileEntity, FileType, ViewMode } from '../../../types';
import { fileService } from '../../../services/file.service';

interface FileItemProps {
  file: FileEntity;
  isSelected: boolean;
  onSelect: () => void;
  onDoubleClick: () => void;
  onContextMenu: (event: React.MouseEvent) => void;
  viewMode: ViewMode;
}

export const FileItem: React.FC<FileItemProps> = ({
  file,
  isSelected,
  onSelect,
  onDoubleClick,
  onContextMenu,
  viewMode,
}) => {
  const getFileIcon = (fileType: FileType, extension: string): string => {
    switch (fileType) {
      case FileType.Image:
        return 'image';
      case FileType.Document:
        if (extension.includes('pdf')) return 'file-pdf';
        if (extension.includes('doc')) return 'file-word';
        if (extension.includes('xls')) return 'file-excel';
        if (extension.includes('ppt')) return 'file-powerpoint';
        return 'file-alt';
      case FileType.Video:
        return 'video';
      case FileType.Audio:
        return 'music';
      case FileType.Archive:
        return 'file-archive';
      default:
        return 'file';
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (viewMode === 'grid') {
    return (
      <div
        className={`p-3 rounded-lg transition-all duration-200 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 ${
          isSelected
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900'
        }`}
        onClick={onSelect}
        onDoubleClick={onDoubleClick}
        onContextMenu={onContextMenu}
      >
        <div className="flex flex-col items-center space-y-2">
          {/* File thumbnail or icon */}
          <div className="w-full h-full flex items-center justify-center">
            {file.fileType === FileType.Image ? (
              <img
                src={fileService.getThumbnailUrl(file.id)}
                alt={file.alt || file.originalFileName}
                className="w-full h-full object-cover rounded"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : null}
            <i
              className={`fas fa-${getFileIcon(
                file.fileType,
                file.fileExtension
              )} text-3xl text-gray-400 ${
                file.fileType === FileType.Image ? 'hidden' : ''
              }`}
            />
          </div>

          {/* File name */}
          <div className="text-center">
            <p className="text-sm font-medium text-gray-900 dark:text-white  max-w-full">
              {file.originalFileName}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {formatFileSize(file.fileSize)}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-12 gap-4 px-6 py-3 border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
        isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : ''
      }`}
      onClick={onSelect}
      onDoubleClick={onDoubleClick}
      onContextMenu={onContextMenu}
    >
      {/* Name column */}
      <div className="col-span-5 flex items-center space-x-3">
        <div className="w-8 h-8 flex items-center justify-center">
          {file.fileType === FileType.Image ? (
            <img
              src={fileService.getThumbnailUrl(file.id)}
              alt={file.alt || file.originalFileName}
              className="w-full h-full object-cover rounded"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          <i
            className={`fas fa-${getFileIcon(
              file.fileType,
              file.fileExtension
            )} text-lg text-gray-400 ${
              file.fileType === FileType.Image ? 'hidden' : ''
            }`}
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
            {file.originalFileName}
          </p>
          {file.description && (
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {file.description}
            </p>
          )}
        </div>
      </div>

      {/* Size column */}
      <div className="col-span-2 flex items-center">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {formatFileSize(file.fileSize)}
        </span>
      </div>

      {/* Type column */}
      <div className="col-span-2 flex items-center">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {file.fileExtension.toUpperCase()}
        </span>
      </div>

      {/* Modified column */}
      <div className="col-span-3 flex items-center">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {formatDate(file.updatedAt)}
        </span>
      </div>
    </div>
  );
};

import React from 'react';
import { FileEntity, Folder } from '../../../types';
import { FileItem } from './FileItem';
import { FolderItem } from './FolderItem';

interface FileListProps {
  files: FileEntity[];
  folders: Folder[];
  selectedItems: (FileEntity | Folder)[];
  onItemSelect: (item: FileEntity | Folder) => void;
  onItemDoubleClick: (item: FileEntity | Folder) => void;
  onItemContextMenu: (
    item: FileEntity | Folder,
    event: React.MouseEvent
  ) => void;
}

export const FileList: React.FC<FileListProps> = ({
  files,
  folders,
  selectedItems,
  onItemSelect,
  onItemDoubleClick,
  onItemContextMenu,
}) => {
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

  return (
    <div className="overflow-hidden">
      {/* Table Header */}
      <div className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-12 gap-4 px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          <div className="col-span-5">Name</div>
          <div className="col-span-2">Size</div>
          <div className="col-span-2">Type</div>
          <div className="col-span-3">Modified</div>
        </div>
      </div>

      {/* Table Body */}
      <div className="bg-white dark:bg-gray-900">
        {/* Folders first */}
        {folders.map((folder) => (
          <FolderItem
            key={`folder-${folder.id}`}
            folder={folder}
            isSelected={selectedItems.some(
              (item) => 'subFolders' in item && item.id === folder.id
            )}
            onSelect={() => onItemSelect(folder)}
            onDoubleClick={() => onItemDoubleClick(folder)}
            onContextMenu={(event) => onItemContextMenu(folder, event)}
            viewMode="list"
          />
        ))}

        {/* Files */}
        {files.map((file) => (
          <FileItem
            key={`file-${file.id}`}
            file={file}
            isSelected={selectedItems.some(
              (item) => 'fileSize' in item && item.id === file.id
            )}
            onSelect={() => onItemSelect(file)}
            onDoubleClick={() => onItemDoubleClick(file)}
            onContextMenu={(event) => onItemContextMenu(file, event)}
            viewMode="list"
          />
        ))}
      </div>
    </div>
  );
};

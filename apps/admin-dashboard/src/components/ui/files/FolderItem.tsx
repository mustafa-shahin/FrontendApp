import React from 'react';
import { Folder, ViewMode } from '../../../types';

interface FolderItemProps {
  folder: Folder;
  isSelected: boolean;
  onSelect: () => void;
  onDoubleClick: () => void;
  onContextMenu: (event: React.MouseEvent) => void;
  viewMode: ViewMode;
}

export const FolderItem: React.FC<FolderItemProps> = ({
  folder,
  isSelected,
  onSelect,
  onDoubleClick,
  onContextMenu,
  viewMode,
}) => {
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
          {/* Folder icon */}
          <div className="w-full h-full flex items-center justify-center">
            <i className="fas fa-folder text-4xl text-blue-500 dark:text-blue-400" />
          </div>

          {/* Folder name */}
          <div className="text-center">
            <p className="text-sm font-medium text-gray-900 dark:text-white  max-w-full">
              {folder.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {folder.fileCount} files
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
        <i className="fas fa-folder text-lg text-blue-500 dark:text-blue-400" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
            {folder.name}
          </p>
          {folder.description && (
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {folder.description}
            </p>
          )}
        </div>
      </div>

      {/* Size column */}
      <div className="col-span-2 flex items-center">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {folder.totalSizeFormatted}
        </span>
      </div>

      {/* Type column */}
      <div className="col-span-2 flex items-center">
        <span className="text-sm text-gray-500 dark:text-gray-400">Folder</span>
      </div>

      {/* Modified column */}
      <div className="col-span-3 flex items-center">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {formatDate(folder.updatedAt)}
        </span>
      </div>
    </div>
  );
};

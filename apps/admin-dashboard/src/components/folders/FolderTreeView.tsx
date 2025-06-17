import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { useFolderTree } from '../../hooks/useFolders';
import { FolderTreeDto } from '../../types';
import { folderService } from '../../services/folder.service';

interface FolderTreeViewProps {
  onFolderSelect?: (folder: FolderTreeDto) => void;
  selectedFolderId?: number;
  className?: string;
}

export const FolderTreeView: React.FC<FolderTreeViewProps> = ({
  onFolderSelect,
  selectedFolderId,
  className = '',
}) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<number>>(
    new Set()
  );
  const { data: folderTree, isLoading, error } = useFolderTree();

  const toggleFolder = (folderId: number) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const renderFolderNode = (folder: FolderTreeDto, level = 0) => {
    const isExpanded = expandedFolders.has(folder.id);
    const isSelected = selectedFolderId === folder.id;
    const hasChildren = folder.children && folder.children.length > 0;

    return (
      <div key={folder.id} className="select-none">
        <div
          className={`flex items-center py-1 px-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer ${
            isSelected
              ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
              : ''
          }`}
          style={{ paddingLeft: `${level * 20 + 8}px` }}
          onClick={() => onFolderSelect?.(folder)}
        >
          {hasChildren ? (
            <Button
              variant="ghost"
              size="sm"
              icon={isExpanded ? 'chevron-down' : 'chevron-right'}
              className="p-0 w-4 h-4 mr-1"
              onClick={() => {
                toggleFolder(folder.id);
              }}
            />
          ) : (
            <div className="w-5" />
          )}

          <i
            className={`fas fa-${folderService.getFolderIcon(
              folder.folderType
            )} mr-2 text-sm ${isSelected ? 'text-blue-600' : 'text-gray-500'}`}
          />

          <span className={`text-sm ${isSelected ? 'font-medium' : ''}`}>
            {folder.name}
          </span>

          {folder.fileCount > 0 && (
            <span className="ml-2 text-xs text-gray-400">
              ({folder.fileCount})
            </span>
          )}
        </div>

        {hasChildren && isExpanded && (
          <div>
            {(folder.children ?? []).map((child) =>
              renderFolderNode(child, level + 1)
            )}
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center py-8 ${className}`}>
        <LoadingSpinner size="md" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <div className="text-red-600 dark:text-red-400">
          <i className="fas fa-exclamation-triangle text-2xl mb-2" />
          <p>Failed to load folder tree</p>
        </div>
      </div>
    );
  }

  if (!folderTree || !folderTree.children?.length) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <div className="text-gray-500 dark:text-gray-400">
          <i className="fas fa-folder-open text-2xl mb-2" />
          <p>No folders found</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`overflow-y-auto ${className}`}>
      {folderTree.children.map((folder) => renderFolderNode(folder))}
    </div>
  );
};

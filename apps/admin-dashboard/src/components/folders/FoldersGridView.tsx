import React from 'react';
import { Button } from '../ui/Button';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { FolderDto } from '../../types';
import { folderService } from '../../services/folder.service';

interface FoldersGridViewProps {
  folders: FolderDto[];
  loading: boolean;
  error?: string;
  onEdit: (folder: FolderDto) => void;
  onDelete: (folder: FolderDto) => void;
  onOpen: (folder: FolderDto) => void;
}

export const FoldersGridView: React.FC<FoldersGridViewProps> = ({
  folders,
  loading,
  error,
  onEdit,
  onDelete,
  onOpen,
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 dark:text-red-400 mb-4">
          <i className="fas fa-exclamation-triangle text-4xl mb-2" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (folders.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-6 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center">
          <i className="fas fa-folder text-3xl text-gray-400 dark:text-gray-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No folders found
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Create your first folder to organize your files.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {folders.map((folder) => (
          <FolderGridItem
            key={folder.id}
            folder={folder}
            onEdit={() => onEdit(folder)}
            onDelete={() => onDelete(folder)}
            onOpen={() => onOpen(folder)}
          />
        ))}
      </div>
    </div>
  );
};

// Folder Grid Item Component
interface FolderGridItemProps {
  folder: FolderDto;
  onEdit: () => void;
  onDelete: () => void;
  onOpen: () => void;
}

const FolderGridItem: React.FC<FolderGridItemProps> = ({
  folder,
  onEdit,
  onDelete,
  onOpen,
}) => {
  const [showActions, setShowActions] = React.useState(false);

  return (
    <div
      className="relative group bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 transition-all cursor-pointer"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      onClick={onOpen}
    >
      {/* Folder Icon and Content */}
      <div className="p-4 text-center">
        <div className="w-16 h-16 mx-auto mb-3 flex items-center justify-center">
          <i
            className={`fas fa-${folderService.getFolderIcon(
              folder.folderType
            )} text-4xl text-blue-500`}
          />
        </div>

        <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
          {folder.name}
        </h4>

        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          <div>{folder.fileCount} files</div>
          <div>{folder.subFolderCount} folders</div>
        </div>

        <div className="text-xs text-gray-400 mt-1">
          {folder.totalSizeFormatted}
        </div>
      </div>

      {/* Action Buttons */}
      {showActions && (
        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center space-x-2">
          <Button
            variant="secondary"
            size="sm"
            icon="folder-open"
            onClick={(e) => {
              e.stopPropagation();
              onOpen();
            }}
          />
          <Button
            variant="secondary"
            size="sm"
            icon="edit"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
          />
          <Button
            variant="danger"
            size="sm"
            icon="trash"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          />
        </div>
      )}

      {/* Public/Private Badge */}
      <div className="absolute top-2 right-2">
        <span
          className={`inline-flex px-1.5 py-0.5 text-xs font-semibold rounded ${
            folder.isPublic
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
          }`}
        >
          {folder.isPublic ? 'Public' : 'Private'}
        </span>
      </div>
    </div>
  );
};

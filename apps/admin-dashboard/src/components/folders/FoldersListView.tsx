import React from 'react';
import { EntityTable, TableColumn, TableAction } from '../ui/EntityTable';
import { FolderDto } from '../../types';
import { folderService } from '../../services/folder.service';

interface FoldersListViewProps {
  folders: FolderDto[];
  loading: boolean;
  error?: string;
  onEdit: (folder: FolderDto) => void;
  onDelete: (folder: FolderDto) => void;
  onOpen: (folder: FolderDto) => void;
}

export const FoldersListView: React.FC<FoldersListViewProps> = ({
  folders,
  loading,
  error,
  onEdit,
  onDelete,
  onOpen,
}) => {
  const columns: TableColumn<FolderDto>[] = [
    {
      key: 'icon',
      label: '',
      width: '40px',
      render: (folder) => (
        <i
          className={`fas fa-${folderService.getFolderIcon(
            folder.folderType
          )} text-blue-500 text-lg`}
        />
      ),
    },
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (folder) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-white">
            {folder.name}
          </div>
          {folder.description && (
            <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
              {folder.description}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'path',
      label: 'Path',
      render: (folder) => (
        <span className="text-sm text-gray-600 dark:text-gray-300 font-mono">
          {folder.path}
        </span>
      ),
    },
    {
      key: 'items',
      label: 'Items',
      align: 'center',
      render: (folder) => (
        <div className="text-sm text-gray-900 dark:text-white">
          <div>{folder.fileCount} files</div>
          <div className="text-xs text-gray-500">
            {folder.subFolderCount} folders
          </div>
        </div>
      ),
    },
    {
      key: 'size',
      label: 'Size',
      align: 'right',
      render: (folder) => (
        <span className="text-sm text-gray-900 dark:text-white">
          {folder.totalSizeFormatted}
        </span>
      ),
    },
    {
      key: 'visibility',
      label: 'Visibility',
      render: (folder) => (
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
            folder.isPublic
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
          }`}
        >
          {folder.isPublic ? 'Public' : 'Private'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Created',
      sortable: true,
      render: (folder) => (
        <span className="text-sm text-gray-900 dark:text-white">
          {new Date(folder.createdAt).toLocaleDateString()}
        </span>
      ),
    },
  ];

  const actions: TableAction<FolderDto>[] = [
    {
      key: 'open',
      label: 'Open',
      icon: 'folder-open',
      variant: 'primary',
      onClick: onOpen,
    },
    {
      key: 'edit',
      label: 'Edit',
      icon: 'edit',
      variant: 'ghost',
      onClick: onEdit,
    },
    {
      key: 'delete',
      label: 'Delete',
      icon: 'trash',
      variant: 'danger',
      onClick: onDelete,
    },
  ];

  return (
    <EntityTable
      data={folders}
      columns={columns}
      actions={actions}
      loading={loading}
      error={error}
      onRowClick={onOpen}
      emptyState={{
        icon: 'folder',
        title: 'No folders found',
        description: 'Create your first folder to organize your files.',
      }}
    />
  );
};

import React from 'react';
import { EntityTable, TableColumn, TableAction } from '../ui/EntityTable';
import { FileDto } from '../../types';
import { fileService } from '../../services/file.service';

interface FilesListViewProps {
  files: FileDto[];
  loading: boolean;
  error?: string;
  selectedFiles: FileDto[];
  onFileSelect: (file: FileDto, selected: boolean) => void;
  onSelectAll: (selected: boolean) => void;
  onEdit: (file: FileDto) => void;
  onDelete: (file: FileDto) => void;
  onDownload: (file: FileDto) => void;
}

export const FilesListView: React.FC<FilesListViewProps> = ({
  files,
  loading,
  error,
  selectedFiles,
  onFileSelect,
  onSelectAll,
  onEdit,
  onDelete,
  onDownload,
}) => {
  const columns: TableColumn<FileDto>[] = [
    {
      key: 'preview',
      label: '',
      width: '60px',
      render: (file) => (
        <div className="w-10 h-10 rounded overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
          {fileService.isImageFile(file.contentType) ? (
            <img
              src={fileService.getImageUrl(file.id, 'thumbnail') || ''}
              alt={file.originalFileName}
              className="w-full h-full object-cover"
            />
          ) : (
            <i
              className={`fas fa-${fileService.getFileTypeIcon(
                file.fileType
              )} text-gray-400`}
            />
          )}
        </div>
      ),
    },
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (file) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-white">
            {file.originalFileName}
          </div>
          {file.description && (
            <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
              {file.description}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'type',
      label: 'Type',
      render: (file) => (
        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
          {file.fileExtension?.toUpperCase() || 'Unknown'}
        </span>
      ),
    },
    {
      key: 'size',
      label: 'Size',
      align: 'right',
      render: (file) => (
        <span className="text-sm text-gray-900 dark:text-white">
          {fileService.formatFileSize(file.fileSize)}
        </span>
      ),
    },
    {
      key: 'visibility',
      label: 'Visibility',
      render: (file) => (
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
            file.isPublic
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
          }`}
        >
          {file.isPublic ? 'Public' : 'Private'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Created',
      sortable: true,
      render: (file) => (
        <span className="text-sm text-gray-900 dark:text-white">
          {new Date(file.createdAt).toLocaleDateString()}
        </span>
      ),
    },
  ];

  const actions: TableAction<FileDto>[] = [
    {
      key: 'download',
      label: 'Download',
      icon: 'download',
      variant: 'ghost',
      onClick: onDownload,
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
      data={files}
      columns={columns}
      actions={actions}
      loading={loading}
      error={error}
      selectedItems={selectedFiles}
      onSelectionChange={(items) => {
        // Handle selection changes
        const currentSelectedIds = selectedFiles.map((f) => f.id);
        const newSelectedIds = items.map((f) => f.id);

        // Find newly selected items
        const newlySelected = items.filter(
          (f) => !currentSelectedIds.includes(f.id)
        );
        const newlyDeselected = selectedFiles.filter(
          (f) => !newSelectedIds.includes(f.id)
        );

        newlySelected.forEach((file) => onFileSelect(file, true));
        newlyDeselected.forEach((file) => onFileSelect(file, false));
      }}
      selectable={true}
      emptyState={{
        icon: 'file',
        title: 'No files found',
        description: 'Upload your first file to get started.',
      }}
    />
  );
};

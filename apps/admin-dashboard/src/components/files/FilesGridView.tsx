import React from 'react';
import { Button } from '../ui/Button';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { FileDto } from '../../types';
import { fileService } from '../../services/file.service';

interface FilesGridViewProps {
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

export const FilesGridView: React.FC<FilesGridViewProps> = ({
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
  const isSelected = (file: FileDto) =>
    selectedFiles.some((f) => f.id === file.id);

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

  if (files.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-6 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center">
          <i className="fas fa-file text-3xl text-gray-400 dark:text-gray-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No files found
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Upload your first file to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Grid Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            checked={files.length > 0 && selectedFiles.length === files.length}
            ref={(input) => {
              if (input) {
                input.indeterminate =
                  selectedFiles.length > 0 &&
                  selectedFiles.length < files.length;
              }
            }}
            onChange={(e) => onSelectAll(e.target.checked)}
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            {selectedFiles.length > 0
              ? `${selectedFiles.length} selected`
              : 'Select all'}
          </span>
        </div>

        <span className="text-sm text-gray-500 dark:text-gray-400">
          {files.length} files
        </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {files.map((file) => (
          <FileGridItem
            key={file.id}
            file={file}
            selected={isSelected(file)}
            onSelect={(selected) => onFileSelect(file, selected)}
            onEdit={() => onEdit(file)}
            onDelete={() => onDelete(file)}
            onDownload={() => onDownload(file)}
          />
        ))}
      </div>
    </div>
  );
};

// File Grid Item Component
interface FileGridItemProps {
  file: FileDto;
  selected: boolean;
  onSelect: (selected: boolean) => void;
  onEdit: () => void;
  onDelete: () => void;
  onDownload: () => void;
}

const FileGridItem: React.FC<FileGridItemProps> = ({
  file,
  selected,
  onSelect,
  onEdit,
  onDelete,
  onDownload,
}) => {
  const [showActions, setShowActions] = React.useState(false);

  return (
    <div
      className={`relative group bg-white dark:bg-gray-800 rounded-lg border-2 transition-all cursor-pointer ${
        selected
          ? 'border-blue-500 ring-2 ring-blue-200'
          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
      }`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Selection Checkbox */}
      <div className="absolute top-2 left-2 z-10">
        <input
          type="checkbox"
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          checked={selected}
          onChange={(e) => onSelect(e.target.checked)}
        />
      </div>

      {/* File Preview */}
      <div className="aspect-square p-4 flex items-center justify-center">
        {fileService.isImageFile(file.contentType) ? (
          <img
            src={fileService.getImageUrl(file.id, 'thumbnail') || ''}
            alt={file.originalFileName}
            className="w-full h-full object-cover rounded"
          />
        ) : (
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
            <i
              className={`fas fa-${fileService.getFileTypeIcon(
                file.fileType
              )} text-2xl text-gray-400`}
            />
          </div>
        )}
      </div>

      {/* File Info */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-700">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
          {file.originalFileName}
        </h4>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {fileService.formatFileSize(file.fileSize)}
        </p>
      </div>

      {/* Action Buttons */}
      {showActions && (
        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center space-x-2">
          <Button
            variant="secondary"
            size="sm"
            icon="download"
            onClick={(e) => {
              e.stopPropagation();
              onDownload();
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
            file.isPublic
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
          }`}
        >
          {file.isPublic ? 'Public' : 'Private'}
        </span>
      </div>
    </div>
  );
};

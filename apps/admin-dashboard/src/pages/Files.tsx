import React, { useState } from 'react';
import { Layout } from '../components/ui/layout/Layout';
import { PageHeader } from '../components/ui/layout/PageHeader';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Dialog } from '../components/ui/Dialog';
import { Pagination } from '../components/common/Pagination';
import { FileUploadModal } from '../components/files/FileUploadModal';
import { FileEditModal } from '../components/files/FileEditModal';
import { FilesListView } from '../components/files/FilesListView';
import { FilesGridView } from '../components/files/FilesGridView';
import {
  useFiles,
  useDeleteFile,
  useDeleteMultipleFiles,
  useBulkMoveFiles,
  useBulkCopyFiles,
} from '../hooks/useFiles';
import { FileDto, FileType } from '../types';
import { fileService } from '../services/file.service';

type ViewMode = 'list' | 'grid';

export const Files: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFileType, setSelectedFileType] = useState<
    FileType | undefined
  >();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedFiles, setSelectedFiles] = useState<FileDto[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editingFile, setEditingFile] = useState<FileDto | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    file: FileDto | null;
    multiple: boolean;
  }>({ isOpen: false, file: null, multiple: false });

  // Data fetching
  const { data, isLoading, error, refetch } = useFiles(
    currentPage,
    pageSize,
    undefined,
    searchTerm,
    selectedFileType
  ) as {
    data?: { items: FileDto[]; totalCount: number };
    isLoading: boolean;
    error: Error | null;
    refetch: () => void;
  };

  // Mutations
  const deleteFileMutation = useDeleteFile({
    onSuccess: () => {
      setDeleteConfirmation({ isOpen: false, file: null, multiple: false });
      setSelectedFiles([]);
      refetch();
    },
  });

  const deleteMultipleFilesMutation = useDeleteMultipleFiles({
    onSuccess: () => {
      setDeleteConfirmation({ isOpen: false, file: null, multiple: false });
      setSelectedFiles([]);
      refetch();
    },
  });

  // Handlers
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleFileTypeFilter = (fileType: FileType | undefined) => {
    setSelectedFileType(fileType);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  const handleFileSelect = (file: FileDto, selected: boolean) => {
    if (selected) {
      setSelectedFiles([...selectedFiles, file]);
    } else {
      setSelectedFiles(selectedFiles.filter((f) => f.id !== file.id));
    }
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedFiles(data?.items || []);
    } else {
      setSelectedFiles([]);
    }
  };

  const handleDeleteFile = (file: FileDto) => {
    setDeleteConfirmation({ isOpen: true, file, multiple: false });
  };

  const handleDeleteSelected = () => {
    if (selectedFiles.length > 0) {
      setDeleteConfirmation({ isOpen: true, file: null, multiple: true });
    }
  };

  const handleDeleteConfirm = () => {
    if (deleteConfirmation.multiple) {
      const fileIds = selectedFiles.map((f) => f.id);
      deleteMultipleFilesMutation.mutate(fileIds);
    } else if (deleteConfirmation.file) {
      deleteFileMutation.mutate(deleteConfirmation.file.id);
    }
  };

  const handleDownloadFile = (file: FileDto) => {
    window.open(fileService.getDownloadUrl(file.id), '_blank');
  };

  const handleEditFile = (file: FileDto) => {
    setEditingFile(file);
  };

  const handleUploadSuccess = () => {
    refetch();
    setShowUploadModal(false);
  };

  const handleEditSuccess = () => {
    refetch();
    setEditingFile(null);
  };

  const fileTypeOptions = [
    { value: undefined, label: 'All Types' },
    { value: FileType.Image, label: 'Images' },
    { value: FileType.Document, label: 'Documents' },
    { value: FileType.Video, label: 'Videos' },
    { value: FileType.Audio, label: 'Audio' },
    { value: FileType.Archive, label: 'Archives' },
    { value: FileType.Other, label: 'Other' },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <PageHeader title="Files" subtitle="Manage your files and documents">
          <div className="flex items-center space-x-3">
            <Button
              variant="secondary"
              icon="upload"
              onClick={() => setShowUploadModal(true)}
            >
              Upload Files
            </Button>

            {selectedFiles.length > 0 && (
              <Button
                variant="danger"
                icon="trash"
                onClick={handleDeleteSelected}
              >
                Delete ({selectedFiles.length})
              </Button>
            )}
          </div>
        </PageHeader>

        {/* Filters and View Toggle */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="w-full sm:w-64">
                <Input
                  type="text"
                  placeholder="Search files..."
                  value={searchTerm}
                  onChange={handleSearch}
                  icon="search"
                />
              </div>

              <div className="w-full sm:w-48">
                <select
                  value={selectedFileType ?? ''}
                  onChange={(e) =>
                    handleFileTypeFilter(
                      e.target.value
                        ? (parseInt(e.target.value) as FileType)
                        : undefined
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  {fileTypeOptions.map((option) => (
                    <option key={option.label} value={option.value ?? ''}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'list' ? 'primary' : 'ghost'}
                size="sm"
                icon="list"
                onClick={() => setViewMode('list')}
              />
              <Button
                variant={viewMode === 'grid' ? 'primary' : 'ghost'}
                size="sm"
                icon="th-large"
                onClick={() => setViewMode('grid')}
              />
            </div>
          </div>
        </div>

        {/* Files Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          {viewMode === 'list' ? (
            <FilesListView
              files={data?.items || []}
              loading={isLoading}
              error={error?.message}
              selectedFiles={selectedFiles}
              onFileSelect={handleFileSelect}
              onSelectAll={handleSelectAll}
              onEdit={handleEditFile}
              onDelete={handleDeleteFile}
              onDownload={handleDownloadFile}
            />
          ) : (
            <FilesGridView
              files={data?.items || []}
              loading={isLoading}
              error={error?.message}
              selectedFiles={selectedFiles}
              onFileSelect={handleFileSelect}
              onSelectAll={handleSelectAll}
              onEdit={handleEditFile}
              onDelete={handleDeleteFile}
              onDownload={handleDownloadFile}
            />
          )}

          {/* Pagination */}
          {data && data.totalCount > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(data.totalCount / pageSize)}
              totalCount={data.totalCount}
              pageSize={pageSize}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              loading={isLoading}
            />
          )}
        </div>

        {/* Upload Modal */}
        <FileUploadModal
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          onSuccess={handleUploadSuccess}
        />

        {/* Edit Modal */}
        {editingFile && (
          <FileEditModal
            isOpen={true}
            onClose={() => setEditingFile(null)}
            file={editingFile}
            onSuccess={handleEditSuccess}
          />
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog
          isOpen={deleteConfirmation.isOpen}
          onClose={() =>
            setDeleteConfirmation({
              isOpen: false,
              file: null,
              multiple: false,
            })
          }
          onConfirm={handleDeleteConfirm}
          title={deleteConfirmation.multiple ? 'Delete Files' : 'Delete File'}
          message={
            deleteConfirmation.multiple
              ? `Are you sure you want to delete ${selectedFiles.length} selected files? This action cannot be undone.`
              : `Are you sure you want to delete "${deleteConfirmation.file?.originalFileName}"? This action cannot be undone.`
          }
          confirmText="Delete"
          cancelText="Cancel"
          variant="danger"
          loading={
            deleteFileMutation.isPending ||
            deleteMultipleFilesMutation.isPending
          }
        />
      </div>
    </Layout>
  );
};

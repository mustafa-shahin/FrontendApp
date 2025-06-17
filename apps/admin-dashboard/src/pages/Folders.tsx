import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Layout } from '../components/ui/layout/Layout';
import { PageHeader } from '../components/ui/layout/PageHeader';
import { Breadcrumbs } from '../components/ui/layout/Breadcrumbs';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Dialog } from '../components/ui/Dialog';
import { Pagination } from '../components/common/Pagination';
import { FolderModal } from '../components/folders/FolderModal';
import { FoldersListView } from '../components/folders/FoldersListView';
import { FoldersGridView } from '../components/folders/FoldersGridView';
import { FolderTreeView } from '../components/folders/FolderTreeView';
import {
  useFolders,
  useDeleteFolder,
  useFolderBreadcrumbs,
} from '../hooks/useFolders';
import { BreadcrumbItem } from '@frontend-app/types';
import { FolderDto } from '../types';
type ViewMode = 'list' | 'grid';

export const Folders: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentFolderId = searchParams.get('folderId')
    ? parseInt(searchParams.get('folderId')!)
    : undefined;

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingFolder, setEditingFolder] = useState<FolderDto | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    folder: FolderDto | null;
  }>({ isOpen: false, folder: null });
  const [showSidebar, setShowSidebar] = useState(true);

  // Data fetching
  const { data, isLoading, error, refetch } = useFolders(
    currentFolderId,
    currentPage,
    pageSize
  );

  const { data: breadcrumbsData } = useFolderBreadcrumbs(
    currentFolderId || 0,
    !!currentFolderId
  );

  // Mutations
  const deleteFolderMutation = useDeleteFolder({
    onSuccess: () => {
      setDeleteConfirmation({ isOpen: false, folder: null });
      refetch();
    },
  });

  // Handlers
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  const handleFolderOpen = (folder: FolderDto) => {
    setSearchParams({ folderId: folder.id.toString() });
    setCurrentPage(1);
  };

  const handleFolderEdit = (folder: FolderDto) => {
    setEditingFolder(folder);
  };

  const handleFolderDelete = (folder: FolderDto) => {
    setDeleteConfirmation({ isOpen: true, folder });
  };

  const handleDeleteConfirm = () => {
    if (deleteConfirmation.folder) {
      deleteFolderMutation.mutate({
        id: deleteConfirmation.folder.id,
        deleteFiles: false, // You might want to add a checkbox for this
      });
    }
  };

  const handleCreateSuccess = () => {
    refetch();
    setShowCreateModal(false);
  };

  const handleEditSuccess = () => {
    refetch();
    setEditingFolder(null);
  };

  const navigateToParent = () => {
    if (breadcrumbsData && breadcrumbsData.length > 1) {
      const parentFolder = breadcrumbsData[breadcrumbsData.length - 2];
      setSearchParams({ folderId: parentFolder.id.toString() });
    } else {
      setSearchParams({});
    }
  };

  const navigateToRoot = () => {
    setSearchParams({});
  };

  // Create breadcrumbs
  const breadcrumbs: BreadcrumbItem[] = [
    { name: 'Root', href: '/folders' },
    ...(breadcrumbsData?.map((folder) => ({
      id: folder.id,
      name: folder.name,
      href: `/folders?folderId=${folder.id}`,
    })) || []),
  ];

  return (
    <Layout>
      <div className="flex h-full">
        {/* Sidebar with folder tree */}
        {showSidebar && (
          <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex-shrink-0">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Folders
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  icon="times"
                  onClick={() => setShowSidebar(false)}
                />
              </div>
            </div>
            <div className="p-4">
              <FolderTreeView
                selectedFolderId={currentFolderId}
                onFolderSelect={(folder) => {
                  setSearchParams({ folderId: folder.id.toString() });
                }}
                className="h-96"
              />
            </div>
          </div>
        )}

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {!showSidebar && (
                  <Button
                    variant="ghost"
                    size="sm"
                    icon="bars"
                    onClick={() => setShowSidebar(true)}
                  />
                )}
                <div>
                  <PageHeader
                    title={currentFolderId ? 'Folder Contents' : 'All Folders'}
                    subtitle="Organize and manage your folder structure"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Button
                  variant="secondary"
                  icon="folder-plus"
                  onClick={() => setShowCreateModal(true)}
                >
                  New Folder
                </Button>
              </div>
            </div>

            {/* Breadcrumbs */}
            {breadcrumbs.length > 1 && <Breadcrumbs items={breadcrumbs} />}

            {/* Navigation buttons */}
            {currentFolderId && (
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  icon="home"
                  onClick={navigateToRoot}
                >
                  Root
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  icon="arrow-up"
                  onClick={navigateToParent}
                  disabled={!breadcrumbsData || breadcrumbsData.length <= 1}
                >
                  Parent Folder
                </Button>
              </div>
            )}

            {/* Filters and View Toggle */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                <div className="w-full sm:w-64">
                  <Input
                    type="text"
                    placeholder="Search folders..."
                    value={searchTerm}
                    onChange={handleSearch}
                    icon="search"
                  />
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

            {/* Folders Content */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow flex-1">
              {viewMode === 'list' ? (
                <FoldersListView
                  folders={data?.items || []}
                  loading={isLoading}
                  error={error?.message}
                  onEdit={handleFolderEdit}
                  onDelete={handleFolderDelete}
                  onOpen={handleFolderOpen}
                />
              ) : (
                <FoldersGridView
                  folders={data?.items || []}
                  loading={isLoading}
                  error={error?.message}
                  onEdit={handleFolderEdit}
                  onDelete={handleFolderDelete}
                  onOpen={handleFolderOpen}
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
          </div>
        </div>
      </div>

      {/* Create Folder Modal */}
      <FolderModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        parentFolderId={currentFolderId}
        onSuccess={handleCreateSuccess}
      />

      {/* Edit Folder Modal */}
      {editingFolder && (
        <FolderModal
          isOpen={true}
          onClose={() => setEditingFolder(null)}
          folderId={editingFolder.id}
          onSuccess={handleEditSuccess}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        isOpen={deleteConfirmation.isOpen}
        onClose={() => setDeleteConfirmation({ isOpen: false, folder: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete Folder"
        message={`Are you sure you want to delete "${deleteConfirmation.folder?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        loading={deleteFolderMutation.isPending}
      />
    </Layout>
  );
};

import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Layout } from '../components/ui/layout/Layout';
import { PageHeader } from '../components/ui/layout/PageHeader';
import { Breadcrumbs } from '../components/ui/layout/Breadcrumbs';
import { EmptyState } from '../components/ui/layout/EmptyState';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { FileGrid } from '../components/ui/files/FileGrid';
import { FileList } from '../components/ui/files/FileList';
import { FileUploadZone } from '../components/ui/files/FileUploadZone';
import { FileEditDialog } from '../components/ui/files/FileEditDialog';
import { FolderEditDialog } from '../components/ui/files/FolderEditDialog';
import { Dialog } from '../components/ui/Dialog';
import { Modal } from '../components/ui/Modal';
import { Toast } from '../components/ui/Toast';
import {
  FileDto,
  Folder,
  ViewMode,
  BreadcrumbItem,
  ContextMenuItem,
  FileType,
} from '../types';
import { useFiles } from '../hooks/useFiles';
import { useFolders } from '../hooks/useFolders';
import { useToast } from '../hooks/useToast';
import { useFileManager } from '../contexts/FileManagerContext';
import { folderService } from '../services/folder.service';

export const UpdatedFileManager: React.FC = () => {
  const { folderId } = useParams<{ folderId: string }>();
  const location = useLocation();

  const {
    viewMode,
    setViewMode,
    selectedItems,
    setSelectedItems,
    currentFolder,
    setCurrentFolder,
    searchTerm,
    setSearchTerm,
  } = useFileManager();

  const currentFolderId = folderId ? parseInt(folderId, 10) : undefined;

  // Determine file type filter based on route
  const getFileTypeFilter = (): FileType | undefined => {
    const path = location.pathname;
    if (path.includes('/images')) return FileType.Image;
    if (path.includes('/documents')) return FileType.Document;
    if (path.includes('/videos')) return FileType.Video;
    if (path.includes('/audio')) return FileType.Audio;
    return undefined;
  };

  const fileTypeFilter = getFileTypeFilter();

  // Use custom hooks
  const {
    files,
    loading: filesLoading,
    error: filesError,
    loadFiles,
    uploadFile,
    updateFile,
    deleteFile,
  } = useFiles({
    folderId: currentFolderId,
    searchTerm,
    fileType: fileTypeFilter,
  });

  const {
    folders,
    loading: foldersLoading,
    error: foldersError,
    loadFolders,
    createFolder,
    updateFolder,
    deleteFolder,
  } = useFolders(currentFolderId);

  const { toasts, showToast, hideToast } = useToast();

  // Local state
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);
  const [editingFile, setEditingFile] = useState<FileDto | null>(null);
  const [editingFolder, setEditingFolder] = useState<Folder | undefined>(
    undefined
  );
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showFolderDialog, setShowFolderDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    items: ContextMenuItem[];
  } | null>(null);

  const loading = filesLoading || foldersLoading;

  // Load current folder and breadcrumbs
  useEffect(() => {
    loadCurrentFolder();
    loadBreadcrumbs();
  }, [currentFolderId]);

  // Reload data when search term changes
  useEffect(() => {
    if (searchTerm) {
      loadFiles({ searchTerm, fileType: fileTypeFilter });
    } else {
      loadFiles({ fileType: fileTypeFilter });
    }
  }, [searchTerm, fileTypeFilter]);

  const loadCurrentFolder = async () => {
    if (currentFolderId) {
      try {
        const folder = await folderService.getFolderById(currentFolderId);
        setCurrentFolder(folder);
      } catch (error) {
        console.error('Failed to load current folder:', error);
        showToast('error', 'Failed to load folder');
      }
    } else {
      setCurrentFolder(null);
    }
  };

  const loadBreadcrumbs = async () => {
    if (!currentFolderId) {
      setBreadcrumbs([{ name: 'Root', href: '/files' }]);
      return;
    }

    try {
      const folderBreadcrumbs = await folderService.getFolderBreadcrumbs(
        currentFolderId
      );
      const breadcrumbItems: BreadcrumbItem[] = [
        { name: 'Root', href: '/files' },
        ...folderBreadcrumbs.map((folder) => ({
          id: folder.id,
          name: folder.name,
          href: `/files/folder/${folder.id}`,
        })),
      ];
      setBreadcrumbs(breadcrumbItems);
    } catch (error) {
      console.error('Failed to load breadcrumbs:', error);
    }
  };

  const handleItemSelect = (item: FileDto | Folder) => {
    setSelectedItems((prev) => {
      const isSelected = prev.some((selected) => selected.id === item.id);
      if (isSelected) {
        return prev.filter((selected) => selected.id !== item.id);
      } else {
        return [...prev, item];
      }
    });
  };

  const handleItemDoubleClick = (item: FileDto | Folder) => {
    if ('subFolders' in item) {
      // It's a folder - navigate to it
      window.location.href = `/files/folder/${item.id}`;
    } else {
      // It's a file - open edit dialog
      setEditingFile(item);
    }
  };

  const handleItemContextMenu = (
    item: FileDto | Folder,
    event: React.MouseEvent
  ) => {
    event.preventDefault();

    const contextMenuItems: ContextMenuItem[] = [
      {
        id: 'edit',
        label: 'Edit',
        icon: 'edit',
        action: () => {
          if ('subFolders' in item) {
            setEditingFolder(item);
          } else {
            setEditingFile(item);
          }
          setContextMenu(null);
        },
      },
      {
        id: 'download',
        label: 'Download',
        icon: 'download',
        action: () => {
          if ('fileSize' in item) {
            window.open(`/api/file/${item.id}/download`, '_blank');
          }
          setContextMenu(null);
        },
        disabled: 'subFolders' in item,
      },
      {
        id: 'separator1',
        label: '',
        icon: '',
        separator: true,
        action: () => {
          console.log('Separator clicked');
        },
      },
      {
        id: 'delete',
        label: 'Delete',
        icon: 'trash',
        action: () => {
          setSelectedItems([item]);
          setShowDeleteDialog(true);
          setContextMenu(null);
        },
      },
    ];

    setContextMenu({
      x: event.clientX,
      y: event.clientY,
      items: contextMenuItems,
    });
  };

  const handleFilesUpload = async (uploadFiles: File[]) => {
    try {
      showToast('info', 'Uploading files...');

      const uploadPromises = uploadFiles.map((file) =>
        uploadFile(file, { folderId: currentFolderId })
      );

      await Promise.all(uploadPromises);

      showToast(
        'success',
        `Successfully uploaded ${uploadFiles.length} file(s)`
      );
      setShowUploadModal(false);
    } catch (error) {
      console.error('Failed to upload files:', error);
      showToast('error', 'Failed to upload files');
    }
  };

  const handleCreateFolder = async (folderData: any) => {
    try {
      await createFolder({
        ...folderData,
        parentFolderId: currentFolderId,
      });
      showToast('success', 'Folder created successfully');
      setShowFolderDialog(false);
    } catch (error) {
      console.error('Failed to create folder:', error);
      showToast('error', 'Failed to create folder');
    }
  };

  const handleUpdateFolder = async (folderId: number, folderData: any) => {
    try {
      await updateFolder(folderId, folderData);
      showToast('success', 'Folder updated successfully');
      setEditingFolder(undefined);
    } catch (error) {
      console.error('Failed to update folder:', error);
      showToast('error', 'Failed to update folder');
    }
  };

  const handleUpdateFile = async (fileId: number, fileData: any) => {
    try {
      await updateFile(fileId, fileData);
      showToast('success', 'File updated successfully');
      setEditingFile(null);
    } catch (error) {
      console.error('Failed to update file:', error);
      showToast('error', 'Failed to update file');
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedItems.length === 0) return;

    try {
      const deletePromises = selectedItems.map((item) => {
        if ('fileSize' in item) {
          return deleteFile(item.id);
        } else {
          return deleteFolder(item.id, false);
        }
      });

      await Promise.all(deletePromises);

      showToast(
        'success',
        `Successfully deleted ${selectedItems.length} item(s)`
      );
      setSelectedItems([]);
      setShowDeleteDialog(false);
    } catch (error) {
      console.error('Failed to delete items:', error);
      showToast('error', 'Failed to delete items');
    }
  };

  // Close context menu when clicking elsewhere
  useEffect(() => {
    const handleClick = () => setContextMenu(null);
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  if (filesError || foldersError) {
    return (
      <Layout>
        <EmptyState
          icon="exclamation-triangle"
          title="Error Loading Files"
          description="There was an error loading your files and folders."
          action={{
            label: 'Retry',
            onClick: () => {
              loadFiles();
              loadFolders();
            },
          }}
        />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbs} />

        {/* Page Header */}
        <PageHeader
          title="File Manager"
          subtitle={
            currentFolder
              ? `Folder: ${currentFolder.name}`
              : 'All files and folders'
          }
        >
          <div className="flex items-center space-x-3">
            {/* Search */}
            <Input
              icon="search"
              placeholder="Search files and folders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />

            {/* View mode toggle */}
            <div className="flex border border-gray-300 dark:border-gray-600 rounded-md">
              <Button
                variant={viewMode === 'grid' ? 'primary' : 'ghost'}
                size="sm"
                icon="th"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              />
              <Button
                variant={viewMode === 'list' ? 'primary' : 'ghost'}
                size="sm"
                icon="list"
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
              />
            </div>

            {/* Actions */}
            <Button icon="plus" onClick={() => setShowFolderDialog(true)}>
              New Folder
            </Button>

            <Button
              variant="primary"
              icon="upload"
              onClick={() => setShowUploadModal(true)}
            >
              Upload Files
            </Button>
          </div>
        </PageHeader>

        {/* Toolbar */}
        {selectedItems.length > 0 && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-700 dark:text-blue-300">
                {selectedItems.length} item(s) selected
              </span>
              <div className="flex space-x-2">
                <Button
                  variant="danger"
                  size="sm"
                  icon="trash"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  Delete
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedItems([])}
                >
                  Clear Selection
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : files.length === 0 && folders.length === 0 ? (
            <EmptyState
              icon="folder-open"
              title="No files or folders"
              description="Start by creating a folder or uploading some files."
              action={{
                label: 'Upload Files',
                onClick: () => setShowUploadModal(true),
              }}
            />
          ) : viewMode === 'grid' ? (
            <div className="p-6">
              <FileGrid
                files={files}
                folders={folders}
                selectedItems={selectedItems}
                onItemSelect={handleItemSelect}
                onItemDoubleClick={handleItemDoubleClick}
                onItemContextMenu={handleItemContextMenu}
              />
            </div>
          ) : (
            <FileList
              files={files}
              folders={folders}
              selectedItems={selectedItems}
              onItemSelect={handleItemSelect}
              onItemDoubleClick={handleItemDoubleClick}
              onItemContextMenu={handleItemContextMenu}
            />
          )}
        </div>
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <div
          className="fixed z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg py-1 min-w-48"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          {contextMenu.items.map((item) =>
            item.separator ? (
              <hr
                key={item.id}
                className="my-1 border-gray-200 dark:border-gray-700"
              />
            ) : (
              <button
                key={item.id}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
                onClick={item.action}
                disabled={item.disabled}
              >
                <i className={`fas fa-${item.icon} w-4 h-4 mr-3`} />
                {item.label}
              </button>
            )
          )}
        </div>
      )}

      {/* Dialogs */}
      <FileEditDialog
        file={editingFile}
        isOpen={!!editingFile}
        onClose={() => setEditingFile(null)}
        onSave={(updatedFile) => handleUpdateFile(updatedFile.id, updatedFile)}
      />

      <FolderEditDialog
        folder={editingFolder}
        parentFolderId={currentFolderId}
        isOpen={showFolderDialog || !!editingFolder}
        onClose={() => {
          setShowFolderDialog(false);
          setEditingFolder(undefined);
        }}
        onSave={(folder) => {
          if (editingFolder) {
            handleUpdateFolder(folder.id, folder);
          } else {
            handleCreateFolder(folder);
          }
        }}
      />

      <Modal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        title="Upload Files"
        size="lg"
      >
        <FileUploadZone onFilesSelected={handleFilesUpload} multiple={true} />
      </Modal>

      <Dialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteSelected}
        title="Delete Items"
        message={`Are you sure you want to delete ${selectedItems.length} item(s)? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
        loading={loading}
      />

      {/* Toast Notifications */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            type={toast.type}
            message={toast.message}
            isVisible={true}
            onClose={() => hideToast(toast.id)}
            duration={toast.duration}
          />
        ))}
      </div>
    </Layout>
  );
};

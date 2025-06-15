import { useState, useEffect } from 'react';
import {
  Folder,
  CreateFolderDto,
  UpdateFolderDto,
  PagedResult,
} from '../types';
import { folderService } from '../services/folder.service';

interface UseFoldersResult {
  folders: Folder[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  loadFolders: (parentId?: number) => Promise<void>;
  createFolder: (data: CreateFolderDto) => Promise<Folder>;
  updateFolder: (id: number, data: UpdateFolderDto) => Promise<Folder>;
  deleteFolder: (id: number, deleteFiles?: boolean) => Promise<void>;
  refreshFolders: () => Promise<void>;
}

export const useFolders = (parentFolderId?: number): UseFoldersResult => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentParentId, setCurrentParentId] = useState(parentFolderId);

  const loadFolders = async (parentId?: number) => {
    setLoading(true);
    setError(null);

    try {
      const id = parentId !== undefined ? parentId : currentParentId;
      setCurrentParentId(id);

      const result = await folderService.getFolders(id);
      setFolders(result.items);
      setTotalCount(result.totalCount);
    } catch (err: any) {
      setError(err.message || 'Failed to load folders');
      console.error('Failed to load folders:', err);
    } finally {
      setLoading(false);
    }
  };

  const createFolder = async (data: CreateFolderDto): Promise<Folder> => {
    const result = await folderService.createFolder(data);

    // Add the new folder to the current list if it belongs to the current parent
    if (data.parentFolderId === currentParentId) {
      setFolders((prev) => [...prev, result]);
      setTotalCount((prev) => prev + 1);
    }

    return result;
  };

  const updateFolder = async (
    id: number,
    data: UpdateFolderDto
  ): Promise<Folder> => {
    const result = await folderService.updateFolder(id, data);

    // Update the folder in the current list
    setFolders((prev) => prev.map((f) => (f.id === id ? result : f)));

    return result;
  };

  const deleteFolder = async (
    id: number,
    deleteFiles = false
  ): Promise<void> => {
    await folderService.deleteFolder(id, deleteFiles);

    // Remove the folder from the current list
    setFolders((prev) => prev.filter((f) => f.id !== id));
    setTotalCount((prev) => prev - 1);
  };

  const refreshFolders = async () => {
    await loadFolders(currentParentId);
  };

  useEffect(() => {
    loadFolders();
  }, []);

  return {
    folders,
    loading,
    error,
    totalCount,
    loadFolders,
    createFolder,
    updateFolder,
    deleteFolder,
    refreshFolders,
  };
};

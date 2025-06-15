import { useState, useEffect } from 'react';
import { FileEntity, FileSearchDto, PagedResult } from '../types';
import { fileService } from '../services/file.service';

interface UseFilesResult {
  files: FileEntity[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  page: number;
  pageSize: number;
  loadFiles: (searchParams?: Partial<FileSearchDto>) => Promise<void>;
  uploadFile: (file: File, options?: any) => Promise<FileEntity>;
  updateFile: (id: number, data: any) => Promise<FileEntity>;
  deleteFile: (id: number) => Promise<void>;
  refreshFiles: () => Promise<void>;
}

export const useFiles = (
  initialParams?: Partial<FileSearchDto>
): UseFilesResult => {
  const [files, setFiles] = useState<FileEntity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchParams, setSearchParams] = useState<Partial<FileSearchDto>>(
    initialParams || {}
  );

  const loadFiles = async (newParams?: Partial<FileSearchDto>) => {
    setLoading(true);
    setError(null);

    try {
      const params = { ...searchParams, ...newParams };
      setSearchParams(params);

      const result = await fileService.getFiles(params);
      setFiles(result.items);
      setTotalCount(result.totalCount);
      setPage(result.page);
      setPageSize(result.pageSize);
    } catch (err: any) {
      setError(err.message || 'Failed to load files');
      console.error('Failed to load files:', err);
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (file: File, options?: any): Promise<FileEntity> => {
    const uploadData = {
      file,
      isPublic: false,
      generateThumbnail: true,
      tags: {},
      ...options,
    };

    const result = await fileService.uploadFile(uploadData);

    // Refresh the file list after upload
    await refreshFiles();

    return result;
  };

  const updateFile = async (id: number, data: any): Promise<FileEntity> => {
    const result = await fileService.updateFile(id, data);

    // Update the file in the current list
    setFiles((prev) => prev.map((f) => (f.id === id ? result : f)));

    return result;
  };

  const deleteFile = async (id: number): Promise<void> => {
    await fileService.deleteFile(id);

    // Remove the file from the current list
    setFiles((prev) => prev.filter((f) => f.id !== id));
    setTotalCount((prev) => prev - 1);
  };

  const refreshFiles = async () => {
    await loadFiles(searchParams);
  };

  useEffect(() => {
    loadFiles();
  }, []);

  return {
    files,
    loading,
    error,
    totalCount,
    page,
    pageSize,
    loadFiles,
    uploadFile,
    updateFile,
    deleteFile,
    refreshFiles,
  };
};

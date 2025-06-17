import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fileService } from '../services/file.service';
import {
  FileUploadDto,
  UpdateFileDto,
  FileSearchDto,
  MultipleFileUploadDto,
  MoveFileDto,
  CopyFileDto,
  FileType,
} from '../types';

// Query Keys
export const fileKeys = {
  all: ['files'] as const,
  lists: () => [...fileKeys.all, 'list'] as const,
  list: (
    page: number,
    pageSize: number,
    folderId?: number,
    search?: string,
    fileType?: FileType
  ) =>
    [
      ...fileKeys.lists(),
      { page, pageSize, folderId, search, fileType },
    ] as const,
  details: () => [...fileKeys.all, 'detail'] as const,
  detail: (id: number) => [...fileKeys.details(), id] as const,
  recent: (count: number) => [...fileKeys.all, 'recent', count] as const,
  statistics: () => [...fileKeys.all, 'statistics'] as const,
};

// Queries
export const useFiles = (
  page = 1,
  pageSize = 20,
  folderId?: number,
  search?: string,
  fileType?: FileType
) => {
  return useQuery({
    queryKey: fileKeys.list(page, pageSize, folderId, search, fileType),
    queryFn: () =>
      fileService.getFiles(page, pageSize, folderId, search, fileType),
    placeholderData: (previousData) => previousData,
  });
};

export const useFile = (id: number, enabled = true) => {
  return useQuery({
    queryKey: fileKeys.detail(id),
    queryFn: () => fileService.getFileById(id),
    enabled: enabled && id > 0,
  });
};

export const useRecentFiles = (count = 10) => {
  return useQuery({
    queryKey: fileKeys.recent(count),
    queryFn: () => fileService.getRecentFiles(count),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useFileStatistics = () => {
  return useQuery({
    queryKey: fileKeys.statistics(),
    queryFn: () => fileService.getFileStatistics(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useSearchFiles = () => {
  return useMutation({
    mutationFn: (searchData: FileSearchDto) =>
      fileService.searchFiles(searchData),
  });
};

// Mutations
interface MutationOptions {
  onSuccess?: (data?: any) => void;
  onError?: (error: Error) => void;
}

export const useUploadFile = (options?: MutationOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (uploadData: FileUploadDto) =>
      fileService.uploadFile(uploadData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: fileKeys.lists() });
      queryClient.invalidateQueries({ queryKey: fileKeys.statistics() });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
};

export const useUploadMultipleFiles = (options?: MutationOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (uploadData: MultipleFileUploadDto) =>
      fileService.uploadMultipleFiles(uploadData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: fileKeys.lists() });
      queryClient.invalidateQueries({ queryKey: fileKeys.statistics() });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
};

export const useUpdateFile = (options?: MutationOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      updateData,
    }: {
      id: number;
      updateData: UpdateFileDto;
    }) => fileService.updateFile(id, updateData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: fileKeys.lists() });
      queryClient.setQueryData(fileKeys.detail(variables.id), data);
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
};

export const useDeleteFile = (options?: MutationOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => fileService.deleteFile(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: fileKeys.lists() });
      queryClient.invalidateQueries({ queryKey: fileKeys.statistics() });
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
};

export const useDeleteMultipleFiles = (options?: MutationOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (fileIds: number[]) => fileService.deleteMultipleFiles(fileIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: fileKeys.lists() });
      queryClient.invalidateQueries({ queryKey: fileKeys.statistics() });
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
};

export const useMoveFile = (options?: MutationOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (moveData: MoveFileDto) => fileService.moveFile(moveData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: fileKeys.lists() });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
};

export const useCopyFile = (options?: MutationOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (copyData: CopyFileDto) => fileService.copyFile(copyData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: fileKeys.lists() });
      queryClient.invalidateQueries({ queryKey: fileKeys.statistics() });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
};

export const useBulkUpdateFiles = (options?: MutationOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      fileIds,
      updateData,
    }: {
      fileIds: number[];
      updateData: UpdateFileDto;
    }) => fileService.bulkUpdateFiles(fileIds, updateData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: fileKeys.lists() });
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
};

export const useBulkMoveFiles = (options?: MutationOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      fileIds,
      destinationFolderId,
    }: {
      fileIds: number[];
      destinationFolderId: number | null;
    }) => fileService.bulkMoveFiles(fileIds, destinationFolderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: fileKeys.lists() });
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
};

export const useBulkCopyFiles = (options?: MutationOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      fileIds,
      destinationFolderId,
    }: {
      fileIds: number[];
      destinationFolderId: number | null;
    }) => fileService.bulkCopyFiles(fileIds, destinationFolderId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: fileKeys.lists() });
      queryClient.invalidateQueries({ queryKey: fileKeys.statistics() });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
};

export const useGenerateThumbnail = (options?: MutationOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (fileId: number) => fileService.generateThumbnail(fileId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: fileKeys.detail(variables) });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
};

export const useGenerateDownloadToken = (options?: MutationOptions) => {
  return useMutation({
    mutationFn: (fileId: number) => fileService.generateDownloadToken(fileId),
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
};

import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query';
import { folderService } from '../services/folder.service';
import {
  CreateFolderDto,
  UpdateFolderDto,
  MoveFolderDto,
  CopyFolderDto,
} from '../types';
// Query Keys
export const folderKeys = {
  all: ['folders'] as const,
  lists: () => [...folderKeys.all, 'list'] as const,
  list: (parentFolderId?: number, page?: number, pageSize?: number) =>
    [...folderKeys.lists(), { parentFolderId, page, pageSize }] as const,
  details: () => [...folderKeys.all, 'detail'] as const,
  detail: (id: number) => [...folderKeys.details(), id] as const,
  tree: (rootFolderId?: number) =>
    [...folderKeys.all, 'tree', rootFolderId] as const,
  breadcrumbs: (id: number) => [...folderKeys.all, 'breadcrumbs', id] as const,
  statistics: (id: number) => [...folderKeys.all, 'statistics', id] as const,
};

// Queries
export const useFolders = (
  parentFolderId?: number,
  page = 1,
  pageSize = 20
) => {
  return useQuery({
    queryKey: folderKeys.list(parentFolderId, page, pageSize),
    queryFn: () => folderService.getFolders(parentFolderId, page, pageSize),
    placeholderData: keepPreviousData,
  });
};

export const useAllFolders = (parentFolderId?: number) => {
  return useQuery({
    queryKey: [...folderKeys.all, 'all', parentFolderId],
    queryFn: () => folderService.getAllFolders(parentFolderId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useFolder = (id: number, enabled = true) => {
  return useQuery({
    queryKey: folderKeys.detail(id),
    queryFn: () => folderService.getFolderById(id),
    enabled: enabled && id > 0,
  });
};

export const useFolderTree = (rootFolderId?: number) => {
  return useQuery({
    queryKey: folderKeys.tree(rootFolderId),
    queryFn: () => folderService.getFolderTree(rootFolderId),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useFolderBreadcrumbs = (id: number, enabled = true) => {
  return useQuery({
    queryKey: folderKeys.breadcrumbs(id),
    queryFn: () => folderService.getFolderBreadcrumbs(id),
    enabled: enabled && id > 0,
  });
};

export const useFolderStatistics = (id: number, enabled = true) => {
  return useQuery({
    queryKey: folderKeys.statistics(id),
    queryFn: () => folderService.getFolderStatistics(id),
    enabled: enabled && id > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useSearchFolders = () => {
  return useMutation({
    mutationFn: (searchTerm: string) => folderService.searchFolders(searchTerm),
  });
};

// Mutations
interface MutationOptions {
  onSuccess?: (data?: any) => void;
  onError?: (error: Error) => void;
}

export const useCreateFolder = (options?: MutationOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (createData: CreateFolderDto) =>
      folderService.createFolder(createData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: folderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: folderKeys.tree() });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
};

export const useUpdateFolder = (options?: MutationOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      updateData,
    }: {
      id: number;
      updateData: UpdateFolderDto;
    }) => folderService.updateFolder(id, updateData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: folderKeys.lists() });
      queryClient.setQueryData(folderKeys.detail(variables.id), data);
      queryClient.invalidateQueries({ queryKey: folderKeys.tree() });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
};

export const useDeleteFolder = (options?: MutationOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, deleteFiles }: { id: number; deleteFiles?: boolean }) =>
      folderService.deleteFolder(id, deleteFiles),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: folderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: folderKeys.tree() });
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
};

export const useMoveFolder = (options?: MutationOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (moveData: MoveFolderDto) => folderService.moveFolder(moveData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: folderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: folderKeys.tree() });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
};

export const useRenameFolder = (options?: MutationOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, newName }: { id: number; newName: string }) =>
      folderService.renameFolder(id, newName),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: folderKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: folderKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: folderKeys.tree() });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
};

export const useCopyFolder = (options?: MutationOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (copyData: CopyFolderDto) => folderService.copyFolder(copyData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: folderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: folderKeys.tree() });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
};

export const useValidateFolderName = () => {
  return useMutation({
    mutationFn: ({
      name,
      parentFolderId,
      excludeFolderId,
    }: {
      name: string;
      parentFolderId?: number;
      excludeFolderId?: number;
    }) =>
      folderService.validateFolderName(name, parentFolderId, excludeFolderId),
  });
};

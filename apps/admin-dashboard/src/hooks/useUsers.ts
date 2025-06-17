import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../services/user.service';
import {
  CreateUserDto,
  UpdateUserDto,
  ChangePasswordDto,
} from '@frontend-app/types';

// Query Keys
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (page: number, pageSize: number, search?: string) =>
    [...userKeys.lists(), { page, pageSize, search }] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: number) => [...userKeys.details(), id] as const,
};

// Queries
export const useUsers = (page = 1, pageSize = 20, search?: string) => {
  return useQuery({
    queryKey: userKeys.list(page, pageSize, search),
    queryFn: () => userService.getUsers(page, pageSize, search),
    placeholderData: (previousData) => previousData,
  });
};

export const useUser = (id: number, enabled = true) => {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => userService.getUserById(id),
    enabled: enabled && id > 0,
  });
};

// Mutations
interface MutationOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const useCreateUser = (options?: MutationOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: CreateUserDto) => userService.createUser(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
};

export const useUpdateUser = (options?: MutationOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, userData }: { id: number; userData: UpdateUserDto }) =>
      userService.updateUser(id, userData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.setQueryData(userKeys.detail(variables.id), data);
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
};

export const useDeleteUser = (options?: MutationOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => userService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
};

export const useActivateUser = (options?: MutationOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => userService.activateUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
};

export const useDeactivateUser = (options?: MutationOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => userService.deactivateUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
};

export const useLockUser = (options?: MutationOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => userService.lockUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
};

export const useUnlockUser = (options?: MutationOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => userService.unlockUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
};

export const useChangePassword = (options?: MutationOptions) => {
  return useMutation({
    mutationFn: ({
      id,
      passwordData,
    }: {
      id: number;
      passwordData: ChangePasswordDto;
    }) => userService.changePassword(id, passwordData),
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
};

export const useUpdateUserAvatar = (options?: MutationOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      avatarFileId,
    }: {
      id: number;
      avatarFileId: number | null;
    }) => userService.updateUserAvatar(id, avatarFileId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.setQueryData(userKeys.detail(variables.id), data);
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
};

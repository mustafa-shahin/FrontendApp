import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
  UseMutationOptions,
} from '@tanstack/react-query';
import { UserDto, PagedResult } from '@frontend-app/types';
import { userService } from '../services/user.service';
import {
  CreateUserFormData,
  UpdateUserFormData,
  ChangePasswordFormData,
} from '../schemas';

// Query Keys
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (page: number, pageSize: number, search?: string) =>
    [...userKeys.lists(), { page, pageSize, search }] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: number) => [...userKeys.details(), id] as const,
};

// Query Hooks
export function useUsers(
  page = 1,
  pageSize = 20,
  search?: string,
  options?: UseQueryOptions<PagedResult<UserDto>, Error>
) {
  return useQuery({
    queryKey: userKeys.list(page, pageSize, search),
    queryFn: () => userService.getUsers(page, pageSize, search),
    staleTime: 30000, // 30 seconds
    ...options,
  });
}

export function useUser(id: number, options?: UseQueryOptions<UserDto, Error>) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => userService.getUserById(id),
    enabled: !!id,
    staleTime: 300000, // 5 minutes
    ...options,
  });
}

// Mutation Hooks
export function useCreateUser(
  options?: UseMutationOptions<UserDto, Error, CreateUserFormData>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: CreateUserFormData) =>
      userService.createUser(userData),
    onSuccess: (data) => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      // Set the new user data in the cache
      queryClient.setQueryData(userKeys.detail(data.id), data);
    },
    ...options,
  });
}

export function useUpdateUser(
  options?: UseMutationOptions<
    UserDto,
    Error,
    { id: number; userData: UpdateUserFormData }
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      userData,
    }: {
      id: number;
      userData: UpdateUserFormData;
    }) => userService.updateUser(id, userData),
    onSuccess: (data, { id }) => {
      // Update the user detail cache
      queryClient.setQueryData(userKeys.detail(id), data);
      // Invalidate users list to refresh any list views
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
    ...options,
  });
}

export function useDeleteUser(
  options?: UseMutationOptions<void, Error, number>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => userService.deleteUser(id),
    onSuccess: (_, id) => {
      // Remove the user from cache
      queryClient.removeQueries({ queryKey: userKeys.detail(id) });
      // Invalidate users list
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
    ...options,
  });
}

export function useActivateUser(
  options?: UseMutationOptions<void, Error, number>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => userService.activateUser(id),
    onSuccess: (_, id) => {
      // Invalidate specific user and lists
      queryClient.invalidateQueries({ queryKey: userKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
    ...options,
  });
}

export function useDeactivateUser(
  options?: UseMutationOptions<void, Error, number>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => userService.deactivateUser(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: userKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
    ...options,
  });
}

export function useLockUser(options?: UseMutationOptions<void, Error, number>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => userService.lockUser(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: userKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
    ...options,
  });
}

export function useUnlockUser(
  options?: UseMutationOptions<void, Error, number>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => userService.unlockUser(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: userKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
    ...options,
  });
}

export function useChangePassword(
  options?: UseMutationOptions<
    void,
    Error,
    { id: number; passwordData: ChangePasswordFormData }
  >
) {
  return useMutation({
    mutationFn: ({ id, passwordData }) =>
      userService.changePassword(id, passwordData),
    ...options,
  });
}

export function useResetPassword(
  options?: UseMutationOptions<void, Error, number>
) {
  return useMutation({
    mutationFn: (id: number) => userService.resetPassword(id),
    ...options,
  });
}

export function useUpdateUserPreferences(
  options?: UseMutationOptions<
    UserDto,
    Error,
    { id: number; preferences: Record<string, any> }
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, preferences }) =>
      userService.updateUserPreferences(id, preferences),
    onSuccess: (data, { id }) => {
      queryClient.setQueryData(userKeys.detail(id), data);
    },
    ...options,
  });
}

export function useSendEmailVerification(
  options?: UseMutationOptions<void, Error, number>
) {
  return useMutation({
    mutationFn: (id: number) => userService.sendEmailVerification(id),
    ...options,
  });
}

export function useUpdateUserAvatar(
  options?: UseMutationOptions<
    UserDto,
    Error,
    { id: number; avatarFileId: number | null }
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, avatarFileId }) =>
      userService.updateUserAvatar(id, avatarFileId),
    onSuccess: (data, { id }) => {
      queryClient.setQueryData(userKeys.detail(id), data);
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
    ...options,
  });
}

export function useRemoveUserAvatar(
  options?: UseMutationOptions<UserDto, Error, number>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => userService.removeUserAvatar(id),
    onSuccess: (data, id) => {
      queryClient.setQueryData(userKeys.detail(id), data);
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
    ...options,
  });
}

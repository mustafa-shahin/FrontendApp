import { useToast } from '../contexts/ToastContext';
import {
  useCreateUser as useCreateUserBase,
  useUpdateUser as useUpdateUserBase,
  useDeleteUser as useDeleteUserBase,
  useActivateUser as useActivateUserBase,
  useDeactivateUser as useDeactivateUserBase,
  useLockUser as useLockUserBase,
  useUnlockUser as useUnlockUserBase,
} from './useUsers';

interface MutationOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const useCreateUserWithToast = (options?: MutationOptions) => {
  const { showToast } = useToast();

  return useCreateUserBase({
    onSuccess: () => {
      showToast('success', 'User created successfully');
      options?.onSuccess?.();
    },
    onError: (error) => {
      showToast('error', `Failed to create user: ${error.message}`);
      options?.onError?.(error);
    },
  });
};

export const useUpdateUserWithToast = (options?: MutationOptions) => {
  const { showToast } = useToast();

  return useUpdateUserBase({
    onSuccess: () => {
      showToast('success', 'User updated successfully');
      options?.onSuccess?.();
    },
    onError: (error) => {
      showToast('error', `Failed to update user: ${error.message}`);
      options?.onError?.(error);
    },
  });
};

export const useDeleteUserWithToast = (options?: MutationOptions) => {
  const { showToast } = useToast();

  return useDeleteUserBase({
    onSuccess: () => {
      showToast('success', 'User deleted successfully');
      options?.onSuccess?.();
    },
    onError: (error) => {
      showToast('error', `Failed to delete user: ${error.message}`);
      options?.onError?.(error);
    },
  });
};

export const useActivateUserWithToast = (options?: MutationOptions) => {
  const { showToast } = useToast();

  return useActivateUserBase({
    onSuccess: () => {
      showToast('success', 'User activated successfully');
      options?.onSuccess?.();
    },
    onError: (error) => {
      showToast('error', `Failed to activate user: ${error.message}`);
      options?.onError?.(error);
    },
  });
};

export const useDeactivateUserWithToast = (options?: MutationOptions) => {
  const { showToast } = useToast();

  return useDeactivateUserBase({
    onSuccess: () => {
      showToast('warning', 'User deactivated successfully');
      options?.onSuccess?.();
    },
    onError: (error) => {
      showToast('error', `Failed to deactivate user: ${error.message}`);
      options?.onError?.(error);
    },
  });
};

export const useLockUserWithToast = (options?: MutationOptions) => {
  const { showToast } = useToast();

  return useLockUserBase({
    onSuccess: () => {
      showToast('warning', 'User locked successfully');
      options?.onSuccess?.();
    },
    onError: (error) => {
      showToast('error', `Failed to lock user: ${error.message}`);
      options?.onError?.(error);
    },
  });
};

export const useUnlockUserWithToast = (options?: MutationOptions) => {
  const { showToast } = useToast();

  return useUnlockUserBase({
    onSuccess: () => {
      showToast('success', 'User unlocked successfully');
      options?.onSuccess?.();
    },
    onError: (error) => {
      showToast('error', `Failed to unlock user: ${error.message}`);
      options?.onError?.(error);
    },
  });
};

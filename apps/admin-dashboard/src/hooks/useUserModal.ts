import { useState, useCallback } from 'react';

interface UseUserModalReturn {
  isOpen: boolean;
  userId: number | null;
  openCreateModal: () => void;
  openEditModal: (id: number) => void;
  closeModal: () => void;
}

export const useUserModal = (): UseUserModalReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);

  const openCreateModal = useCallback(() => {
    setUserId(null);
    setIsOpen(true);
  }, []);

  const openEditModal = useCallback((id: number) => {
    setUserId(id);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setUserId(null);
  }, []);

  return {
    isOpen,
    userId,
    openCreateModal,
    openEditModal,
    closeModal,
  };
};

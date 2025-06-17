import { useState } from 'react';

export const useUserModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);

  const openCreateModal = () => {
    setUserId(null);
    setIsOpen(true);
  };

  const openEditModal = (id: number) => {
    setUserId(id);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setUserId(null);
  };

  return {
    isOpen,
    userId,
    openCreateModal,
    openEditModal,
    closeModal,
  };
};

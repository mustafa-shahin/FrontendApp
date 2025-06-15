import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'danger';
  loading?: boolean;
  children?: React.ReactNode;
}

export const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
  loading = false,
  children,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="space-y-4">
        {message && (
          <p className="text-gray-600 dark:text-gray-300">{message}</p>
        )}

        {children}

        <div className="flex justify-end space-x-3">
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            {cancelText}
          </Button>

          {onConfirm && (
            <Button
              variant={variant === 'danger' ? 'danger' : 'primary'}
              onClick={onConfirm}
              loading={loading}
            >
              {confirmText}
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { EntityModal } from '../ui/EntityModal';
import { FormGenerator, getFolderFormFields } from '../forms/FormGenerator';
import {
  useCreateFolder,
  useUpdateFolder,
  useFolder,
  useAllFolders,
} from '../../hooks/useFolders';
import {
  createFolderSchema,
  updateFolderSchema,
  CreateFolderFormData,
  UpdateFolderFormData,
} from '../../schemas';
import { CreateFolderDto, UpdateFolderDto } from '../../types';

interface FolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  folderId?: number | null;
  parentFolderId?: number | null;
  onSuccess?: () => void;
}

export const FolderModal: React.FC<FolderModalProps> = ({
  isOpen,
  onClose,
  folderId,
  parentFolderId,
  onSuccess,
}) => {
  const isEdit = !!folderId;

  // Form setup
  const form = useForm<CreateFolderFormData | UpdateFolderFormData>({
    resolver: zodResolver(isEdit ? updateFolderSchema : createFolderSchema),
    defaultValues: {
      name: '',
      description: '',
      folderType: 0,
      isPublic: false,
      metadata: {},
      parentFolderId: parentFolderId || null,
    },
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = form;

  // Queries and mutations
  const { data: folder, isLoading: folderLoading } = useFolder(
    folderId || 0,
    isEdit
  );
  const { data: foldersData } = useAllFolders();

  const createFolderMutation = useCreateFolder({
    onSuccess: () => {
      onSuccess?.();
      onClose();
      reset();
    },
  });

  const updateFolderMutation = useUpdateFolder({
    onSuccess: () => {
      onSuccess?.();
      onClose();
    },
  });

  // Load folder data for editing
  useEffect(() => {
    if (isEdit && folder) {
      reset({
        id: folder.id,
        name: folder.name,
        description: folder.description || '',
        folderType: folder.folderType,
        isPublic: folder.isPublic,
        metadata: folder.metadata || {},
        parentFolderId: folder.parentFolderId,
      });
    } else if (!isEdit) {
      reset({
        name: '',
        description: '',
        folderType: 0,
        isPublic: false,
        metadata: {},
        parentFolderId: parentFolderId || null,
      });
    }
  }, [folder, isEdit, reset, parentFolderId]);

  const onSubmit = async (
    data: CreateFolderFormData | UpdateFolderFormData
  ) => {
    try {
      if (isEdit) {
        await updateFolderMutation.mutateAsync({
          id: folderId!,
          updateData: data as UpdateFolderDto,
        });
      } else {
        await createFolderMutation.mutateAsync(data as CreateFolderDto);
      }
    } catch (error) {
      console.error('Error saving folder:', error);
    }
  };

  // Create parent folder options (excluding current folder and its children)
  const parentFolderOptions =
    foldersData
      ?.filter((f) => {
        if (isEdit && folderId) {
          // Exclude current folder and any of its descendants
          return f.id !== folderId && !f.path.includes(`/${folderId}/`);
        }
        return true;
      })
      .map((folder) => ({
        value: folder.id,
        label: `${folder.path} (${folder.name})`,
      })) || [];

  // Enhanced form fields with parent folder selection
  const formFields = [
    ...getFolderFormFields(),
    {
      name: 'parentFolderId',
      label: 'Parent Folder',
      type: 'select' as const,
      options: [{ value: '', label: 'Root Folder' }, ...parentFolderOptions],
      description: 'Select a parent folder to organize this folder',
    },
  ];

  return (
    <EntityModal
      isOpen={isOpen}
      onClose={onClose}
      onSave={handleSubmit(onSubmit)}
      title={isEdit ? 'Edit Folder' : 'Create Folder'}
      loading={folderLoading}
      saving={
        isSubmitting ||
        createFolderMutation.isPending ||
        updateFolderMutation.isPending
      }
      size="lg"
      saveLabel={isEdit ? 'Update Folder' : 'Create Folder'}
    >
      <FormGenerator form={form} fields={formFields} />
    </EntityModal>
  );
};

// apps/admin-dashboard/src/components/folders/FolderTreeView.tsx

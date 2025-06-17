import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { EntityModal } from '../ui/EntityModal';
import { FormGenerator, getFileEditFormFields } from '../forms/FormGenerator';
import { useUpdateFile } from '../../hooks/useFiles';
import { useFolders } from '../../hooks/useFolders';
import { updateFileSchema, UpdateFileFormData } from '../../schemas';
import { FileDto, UpdateFileDto } from '../../types';

interface FileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  file: FileDto;
  onSuccess?: () => void;
}

export const FileEditModal: React.FC<FileEditModalProps> = ({
  isOpen,
  onClose,
  file,
  onSuccess,
}) => {
  // Form setup
  const form = useForm<UpdateFileFormData>({
    resolver: zodResolver(updateFileSchema),
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = form;

  // Fetch folders for selection
  const { data: foldersData } = useFolders();

  // Mutation
  const updateFileMutation = useUpdateFile({
    onSuccess: () => {
      onSuccess?.();
      onClose();
    },
  });

  // Load file data
  useEffect(() => {
    if (file) {
      reset({
        id: file.id,
        description: file.description || '',
        alt: file.alt || '',
        isPublic: file.isPublic,
        folderId: file.folderId,
        tags: file.tags || {},
      });
    }
  }, [file, reset]);

  const onSubmit = async (data: UpdateFileFormData) => {
    try {
      const updateData: UpdateFileDto = {
        description: data.description,
        alt: data.alt,
        isPublic: data.isPublic,
        folderId: data.folderId ?? undefined,
        tags: data.tags,
      };

      await updateFileMutation.mutateAsync({
        id: file.id,
        updateData,
      });
    } catch (error) {
      console.error('Error updating file:', error);
    }
  };

  const folderOptions =
    foldersData?.items?.map((folder) => ({
      value: folder.id,
      label: folder.name,
    })) || [];

  // Enhanced form fields with folder selection
  const formFields = [
    ...getFileEditFormFields(),
    {
      name: 'folderId',
      label: 'Folder',
      type: 'select' as const,
      options: [{ value: '', label: 'Root Folder' }, ...folderOptions],
      description: 'Move file to a different folder',
    },
  ];

  return (
    <EntityModal
      isOpen={isOpen}
      onClose={onClose}
      onSave={handleSubmit(onSubmit)}
      title={`Edit ${file.originalFileName}`}
      saving={isSubmitting || updateFileMutation.isPending}
      size="lg"
      saveLabel="Update File"
    >
      <div className="space-y-6">
        {/* File Preview */}
        <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
            {file.contentType.startsWith('image/') ? (
              <img
                src={`/api/file/${file.id}/thumbnail`}
                alt={file.originalFileName}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <i className="fas fa-file text-gray-400 text-2xl" />
            )}
          </div>
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white">
              {file.originalFileName}
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {file.contentType} • {(file.fileSize / 1024 / 1024).toFixed(2)} MB
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Created: {new Date(file.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Form Fields */}
        <FormGenerator form={form} fields={formFields} />
      </div>
    </EntityModal>
  );
};

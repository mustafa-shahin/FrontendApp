import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { EntityModal } from '../ui/EntityModal';
import { FormGenerator, getFileUploadFormFields } from '../forms/FormGenerator';
import { useUploadFile, useUploadMultipleFiles } from '../../hooks/useFiles';
import { useFolders } from '../../hooks/useFolders';
import { fileUploadSchema, FileUploadFormData } from '../../schemas';
import { FileUploadDto, MultipleFileUploadDto } from '../../types';

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  folderId?: number | null;
}

export const FileUploadModal: React.FC<FileUploadModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  folderId,
}) => {
  const [uploadMode, setUploadMode] = useState<'single' | 'multiple'>('single');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  // Form setup
  const form = useForm<FileUploadFormData>({
    resolver: zodResolver(fileUploadSchema),
    defaultValues: {
      isPublic: false,
      generateThumbnail: true,
      tags: {},
    },
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = form;

  // Fetch folders for selection
  const { data: foldersData } = useFolders();

  // Mutations
  const uploadSingleMutation = useUploadFile({
    onSuccess: () => {
      onSuccess?.();
      onClose();
      reset();
    },
  });

  const uploadMultipleMutation = useUploadMultipleFiles({
    onSuccess: () => {
      onSuccess?.();
      onClose();
      reset();
      setSelectedFiles([]);
    },
  });

  const onSubmit = async (data: FileUploadFormData) => {
    try {
      if (uploadMode === 'single' && data.file) {
        const uploadData: FileUploadDto = {
          file: data.file,
          description: data.description,
          alt: data.alt,
          folderId: folderId || undefined,
          isPublic: data.isPublic,
          generateThumbnail: data.generateThumbnail,
          tags: data.tags,
        };
        await uploadSingleMutation.mutateAsync(uploadData);
      } else if (uploadMode === 'multiple' && selectedFiles.length > 0) {
        const uploadData: MultipleFileUploadDto = {
          files: selectedFiles,
          folderId: folderId || null,
          isPublic: data.isPublic,
          generateThumbnails: data.generateThumbnail,
        };
        await uploadMultipleMutation.mutateAsync(uploadData);
      }
    } catch (error) {
      console.error('Error uploading files:', error);
    }
  };

  const handleMultipleFileSelect = (files: File[] | null) => {
    setSelectedFiles(files || []);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  const folderOptions =
    foldersData?.items?.map((folder) => ({
      value: folder.id,
      label: folder.name,
    })) || [];

  // Enhanced form fields with folder selection
  const formFields = [
    ...getFileUploadFormFields(),
    {
      name: 'folderId',
      label: 'Folder',
      type: 'select' as const,
      options: [{ value: '', label: 'Root Folder' }, ...folderOptions],
      description: 'Select a folder to organize your file',
    },
  ];

  // Override file field for multiple upload mode
  if (uploadMode === 'multiple') {
    const fileFieldIndex = formFields.findIndex((f) => f.name === 'file');
    if (fileFieldIndex !== -1) {
      formFields[fileFieldIndex] = {
        ...formFields[fileFieldIndex],
        multiple: true,
        hidden: true, // Hide the form field, we'll use custom UI
      };
    }
  }

  return (
    <EntityModal
      isOpen={isOpen}
      onClose={onClose}
      onSave={handleSubmit(onSubmit)}
      title="Upload Files"
      saving={
        isSubmitting ||
        uploadSingleMutation.isPending ||
        uploadMultipleMutation.isPending
      }
      size="lg"
      saveLabel="Upload"
    >
      <div className="space-y-6">
        {/* Upload Mode Toggle */}
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Upload Mode:
          </label>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => setUploadMode('single')}
              className={`px-3 py-1 rounded text-sm font-medium ${
                uploadMode === 'single'
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
              }`}
            >
              Single File
            </button>
            <button
              type="button"
              onClick={() => setUploadMode('multiple')}
              className={`px-3 py-1 rounded text-sm font-medium ${
                uploadMode === 'multiple'
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
              }`}
            >
              Multiple Files
            </button>
          </div>
        </div>

        {/* Multiple File Upload UI */}
        {uploadMode === 'multiple' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Files
              </label>
              <input
                type="file"
                multiple
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  handleMultipleFileSelect(files);
                }}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            {/* Selected Files List */}
            {selectedFiles.length > 0 && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Selected Files ({selectedFiles.length})
                </label>
                <div className="max-h-40 overflow-y-auto space-y-2">
                  {selectedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded"
                    >
                      <div className="flex items-center space-x-2">
                        <i className="fas fa-file text-gray-400" />
                        <span className="text-sm text-gray-900 dark:text-white">
                          {file.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <i className="fas fa-times" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Form Fields */}
        <FormGenerator form={form} fields={formFields} />
      </div>
    </EntityModal>
  );
};

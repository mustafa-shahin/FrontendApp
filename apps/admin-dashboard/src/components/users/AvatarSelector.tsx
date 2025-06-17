import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { useFiles, useUploadFile } from '../../hooks/useFiles';
import { FileType, UserDto } from '@frontend-app/types';
import { fileService } from '../../services/file.service';

interface AvatarSelectorProps {
  selectedFileId: number | null;
  onFileSelect: (fileId: number | null) => void;
  currentUser?: UserDto;
}

export const AvatarSelector: React.FC<AvatarSelectorProps> = ({
  selectedFileId,
  onFileSelect,
  currentUser,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { data: filesData = [], isLoading } = useFiles(
    1,
    20,
    undefined,
    searchTerm,
    FileType.Image
  );

  const uploadMutation = useUploadFile({
    onSuccess: (data) => {
      onFileSelect(data.id);
      setIsModalOpen(false);
      setSelectedFile(null);
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      uploadMutation.mutate({
        file: selectedFile,
        description: 'User avatar',
        isPublic: false,
        generateThumbnail: true,
        tags: { type: 'avatar', userId: currentUser?.id },
      });
    }
  };

  const getCurrentAvatarUrl = () => {
    if (selectedFileId) {
      return fileService.getImageUrl(selectedFileId, 'thumbnail');
    }
    return null;
  };

  return (
    <div className="space-y-4">
      {/* Current Avatar Display */}
      <div className="flex items-center space-x-4">
        <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
          {getCurrentAvatarUrl() ? (
            <img
              src={getCurrentAvatarUrl() || ''}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <i className="fas fa-user text-2xl text-gray-400" />
          )}
        </div>

        <div className="space-y-2">
          <div className="flex space-x-2">
            <Button
              variant="secondary"
              size="sm"
              icon="image"
              onClick={() => setIsModalOpen(true)}
            >
              Choose Avatar
            </Button>

            {selectedFileId && (
              <Button
                variant="ghost"
                size="sm"
                icon="trash"
                onClick={() => onFileSelect(null)}
              >
                Remove
              </Button>
            )}
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            Select an existing image or upload a new one
          </p>
        </div>
      </div>

      {/* Avatar Selection Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Select Avatar"
        size="lg"
      >
        <div className="space-y-6">
          {/* Upload Section */}
          <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Upload New Avatar
            </h4>

            <div className="space-y-4">
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>

              {selectedFile && (
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <i className="fas fa-image text-blue-500" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {selectedFile.name}
                    </span>
                  </div>

                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleUpload}
                    loading={uploadMutation.isPending}
                  >
                    Upload
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Existing Images Section */}
          <div>
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Choose from Existing Images
            </h4>

            <div className="space-y-4">
              <Input
                placeholder="Search images..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon="search"
              />

              {isLoading ? (
                <div className="flex justify-center py-8">
                  <LoadingSpinner size="lg" />
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-4 max-h-64 overflow-y-auto">
                  {filesData.map((file) => (
                    <div
                      key={file.id}
                      className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                        selectedFileId === file.id
                          ? 'border-blue-500 ring-2 ring-blue-200'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                      }`}
                      onClick={() => {
                        onFileSelect(file.id);
                        setIsModalOpen(false);
                      }}
                    >
                      <div className="aspect-square">
                        <img
                          src={
                            fileService.getImageUrl(file.id, 'thumbnail') || ''
                          }
                          alt={file.originalFileName}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {selectedFileId === file.id && (
                        <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center">
                          <i className="fas fa-check-circle text-blue-500 text-2xl" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {filesData?.items.length === 0 && !isLoading && (
                <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                  No images found. Upload a new image above.
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

import React, { useState, useRef } from 'react';
import { Button } from '../Button';
import { fileService } from '../../../services/file.service';

interface AvatarUploadProps {
  currentAvatarUrl?: string;
  currentAvatarFileId?: number;
  onAvatarChange: (fileId: number | null, avatarUrl: string | null) => void;
  disabled?: boolean;
}

export const AvatarUpload: React.FC<AvatarUploadProps> = ({
  currentAvatarUrl,
  currentAvatarFileId,
  onAvatarChange,
  disabled = false,
}) => {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    currentAvatarUrl || null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    setUploading(true);

    try {
      // Create preview URL
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);

      // Upload file
      const uploadedFile = await fileService.uploadFile({
        file,
        description: 'User avatar',
        isPublic: false,
        generateThumbnail: true,
        tags: { type: 'avatar' },
      });

      // Get the avatar URL
      const avatarUrl = fileService.getDownloadUrl(uploadedFile.id);

      onAvatarChange(uploadedFile.id, avatarUrl);
    } catch (error) {
      console.error('Failed to upload avatar:', error);
      alert('Failed to upload avatar. Please try again.');
      // Restore previous preview
      setPreviewUrl(currentAvatarUrl || null);
    } finally {
      setUploading(false);
      // Clear the input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveAvatar = () => {
    setPreviewUrl(null);
    onAvatarChange(null, null);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Profile Picture
      </label>

      <div className="flex items-center space-x-6">
        {/* Avatar Preview */}
        <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center border-2 border-gray-200 dark:border-gray-700">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Avatar preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <i className="fas fa-user text-3xl text-gray-400 dark:text-gray-600" />
          )}
        </div>

        {/* Upload Controls */}
        <div className="space-y-2">
          <div className="space-x-2">
            <Button
              variant="secondary"
              size="sm"
              icon="upload"
              onClick={handleUploadClick}
              disabled={disabled || uploading}
              loading={uploading}
            >
              {previewUrl ? 'Change Picture' : 'Upload Picture'}
            </Button>

            {previewUrl && (
              <Button
                variant="ghost"
                size="sm"
                icon="trash"
                onClick={handleRemoveAvatar}
                disabled={disabled || uploading}
                className="text-red-600 hover:text-red-700 dark:text-red-400"
              >
                Remove
              </Button>
            )}
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400">
            JPG, PNG or GIF. Max size 5MB.
          </p>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};

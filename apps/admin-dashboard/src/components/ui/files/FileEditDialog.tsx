import React, { useState, useEffect } from 'react';
import { Modal } from '../Modal';
import { Input } from '../Input';

import { Checkbox } from '../Checkbox';
import { Button } from '../Button';
import { Select } from '../Select';
import { FileEntity, UpdateFileDto } from '../../../types';
import { fileService } from '../../../services/file.service';
import { folderService } from '../../../services/folder.service';

interface FileEditDialogProps {
  file: FileEntity | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedFile: FileEntity) => void;
}

export const FileEditDialog: React.FC<FileEditDialogProps> = ({
  file,
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<UpdateFileDto>({
    description: '',
    alt: '',
    isPublic: false,
    tags: {},
    folderId: undefined,
  });
  const [loading, setSaving] = useState(false);
  const [folders, setFolders] = useState<
    Array<{ value: number; label: string }>
  >([]);

  useEffect(() => {
    if (file) {
      setFormData({
        description: file.description || '',
        alt: file.alt || '',
        isPublic: file.isPublic,
        tags: file.tags || {},
        folderId: file.folderId,
      });
    }
  }, [file]);

  useEffect(() => {
    if (isOpen) {
      loadFolders();
    }
  }, [isOpen]);

  const loadFolders = async () => {
    try {
      const folderData = await folderService.getAllFolders();
      const folderOptions = folderData.map((folder) => ({
        value: folder.id,
        label: folder.path,
      }));
      setFolders([{ value: 0, label: 'Root' }, ...folderOptions]);
    } catch (error) {
      console.error('Failed to load folders:', error);
    }
  };

  const handleSave = async () => {
    if (!file) return;

    setSaving(true);
    try {
      const updatedFile = await fileService.updateFile(file.id, formData);
      onSave(updatedFile);
      onClose();
    } catch (error) {
      console.error('Failed to update file:', error);
    } finally {
      setSaving(false);
    }
  };

  if (!file) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit File" size="lg">
      <div className="space-y-6">
        {/* File preview */}
        <div className="flex items-start space-x-4">
          <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center overflow-hidden">
            {file.fileType === 1 ? ( // Image type
              <img
                src={fileService.getThumbnailUrl(file.id)}
                alt={file.alt || file.originalFileName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : null}
            <i
              className={`fas fa-file text-3xl text-gray-400 ${
                file.fileType === 1 ? 'hidden' : ''
              }`}
            />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">
              {file.originalFileName}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {file.contentType} • {file.fileSize} bytes
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Created: {new Date(file.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Form fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Enter file description"
          />

          {file.fileType === 1 && ( // Image type
            <Input
              label="Alt Text"
              value={formData.alt}
              onChange={(e) =>
                setFormData({ ...formData, alt: e.target.value })
              }
              placeholder="Enter alt text for accessibility"
            />
          )}
        </div>

        <Select
          label="Folder"
          value={formData.folderId || 0}
          onChange={(e) =>
            setFormData({
              ...formData,
              folderId: Number(e.target.value) || undefined,
            })
          }
          options={folders}
          placeholder="Select a folder"
        />

        <Checkbox
          label="Public Access"
          checked={formData.isPublic}
          onChange={(e) =>
            setFormData({ ...formData, isPublic: e.target.checked })
          }
        />

        {/* File metadata display */}
        {file.width && file.height && (
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
              File Information
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500 dark:text-gray-400">
                  Dimensions:
                </span>
                <span className="ml-2 text-gray-900 dark:text-white">
                  {file.width} × {file.height}
                </span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">
                  Downloads:
                </span>
                <span className="ml-2 text-gray-900 dark:text-white">
                  {file.downloadCount}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSave} loading={loading}>
            Save Changes
          </Button>
        </div>
      </div>
    </Modal>
  );
};

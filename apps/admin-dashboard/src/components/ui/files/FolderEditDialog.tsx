import React, { useState, useEffect } from 'react';
import { Modal } from '../Modal';
import { Input } from '../Input';
import { Textarea } from '../Textarea';
import { Checkbox } from '../Checkbox';
import { Button } from '../Button';
import { Select } from '../Select';
import {
  Folder,
  CreateFolderDto,
  UpdateFolderDto,
  FolderType,
} from '../../../types';
import { folderService } from '../../../services/folder.service';

interface FolderEditDialogProps {
  folder?: Folder;
  parentFolderId?: number;
  isOpen: boolean;
  onClose: () => void;
  onSave: (folder: Folder) => void;
}

export const FolderEditDialog: React.FC<FolderEditDialogProps> = ({
  folder,
  parentFolderId,
  isOpen,
  onClose,
  onSave,
}) => {
  const isEditing = !!folder;

  const [formData, setFormData] = useState<CreateFolderDto>({
    name: '',
    description: '',
    parentFolderId: parentFolderId,
    isPublic: false,
    folderType: FolderType.General,
    metadata: {},
  });
  const [loading, setSaving] = useState(false);
  const [folders, setFolders] = useState<
    Array<{ value: number; label: string }>
  >([]);

  const folderTypeOptions = [
    { value: FolderType.General, label: 'General' },
    { value: FolderType.Images, label: 'Images' },
    { value: FolderType.Documents, label: 'Documents' },
    { value: FolderType.Videos, label: 'Videos' },
    { value: FolderType.Audio, label: 'Audio' },
    { value: FolderType.UserAvatars, label: 'User Avatars' },
    { value: FolderType.CompanyAssets, label: 'Company Assets' },
    { value: FolderType.Temporary, label: 'Temporary' },
  ];

  useEffect(() => {
    if (folder) {
      setFormData({
        name: folder.name,
        description: folder.description || '',
        parentFolderId: folder.parentFolderId,
        isPublic: folder.isPublic,
        folderType: folder.folderType,
        metadata: folder.metadata || {},
      });
    } else {
      setFormData({
        name: '',
        description: '',
        parentFolderId: parentFolderId,
        isPublic: false,
        folderType: FolderType.General,
        metadata: {},
      });
    }
  }, [folder, parentFolderId]);

  useEffect(() => {
    if (isOpen) {
      loadFolders();
    }
  }, [isOpen]);

  const loadFolders = async () => {
    try {
      const folderData = await folderService.getAllFolders();
      // Filter out current folder and its descendants if editing
      const availableFolders = folder
        ? folderData.filter(
            (f) => f.id !== folder.id && !f.path.startsWith(folder.path + '/')
          )
        : folderData;

      const folderOptions = availableFolders.map((f) => ({
        value: f.id,
        label: f.path,
      }));
      setFolders([{ value: 0, label: 'Root' }, ...folderOptions]);
    } catch (error) {
      console.error('Failed to load folders:', error);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let savedFolder: Folder;

      if (isEditing && folder) {
        const updateData: UpdateFolderDto = {
          name: formData.name,
          description: formData.description,
          isPublic: formData.isPublic,
          metadata: formData.metadata,
        };
        savedFolder = await folderService.updateFolder(folder.id, updateData);
      } else {
        savedFolder = await folderService.createFolder(formData);
      }

      onSave(savedFolder);
      onClose();
    } catch (error) {
      console.error('Failed to save folder:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Folder' : 'Create Folder'}
      size="md"
    >
      <div className="space-y-4">
        <Input
          label="Folder Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter folder name"
          required
        />

        <Textarea
          label="Description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Enter folder description (optional)"
          rows={3}
        />

        <Select
          label="Parent Folder"
          value={formData.parentFolderId || 0}
          onChange={(e) =>
            setFormData({
              ...formData,
              parentFolderId: Number(e.target.value) || undefined,
            })
          }
          options={folders}
        />

        <Select
          label="Folder Type"
          value={formData.folderType}
          onChange={(e) =>
            setFormData({
              ...formData,
              folderType: Number(e.target.value) as FolderType,
            })
          }
          options={folderTypeOptions}
        />

        <Checkbox
          label="Public Access"
          checked={formData.isPublic}
          onChange={(e) =>
            setFormData({ ...formData, isPublic: e.target.checked })
          }
        />

        {/* Folder info for editing */}
        {isEditing && folder && (
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
              Folder Information
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500 dark:text-gray-400">Files:</span>
                <span className="ml-2 text-gray-900 dark:text-white">
                  {folder.fileCount}
                </span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">
                  Subfolders:
                </span>
                <span className="ml-2 text-gray-900 dark:text-white">
                  {folder.subFolderCount}
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-gray-500 dark:text-gray-400">
                  Total Size:
                </span>
                <span className="ml-2 text-gray-900 dark:text-white">
                  {folder.totalSizeFormatted}
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
            {isEditing ? 'Save Changes' : 'Create Folder'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

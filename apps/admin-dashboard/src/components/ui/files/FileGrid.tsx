import React from 'react';
import { FileEntity, Folder } from '../../../types';
import { FileItem } from './FileItem';
import { FolderItem } from './FolderItem';

interface FileGridProps {
  files: FileEntity[];
  folders: Folder[];
  selectedItems: (FileEntity | Folder)[];
  onItemSelect: (item: FileEntity | Folder) => void;
  onItemDoubleClick: (item: FileEntity | Folder) => void;
  onItemContextMenu: (
    item: FileEntity | Folder,
    event: React.MouseEvent
  ) => void;
}

export const FileGrid: React.FC<FileGridProps> = ({
  files,
  folders,
  selectedItems,
  onItemSelect,
  onItemDoubleClick,
  onItemContextMenu,
}) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
      {/* Folders first */}
      {folders.map((folder) => (
        <FolderItem
          key={`folder-${folder.id}`}
          folder={folder}
          isSelected={selectedItems.some(
            (item) => 'subFolders' in item && item.id === folder.id
          )}
          onSelect={() => onItemSelect(folder)}
          onDoubleClick={() => onItemDoubleClick(folder)}
          onContextMenu={(event) => onItemContextMenu(folder, event)}
          viewMode="grid"
        />
      ))}

      {/* Files */}
      {files.map((file) => (
        <FileItem
          key={`file-${file.id}`}
          file={file}
          isSelected={selectedItems.some(
            (item) => 'fileSize' in item && item.id === file.id
          )}
          onSelect={() => onItemSelect(file)}
          onDoubleClick={() => onItemDoubleClick(file)}
          onContextMenu={(event) => onItemContextMenu(file, event)}
          viewMode="grid"
        />
      ))}
    </div>
  );
};

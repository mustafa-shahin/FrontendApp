import React, { createContext, useContext, useState } from 'react';
import { ViewMode, FileEntity, Folder } from '../types';

interface FileManagerContextType {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  selectedItems: (FileEntity | Folder)[];
  setSelectedItems: React.Dispatch<
    React.SetStateAction<(FileEntity | Folder)[]>
  >;
  currentFolder: Folder | null;
  setCurrentFolder: (folder: Folder | null) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const FileManagerContext = createContext<FileManagerContextType | undefined>(
  undefined
);

export const useFileManager = () => {
  const context = useContext(FileManagerContext);
  if (!context) {
    throw new Error('useFileManager must be used within a FileManagerProvider');
  }
  return context;
};

interface FileManagerProviderProps {
  children: React.ReactNode;
}

export const FileManagerProvider: React.FC<FileManagerProviderProps> = ({
  children,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedItems, setSelectedItems] = useState<(FileEntity | Folder)[]>(
    []
  );
  const [currentFolder, setCurrentFolder] = useState<Folder | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const value = {
    viewMode,
    setViewMode,
    selectedItems,
    setSelectedItems,
    currentFolder,
    setCurrentFolder,
    searchTerm,
    setSearchTerm,
    isLoading,
    setIsLoading,
  };

  return (
    <FileManagerContext.Provider value={value}>
      {children}
    </FileManagerContext.Provider>
  );
};

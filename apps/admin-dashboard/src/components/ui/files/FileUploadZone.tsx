import React, { useState, useRef } from 'react';
import { Button } from '../Button';

interface FileUploadZoneProps {
  onFilesSelected: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
}

export const FileUploadZone: React.FC<FileUploadZoneProps> = ({
  onFilesSelected,
  accept,
  multiple = true,
  disabled = false,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      onFilesSelected(files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onFilesSelected(files);
    }
    // Reset the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
        isDragOver
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
          : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled}
      />

      <div className="space-y-4">
        <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
          <i className="fas fa-cloud-upload-alt text-2xl text-gray-400 dark:text-gray-600" />
        </div>

        <div>
          <p className="text-lg font-medium text-gray-900 dark:text-white">
            Drop files here or click to upload
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {multiple ? 'Select multiple files' : 'Select a file'} to upload
          </p>
        </div>

        <Button variant="primary" disabled={disabled}>
          Choose Files
        </Button>
      </div>
    </div>
  );
};

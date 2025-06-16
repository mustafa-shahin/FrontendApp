import React, { forwardRef, useState } from 'react';
import { FormField } from './FormField';
import { Button } from '../ui/Button';
import { FieldError, FieldErrorsImpl, Merge } from 'react-hook-form';

interface FormFileInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | string;
  accept?: string;
  multiple?: boolean;
  description?: string;
  previewUrl?: string;
  onFileChange?: (files: File[] | null) => void;
}

export const FormFileInput = forwardRef<HTMLInputElement, FormFileInputProps>(
  (
    {
      label,
      error,
      required,
      accept,
      multiple,
      className,
      description,
      previewUrl,
      onFileChange,
      ...props
    },
    ref
  ) => {
    const [preview, setPreview] = useState<string | null>(previewUrl || null);
    const [fileName, setFileName] = useState<string>('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        const file = files[0];
        setFileName(file.name);

        // Create preview for images
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e) => {
            setPreview(e.target?.result as string);
          };
          reader.readAsDataURL(file);
        } else {
          setPreview(null);
        }

        onFileChange?.(Array.from(files));
      } else {
        setFileName('');
        setPreview(null);
        onFileChange?.(null);
      }
    };

    return (
      <FormField
        label={label}
        error={error}
        required={required}
        className={className}
        description={description}
      >
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <input
              ref={ref}
              type="file"
              accept={accept}
              multiple={multiple}
              onChange={handleFileChange}
              className="hidden"
              id={`file-${Math.random().toString(36).substr(2, 9)}`}
              {...props}
            />
            <Button
              type="button"
              variant="secondary"
              icon="upload"
              onClick={() => {
                const input = document.getElementById(
                  `file-${Math.random().toString(36).substr(2, 9)}`
                ) as HTMLInputElement;
                input?.click();
              }}
            >
              Choose File
            </Button>
            {fileName && (
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {fileName}
              </span>
            )}
          </div>

          {preview && (
            <div className="flex justify-center">
              <img
                src={preview}
                alt="Preview"
                className="w-24 h-24 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
              />
            </div>
          )}
        </div>
      </FormField>
    );
  }
);

FormFileInput.displayName = 'FormFileInput';

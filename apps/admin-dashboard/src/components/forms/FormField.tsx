import React from 'react';
import { FieldError, FieldErrorsImpl, Merge } from 'react-hook-form';

interface FormFieldProps {
  label?: string;
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
  description?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  required,
  children,
  className = '',
  description,
}) => {
  const errorMessage =
    typeof error === 'string' ? error : error?.message?.toString();

  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {description && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {description}
        </p>
      )}

      <div className="relative">{children}</div>

      {errorMessage && (
        <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
          <i className="fas fa-exclamation-circle mr-1" />
          {errorMessage}
        </p>
      )}
    </div>
  );
};

import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: string;
  iconPosition?: 'left' | 'right';
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { label, error, icon, iconPosition = 'left', className = '', ...props },
    ref
  ) => {
    const baseClasses =
      'block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500';
    const errorClasses = error
      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
      : '';
    const iconClasses = icon
      ? iconPosition === 'left'
        ? 'pl-10'
        : 'pr-10'
      : '';

    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </label>
        )}

        <div className="relative">
          {icon && (
            <div
              className={`absolute inset-y-0 ${
                iconPosition === 'left' ? 'left-0 pl-3' : 'right-0 pr-3'
              } flex items-center pointer-events-none`}
            >
              <i className={`fas fa-${icon} text-gray-400`} />
            </div>
          )}

          <input
            ref={ref}
            className={`${baseClasses} ${errorClasses} ${iconClasses} ${className}`}
            {...props}
          />
        </div>

        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

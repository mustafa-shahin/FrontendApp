import React from 'react';
import { ButtonProps } from '../../types';

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  icon,
  iconPosition = 'left',
  className = '',
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = {
    primary:
      'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 dark:bg-blue-700 dark:hover:bg-blue-600',
    secondary:
      'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500 dark:bg-gray-700 dark:hover:bg-gray-600',
    danger:
      'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 dark:bg-red-700 dark:hover:bg-red-600',
    success:
      'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 dark:bg-green-700 dark:hover:bg-green-600',
    warning:
      'bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500 dark:bg-yellow-700 dark:hover:bg-yellow-600',
    ghost:
      'text-gray-700 hover:bg-gray-100 focus:ring-gray-500 dark:text-gray-300 dark:hover:bg-gray-800',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const iconClasses =
    size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5';

  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading ? (
        <i
          className={`fas fa-spinner fa-spin ${iconClasses} ${
            children ? 'mr-2' : ''
          }`}
        />
      ) : icon && iconPosition === 'left' ? (
        <i
          className={`fas fa-${icon} ${iconClasses} ${children ? 'mr-2' : ''}`}
        />
      ) : null}

      {children}

      {!loading && icon && iconPosition === 'right' ? (
        <i
          className={`fas fa-${icon} ${iconClasses} ${children ? 'ml-2' : ''}`}
        />
      ) : null}
    </button>
  );
};

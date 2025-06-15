import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  children,
}) => {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1 text-gray-600 dark:text-gray-400">{subtitle}</p>
          )}
        </div>

        {children && (
          <div className="flex items-center space-x-3">{children}</div>
        )}
      </div>
    </div>
  );
};

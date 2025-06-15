import React from 'react';
import { Button } from '../Button';

interface EmptyStateProps {
  icon: string;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
}) => {
  return (
    <div className="text-center py-12">
      <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
        <i
          className={`fas fa-${icon} text-3xl text-gray-400 dark:text-gray-600`}
        />
      </div>

      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
        {title}
      </h3>

      {description && (
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
          {description}
        </p>
      )}

      {action && <Button onClick={action.onClick}>{action.label}</Button>}
    </div>
  );
};

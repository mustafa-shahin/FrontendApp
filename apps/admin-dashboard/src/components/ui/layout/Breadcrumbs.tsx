import React from 'react';
import { Link } from 'react-router-dom';
import { BreadcrumbItem } from '../../../types';

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  if (items.length === 0) return null;

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
      {items.map((item, index) => (
        <React.Fragment key={item.path || item.name}>
          {index > 0 && <i className="fas fa-chevron-right w-3 h-3" />}

          {item.href ? (
            <Link
              to={item.href}
              className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            >
              {item.name}
            </Link>
          ) : (
            <span
              className={
                index === items.length - 1
                  ? 'text-gray-900 dark:text-white font-medium'
                  : ''
              }
            >
              {item.name}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

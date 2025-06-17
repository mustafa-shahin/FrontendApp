import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface SidebarItem {
  id: string;
  label: string;
  icon: string;
  path?: string;
  children?: SidebarItem[];
}

const sidebarItems: SidebarItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'tachometer-alt',
    path: '/',
  },
  {
    id: 'files',
    label: 'Files',
    icon: 'folder',
    children: [
      {
        id: 'all-files',
        label: 'All Files',
        icon: 'file',
        path: '/files',
      },
      {
        id: 'folders',
        label: 'Folders',
        icon: 'folder-open',
        path: '/folders',
      },
      {
        id: 'images',
        label: 'Images',
        icon: 'image',
        path: '/files',
      },
      {
        id: 'documents',
        label: 'Documents',
        icon: 'file-alt',
        path: '/documents',
      },
      {
        id: 'videos',
        label: 'Videos',
        icon: 'video',
        path: '/files/videos',
      },
      {
        id: 'audio',
        label: 'Audio',
        icon: 'music',
        path: '/files/audio',
      },
    ],
  },
  {
    id: 'users',
    label: 'Users',
    icon: 'users',
    path: '/users',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: 'cog',
    path: '/settings',
  },
];

interface SidebarProps {
  isCollapsed: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed }) => {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>(['files']);

  const toggleExpanded = (itemId: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const isActive = (path?: string) => {
    if (!path) return false;
    return (
      location.pathname === path || location.pathname.startsWith(path + '/')
    );
  };

  const renderSidebarItem = (item: SidebarItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.id);
    const active = isActive(item.path);

    return (
      <div key={item.id}>
        {item.path ? (
          <Link
            to={item.path}
            className={`flex items-center px-4 py-2 text-sm font-medium transition-colors duration-200 ${
              active
                ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700 dark:bg-blue-900 dark:text-blue-300'
                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
            } ${level > 0 ? 'pl-8' : ''}`}
          >
            <i
              className={`fas fa-${item.icon} w-5 h-5 ${
                isCollapsed ? '' : 'mr-3'
              }`}
            />
            {!isCollapsed && <span>{item.label}</span>}
          </Link>
        ) : (
          <button
            onClick={() => toggleExpanded(item.id)}
            className={`flex items-center justify-between w-full px-4 py-2 text-sm font-medium transition-colors duration-200 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 ${
              level > 0 ? 'pl-8' : ''
            }`}
          >
            <div className="flex items-center">
              <i
                className={`fas fa-${item.icon} w-5 h-5 ${
                  isCollapsed ? '' : 'mr-3'
                }`}
              />
              {!isCollapsed && <span>{item.label}</span>}
            </div>
            {!isCollapsed && hasChildren && (
              <i
                className={`fas fa-chevron-${
                  isExpanded ? 'up' : 'down'
                } w-4 h-4`}
              />
            )}
          </button>
        )}

        {hasChildren && isExpanded && !isCollapsed && (
          <div className="bg-gray-50 dark:bg-gray-800">
            {item.children!.map((child) => renderSidebarItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className={`bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <i className="fas fa-cube text-white" />
          </div>
          {!isCollapsed && (
            <span className="ml-3 text-xl font-semibold text-gray-900 dark:text-white">
              CMS Admin
            </span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-4 flex-1">
        <div className="space-y-1">
          {sidebarItems.map((item) => renderSidebarItem(item))}
        </div>
      </nav>
    </div>
  );
};

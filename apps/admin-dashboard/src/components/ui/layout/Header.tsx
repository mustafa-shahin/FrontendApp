import React from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useTheme } from '../../../contexts/ThemeContext';
import { Button } from '../Button';
interface HeaderProps {
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 h-16">
      <div className="flex items-center justify-between px-4 h-full">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            icon="bars"
            onClick={onToggleSidebar}
            className="lg:hidden"
          />

          <div className="hidden lg:block">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              File Manager
            </h1>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="sm"
            icon={theme === 'light' ? 'moon' : 'sun'}
            onClick={toggleTheme}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          />

          {/* User menu */}
          <div className="flex items-center space-x-3">
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.fullName}
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                <i className="fas fa-user text-gray-600 dark:text-gray-300" />
              </div>
            )}

            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {user?.roleName}
              </p>
            </div>

            <Button
              variant="ghost"
              size="sm"
              icon="sign-out-alt"
              onClick={handleLogout}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

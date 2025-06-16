import React, { useState } from 'react';
import { Modal } from '../Modal';
import { Button } from '../Button';
import { LoadingSpinner } from '../LoadingSpinner';

export interface FormTab {
  id: string;
  label: string;
  icon: string;
  content: React.ReactNode;
  disabled?: boolean;
  badge?: string | number;
}

export interface FormValidationError {
  field: string;
  message: string;
  tab?: string;
}

export interface EntityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => Promise<void> | void;
  title: string;
  loading?: boolean;
  saving?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  tabs?: FormTab[];
  children?: React.ReactNode;
  saveLabel?: string;
  cancelLabel?: string;
  errors?: FormValidationError[];
  showSaveButton?: boolean;
  saveButtonDisabled?: boolean;
  customActions?: React.ReactNode;
  className?: string;
}

export const EntityModal: React.FC<EntityModalProps> = ({
  isOpen,
  onClose,
  onSave,
  title,
  loading = false,
  saving = false,
  size = 'lg',
  tabs,
  children,
  saveLabel = 'Save',
  cancelLabel = 'Cancel',
  errors = [],
  showSaveButton = true,
  saveButtonDisabled = false,
  customActions,
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState(tabs?.[0]?.id || '');

  const handleSave = async () => {
    try {
      await onSave();
    } catch (error) {
      console.error('Save operation failed:', error);
    }
  };

  const getTabErrors = (tabId: string): FormValidationError[] => {
    return errors.filter((error) => error.tab === tabId);
  };

  const hasTabErrors = (tabId: string): boolean => {
    return getTabErrors(tabId).length > 0;
  };

  const renderTabContent = () => {
    if (!tabs) return children;

    const activeTabContent = tabs.find((tab) => tab.id === activeTab)?.content;
    return activeTabContent || null;
  };

  const renderErrorSummary = () => {
    if (errors.length === 0) return null;

    return (
      <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <div className="flex items-center mb-2">
          <i className="fas fa-exclamation-triangle text-red-600 dark:text-red-400 mr-2" />
          <h4 className="text-sm font-medium text-red-800 dark:text-red-200">
            Please correct the following errors:
          </h4>
        </div>
        <ul className="list-disc list-inside text-sm text-red-700 dark:text-red-300">
          {errors.map((error, index) => (
            <li key={index}>
              {error.tab && tabs
                ? `${tabs.find((t) => t.id === error.tab)?.label}: `
                : ''}
              {error.message}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size={size}
      className={className}
    >
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
          <span className="ml-3 text-gray-600 dark:text-gray-400">
            Loading...
          </span>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Tabs */}
          {tabs && tabs.length > 1 && (
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="flex space-x-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    disabled={tab.disabled}
                    className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                    } ${tab.disabled ? 'opacity-50 cursor-not-allowed' : ''} ${
                      hasTabErrors(tab.id)
                        ? 'text-red-600 dark:text-red-400'
                        : ''
                    }`}
                  >
                    <i className={`fas fa-${tab.icon} mr-2`} />
                    {tab.label}
                    {tab.badge && (
                      <span className="ml-2 px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded-full">
                        {tab.badge}
                      </span>
                    )}
                    {hasTabErrors(tab.id) && (
                      <i className="fas fa-exclamation-circle ml-2 text-red-500" />
                    )}
                  </button>
                ))}
              </nav>
            </div>
          )}

          {/* Error Summary */}
          {renderErrorSummary()}

          {/* Content */}
          <div className="min-h-96">{renderTabContent()}</div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            {customActions}

            <Button variant="ghost" onClick={onClose} disabled={saving}>
              {cancelLabel}
            </Button>

            {showSaveButton && (
              <Button
                onClick={handleSave}
                loading={saving}
                disabled={saveButtonDisabled || saving}
              >
                {saveLabel}
              </Button>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
};

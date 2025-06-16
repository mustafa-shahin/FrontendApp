// apps/admin-dashboard/src/components/common/EntityTable.tsx
import React from 'react';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { EmptyState } from '../ui/layout/EmptyState';
import { Button } from '../ui/Button';

export interface TableColumn<T> {
  key: string;
  label: string;
  render?: (item: T, index: number) => React.ReactNode;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface TableAction<T> {
  key: string;
  label: string;
  icon: string;
  variant?:
    | 'primary'
    | 'secondary'
    | 'danger'
    | 'success'
    | 'warning'
    | 'ghost';
  onClick: (item: T) => void;
  disabled?: (item: T) => boolean;
  visible?: (item: T) => boolean;
}

export interface EntityTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  actions?: TableAction<T>[];
  loading?: boolean;
  error?: string | null;
  emptyState?: {
    icon: string;
    title: string;
    description?: string;
    action?: {
      label: string;
      onClick: () => void;
    };
  };
  onRowClick?: (item: T) => void;
  rowKey?: keyof T | ((item: T) => string | number);
  selectedItems?: T[];
  onSelectionChange?: (items: T[]) => void;
  selectable?: boolean;
  className?: string;
}

export function EntityTable<T extends Record<string, any>>({
  data,
  columns,
  actions = [],
  loading = false,
  error = null,
  emptyState,
  onRowClick,
  rowKey = 'id' as keyof T,
  selectedItems = [],
  onSelectionChange,
  selectable = false,
  className = '',
}: EntityTableProps<T>) {
  const getRowKey = (item: T, index: number): string | number => {
    if (typeof rowKey === 'function') {
      return rowKey(item);
    }
    return item[rowKey] ?? index;
  };

  const isSelected = (item: T): boolean => {
    const key = getRowKey(item, 0);
    return selectedItems.some((selected) => getRowKey(selected, 0) === key);
  };

  const handleSelectAll = (checked: boolean) => {
    if (!onSelectionChange) return;
    onSelectionChange(checked ? [...data] : []);
  };

  const handleSelectItem = (item: T, checked: boolean) => {
    if (!onSelectionChange) return;

    if (checked) {
      onSelectionChange([...selectedItems, item]);
    } else {
      const key = getRowKey(item, 0);
      onSelectionChange(
        selectedItems.filter((selected) => getRowKey(selected, 0) !== key)
      );
    }
  };

  const allSelected = data.length > 0 && selectedItems.length === data.length;
  const someSelected =
    selectedItems.length > 0 && selectedItems.length < data.length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 dark:text-red-400 mb-4">
          <i className="fas fa-exclamation-triangle text-4xl mb-2" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return emptyState ? (
      <EmptyState
        icon={emptyState.icon}
        title={emptyState.title}
        description={emptyState.description}
        action={emptyState.action}
      />
    ) : (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">No data available</p>
      </div>
    );
  }

  return (
    <div className={`overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {selectable && (
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:border-gray-600 dark:focus:ring-blue-500"
                    checked={allSelected}
                    ref={(input) => {
                      if (input) input.indeterminate = someSelected;
                    }}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </th>
              )}

              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${
                    column.align === 'center'
                      ? 'text-center'
                      : column.align === 'right'
                      ? 'text-right'
                      : 'text-left'
                  }`}
                  style={{ width: column.width }}
                >
                  {column.label}
                  {column.sortable && (
                    <i className="fas fa-sort ml-1 text-gray-400" />
                  )}
                </th>
              ))}

              {actions.length > 0 && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>

          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {data.map((item, index) => (
              <tr
                key={getRowKey(item, index)}
                className={`hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                  onRowClick ? 'cursor-pointer' : ''
                } ${isSelected(item) ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                onClick={() => onRowClick?.(item)}
              >
                {selectable && (
                  <td
                    className="px-6 py-4 whitespace-nowrap"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:border-gray-600 dark:focus:ring-blue-500"
                      checked={isSelected(item)}
                      onChange={(e) => handleSelectItem(item, e.target.checked)}
                    />
                  </td>
                )}

                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white ${
                      column.align === 'center'
                        ? 'text-center'
                        : column.align === 'right'
                        ? 'text-right'
                        : 'text-left'
                    }`}
                  >
                    {column.render
                      ? column.render(item, index)
                      : item[column.key]}
                  </td>
                ))}

                {actions.length > 0 && (
                  <td
                    className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {actions
                      .filter((action) => action.visible?.(item) ?? true)
                      .map((action) => (
                        <Button
                          key={action.key}
                          variant={action.variant || 'ghost'}
                          size="sm"
                          icon={action.icon}
                          onClick={() => action.onClick(item)}
                          disabled={action.disabled?.(item)}
                          title={action.label}
                        />
                      ))}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

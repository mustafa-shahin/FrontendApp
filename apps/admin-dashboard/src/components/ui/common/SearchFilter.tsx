// apps/admin-dashboard/src/components/common/SearchFilter.tsx
import React, { useState, useEffect } from 'react';
import { Input } from '../Input';
import { Select } from '../Select';
import { Button } from '../Button';
import { Checkbox } from '../Checkbox';
import { Modal } from '../Modal';

export interface FilterField {
  key: string;
  label: string;
  type:
    | 'text'
    | 'select'
    | 'multiselect'
    | 'date'
    | 'daterange'
    | 'number'
    | 'boolean';
  options?: { value: any; label: string }[];
  placeholder?: string;
  defaultValue?: any;
}

export interface FilterValues {
  [key: string]: any;
}

export interface SearchFilterProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filterFields?: FilterField[];
  filterValues?: FilterValues;
  onFilterChange?: (filters: FilterValues) => void;
  onClearFilters?: () => void;
  showAdvancedFilters?: boolean;
  loading?: boolean;
  className?: string;
}

export const SearchFilter: React.FC<SearchFilterProps> = ({
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search...',
  filterFields = [],
  filterValues = {},
  onFilterChange,
  onClearFilters,
  showAdvancedFilters = false,
  loading = false,
  className = '',
}) => {
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [localFilters, setLocalFilters] = useState<FilterValues>(filterValues);
  const [hasActiveFilters, setHasActiveFilters] = useState(false);

  useEffect(() => {
    setLocalFilters(filterValues);
  }, [filterValues]);

  useEffect(() => {
    const hasFilters = Object.values(filterValues).some((value) => {
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === 'string') return value.trim() !== '';
      if (typeof value === 'boolean') return value;
      return value !== null && value !== undefined;
    });
    setHasActiveFilters(hasFilters);
  }, [filterValues]);

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleApplyFilters = () => {
    onFilterChange?.(localFilters);
    setShowFiltersModal(false);
  };

  const handleClearFilters = () => {
    const clearedFilters = filterFields.reduce((acc, field) => {
      acc[field.key] =
        field.type === 'multiselect'
          ? []
          : field.type === 'boolean'
          ? false
          : '';
      return acc;
    }, {} as FilterValues);

    setLocalFilters(clearedFilters);
    onClearFilters?.();
    setShowFiltersModal(false);
  };

  const renderFilterField = (field: FilterField) => {
    const value = localFilters[field.key];

    switch (field.type) {
      case 'text':
        return (
          <Input
            key={field.key}
            label={field.label}
            value={value || ''}
            onChange={(e) => handleFilterChange(field.key, e.target.value)}
            placeholder={field.placeholder}
          />
        );

      case 'select':
        return (
          <Select
            key={field.key}
            label={field.label}
            value={value || ''}
            onChange={(e) => handleFilterChange(field.key, e.target.value)}
            options={field.options || []}
            placeholder={field.placeholder}
          />
        );

      case 'multiselect':
        return (
          <div key={field.key} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {field.label}
            </label>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {field.options?.map((option) => (
                <Checkbox
                  key={option.value}
                  label={option.label}
                  checked={(value || []).includes(option.value)}
                  onChange={(e) => {
                    const currentValues = value || [];
                    const newValues = e.target.checked
                      ? [...currentValues, option.value]
                      : currentValues.filter((v: any) => v !== option.value);
                    handleFilterChange(field.key, newValues);
                  }}
                />
              ))}
            </div>
          </div>
        );

      case 'date':
        return (
          <Input
            key={field.key}
            type="date"
            label={field.label}
            value={value || ''}
            onChange={(e) => handleFilterChange(field.key, e.target.value)}
          />
        );

      case 'daterange':
        return (
          <div key={field.key} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {field.label}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="date"
                placeholder="From"
                value={value?.from || ''}
                onChange={(e) =>
                  handleFilterChange(field.key, {
                    ...value,
                    from: e.target.value,
                  })
                }
              />
              <Input
                type="date"
                placeholder="To"
                value={value?.to || ''}
                onChange={(e) =>
                  handleFilterChange(field.key, {
                    ...value,
                    to: e.target.value,
                  })
                }
              />
            </div>
          </div>
        );

      case 'number':
        return (
          <Input
            key={field.key}
            type="number"
            label={field.label}
            value={value || ''}
            onChange={(e) =>
              handleFilterChange(field.key, Number(e.target.value) || '')
            }
            placeholder={field.placeholder}
          />
        );

      case 'boolean':
        return (
          <Checkbox
            key={field.key}
            label={field.label}
            checked={value || false}
            onChange={(e) => handleFilterChange(field.key, e.target.checked)}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center space-x-3">
        {/* Search Input */}
        <div className="flex-1">
          <Input
            icon="search"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            disabled={loading}
          />
        </div>

        {/* Quick Filters */}
        {filterFields.slice(0, 2).map((field) => (
          <div key={field.key} className="min-w-48">
            {field.type === 'select' && (
              <Select
                value={filterValues[field.key] || ''}
                onChange={(e) => handleFilterChange(field.key, e.target.value)}
                options={[
                  { value: '', label: `All ${field.label}` },
                  ...(field.options || []),
                ]}
                disabled={loading}
              />
            )}
          </div>
        ))}

        {/* Advanced Filters Button */}
        {showAdvancedFilters && filterFields.length > 2 && (
          <Button
            variant="ghost"
            icon="filter"
            onClick={() => setShowFiltersModal(true)}
            className={
              hasActiveFilters ? 'text-blue-600 dark:text-blue-400' : ''
            }
            disabled={loading}
          >
            Filters {hasActiveFilters && <span className="ml-1">•</span>}
          </Button>
        )}

        {/* Clear Filters */}
        {hasActiveFilters && onClearFilters && (
          <Button
            variant="ghost"
            icon="times"
            onClick={handleClearFilters}
            disabled={loading}
          >
            Clear
          </Button>
        )}
      </div>

      {/* Advanced Filters Modal */}
      {showAdvancedFilters && (
        <Modal
          isOpen={showFiltersModal}
          onClose={() => setShowFiltersModal(false)}
          title="Advanced Filters"
          size="md"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filterFields.map(renderFilterField)}
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button variant="ghost" onClick={handleClearFilters}>
                Clear All
              </Button>
              <Button
                variant="ghost"
                onClick={() => setShowFiltersModal(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleApplyFilters}>Apply Filters</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

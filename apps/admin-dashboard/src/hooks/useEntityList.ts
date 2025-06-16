import { useState, useEffect, useCallback } from 'react';
import { PagedResult } from '../types';

export interface EntityListState<T> {
  items: T[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  selectedItems: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface EntityListActions<T> {
  setSearchTerm: (term: string) => void;
  setSelectedItems: (items: T[]) => void;
  toggleSelection: (item: T, idField?: keyof T) => void;
  clearSelection: () => void;
  refresh: () => Promise<void>;
  loadPage: (page: number) => Promise<void>;
}

export interface UseEntityListOptions<T> {
  fetchFn: (
    searchTerm?: string,
    page?: number,
    pageSize?: number
  ) => Promise<PagedResult<T>>;
  initialPageSize?: number;
  idField?: keyof T;
  autoLoad?: boolean;
}

export function useEntityList<T>(
  options: UseEntityListOptions<T>
): [EntityListState<T>, EntityListActions<T>] {
  const {
    fetchFn,
    initialPageSize = 20,
    idField = 'id' as keyof T,
    autoLoad = true,
  } = options;

  const [state, setState] = useState<EntityListState<T>>({
    items: [],
    loading: false,
    error: null,
    searchTerm: '',
    selectedItems: [],
    totalCount: 0,
    page: 1,
    pageSize: initialPageSize,
  });

  const loadData = useCallback(
    async (searchTerm?: string, page?: number, pageSize?: number) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const result = await fetchFn(
          searchTerm ?? state.searchTerm,
          page ?? state.page,
          pageSize ?? state.pageSize
        );

        setState((prev) => ({
          ...prev,
          items: result.items,
          totalCount: result.totalCount,
          page: result.page,
          pageSize: result.pageSize,
          loading: false,
        }));
      } catch (error) {
        setState((prev) => ({
          ...prev,
          error: error instanceof Error ? error.message : 'An error occurred',
          loading: false,
        }));
      }
    },
    [fetchFn, state.searchTerm, state.page, state.pageSize]
  );

  const setSearchTerm = useCallback(
    (term: string) => {
      setState((prev) => ({ ...prev, searchTerm: term, page: 1 }));
      loadData(term, 1);
    },
    [loadData]
  );

  const setSelectedItems = useCallback((items: T[]) => {
    setState((prev) => ({ ...prev, selectedItems: items }));
  }, []);

  const toggleSelection = useCallback(
    (item: T, customIdField?: keyof T) => {
      const field = customIdField || idField;
      setState((prev) => {
        const isSelected = prev.selectedItems.some(
          (selected) => selected[field] === item[field]
        );
        const newSelection = isSelected
          ? prev.selectedItems.filter(
              (selected) => selected[field] !== item[field]
            )
          : [...prev.selectedItems, item];

        return { ...prev, selectedItems: newSelection };
      });
    },
    [idField]
  );

  const clearSelection = useCallback(() => {
    setState((prev) => ({ ...prev, selectedItems: [] }));
  }, []);

  const refresh = useCallback(() => {
    return loadData();
  }, [loadData]);

  const loadPage = useCallback(
    (page: number) => {
      setState((prev) => ({ ...prev, page }));
      return loadData(undefined, page);
    },
    [loadData]
  );

  useEffect(() => {
    if (autoLoad) {
      loadData();
    }
  }, [autoLoad, loadData]);

  const actions: EntityListActions<T> = {
    setSearchTerm,
    setSelectedItems,
    toggleSelection,
    clearSelection,
    refresh,
    loadPage,
  };

  return [state, actions];
}

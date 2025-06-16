import { useCallback, useState } from 'react';
import { useToast } from './useToast';

export interface CrudOperations<TEntity, TCreateDto, TUpdateDto> {
  create: (data: TCreateDto) => Promise<TEntity>;
  update: (id: number, data: TUpdateDto) => Promise<TEntity>;
  delete: (id: number) => Promise<void>;
  getById: (id: number) => Promise<TEntity>;
  toggleStatus?: (id: number) => Promise<TEntity>;
}

export interface CrudState {
  loading: boolean;
  operationLoading: boolean;
  error: string | null;
}

export interface CrudActions<TEntity, TCreateDto, TUpdateDto> {
  createEntity: (data: TCreateDto) => Promise<TEntity | null>;
  updateEntity: (id: number, data: TUpdateDto) => Promise<TEntity | null>;
  deleteEntity: (id: number) => Promise<boolean>;
  loadEntity: (id: number) => Promise<TEntity | null>;
  toggleEntityStatus: (id: number) => Promise<TEntity | null>;
  clearError: () => void;
}

export interface UseEntityCrudOptions<TEntity, TCreateDto, TUpdateDto> {
  operations: CrudOperations<TEntity, TCreateDto, TUpdateDto>;
  entityName: string; // For toast messages
  onSuccess?: {
    create?: (entity: TEntity) => void;
    update?: (entity: TEntity) => void;
    delete?: () => void;
    toggleStatus?: (entity: TEntity) => void;
  };
  showToasts?: boolean;
}

export function useEntityCrud<TEntity, TCreateDto, TUpdateDto>(
  options: UseEntityCrudOptions<TEntity, TCreateDto, TUpdateDto>
): [CrudState, CrudActions<TEntity, TCreateDto, TUpdateDto>] {
  const { operations, entityName, onSuccess, showToasts = true } = options;
  const { showToast } = useToast();

  const [state, setState] = useState<CrudState>({
    loading: false,
    operationLoading: false,
    error: null,
  });

  const setLoading = useCallback((loading: boolean) => {
    setState((prev) => ({ ...prev, loading }));
  }, []);

  const setOperationLoading = useCallback((operationLoading: boolean) => {
    setState((prev) => ({ ...prev, operationLoading }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState((prev) => ({ ...prev, error }));
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, [setError]);

  const createEntity = useCallback(
    async (data: TCreateDto): Promise<TEntity | null> => {
      setOperationLoading(true);
      setError(null);

      try {
        const entity = await operations.create(data);

        if (showToasts) {
          showToast('success', `${entityName} created successfully`);
        }

        onSuccess?.create?.(entity);
        return entity;
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : `Failed to create ${entityName.toLowerCase()}`;
        setError(errorMessage);

        if (showToasts) {
          showToast('error', errorMessage);
        }

        return null;
      } finally {
        setOperationLoading(false);
      }
    },
    [
      operations,
      entityName,
      showToasts,
      showToast,
      onSuccess,
      setOperationLoading,
      setError,
    ]
  );

  const updateEntity = useCallback(
    async (id: number, data: TUpdateDto): Promise<TEntity | null> => {
      setOperationLoading(true);
      setError(null);

      try {
        const entity = await operations.update(id, data);

        if (showToasts) {
          showToast('success', `${entityName} updated successfully`);
        }

        onSuccess?.update?.(entity);
        return entity;
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : `Failed to update ${entityName.toLowerCase()}`;
        setError(errorMessage);

        if (showToasts) {
          showToast('error', errorMessage);
        }

        return null;
      } finally {
        setOperationLoading(false);
      }
    },
    [
      operations,
      entityName,
      showToasts,
      showToast,
      onSuccess,
      setOperationLoading,
      setError,
    ]
  );

  const deleteEntity = useCallback(
    async (id: number): Promise<boolean> => {
      setOperationLoading(true);
      setError(null);

      try {
        await operations.delete(id);

        if (showToasts) {
          showToast('success', `${entityName} deleted successfully`);
        }

        onSuccess?.delete?.();
        return true;
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : `Failed to delete ${entityName.toLowerCase()}`;
        setError(errorMessage);

        if (showToasts) {
          showToast('error', errorMessage);
        }

        return false;
      } finally {
        setOperationLoading(false);
      }
    },
    [
      operations,
      entityName,
      showToasts,
      showToast,
      onSuccess,
      setOperationLoading,
      setError,
    ]
  );

  const loadEntity = useCallback(
    async (id: number): Promise<TEntity | null> => {
      setLoading(true);
      setError(null);

      try {
        const entity = await operations.getById(id);
        return entity;
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : `Failed to load ${entityName.toLowerCase()}`;
        setError(errorMessage);

        if (showToasts) {
          showToast('error', errorMessage);
        }

        return null;
      } finally {
        setLoading(false);
      }
    },
    [operations, entityName, showToasts, showToast, setLoading, setError]
  );

  const toggleEntityStatus = useCallback(
    async (id: number): Promise<TEntity | null> => {
      if (!operations.toggleStatus) {
        setError('Toggle status operation not available');
        return null;
      }

      setOperationLoading(true);
      setError(null);

      try {
        const entity = await operations.toggleStatus(id);

        if (showToasts) {
          showToast('success', `${entityName} status updated successfully`);
        }

        onSuccess?.toggleStatus?.(entity);
        return entity;
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : `Failed to toggle ${entityName.toLowerCase()} status`;
        setError(errorMessage);

        if (showToasts) {
          showToast('error', errorMessage);
        }

        return null;
      } finally {
        setOperationLoading(false);
      }
    },
    [
      operations,
      entityName,
      showToasts,
      showToast,
      onSuccess,
      setOperationLoading,
      setError,
    ]
  );

  const actions: CrudActions<TEntity, TCreateDto, TUpdateDto> = {
    createEntity,
    updateEntity,
    deleteEntity,
    loadEntity,
    toggleEntityStatus,
    clearError,
  };

  return [state, actions];
}

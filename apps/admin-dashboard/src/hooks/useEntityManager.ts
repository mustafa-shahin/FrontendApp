import { useState, useCallback, useMemo } from 'react';
import { useEntityList } from './useEntityList';
import { useEntityCrud } from './useEntityCrud';
import { useEntityForm } from './useEntityForm';
import { useToast } from './useToast';
import { PagedResult } from '../types';

export interface EntityManagerState<TEntity> {
  // List state
  items: TEntity[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  selectedItems: TEntity[];
  totalCount: number;
  page: number;
  pageSize: number;

  // UI state
  showCreateModal: boolean;
  showEditModal: boolean;
  showDeleteDialog: boolean;
  editingItem: TEntity | null;
  itemToDelete: TEntity | null;

  // CRUD state
  operationLoading: boolean;

  // Form state
  formState: any; // Will be properly typed based on form data
}

export interface EntityManagerActions<TEntity, TCreateDto, TUpdateDto> {
  // List actions
  setSearchTerm: (term: string) => void;
  setSelectedItems: (items: TEntity[]) => void;
  toggleSelection: (item: TEntity) => void;
  clearSelection: () => void;
  refresh: () => Promise<void>;
  loadPage: (page: number) => Promise<void>;
  setPageSize: (size: number) => Promise<void>;

  // CRUD actions
  createEntity: (data: TCreateDto) => Promise<TEntity | null>;
  updateEntity: (id: number, data: TUpdateDto) => Promise<TEntity | null>;
  deleteEntity: (id: number) => Promise<boolean>;
  toggleEntityStatus: (id: number) => Promise<TEntity | null>;
  bulkDelete: (ids: number[]) => Promise<boolean>;

  // UI actions
  openCreateModal: () => void;
  openEditModal: (item: TEntity) => void;
  closeModals: () => void;
  openDeleteDialog: (item: TEntity) => void;
  closeDeleteDialog: () => void;

  // Form actions
  setFormField: (field: string, value: any) => void;
  resetForm: () => void;
  submitForm: () => Promise<void>;
  validateForm: () => boolean;
}

export interface UseEntityManagerOptions<TEntity, TCreateDto, TUpdateDto> {
  // Entity configuration
  entityName: string;
  idField?: keyof TEntity;

  // API operations
  operations: {
    list: (
      searchTerm?: string,
      page?: number,
      pageSize?: number
    ) => Promise<PagedResult<TEntity>>;
    create: (data: TCreateDto) => Promise<TEntity>;
    update: (id: number, data: TUpdateDto) => Promise<TEntity>;
    delete: (id: number) => Promise<void>;
    getById: (id: number) => Promise<TEntity>;
    toggleStatus?: (id: number) => Promise<TEntity>;
    bulkDelete?: (ids: number[]) => Promise<void>;
  };

  // Form configuration
  formConfig: {
    initialData: TCreateDto & TUpdateDto;
    validationRules?: any[];
    transformForEdit?: (entity: TEntity) => TCreateDto & TUpdateDto;
    transformForCreate?: (formData: TCreateDto & TUpdateDto) => TCreateDto;
    transformForUpdate?: (formData: TCreateDto & TUpdateDto) => TUpdateDto;
  };

  // Options
  initialPageSize?: number;
  showToasts?: boolean;
  autoRefreshOnSuccess?: boolean;
}

export function useEntityManager<
  TEntity extends Record<string, any>,
  TCreateDto extends Record<string, any>,
  TUpdateDto extends Record<string, any>
>(
  options: UseEntityManagerOptions<TEntity, TCreateDto, TUpdateDto>
): [
  EntityManagerState<TEntity>,
  EntityManagerActions<TEntity, TCreateDto, TUpdateDto>
] {
  const {
    entityName,
    idField = 'id' as keyof TEntity,
    operations,
    formConfig,
    initialPageSize = 20,
    showToasts = true,
    autoRefreshOnSuccess = true,
  } = options;

  // UI State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<TEntity | null>(null);
  const [itemToDelete, setItemToDelete] = useState<TEntity | null>(null);

  // Hooks
  const { showToast } = useToast();

  const [listState, listActions] = useEntityList<TEntity>({
    fetchFn: operations.list,
    initialPageSize,
    idField,
  });

  const [crudState, crudActions] = useEntityCrud({
    operations,
    entityName,
    showToasts,
    onSuccess: {
      create: () => {
        if (autoRefreshOnSuccess) {
          listActions.refresh();
        }
        setShowCreateModal(false);
        setEditingItem(null);
      },
      update: () => {
        if (autoRefreshOnSuccess) {
          listActions.refresh();
        }
        setShowEditModal(false);
        setEditingItem(null);
      },
      delete: () => {
        if (autoRefreshOnSuccess) {
          listActions.refresh();
        }
        setShowDeleteDialog(false);
        setItemToDelete(null);
      },
      toggleStatus: () => {
        if (autoRefreshOnSuccess) {
          listActions.refresh();
        }
      },
    },
  });

  const formHook = useEntityForm<TCreateDto & TUpdateDto>({
    initialData: formConfig.initialData,
    validationRules: formConfig.validationRules || [],
    onSubmit: async (data: TCreateDto & TUpdateDto) => {
      if (editingItem) {
        const updateData = formConfig.transformForUpdate
          ? formConfig.transformForUpdate(data)
          : (data as TUpdateDto);
        await crudActions.updateEntity(
          editingItem[idField] as number,
          updateData
        );
      } else {
        const createData = formConfig.transformForCreate
          ? formConfig.transformForCreate(data)
          : (data as TCreateDto);
        await crudActions.createEntity(createData);
      }
    },
  });

  // Combined actions
  const openCreateModal = useCallback(() => {
    setEditingItem(null);
    formHook.resetForm();
    setShowCreateModal(true);
  }, [formHook]);

  const openEditModal = useCallback(
    async (item: TEntity) => {
      setEditingItem(item);

      try {
        // Load full entity details if needed
        const fullItem = await crudActions.loadEntity(item[idField] as number);
        if (fullItem) {
          const formData = formConfig.transformForEdit
            ? formConfig.transformForEdit(fullItem)
            : (fullItem as unknown as TCreateDto & TUpdateDto);
          formHook.setData(formData);
        }
      } catch (error) {
        console.error(
          `Failed to load ${entityName.toLowerCase()} details:`,
          error
        );
      }

      setShowEditModal(true);
    },
    [crudActions, formConfig, formHook, entityName, idField]
  );

  const closeModals = useCallback(() => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setEditingItem(null);
  }, []);

  const openDeleteDialog = useCallback((item: TEntity) => {
    setItemToDelete(item);
    setShowDeleteDialog(true);
  }, []);

  const closeDeleteDialog = useCallback(() => {
    setShowDeleteDialog(false);
    setItemToDelete(null);
  }, []);

  const handleDelete = useCallback(async (): Promise<boolean> => {
    if (!itemToDelete) return false;
    const success = await crudActions.deleteEntity(
      itemToDelete[idField] as number
    );
    return success;
  }, [itemToDelete, crudActions, idField]);

  const bulkDelete = useCallback(
    async (ids: number[]): Promise<boolean> => {
      if (!operations.bulkDelete) {
        // Fallback to individual deletes
        try {
          await Promise.all(ids.map((id) => crudActions.deleteEntity(id)));
          if (autoRefreshOnSuccess) {
            await listActions.refresh();
          }
          return true;
        } catch (error) {
          console.error('Bulk delete failed:', error);
          return false;
        }
      }

      try {
        await operations.bulkDelete(ids);
        if (autoRefreshOnSuccess) {
          await listActions.refresh();
        }
        if (showToasts) {
          showToast(
            'success',
            `${ids.length} ${entityName.toLowerCase()}(s) deleted successfully`
          );
        }
        return true;
      } catch (error) {
        console.error('Bulk delete failed:', error);
        if (showToasts) {
          showToast('error', `Failed to delete ${entityName.toLowerCase()}(s)`);
        }
        return false;
      }
    },
    [
      operations,
      crudActions,
      listActions,
      autoRefreshOnSuccess,
      showToasts,
      showToast,
      entityName,
    ]
  );

  const setPageSize = useCallback(
    async (size: number) => {
      await listActions.loadPage(1); // Reset to first page
      // Note: You might need to update your list state to handle page size changes
    },
    [listActions]
  );

  // Combined state
  const state: EntityManagerState<TEntity> = useMemo(
    () => ({
      // List state
      items: listState.items,
      loading: listState.loading,
      error: listState.error,
      searchTerm: listState.searchTerm,
      selectedItems: listState.selectedItems,
      totalCount: listState.totalCount,
      page: listState.page,
      pageSize: listState.pageSize,

      // UI state
      showCreateModal,
      showEditModal,
      showDeleteDialog,
      editingItem,
      itemToDelete,

      // CRUD state
      operationLoading: crudState.operationLoading,

      // Form state
      formState: formHook.formState,
    }),
    [
      listState,
      showCreateModal,
      showEditModal,
      showDeleteDialog,
      editingItem,
      itemToDelete,
      crudState.operationLoading,
      formHook.formState,
    ]
  );

  const actions: EntityManagerActions<TEntity, TCreateDto, TUpdateDto> =
    useMemo(
      () => ({
        // List actions
        setSearchTerm: listActions.setSearchTerm,
        setSelectedItems: listActions.setSelectedItems,
        toggleSelection: listActions.toggleSelection,
        clearSelection: listActions.clearSelection,
        refresh: listActions.refresh,
        loadPage: listActions.loadPage,
        setPageSize,

        // CRUD actions
        createEntity: crudActions.createEntity,
        updateEntity: crudActions.updateEntity,
        deleteEntity: handleDelete,
        toggleEntityStatus: crudActions.toggleEntityStatus,
        bulkDelete,

        // UI actions
        openCreateModal,
        openEditModal,
        closeModals,
        openDeleteDialog,
        closeDeleteDialog,

        // Form actions
        setFormField: formHook.setField,
        resetForm: formHook.resetForm,
        submitForm: formHook.handleSubmit,
        validateForm: formHook.validateForm,
      }),
      [
        listActions,
        setPageSize,
        crudActions,
        handleDelete,
        bulkDelete,
        openCreateModal,
        openEditModal,
        closeModals,
        openDeleteDialog,
        closeDeleteDialog,
        formHook,
      ]
    );

  return [state, actions];
}

import React, { useMemo } from 'react';
import { Layout } from '../components/ui/layout/Layout';
import { PageHeader } from '../components/ui/layout/PageHeader';
import { Button } from '../components/ui/Button';
import { Dialog } from '../components/ui/Dialog';
import {
  EntityTable,
  TableColumn,
  TableAction,
} from '../components/ui/common/EntityTable';
import { EntityModal, FormTab } from '../components/ui/common/EntityModal';
import {
  SearchFilter,
  FilterField,
} from '../components/ui/common/SearchFilter';
import { BulkActions, BulkAction } from '../components/ui/common/BulkActions';
import { Pagination } from '../components/ui/common/Pagination';
import { useEntityManager } from '../hooks/useEntityManager';
import { useToast } from '../hooks/useToast';
import { Toast } from '../components/ui/Toast';
import {
  UserDto,
  CreateUserDto,
  UpdateUserDto,
  UserRole,
  PagedResult,
} from '../types';
import { apiService } from '../services/api.service';
import { fileService } from '../services/file.service';
import { UserFormContent } from '../components/ui/users/UserFormContent';
import { createUserValidationRules } from '../components/ui/users/UserValidationRules';

// API operations
const userOperations = {
  list: (
    searchTerm?: string,
    page?: number,
    pageSize?: number
  ): Promise<PagedResult<UserDto>> => {
    const params = new URLSearchParams();
    if (searchTerm) params.append('search', searchTerm);
    if (page) params.append('page', page.toString());
    if (pageSize) params.append('pageSize', pageSize.toString());

    const query = params.toString();
    return apiService.get<PagedResult<UserDto>>(
      `/user${query ? `?${query}` : ''}`
    );
  },
  create: (data: CreateUserDto) => apiService.post<UserDto>('/user', data),
  update: (id: number, data: UpdateUserDto) =>
    apiService.put<UserDto>(`/user/${id}`, data),
  delete: (id: number) => apiService.delete<void>(`/user/${id}`),
  getById: (id: number) => apiService.get<UserDto>(`/user/${id}`),
  toggleStatus: async (id: number) => {
    const user = await apiService.get<UserDto>(`/user/${id}`);
    const endpoint = user.isActive ? 'deactivate' : 'activate';
    return apiService.post<UserDto>(`/user/${id}/${endpoint}`, {});
  },
  bulkDelete: (ids: number[]) =>
    apiService.delete<void>('/user/bulk-delete', { userIds: ids }),
};

export const UserManagementSimplified: React.FC = () => {
  const { toasts, showToast, hideToast } = useToast();

  // Initialize entity manager
  const [state, actions] = useEntityManager<
    //
    UserDto,
    CreateUserDto,
    UpdateUserDto
  >({
    entityName: 'User',
    operations: userOperations,
    formConfig: {
      initialData: {
        email: '',
        username: '',
        password: '',
        firstName: '',
        lastName: '',
        isActive: true,
        role: UserRole.Customer,
        timezone: '',
        language: '',
        avatarFileId: null,
        addresses: [],
        contactDetails: [],
        preferences: {},
        avatar: null,
      } as CreateUserDto & UpdateUserDto,
      validationRules: createUserValidationRules(!!state.editingItem),
      transformForEdit: (user: UserDto) => ({
        email: user.email,
        username: user.username,
        password: '',
        firstName: user.firstName,
        lastName: user.lastName,
        isActive: user.isActive,
        role: user.role,
        timezone: user.timezone || '',
        language: user.language || '',
        avatarFileId: user.avatarFileId,
        addresses: user.addresses || [],
        contactDetails: user.contactDetails || [],
        preferences: user.preferences || {},
        avatar: null,
      }),
      transformForCreate: (formData) => {
        const { avatar, ...createData } = formData;
        return createData as CreateUserDto;
      },
      transformForUpdate: (formData) => {
        const { password, avatar, ...updateData } = formData;
        return updateData as UpdateUserDto;
      },
    },
  });

  // Table configuration
  const columns: TableColumn<UserDto>[] = useMemo(
    () => [
      {
        key: 'user',
        label: 'User',
        render: (user) => (
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
              {user.avatarFileId ? (
                <img
                  src={fileService.getAvatarUrl(user)?.toString()}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <i className="fas fa-user text-gray-600 dark:text-gray-300" />
              )}
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {user.firstName} {user.lastName}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {user.email}
              </div>
            </div>
          </div>
        ),
      },
      {
        key: 'role',
        label: 'Role',
        render: (user) => (
          <span
            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
              user.role === UserRole.Admin
                ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                : user.role === UserRole.Dev
                ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
            }`}
          >
            {user.roleName}
          </span>
        ),
      },
      {
        key: 'status',
        label: 'Status',
        render: (user) => (
          <span
            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
              user.isActive
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}
          >
            {user.isActive ? 'Active' : 'Inactive'}
          </span>
        ),
      },
      {
        key: 'lastLoginAt',
        label: 'Last Login',
        render: (user) => (
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {user.lastLoginAt
              ? new Date(user.lastLoginAt).toLocaleDateString()
              : 'Never'}
          </span>
        ),
      },
    ],
    []
  );

  const tableActions: TableAction<UserDto>[] = useMemo(
    () => [
      {
        key: 'edit',
        label: 'Edit',
        icon: 'edit',
        variant: 'ghost',
        onClick: actions.openEditModal,
      },
      {
        key: 'toggle-status',
        label: (user: UserDto) => (user.isActive ? 'Deactivate' : 'Activate'),
        icon: (user: UserDto) => (user.isActive ? 'ban' : 'check'),
        variant: 'ghost',
        onClick: (user) => actions.toggleEntityStatus(user.id),
      },
      {
        key: 'delete',
        label: 'Delete',
        icon: 'trash',
        variant: 'ghost',
        onClick: actions.openDeleteDialog,
      },
    ],
    [actions]
  );

  // Bulk actions configuration
  const bulkActions: BulkAction<UserDto>[] = useMemo(
    () => [
      {
        key: 'bulk-delete',
        label: 'Delete Selected',
        icon: 'trash',
        variant: 'danger',
        confirmationRequired: true,
        confirmationTitle: 'Delete Users',
        confirmationMessage: (users) =>
          `Are you sure you want to delete ${users.length} user(s)? This action cannot be undone.`,
        action: async (users) => {
          const ids = users.map((user) => user.id);
          await actions.bulkDelete(ids);
          actions.clearSelection();
        },
      },
      {
        key: 'bulk-export',
        label: 'Export Selected',
        icon: 'download',
        variant: 'secondary',
        action: async (users) => {
          // Export functionality
          console.log('Exporting users:', users);
          showToast('info', `Exporting ${users.length} users...`);
        },
      },
    ],
    [actions, showToast]
  );

  // Filter configuration
  const filterFields: FilterField[] = useMemo(
    () => [
      {
        key: 'role',
        label: 'Role',
        type: 'select',
        options: [
          { value: UserRole.Customer, label: 'Customer' },
          { value: UserRole.Admin, label: 'Admin' },
          { value: UserRole.Dev, label: 'Developer' },
        ],
      },
      {
        key: 'status',
        label: 'Status',
        type: 'select',
        options: [
          { value: 'active', label: 'Active' },
          { value: 'inactive', label: 'Inactive' },
        ],
      },
      {
        key: 'hasAvatar',
        label: 'Has Profile Picture',
        type: 'boolean',
      },
      {
        key: 'createdAt',
        label: 'Registration Date',
        type: 'daterange',
      },
    ],
    []
  );

  // Modal tabs configuration
  const formTabs: FormTab[] = useMemo(
    () => [
      {
        id: 'basic',
        label: 'Basic Info',
        icon: 'user',
        content: (
          <UserFormContent
            formHook={{
              formState: state.formState,
              setField: actions.setFormField,
              getFieldProps: (field) => ({
                value: state.formState.data[field],
                error: state.formState.errors[field],
                touched: state.formState.touched[field],
                onChange: (value) => actions.setFormField(field, value),
              }),
            }}
            editingUser={state.editingItem}
            activeTab="basic"
          />
        ),
      },
      {
        id: 'avatar',
        label: 'Profile Picture',
        icon: 'image',
        content: (
          <UserFormContent
            formHook={{
              formState: state.formState,
              setField: actions.setFormField,
              getFieldProps: (field) => ({
                value: state.formState.data[field],
                error: state.formState.errors[field],
                touched: state.formState.touched[field],
                onChange: (value) => actions.setFormField(field, value),
              }),
            }}
            editingUser={state.editingItem}
            activeTab="avatar"
          />
        ),
      },
      {
        id: 'addresses',
        label: 'Addresses',
        icon: 'map-marker-alt',
        badge: state.formState.data.addresses?.length || 0,
        content: (
          <UserFormContent
            formHook={{
              formState: state.formState,
              setField: actions.setFormField,
              getFieldProps: (field) => ({
                value: state.formState.data[field],
                error: state.formState.errors[field],
                touched: state.formState.touched[field],
                onChange: (value) => actions.setFormField(field, value),
              }),
            }}
            editingUser={state.editingItem}
            activeTab="addresses"
          />
        ),
      },
      {
        id: 'contacts',
        label: 'Contact Details',
        icon: 'phone',
        badge: state.formState.data.contactDetails?.length || 0,
        content: (
          <UserFormContent
            formHook={{
              formState: state.formState,
              setField: actions.setFormField,
              getFieldProps: (field) => ({
                value: state.formState.data[field],
                error: state.formState.errors[field],
                touched: state.formState.touched[field],
                onChange: (value) => actions.setFormField(field, value),
              }),
            }}
            editingUser={state.editingItem}
            activeTab="contacts"
          />
        ),
      },
    ],
    [state.formState, state.editingItem, actions.setFormField]
  );

  return (
    <Layout>
      <div className="space-y-6">
        <PageHeader
          title="User Management"
          subtitle="Manage system users and their permissions"
        >
          <Button
            variant="primary"
            icon="user-plus"
            onClick={actions.openCreateModal}
          >
            Add User
          </Button>
        </PageHeader>

        {/* Search and Filters */}
        <SearchFilter
          searchValue={state.searchTerm}
          onSearchChange={actions.setSearchTerm}
          searchPlaceholder="Search users..."
          filterFields={filterFields}
          showAdvancedFilters={true}
          loading={state.loading}
        />

        {/* Bulk Actions */}
        <BulkActions
          selectedItems={state.selectedItems}
          actions={bulkActions}
          onClearSelection={actions.clearSelection}
          loading={state.operationLoading}
        />

        {/* Users Table */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow">
          <EntityTable
            data={state.items}
            columns={columns}
            actions={tableActions}
            loading={state.loading}
            error={state.error}
            emptyState={{
              icon: 'users',
              title: 'No users found',
              description: 'Start by adding some users to your system.',
              action: {
                label: 'Add User',
                onClick: actions.openCreateModal,
              },
            }}
            onRowClick={actions.openEditModal}
            selectedItems={state.selectedItems}
            onSelectionChange={actions.setSelectedItems}
            selectable={true}
          />

          {/* Pagination */}
          <Pagination
            currentPage={state.page}
            totalPages={Math.ceil(state.totalCount / state.pageSize)}
            totalCount={state.totalCount}
            pageSize={state.pageSize}
            onPageChange={actions.loadPage}
            onPageSizeChange={actions.setPageSize}
            loading={state.loading}
          />
        </div>
      </div>

      {/* Modals and Dialogs */}
      <EntityModal
        isOpen={state.showCreateModal || state.showEditModal}
        onClose={actions.closeModals}
        onSave={actions.submitForm}
        title={state.editingItem ? 'Edit User' : 'Create User'}
        loading={state.loading}
        saving={state.operationLoading || state.formState.isSubmitting}
        size="xl"
        tabs={formTabs}
        saveButtonDisabled={!state.formState.isValid}
      />

      <Dialog
        isOpen={state.showDeleteDialog}
        onClose={actions.closeDeleteDialog}
        onConfirm={() => actions.deleteEntity(state.itemToDelete?.id)}
        title="Delete User"
        message={`Are you sure you want to delete ${state.itemToDelete?.firstName} ${state.itemToDelete?.lastName}? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
        loading={state.operationLoading}
      />

      {/* Toast Notifications */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            type={toast.type}
            message={toast.message}
            isVisible={true}
            onClose={() => hideToast(toast.id)}
            duration={toast.duration}
          />
        ))}
      </div>
    </Layout>
  );
};

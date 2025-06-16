import React, { useState } from 'react';
import { Layout } from '../components/ui/layout/Layout';
import { PageHeader } from '../components/ui/layout/PageHeader';
import {
  EntityTable,
  TableColumn,
  TableAction,
} from '../components/ui/EntityTable';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Dialog } from '../components/ui/Dialog';
import { UserModal } from '../components/users/UserModal';
import {
  useUsers,
  useDeleteUser,
  useActivateUser,
  useDeactivateUser,
  useLockUser,
  useUnlockUser,
} from '../hooks/useUsers';
import { useUserModal } from '../hooks/useUserModal';
import { UserDto } from '@frontend-app/types';
import { fileService } from '../services/file.service';
import { Pagination } from '../components/common/Pagination';

export const Users: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    user: UserDto | null;
  }>({ isOpen: false, user: null });

  // Modal management
  const { isOpen, userId, openCreateModal, openEditModal, closeModal } =
    useUserModal();

  // Data fetching
  const { data, isLoading, error, refetch } = useUsers(
    currentPage,
    pageSize,
    searchTerm
  );

  // Mutations
  const deleteUserMutation = useDeleteUser({
    onSuccess: () => {
      setDeleteConfirmation({ isOpen: false, user: null });
      refetch();
    },
  });

  const activateUserMutation = useActivateUser({
    onSuccess: () => refetch(),
  });

  const deactivateUserMutation = useDeactivateUser({
    onSuccess: () => refetch(),
  });

  const lockUserMutation = useLockUser({
    onSuccess: () => refetch(),
  });

  const unlockUserMutation = useUnlockUser({
    onSuccess: () => refetch(),
  });

  // Table columns
  const columns: TableColumn<UserDto>[] = [
    {
      key: 'avatar',
      label: '',
      width: '60px',
      render: (user) => (
        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
          {user.avatarFileId ? (
            <img
              src={
                fileService.getImageUrl(user.avatarFileId, 'thumbnail') ||
                undefined
              }
              alt={`${user.firstName} ${user.lastName}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <i className="fas fa-user text-gray-400" />
          )}
        </div>
      ),
    },
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (user) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-white">
            {user.firstName} {user.lastName}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            @{user.username}
          </div>
        </div>
      ),
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true,
      render: (user) => (
        <div className="text-sm">
          <div className="text-gray-900 dark:text-white">{user.email}</div>
          {user.emailVerifiedAt && (
            <div className="text-green-600 dark:text-green-400 text-xs flex items-center">
              <i className="fas fa-check-circle mr-1" />
              Verified
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'role',
      label: 'Role',
      sortable: true,
      render: (user) => (
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
            user.role === 2
              ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
              : user.role === 1
              ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
              : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
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
        <div className="flex flex-col space-y-1">
          <span
            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
              user.isActive
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}
          >
            {user.isActive ? 'Active' : 'Inactive'}
          </span>
          {user.isLocked && (
            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
              Locked
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'lastLoginAt',
      label: 'Last Login',
      sortable: true,
      render: (user) => (
        <div className="text-sm text-gray-900 dark:text-white">
          {user.lastLoginAt
            ? new Date(user.lastLoginAt).toLocaleDateString()
            : 'Never'}
        </div>
      ),
    },
    {
      key: 'createdAt',
      label: 'Created',
      sortable: true,
      render: (user) => (
        <div className="text-sm text-gray-900 dark:text-white">
          {new Date(user.createdAt).toLocaleDateString()}
        </div>
      ),
    },
  ];

  // Table actions
  const actions: TableAction<UserDto>[] = [
    {
      key: 'edit',
      label: 'Edit',
      icon: 'edit',
      variant: 'ghost',
      onClick: (user) => openEditModal(user.id),
    },
    {
      key: 'activate',
      label: 'Activate',
      icon: 'check',
      variant: 'success',
      onClick: (user) => activateUserMutation.mutate(user.id),
      visible: (user) => !user.isActive,
      disabled: (user) => activateUserMutation.isPending,
    },
    {
      key: 'deactivate',
      label: 'Deactivate',
      icon: 'times',
      variant: 'warning',
      onClick: (user) => deactivateUserMutation.mutate(user.id),
      visible: (user) => user.isActive,
      disabled: (user) => deactivateUserMutation.isPending,
    },
    {
      key: 'lock',
      label: 'Lock',
      icon: 'lock',
      variant: 'secondary',
      onClick: (user) => lockUserMutation.mutate(user.id),
      visible: (user) => !user.isLocked,
      disabled: (user) => lockUserMutation.isPending,
    },
    {
      key: 'unlock',
      label: 'Unlock',
      icon: 'unlock',
      variant: 'secondary',
      onClick: (user) => unlockUserMutation.mutate(user.id),
      visible: (user) => user.isLocked,
      disabled: (user) => unlockUserMutation.isPending,
    },
    {
      key: 'delete',
      label: 'Delete',
      icon: 'trash',
      variant: 'danger',
      onClick: (user) => setDeleteConfirmation({ isOpen: true, user }),
    },
  ];

  // Handlers
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  const handleDeleteConfirm = () => {
    if (deleteConfirmation.user) {
      deleteUserMutation.mutate(deleteConfirmation.user.id);
    }
  };

  const handleUserSuccess = () => {
    refetch();
  };

  return (
    <Layout>
      <div className="space-y-6">
        <PageHeader
          title="Users"
          subtitle="Manage system users and their permissions"
        >
          <div className="flex items-center space-x-3">
            <div className="w-64">
              <Input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={handleSearch}
                icon="search"
              />
            </div>
            <Button variant="primary" icon="plus" onClick={openCreateModal}>
              Add User
            </Button>
          </div>
        </PageHeader>

        {/* Users Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <EntityTable
            data={data?.items || []}
            columns={columns}
            actions={actions}
            loading={isLoading}
            error={error?.message}
            onRowClick={(user) => openEditModal(user.id)}
            emptyState={{
              icon: 'users',
              title: 'No users found',
              description: searchTerm
                ? 'No users match your search criteria.'
                : 'Get started by creating your first user.',
              action: {
                label: 'Add User',
                onClick: openCreateModal,
              },
            }}
          />

          {/* Pagination */}
          {data && data.totalCount > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(data.totalCount / pageSize)}
              totalCount={data.totalCount}
              pageSize={pageSize}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              loading={isLoading}
            />
          )}
        </div>

        {/* User Modal */}
        <UserModal
          isOpen={isOpen}
          onClose={closeModal}
          userId={userId}
          onSuccess={handleUserSuccess}
        />

        {/* Delete Confirmation Dialog */}
        <Dialog
          isOpen={deleteConfirmation.isOpen}
          onClose={() => setDeleteConfirmation({ isOpen: false, user: null })}
          onConfirm={handleDeleteConfirm}
          title="Delete User"
          message={`Are you sure you want to delete ${deleteConfirmation.user?.firstName} ${deleteConfirmation.user?.lastName}? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          variant="danger"
          loading={deleteUserMutation.isPending}
        />
      </div>
    </Layout>
  );
};

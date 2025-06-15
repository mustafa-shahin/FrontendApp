import React, { useState, useEffect } from 'react';
import { Layout } from '../components/ui/layout/Layout';
import { PageHeader } from '../components/ui/layout/PageHeader';
import { EmptyState } from '../components/ui/layout/EmptyState';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { Select } from '../components/ui/Select';
import { Checkbox } from '../components/ui/Checkbox';
import { Dialog } from '../components/ui/Dialog';
import { User, CreateUserDto, UserRole } from '../types';

const mockUsers: User[] = [
  {
    id: 1,
    email: 'admin@demo.com',
    username: 'admin',
    firstName: 'Admin',
    lastName: 'User',
    isActive: true,
    isLocked: false,
    lastLoginAt: new Date().toISOString(),
    avatarFileId: undefined,
    avatarUrl: undefined,
    timezone: 'UTC',
    language: 'en',
    emailVerifiedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    role: UserRole.Admin,
    roleName: 'Admin',
    preferences: {},
    addresses: [],
    contactDetails: [],
  },
];

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const [userForm, setUserForm] = useState<CreateUserDto>({
    email: '',
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    isActive: true,
    role: UserRole.Customer,
    preferences: {},
    addresses: [],
    contactDetails: [],
  });

  const filteredUsers = users.filter(
    (user) =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateUser = () => {
    setEditingUser(null);
    setUserForm({
      email: '',
      username: '',
      password: '',
      firstName: '',
      lastName: '',
      isActive: true,
      role: UserRole.Customer,
      preferences: {},
      addresses: [],
      contactDetails: [],
    });
    setShowUserModal(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setUserForm({
      email: user.email,
      username: user.username,
      password: '',
      firstName: user.firstName,
      lastName: user.lastName,
      isActive: user.isActive,
      role: user.role,
      preferences: user.preferences,
      addresses: [],
      contactDetails: [],
    });
    setShowUserModal(true);
  };

  const handleSaveUser = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (editingUser) {
        // Update existing user
        setUsers((prev) =>
          prev.map((u) =>
            u.id === editingUser.id
              ? { ...u, ...userForm, updatedAt: new Date().toISOString() }
              : u
          )
        );
      } else {
        // Create new user
        const newUser: User = {
          ...userForm,
          id: Math.max(...users.map((u) => u.id)) + 1,
          roleName: UserRole[userForm.role],
          isLocked: false,
          emailVerifiedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setUsers((prev) => [...prev, newUser]);
      }

      setShowUserModal(false);
    } catch (error) {
      console.error('Failed to save user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
      setShowDeleteDialog(false);
      setUserToDelete(null);
    } catch (error) {
      console.error('Failed to delete user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUserStatus = async (user: User) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      setUsers((prev) =>
        prev.map((u) =>
          u.id === user.id
            ? {
                ...u,
                isActive: !u.isActive,
                updatedAt: new Date().toISOString(),
              }
            : u
        )
      );
    } catch (error) {
      console.error('Failed to toggle user status:', error);
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    { value: UserRole.Customer, label: 'Customer' },
    { value: UserRole.Admin, label: 'Admin' },
    { value: UserRole.Dev, label: 'Developer' },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <PageHeader
          title="User Management"
          subtitle="Manage system users and their permissions"
        >
          <div className="flex items-center space-x-3">
            <Input
              icon="search"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
            <Button
              variant="primary"
              icon="user-plus"
              onClick={handleCreateUser}
            >
              Add User
            </Button>
          </div>
        </PageHeader>

        {/* Users Table */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow overflow-hidden">
          {filteredUsers.length === 0 ? (
            <EmptyState
              icon="users"
              title="No users found"
              description="Start by adding some users to your system."
              action={{
                label: 'Add User',
                onClick: handleCreateUser,
              }}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Last Login
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                            {user.avatarUrl ? (
                              <img
                                src={user.avatarUrl}
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
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
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
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.isActive
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}
                        >
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {user.lastLoginAt
                          ? new Date(user.lastLoginAt).toLocaleDateString()
                          : 'Never'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          icon="edit"
                          onClick={() => handleEditUser(user)}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={user.isActive ? 'ban' : 'check'}
                          onClick={() => handleToggleUserStatus(user)}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          icon="trash"
                          onClick={() => {
                            setUserToDelete(user);
                            setShowDeleteDialog(true);
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* User Modal */}
      <Modal
        isOpen={showUserModal}
        onClose={() => setShowUserModal(false)}
        title={editingUser ? 'Edit User' : 'Create User'}
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="First Name"
              value={userForm.firstName}
              onChange={(e) =>
                setUserForm({ ...userForm, firstName: e.target.value })
              }
              placeholder="Enter first name"
              required
            />
            <Input
              label="Last Name"
              value={userForm.lastName}
              onChange={(e) =>
                setUserForm({ ...userForm, lastName: e.target.value })
              }
              placeholder="Enter last name"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Email"
              type="email"
              value={userForm.email}
              onChange={(e) =>
                setUserForm({ ...userForm, email: e.target.value })
              }
              placeholder="Enter email address"
              required
            />
            <Input
              label="Username"
              value={userForm.username}
              onChange={(e) =>
                setUserForm({ ...userForm, username: e.target.value })
              }
              placeholder="Enter username"
              required
            />
          </div>

          {!editingUser && (
            <Input
              label="Password"
              type="password"
              value={userForm.password}
              onChange={(e) =>
                setUserForm({ ...userForm, password: e.target.value })
              }
              placeholder="Enter password"
              required
            />
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Role"
              value={userForm.role}
              onChange={(e) =>
                setUserForm({
                  ...userForm,
                  role: Number(e.target.value) as UserRole,
                })
              }
              options={roleOptions}
            />
            <div className="flex items-end">
              <Checkbox
                label="Active User"
                checked={userForm.isActive}
                onChange={(e) =>
                  setUserForm({ ...userForm, isActive: e.target.checked })
                }
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="ghost"
              onClick={() => setShowUserModal(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveUser} loading={loading}>
              {editingUser ? 'Update User' : 'Create User'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Dialog */}
      <Dialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteUser}
        title="Delete User"
        message={`Are you sure you want to delete ${userToDelete?.firstName} ${userToDelete?.lastName}? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
        loading={loading}
      />
    </Layout>
  );
};

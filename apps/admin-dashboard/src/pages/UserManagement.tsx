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
import {
  User,
  CreateUserDto,
  UserRole,
  UserListDto,
  PagedResult,
} from '../types/';
import { apiService } from '../services/api.service';

// Removed mockUsers array as per the request

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<UserListDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserListDto | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserListDto | null>(null);

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
    avatar: null,
    avatarFileId: null,
    timezone: null,
    language: null,
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await apiService.get<PagedResult<UserListDto>>('/user');
      setUsers(response.items);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

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
      avatar: null,
      avatarFileId: 0,
      timezone: '',
      language: '',
    });
    setShowUserModal(true);
  };

  const handleEditUser = (user: UserListDto) => {
    setEditingUser(user);
    setUserForm({
      email: user.email,
      username: user.username,
      password: '',
      firstName: user.firstName,
      lastName: user.lastName,
      isActive: user.isActive,
      role: user.role,
      preferences: {},
      addresses: [],
      contactDetails: [],
      avatar: null,
      avatarFileId: null,
      timezone: user.timezone || '',
      language: user.language || '',
    });
    setShowUserModal(true);
  };

  const handleSaveUser = async () => {
    setLoading(true);
    try {
      if (editingUser) {
        const updateUserDto = {
          email: userForm.email,
          username: userForm.username,
          firstName: userForm.firstName,
          lastName: userForm.lastName,
          isActive: userForm.isActive,
          role: userForm.role,
          preferences: userForm.preferences,
          addresses: userForm.addresses,
          contactDetails: userForm.contactDetails,
          language: userForm.language,
          timezone: userForm.timezone,
        };
        await apiService.put<User>(`/user/${editingUser.id}`, updateUserDto);
      } else {
        await apiService.post<User>('/user', userForm);
      }
      setShowUserModal(false);
      fetchUsers();
    } catch (error) {
      console.error('Failed to save user:', error);
      alert('Failed to save user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    setLoading(true);
    try {
      await apiService.delete(`/user/${userToDelete.id}`);
      setShowDeleteDialog(false);
      setUserToDelete(null);
      fetchUsers();
    } catch (error) {
      console.error('Failed to delete user:', error);
      alert('Failed to delete user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUserStatus = async (user: UserListDto) => {
    setLoading(true);
    try {
      if (user.isActive) {
        await apiService.post(`/user/${user.id}/deactivate`);
      } else {
        await apiService.post(`/user/${user.id}/activate`);
      }
      fetchUsers();
    } catch (error) {
      console.error('Failed to toggle user status:', error);
      alert('Failed to toggle user status. Please try again.');
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
          {loading ? (
            <div className="p-6 text-center">Loading users...</div>
          ) : filteredUsers.length === 0 ? (
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
          {/* Add Timezone and Language Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Timezone"
              value={userForm.timezone || ''}
              onChange={(e) =>
                setUserForm({ ...userForm, timezone: e.target.value })
              }
              placeholder="Enter user's timezone"
            />
            <Input
              label="Language"
              value={userForm.language || ''}
              onChange={(e) =>
                setUserForm({ ...userForm, language: e.target.value })
              }
              placeholder="Enter user's preferred language"
            />
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

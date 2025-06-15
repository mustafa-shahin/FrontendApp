import React, { useState, useEffect, useReducer, useCallback } from 'react';
import { Layout } from '../components/ui/layout/Layout';
import { PageHeader } from '../components/ui/layout/PageHeader';
import { EmptyState } from '../components/ui/layout/EmptyState';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { Select } from '../components/ui/Select';
import { Checkbox } from '../components/ui/Checkbox';
import { Dialog } from '../components/ui/Dialog';
import { AvatarUpload } from '../components/ui/form/AvatarUpload';
import {
  UserDto,
  CreateUserDto,
  UserRole,
  PagedResult,
  AddressDto,
  ContactDetailsDto,
  UpdateUserDto,
  UpdateAddressDto,
  UpdateContactDetailsDto,
  CreateAddressDto,
  CreateContactDetailsDto,
} from '../types/';
import { apiService } from '../services/api.service';
import { fileService } from '../services/file.service';
import { AddressForm } from '../components/ui/form/AddressForm';
import { ContactDetailsForm } from '../components/ui/form/ContactDetailsForm';

interface UserFormData {
  email: string;
  username: string;
  password?: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  role: UserRole;
  timezone: string;
  language: string;
  avatarFileId: number | null;
  avatarUrl: string | null;
  addresses: Partial<AddressDto>[];
  contactDetails: Partial<ContactDetailsDto>[];
  preferences: Record<string, unknown>;
}

// Reducer for user form state
type FormAction =
  | { type: 'RESET_FORM' }
  | { type: 'SET_FIELD'; field: keyof UserFormData; value: any }
  | { type: 'SET_FORM_DATA'; data: UserFormData }
  | { type: 'ADD_ADDRESS' }
  | { type: 'UPDATE_ADDRESS'; index: number; address: Partial<AddressDto> }
  | { type: 'REMOVE_ADDRESS'; index: number }
  | { type: 'ADD_CONTACT' }
  | {
      type: 'UPDATE_CONTACT';
      index: number;
      contact: Partial<ContactDetailsDto>;
    }
  | { type: 'REMOVE_CONTACT'; index: number };

const initialUserFormData: UserFormData = {
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
  avatarUrl: null,
  addresses: [],
  contactDetails: [],
  preferences: {},
};

const userFormReducer = (
  state: UserFormData,
  action: FormAction
): UserFormData => {
  switch (action.type) {
    case 'RESET_FORM':
      return initialUserFormData;
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value };
    case 'SET_FORM_DATA':
      return action.data;
    case 'ADD_ADDRESS':
      return {
        ...state,
        addresses: [
          ...state.addresses,
          {
            street: '',
            city: '',
            state: '',
            country: '',
            postalCode: '',
            isDefault: state.addresses.length === 0,
          },
        ],
      };
    case 'UPDATE_ADDRESS':
      return {
        ...state,
        addresses: state.addresses.map((addr, i) =>
          i === action.index ? action.address : addr
        ),
      };
    case 'REMOVE_ADDRESS':
      return {
        ...state,
        addresses: state.addresses.filter((_, i) => i !== action.index),
      };
    case 'ADD_CONTACT':
      return {
        ...state,
        contactDetails: [
          ...state.contactDetails,
          {
            isDefault: state.contactDetails.length === 0,
            additionalContacts: {},
          },
        ],
      };
    case 'UPDATE_CONTACT':
      return {
        ...state,
        contactDetails: state.contactDetails.map((contact, i) =>
          i === action.index ? action.contact : contact
        ),
      };
    case 'REMOVE_CONTACT':
      return {
        ...state,
        contactDetails: state.contactDetails.filter(
          (_, i) => i !== action.index
        ),
      };
    default:
      return state;
  }
};

interface UserFormContentProps {
  userForm: UserFormData;
  dispatch: React.Dispatch<FormAction>;
  editingUser: UserDto | null;
  formLoading: boolean;
  activeTab: string;
  onAvatarChange: (fileId: number | null, avatarUrl: string | null) => void;
  roleOptions: { value: UserRole; label: string }[];
}

const UserFormContent: React.FC<UserFormContentProps> = React.memo(
  ({
    userForm,
    dispatch,
    editingUser,
    formLoading,
    activeTab,
    onAvatarChange,
    roleOptions,
  }) => {
    const handleAddAddress = useCallback(() => {
      dispatch({ type: 'ADD_ADDRESS' });
    }, [dispatch]);

    const handleUpdateAddress = useCallback(
      (index: number, address: Partial<AddressDto>) => {
        dispatch({ type: 'UPDATE_ADDRESS', index, address });
      },
      [dispatch]
    );

    const handleRemoveAddress = useCallback(
      (index: number) => {
        dispatch({ type: 'REMOVE_ADDRESS', index });
      },
      [dispatch]
    );

    const handleAddContactDetails = useCallback(() => {
      dispatch({ type: 'ADD_CONTACT' });
    }, [dispatch]);

    const handleUpdateContactDetails = useCallback(
      (index: number, contact: Partial<ContactDetailsDto>) => {
        dispatch({ type: 'UPDATE_CONTACT', index, contact });
      },
      [dispatch]
    );

    const handleRemoveContactDetails = useCallback(
      (index: number) => {
        dispatch({ type: 'REMOVE_CONTACT', index });
      },
      [dispatch]
    );

    return (
      <div className="min-h-96">
        {activeTab === 'basic' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="First Name"
                value={userForm.firstName}
                onChange={(e) =>
                  dispatch({
                    type: 'SET_FIELD',
                    field: 'firstName',
                    value: e.target.value,
                  })
                }
                placeholder="Enter first name"
                required
              />
              <Input
                label="Last Name"
                value={userForm.lastName}
                onChange={(e) =>
                  dispatch({
                    type: 'SET_FIELD',
                    field: 'lastName',
                    value: e.target.value,
                  })
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
                  dispatch({
                    type: 'SET_FIELD',
                    field: 'email',
                    value: e.target.value,
                  })
                }
                placeholder="Enter email address"
                required
              />
              <Input
                label="Username"
                value={userForm.username}
                onChange={(e) =>
                  dispatch({
                    type: 'SET_FIELD',
                    field: 'username',
                    value: e.target.value,
                  })
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
                  dispatch({
                    type: 'SET_FIELD',
                    field: 'password',
                    value: e.target.value,
                  })
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
                  dispatch({
                    type: 'SET_FIELD',
                    field: 'role',
                    value: Number(e.target.value),
                  })
                }
                options={roleOptions}
              />
              <div className="flex items-end">
                <Checkbox
                  label="Active User"
                  checked={userForm.isActive}
                  onChange={(e) =>
                    dispatch({
                      type: 'SET_FIELD',
                      field: 'isActive',
                      value: e.target.checked,
                    })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Timezone"
                value={userForm.timezone}
                onChange={(e) =>
                  dispatch({
                    type: 'SET_FIELD',
                    field: 'timezone',
                    value: e.target.value,
                  })
                }
                placeholder="Enter user's timezone"
              />
              <Input
                label="Language"
                value={userForm.language}
                onChange={(e) =>
                  dispatch({
                    type: 'SET_FIELD',
                    field: 'language',
                    value: e.target.value,
                  })
                }
                placeholder="Enter user's preferred language"
              />
            </div>
          </div>
        )}

        {activeTab === 'avatar' && (
          <AvatarUpload
            currentAvatarUrl={userForm.avatarUrl || undefined}
            currentAvatarFileId={userForm.avatarFileId || undefined}
            onAvatarChange={onAvatarChange}
            disabled={formLoading}
          />
        )}

        {activeTab === 'addresses' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Addresses
              </h3>
              <Button
                variant="secondary"
                size="sm"
                icon="plus"
                onClick={handleAddAddress}
              >
                Add Address
              </Button>
            </div>

            {userForm.addresses.length === 0 ? (
              <div className="text-center py-8">
                <i className="fas fa-map-marker-alt text-4xl text-gray-400 dark:text-gray-600 mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  No addresses added yet.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {userForm.addresses.map((address, index) => (
                  <AddressForm
                    key={index}
                    address={address}
                    onChange={(updatedAddress) =>
                      handleUpdateAddress(index, updatedAddress)
                    }
                    onRemove={() => handleRemoveAddress(index)}
                    showRemove={userForm.addresses.length > 1}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'contacts' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Contact Details
              </h3>
              <Button
                variant="secondary"
                size="sm"
                icon="plus"
                onClick={handleAddContactDetails}
              >
                Add Contact Details
              </Button>
            </div>

            {userForm.contactDetails.length === 0 ? (
              <div className="text-center py-8">
                <i className="fas fa-phone text-4xl text-gray-400 dark:text-gray-600 mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  No contact details added yet.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {userForm.contactDetails.map((contact, index) => (
                  <ContactDetailsForm
                    key={index}
                    contactDetails={contact}
                    onChange={(updatedContact) =>
                      handleUpdateContactDetails(index, updatedContact)
                    }
                    onRemove={() => handleRemoveContactDetails(index)}
                    showRemove={userForm.contactDetails.length > 1}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
);

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<UserDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserDto | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserDto | null>(null);
  const [activeTab, setActiveTab] = useState('basic');
  const [formLoading, setFormLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [userForm, dispatch] = useReducer(userFormReducer, initialUserFormData);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await apiService.get<PagedResult<UserDto>>('/user');
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
    dispatch({ type: 'RESET_FORM' });
    setFormErrors({});
    setShowUserModal(true);
  };

  const handleEditUser = async (user: UserDto) => {
    setEditingUser(user);
    setFormLoading(true);
    setFormErrors({});

    try {
      const fullUser = await apiService.get<UserDto>(`/user/${user.id}`);
      dispatch({
        type: 'SET_FORM_DATA',
        data: {
          email: fullUser.email,
          username: fullUser.username,
          password: '',
          firstName: fullUser.firstName,
          lastName: fullUser.lastName,
          isActive: fullUser.isActive,
          role: fullUser.role,
          timezone: fullUser.timezone || '',
          language: fullUser.language || '',
          avatarFileId: fullUser.avatarFileId,
          avatarUrl: fileService.getAvatarUrl(fullUser),
          addresses: fullUser.addresses || [],
          contactDetails: fullUser.contactDetails || [],
          preferences: fullUser.preferences || {},
        },
      });
    } catch (error) {
      console.error('Failed to fetch user details:', error);
      dispatch({
        type: 'SET_FORM_DATA',
        data: {
          email: user.email,
          username: user.username,
          password: '',
          firstName: user.firstName,
          lastName: user.lastName,
          isActive: user.isActive,
          role: user.role,
          timezone: user.timezone || '',
          language: user.language || '',
          avatarFileId: null,
          avatarUrl: fileService.getAvatarUrl(user),
          addresses: user.addresses || [],
          contactDetails: user.contactDetails || [],
          preferences: {},
        },
      });
    } finally {
      setFormLoading(false);
      setShowUserModal(true);
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!userForm.firstName.trim())
      errors.firstName = 'First Name is required.';
    if (!userForm.lastName.trim()) errors.lastName = 'Last Name is required.';
    if (!userForm.email.trim()) {
      errors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(userForm.email)) {
      errors.email = 'Email address is invalid.';
    }
    if (!userForm.username.trim()) errors.username = 'Username is required.';
    if (!editingUser && !userForm.password?.trim())
      errors.password = 'Password is required for new users.';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveUser = async () => {
    if (!validateForm()) {
      setActiveTab('basic'); // Direct user to basic info tab if there are errors there
      return;
    }

    setFormLoading(true);
    try {
      if (editingUser) {
        const updateUserDto: UpdateUserDto = {
          email: userForm.email,
          username: userForm.username,
          firstName: userForm.firstName,
          lastName: userForm.lastName,
          isActive: userForm.isActive,
          role: userForm.role,
          timezone: userForm.timezone || null,
          language: userForm.language || null,
          avatarFileId: userForm.avatarFileId,
          preferences: userForm.preferences,
          addresses: userForm.addresses.map((addr) => ({
            id: addr.id,
            street: addr.street || '',
            street2: addr.street2,
            city: addr.city || '',
            state: addr.state || '',
            country: addr.country || '',
            postalCode: addr.postalCode || '',
            region: addr.region,
            district: addr.district,
            isDefault: addr.isDefault || false,
            addressType: addr.addressType,
            notes: addr.notes,
          })) as UpdateAddressDto[],
          contactDetails: userForm.contactDetails.map((contact) => ({
            id: contact.id,
            primaryPhone: contact.primaryPhone,
            secondaryPhone: contact.secondaryPhone,
            mobile: contact.mobile,
            fax: contact.fax,
            email: contact.email,
            secondaryEmail: contact.secondaryEmail,
            website: contact.website,
            linkedInProfile: contact.linkedInProfile,
            twitterProfile: contact.twitterProfile,
            facebookProfile: contact.facebookProfile,
            instagramProfile: contact.instagramProfile,
            whatsAppNumber: contact.whatsAppNumber,
            telegramHandle: contact.telegramHandle,
            additionalContacts: contact.additionalContacts || {},
            isDefault: contact.isDefault || false,
            contactType: contact.contactType,
          })) as UpdateContactDetailsDto[],
        };
        await apiService.put<UserDto>(`/user/${editingUser.id}`, updateUserDto);
      } else {
        const createUserDto: CreateUserDto = {
          email: userForm.email,
          username: userForm.username,
          firstName: userForm.firstName,
          lastName: userForm.lastName,
          isActive: userForm.isActive,
          role: userForm.role,
          timezone: userForm.timezone || null,
          language: userForm.language || null,
          avatarFileId: userForm.avatarFileId,
          preferences: userForm.preferences,
          avatar: null, // This field seems redundant if avatarFileId is used. Check API spec.
          addresses: userForm.addresses.map((addr) => ({
            street: addr.street || '',
            street2: addr.street2,
            city: addr.city || '',
            state: addr.state || '',
            country: addr.country || '',
            postalCode: addr.postalCode || '',
            region: addr.region,
            district: addr.district,
            isDefault: addr.isDefault || false,
            addressType: addr.addressType,
            notes: addr.notes,
          })) as CreateAddressDto[],
          contactDetails: userForm.contactDetails.map((contact) => ({
            primaryPhone: contact.primaryPhone,
            secondaryPhone: contact.secondaryPhone,
            mobile: contact.mobile,
            fax: contact.fax,
            email: contact.email,
            secondaryEmail: contact.secondaryEmail,
            website: contact.website,
            linkedInProfile: contact.linkedInProfile,
            twitterProfile: contact.twitterProfile,
            facebookProfile: contact.facebookProfile,
            instagramProfile: contact.instagramProfile,
            whatsAppNumber: contact.whatsAppNumber,
            telegramHandle: contact.telegramHandle,
            additionalContacts: contact.additionalContacts || {},
            isDefault: contact.isDefault || false,
            contactType: contact.contactType,
          })) as CreateContactDetailsDto[],
          password: '',
        };
        await apiService.post<UserDto>('/user', createUserDto);
      }

      setShowUserModal(false);
      fetchUsers();
    } catch (error) {
      console.error('Failed to save user:', error);
    } finally {
      setFormLoading(false);
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
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUserStatus = async (user: UserDto) => {
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
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = useCallback(
    (fileId: number | null, avatarUrl: string | null) => {
      dispatch({ type: 'SET_FIELD', field: 'avatarFileId', value: fileId });
      dispatch({ type: 'SET_FIELD', field: 'avatarUrl', value: avatarUrl });
    },
    [dispatch]
  );

  const roleOptions = [
    { value: UserRole.Customer, label: 'Customer' },
    { value: UserRole.Admin, label: 'Admin' },
    { value: UserRole.Dev, label: 'Developer' },
  ];

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: 'user' },
    { id: 'avatar', label: 'Profile Picture', icon: 'image' },
    { id: 'addresses', label: 'Addresses', icon: 'map-marker-alt' },
    { id: 'contacts', label: 'Contact Details', icon: 'phone' },
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

      {/* Enhanced User Modal */}
      <Modal
        isOpen={showUserModal}
        onClose={() => setShowUserModal(false)}
        title={editingUser ? 'Edit User' : 'Create User'}
        size="xl"
      >
        {formLoading ? (
          <div className="p-6 text-center">
            <i className="fas fa-spinner fa-spin text-2xl text-blue-600 dark:text-blue-400 mb-4" />
            <p>Loading user details...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="flex space-x-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    <i className={`fas fa-${tab.icon} mr-2`} />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <UserFormContent
              userForm={userForm}
              dispatch={dispatch}
              editingUser={editingUser}
              formLoading={formLoading}
              activeTab={activeTab}
              onAvatarChange={handleAvatarChange}
              roleOptions={roleOptions}
            />

            {/* Form Validation Errors (General) */}
            {Object.keys(formErrors).length > 0 && (
              <div className="p-3 bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200 rounded-md">
                <p className="font-semibold mb-2">
                  Please correct the following errors:
                </p>
                <ul className="list-disc list-inside">
                  {Object.entries(formErrors).map(([key, message]) => (
                    <li key={key}>{message}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="ghost"
                onClick={() => setShowUserModal(false)}
                disabled={formLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveUser}
                loading={formLoading}
                disabled={formLoading}
              >
                {editingUser ? 'Update User' : 'Create User'}
              </Button>
            </div>
          </div>
        )}
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

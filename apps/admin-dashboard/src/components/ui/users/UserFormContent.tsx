import React from 'react';
import { Input } from '../Input';
import { Select } from '../Select';
import { Checkbox } from '../Checkbox';
import { Button } from '../Button';
import { AvatarUpload } from '../form/AvatarUpload';
import { AddressForm } from '../form/AddressForm';
import { ContactDetailsForm } from '../form/ContactDetailsForm';
import {
  UserDto,
  UserRole,
  AddressDto,
  ContactDetailsDto,
} from '../../../types';

interface UserFormData {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  role: UserRole;
  timezone: string;
  language: string;
  avatarFileId: number | null;
  addresses: any[];
  contactDetails: any[];
  preferences: Record<string, unknown>;
  avatarUrl: string | null;
}

interface UserFormContentProps {
  formHook: {
    formState: {
      data: UserFormData;
      errors: Partial<Record<keyof UserFormData, string>>;
      touched: Partial<Record<keyof UserFormData, boolean>>;
      isValid: boolean;
      isDirty: boolean;
      isSubmitting: boolean;
    };
    setField: (field: keyof UserFormData, value: any) => void;
    getFieldProps: (field: keyof UserFormData) => {
      value: any;
      error?: string;
      touched?: boolean;
      onChange: (value: any) => void;
    };
  };
  editingUser: UserDto | null;
  activeTab: string;
}

export const UserFormContent: React.FC<UserFormContentProps> = ({
  formHook,
  editingUser,
  activeTab,
}) => {
  const { formState, setField } = formHook;

  const roleOptions = [
    { value: UserRole.Customer, label: 'Customer' },
    { value: UserRole.Admin, label: 'Admin' },
    { value: UserRole.Dev, label: 'Developer' },
  ];

  const handleAvatarChange = (
    fileId: number | null,
    avatarUrl: string | null
  ) => {
    setField('avatarFileId', fileId);
  };

  const handleAddAddress = () => {
    const newAddress: Partial<AddressDto> = {
      street: '',
      city: '',
      state: '',
      country: '',
      postalCode: '',
      isDefault: formState.data.addresses.length === 0,
    };
    setField('addresses', [...formState.data.addresses, newAddress]);
  };

  const handleUpdateAddress = (index: number, address: Partial<AddressDto>) => {
    const updatedAddresses = [...formState.data.addresses];
    updatedAddresses[index] = address;
    setField('addresses', updatedAddresses);
  };

  const handleRemoveAddress = (index: number) => {
    const updatedAddresses = formState.data.addresses.filter(
      (_: any, i: number) => i !== index
    );
    setField('addresses', updatedAddresses);
  };

  const handleAddContactDetails = () => {
    const newContact: Partial<ContactDetailsDto> = {
      isDefault: formState.data.contactDetails.length === 0,
      additionalContacts: {},
    };
    setField('contactDetails', [...formState.data.contactDetails, newContact]);
  };

  const handleUpdateContactDetails = (
    index: number,
    contact: Partial<ContactDetailsDto>
  ) => {
    const updatedContacts = [...formState.data.contactDetails];
    updatedContacts[index] = contact;
    setField('contactDetails', updatedContacts);
  };

  const handleRemoveContactDetails = (index: number) => {
    const updatedContacts = formState.data.contactDetails.filter(
      (_: any, i: number) => i !== index
    );
    setField('contactDetails', updatedContacts);
  };

  const handleFieldBlur = () => {
    // Field blur handler - can be implemented later if needed
  };

  switch (activeTab) {
    case 'basic':
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="First Name"
              value={formState.data.firstName}
              error={formState.errors.firstName}
              onChange={(e) => setField('firstName', e.target.value)}
              onBlur={handleFieldBlur}
              placeholder="Enter first name"
              required
            />
            <Input
              label="Last Name"
              value={formState.data.lastName}
              error={formState.errors.lastName}
              onChange={(e) => setField('lastName', e.target.value)}
              onBlur={handleFieldBlur}
              placeholder="Enter last name"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Email"
              type="email"
              value={formState.data.email}
              error={formState.errors.email}
              onChange={(e) => setField('email', e.target.value)}
              onBlur={handleFieldBlur}
              placeholder="Enter email address"
              required
            />
            <Input
              label="Username"
              value={formState.data.username}
              error={formState.errors.username}
              onChange={(e) => setField('username', e.target.value)}
              onBlur={handleFieldBlur}
              placeholder="Enter username"
              required
            />
          </div>

          {!editingUser && (
            <Input
              label="Password"
              type="password"
              value={formState.data.password}
              error={formState.errors.password}
              onChange={(e) => setField('password', e.target.value)}
              onBlur={handleFieldBlur}
              placeholder="Enter password"
              required
            />
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Role"
              value={formState.data.role}
              onChange={(e) => setField('role', Number(e.target.value))}
              options={roleOptions}
            />
            <div className="flex items-end">
              <Checkbox
                label="Active User"
                checked={formState.data.isActive}
                onChange={(e) => setField('isActive', e.target.checked)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Timezone"
              value={formState.data.timezone}
              error={formState.errors.timezone}
              onChange={(e) => setField('timezone', e.target.value)}
              onBlur={handleFieldBlur}
              placeholder="Enter user's timezone"
            />
            <Input
              label="Language"
              value={formState.data.language}
              error={formState.errors.language}
              onChange={(e) => setField('language', e.target.value)}
              onBlur={handleFieldBlur}
              placeholder="Enter user's preferred language"
            />
          </div>
        </div>
      );

    case 'avatar':
      return (
        <AvatarUpload
          currentAvatarUrl={formState.data.avatarUrl || undefined}
          currentAvatarFileId={formState.data.avatarFileId || undefined}
          onAvatarChange={handleAvatarChange}
          disabled={formState.isSubmitting}
        />
      );

    case 'addresses':
      return (
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

          {formState.data.addresses.length === 0 ? (
            <div className="text-center py-8">
              <i className="fas fa-map-marker-alt text-4xl text-gray-400 dark:text-gray-600 mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                No addresses added yet.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {formState.data.addresses.map(
                (address: Partial<AddressDto>, index: number) => (
                  <AddressForm
                    key={index}
                    address={address}
                    onChange={(updatedAddress) =>
                      handleUpdateAddress(index, updatedAddress)
                    }
                    onRemove={() => handleRemoveAddress(index)}
                    showRemove={formState.data.addresses.length > 1}
                  />
                )
              )}
            </div>
          )}
        </div>
      );

    case 'contacts':
      return (
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

          {formState.data.contactDetails.length === 0 ? (
            <div className="text-center py-8">
              <i className="fas fa-phone text-4xl text-gray-400 dark:text-gray-600 mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                No contact details added yet.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {formState.data.contactDetails.map(
                (contact: Partial<ContactDetailsDto>, index: number) => (
                  <ContactDetailsForm
                    key={index}
                    contactDetails={contact}
                    onChange={(updatedContact) =>
                      handleUpdateContactDetails(index, updatedContact)
                    }
                    onRemove={() => handleRemoveContactDetails(index)}
                    showRemove={formState.data.contactDetails.length > 1}
                  />
                )
              )}
            </div>
          )}
        </div>
      );

    default:
      return <div>Unknown tab</div>;
  }
};

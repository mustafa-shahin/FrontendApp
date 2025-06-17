import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { EntityModal, FormTab } from '../ui/EntityModal';
import {
  FormGenerator,
  getUserFormFields,
  getAddressFormFields,
  getContactDetailsFormFields,
} from '../forms/FormGenerator';
import { Button } from '../ui/Button';
import { AvatarSelector } from './AvatarSelector';
import {
  useUser,
  useCreateUser,
  useUpdateUser,
  useUpdateUserAvatar,
} from '../../hooks/useUsers';
import {
  createUserSchema,
  updateUserSchema,
  CreateUserFormData,
  UpdateUserFormData,
  AddressFormData,
  ContactDetailsFormData,
} from '../../schemas';
import { UserDto, CreateUserDto, UpdateUserDto } from '@frontend-app/types';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: number | null;
  onSuccess?: () => void;
}

export const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  onClose,
  userId,
  onSuccess,
}) => {
  const isEdit = !!userId;
  const [activeAvatarFileId, setActiveAvatarFileId] = useState<number | null>(
    null
  );
  const [addresses, setAddresses] = useState<AddressFormData[]>([]);
  const [contactDetails, setContactDetails] = useState<
    ContactDetailsFormData[]
  >([]);

  // Queries and mutations
  const { data: user, isLoading: userLoading } = useUser(userId || 0, isEdit);
  const createUserMutation = useCreateUser({
    onSuccess: () => {
      onSuccess?.();
      onClose();
    },
  });
  const updateUserMutation = useUpdateUser({
    onSuccess: () => {
      onSuccess?.();
      onClose();
    },
  });
  const updateAvatarMutation = useUpdateUserAvatar();

  // Form setup
  const form = useForm<CreateUserFormData | UpdateUserFormData>({
    resolver: zodResolver(isEdit ? updateUserSchema : createUserSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      role: 0,
      isActive: true,
      addresses: [],
      contactDetails: [],
    },
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = form;

  // Load user data for editing
  useEffect(() => {
    if (isEdit && user) {
      reset({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        pictureFileId: user.pictureFileId,
      });
      setActiveAvatarFileId(user.pictureFileId);
      setAddresses(user.addresses);
      setContactDetails(user.contactDetails);
    } else if (!isEdit) {
      reset({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        role: 0,
        isActive: true,
        addresses: [],
        contactDetails: [],
      });
      setActiveAvatarFileId(null);
      setAddresses([]);
      setContactDetails([]);
    }
  }, [user, isEdit, reset]);

  const onSubmit = async (data: CreateUserFormData | UpdateUserFormData) => {
    try {
      const userData = {
        ...data,
        addresses,
        contactDetails,
        pictureFileId: activeAvatarFileId,
      };

      if (isEdit) {
        await updateUserMutation.mutateAsync({
          id: userId!,
          userData: userData as UpdateUserDto,
        });
      } else {
        await createUserMutation.mutateAsync(userData as CreateUserDto);
      }
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const addAddress = () => {
    const newAddress: AddressFormData = {
      street: '',
      city: '',
      state: '',
      country: '',
      postalCode: '',
      isDefault: addresses.length === 0,
    };
    setAddresses([...addresses, newAddress]);
  };

  const updateAddress = (index: number, addressData: AddressFormData) => {
    const updatedAddresses = [...addresses];
    updatedAddresses[index] = addressData;
    setAddresses(updatedAddresses);
  };

  const removeAddress = (index: number) => {
    setAddresses(addresses.filter((_, i) => i !== index));
  };

  const addContactDetail = () => {
    const newContact: ContactDetailsFormData = {
      isDefault: contactDetails.length === 0,
      additionalContacts: {},
    };
    setContactDetails([...contactDetails, newContact]);
  };

  const updateContactDetail = (
    index: number,
    contactData: ContactDetailsFormData
  ) => {
    const updatedContacts = [...contactDetails];
    updatedContacts[index] = contactData;
    setContactDetails(updatedContacts);
  };

  const removeContactDetail = (index: number) => {
    setContactDetails(contactDetails.filter((_, i) => i !== index));
  };

  const tabs: FormTab[] = [
    {
      id: 'basic',
      label: 'Basic Information',
      icon: 'user',
      content: (
        <div className="space-y-6">
          <FormGenerator form={form} fields={getUserFormFields(!isEdit)} />

          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Profile Picture
            </h4>
            <AvatarSelector
              selectedFileId={activeAvatarFileId}
              onFileSelect={setActiveAvatarFileId}
              currentUser={user}
            />
          </div>
        </div>
      ),
    },
    {
      id: 'addresses',
      label: 'Addresses',
      icon: 'map-marker-alt',
      badge: addresses.length > 0 ? addresses.length : undefined,
      content: (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h4 className="text-lg font-medium text-gray-900 dark:text-white">
              Addresses
            </h4>
            <Button
              variant="secondary"
              size="sm"
              icon="plus"
              onClick={addAddress}
            >
              Add Address
            </Button>
          </div>

          {addresses.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              No addresses added yet
            </p>
          ) : (
            <div className="space-y-6">
              {addresses.map((address, index) => (
                <AddressForm
                  key={index}
                  address={address}
                  onUpdate={(data) => updateAddress(index, data)}
                  onRemove={() => removeAddress(index)}
                  canRemove={addresses.length > 1}
                />
              ))}
            </div>
          )}
        </div>
      ),
    },
    {
      id: 'contacts',
      label: 'Contact Details',
      icon: 'phone',
      badge: contactDetails.length > 0 ? contactDetails.length : undefined,
      content: (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h4 className="text-lg font-medium text-gray-900 dark:text-white">
              Contact Details
            </h4>
            <Button
              variant="secondary"
              size="sm"
              icon="plus"
              onClick={addContactDetail}
            >
              Add Contact
            </Button>
          </div>

          {contactDetails.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              No contact details added yet
            </p>
          ) : (
            <div className="space-y-6">
              {contactDetails.map((contact, index) => (
                <ContactForm
                  key={index}
                  contact={contact}
                  onUpdate={(data) => updateContactDetail(index, data)}
                  onRemove={() => removeContactDetail(index)}
                  canRemove={contactDetails.length > 1}
                />
              ))}
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <EntityModal
      isOpen={isOpen}
      onClose={onClose}
      onSave={handleSubmit(onSubmit)}
      title={isEdit ? 'Edit User' : 'Create User'}
      loading={userLoading}
      saving={
        isSubmitting ||
        createUserMutation.isPending ||
        updateUserMutation.isPending
      }
      size="xl"
      tabs={tabs}
      saveLabel={isEdit ? 'Update User' : 'Create User'}
    />
  );
};

// Address Form Component
interface AddressFormProps {
  address: AddressFormData;
  onUpdate: (address: AddressFormData) => void;
  onRemove: () => void;
  canRemove: boolean;
}

const AddressForm: React.FC<AddressFormProps> = ({
  address,
  onUpdate,
  onRemove,
  canRemove,
}) => {
  const form = useForm<AddressFormData>({
    defaultValues: address,
  });

  const { handleSubmit, watch } = form;

  // Watch for form changes and update parent
  useEffect(() => {
    const subscription = watch((value) => {
      onUpdate(value as AddressFormData);
    });
    return () => subscription.unsubscribe();
  }, [watch, onUpdate]);

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h5 className="font-medium text-gray-900 dark:text-white">
          {address.addressType || 'Address'}
        </h5>
        {canRemove && (
          <Button variant="danger" size="sm" icon="trash" onClick={onRemove} />
        )}
      </div>

      <FormGenerator form={form} fields={getAddressFormFields()} />
    </div>
  );
};

// Contact Form Component
interface ContactFormProps {
  contact: ContactDetailsFormData;
  onUpdate: (contact: ContactDetailsFormData) => void;
  onRemove: () => void;
  canRemove: boolean;
}

const ContactForm: React.FC<ContactFormProps> = ({
  contact,
  onUpdate,
  onRemove,
  canRemove,
}) => {
  const form = useForm<ContactDetailsFormData>({
    defaultValues: contact,
  });

  const { watch } = form;

  // Watch for form changes and update parent
  useEffect(() => {
    const subscription = watch((value) => {
      onUpdate(value as ContactDetailsFormData);
    });
    return () => subscription.unsubscribe();
  }, [watch, onUpdate]);

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h5 className="font-medium text-gray-900 dark:text-white">
          {contact.contactType || 'Contact Details'}
        </h5>
        {canRemove && (
          <Button variant="danger" size="sm" icon="trash" onClick={onRemove} />
        )}
      </div>

      <FormGenerator form={form} fields={getContactDetailsFormFields()} />
    </div>
  );
};

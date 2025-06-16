import React, { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { EntityModal, FormTab } from '../ui/EntityModal';
import { UserBasicInfoForm } from './forms/UserBasicInfoForm';
import { AddressForm } from './forms/AddressForm';
import { ContactDetailsForm } from './forms/ContactDetailsForm';
import {
  CreateUserFormData,
  UpdateUserFormData,
  CreateUserSchema,
  UpdateUserSchema,
} from '../../schemas';
import { useCreateUser, useUpdateUser, useUser } from '../../hooks/useUsers';
import { UserDto } from '@frontend-app/types';
import { fileService } from '../../services/file.service';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: number | null;
  onSuccess?: (user: UserDto) => void;
}

export const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  onClose,
  userId,
  onSuccess,
}) => {
  const isEdit = !!userId;
  const title = isEdit ? 'Edit User' : 'Create User';

  // Fetch user data for edit mode
  const {
    data: userData,
    isLoading: isUserLoading,
    error: userError,
  } = useUser(userId!, {
    enabled: isEdit && !!userId,
    queryKey: [],
  });

  // Form setup
  const schema = isEdit ? UpdateUserSchema : CreateUserSchema;
  const defaultValues = useMemo(() => {
    if (isEdit && userData) {
      return {
        email: userData.email,
        username: userData.username,
        firstName: userData.firstName,
        lastName: userData.lastName,
        isActive: userData.isActive,
        avatarFileId: userData.avatarFileId,
        timezone: userData.timezone,
        language: userData.language,
        role: userData.role,
        preferences: userData.preferences,
        addresses: userData.addresses.map((addr) => ({
          id: addr.id,
          street: addr.street,
          street2: addr.street2,
          city: addr.city,
          state: addr.state,
          country: addr.country,
          postalCode: addr.postalCode,
          region: addr.region,
          district: addr.district,
          isDefault: addr.isDefault,
          addressType: addr.addressType,
          notes: addr.notes,
        })),
        contactDetails: userData.contactDetails.map((contact) => ({
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
          additionalContacts: contact.additionalContacts,
          isDefault: contact.isDefault,
          contactType: contact.contactType,
        })),
        avatar: null,
      } as UpdateUserFormData;
    }

    return {
      email: '',
      username: '',
      password: '',
      firstName: '',
      lastName: '',
      isActive: true,
      avatarFileId: null,
      timezone: null,
      language: null,
      role: 0, // Customer
      preferences: {},
      addresses: [],
      contactDetails: [],
      avatar: null,
    } as CreateUserFormData;
  }, [isEdit, userData]);

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    watch,
  } = useForm<CreateUserFormData | UpdateUserFormData>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  // Reset form when modal opens/closes or data changes
  useEffect(() => {
    if (isOpen) {
      reset(defaultValues);
    }
  }, [isOpen, defaultValues, reset]);

  // Mutations
  const createUserMutation = useCreateUser({
    onSuccess: (data) => {
      onSuccess?.(data);
      onClose();
    },
    onError: (error) => {
      console.error('Failed to create user:', error);
    },
  });

  const updateUserMutation = useUpdateUser({
    onSuccess: (data) => {
      onSuccess?.(data);
      onClose();
    },
    onError: (error) => {
      console.error('Failed to update user:', error);
    },
  });

  // Form submission
  const onSubmit = (data: CreateUserFormData | UpdateUserFormData) => {
    if (isEdit && userId) {
      updateUserMutation.mutate({
        id: userId,
        userData: data as UpdateUserFormData,
      });
    } else {
      createUserMutation.mutate(data as CreateUserFormData);
    }
  };

  // Get avatar preview URL
  const avatarPreviewUrl = useMemo(() => {
    if (userData?.avatarFileId) {
      return (
        fileService.getImageUrl(userData.avatarFileId, 'download') ?? undefined
      );
    }
    return undefined;
  }, [userData?.avatarFileId]);

  // Form validation errors for tabs
  const getTabErrors = (fields: string[]) => {
    return fields.some((field) => {
      const fieldPath = field.split('.');
      let errorObj: any = errors;
      for (const path of fieldPath) {
        if (errorObj?.[path]) {
          errorObj = errorObj[path];
        } else {
          return false;
        }
      }
      return !!errorObj;
    });
  };

  // Tab configuration
  const tabs: FormTab[] = [
    {
      id: 'basic',
      label: 'Basic Info',
      icon: 'user',
      content: (
        <UserBasicInfoForm
          control={control}
          errors={errors}
          isEdit={isEdit}
          avatarPreviewUrl={avatarPreviewUrl}
        />
      ),
    },
    {
      id: 'addresses',
      label: 'Addresses',
      icon: 'map-marker-alt',
      badge: watch('addresses')?.length || 0,
      content: <AddressForm control={control} errors={errors} />,
    },
    {
      id: 'contacts',
      label: 'Contact Details',
      icon: 'address-book',
      badge: watch('contactDetails')?.length || 0,
      content: <ContactDetailsForm control={control} errors={errors} />,
    },
  ];

  // Loading state
  const isLoading = isEdit ? isUserLoading : false;
  const isSaving = createUserMutation.isPending || updateUserMutation.isPending;

  // Error state
  const hasError = !!userError;
  const errorMessage = userError?.message || 'Failed to load user data';

  return (
    <EntityModal
      isOpen={isOpen}
      onClose={onClose}
      onSave={handleSubmit(onSubmit)}
      title={title}
      loading={isLoading}
      saving={isSaving}
      size="xl"
      tabs={tabs}
      saveLabel={isEdit ? 'Update User' : 'Create User'}
      saveButtonDisabled={!isDirty && isEdit}
      errors={hasError ? [{ field: 'general', message: errorMessage }] : []}
    />
  );
};

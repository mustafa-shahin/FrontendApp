import React from 'react';
import { Control, FieldErrors } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import {
  FormInput,
  FormSelect,
  FormCheckbox,
  FormFileInput,
} from '../../forms';
import { UserRole } from '@frontend-app/types';
import { CreateUserFormData, UpdateUserFormData } from '../../../schemas';

interface UserBasicInfoFormProps {
  control: Control<CreateUserFormData | UpdateUserFormData>;
  errors: FieldErrors<CreateUserFormData | UpdateUserFormData>;
  isEdit?: boolean;
  avatarPreviewUrl?: string;
}

export const UserBasicInfoForm: React.FC<UserBasicInfoFormProps> = ({
  control,
  errors,
  isEdit = false,
  avatarPreviewUrl,
}) => {
  const roleOptions = [
    { value: UserRole.Customer, label: 'Customer' },
    { value: UserRole.Admin, label: 'Admin' },
    { value: UserRole.Dev, label: 'Developer' },
  ];

  const timezoneOptions = [
    { value: 'UTC', label: 'UTC' },
    { value: 'America/New_York', label: 'Eastern Time' },
    { value: 'America/Chicago', label: 'Central Time' },
    { value: 'America/Denver', label: 'Mountain Time' },
    { value: 'America/Los_Angeles', label: 'Pacific Time' },
    { value: 'Europe/London', label: 'London' },
    { value: 'Europe/Paris', label: 'Paris' },
    { value: 'Europe/Berlin', label: 'Berlin' },
    { value: 'Asia/Tokyo', label: 'Tokyo' },
    { value: 'Asia/Shanghai', label: 'Shanghai' },
  ];

  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' },
    { value: 'it', label: 'Italian' },
    { value: 'ja', label: 'Japanese' },
    { value: 'zh', label: 'Chinese' },
  ];

  return (
    <div className="space-y-6">
      {/* Avatar Upload */}
      <div className="flex justify-center mb-6">
        <Controller
          name="avatar"
          control={control}
          render={({ field: { onChange, value, ...field } }) => (
            <FormFileInput
              {...field}
              label="Profile Picture"
              accept="image/*"
              previewUrl={avatarPreviewUrl}
              onFileChange={(files) => onChange(files?.[0] || null)}
              error={errors.avatar}
              description="Upload a profile picture (JPEG, PNG, max 5MB)"
            />
          )}
        />
      </div>

      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Controller
          name="firstName"
          control={control}
          render={({ field }) => (
            <FormInput
              {...field}
              label="First Name"
              placeholder="Enter first name"
              required
              error={errors.firstName}
            />
          )}
        />

        <Controller
          name="lastName"
          control={control}
          render={({ field }) => (
            <FormInput
              {...field}
              label="Last Name"
              placeholder="Enter last name"
              required
              error={errors.lastName}
            />
          )}
        />

        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <FormInput
              {...field}
              type="email"
              label="Email Address"
              placeholder="Enter email address"
              required
              icon="envelope"
              error={errors.email}
            />
          )}
        />

        <Controller
          name="username"
          control={control}
          render={({ field }) => (
            <FormInput
              {...field}
              label="Username"
              placeholder="Enter username"
              required
              icon="user"
              error={errors.username}
            />
          )}
        />

        {!isEdit && (
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <FormInput
                {...field}
                type="password"
                label="Password"
                placeholder="Enter password"
                required
                icon="lock"
                error={
                  !isEdit
                    ? (errors as FieldErrors<CreateUserFormData>).password
                    : undefined
                }
                className="md:col-span-2"
              />
            )}
          />
        )}

        <Controller
          name="role"
          control={control}
          render={({ field }) => (
            <FormSelect
              {...field}
              label="Role"
              options={roleOptions}
              placeholder="Select role"
              required
              error={errors.role}
            />
          )}
        />

        <Controller
          name="timezone"
          control={control}
          render={({ field: { value, ...fieldProps } }) => (
            <FormSelect
              {...fieldProps}
              value={value ?? undefined}
              label="Timezone"
              options={timezoneOptions}
              placeholder="Select timezone"
              error={errors.timezone}
            />
          )}
        />

        <Controller
          name="language"
          control={control}
          render={({ field: { value, ...fieldProps } }) => (
            <FormSelect
              {...fieldProps}
              value={value ?? undefined}
              label="Language"
              options={languageOptions}
              placeholder="Select language"
              error={errors.language}
            />
          )}
        />
      </div>

      {/* Status Checkboxes */}
      <div className="flex flex-wrap gap-6">
        <Controller
          name="isActive"
          control={control}
          render={({ field: { value, onChange, ...field } }) => (
            <FormCheckbox
              {...field}
              checked={value}
              onChange={(e) => onChange(e.target.checked)}
              label="Active User"
              error={errors.isActive}
            />
          )}
        />
      </div>
    </div>
  );
};

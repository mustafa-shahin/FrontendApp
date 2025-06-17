import { UseFormReturn, FieldPath, FieldValues } from 'react-hook-form';
import { FormFieldConfig } from '../../schemas';
import { FormInput } from './FormInput';
import { FormSelect } from './FormSelect';
import { FormTextarea } from './FormTextarea';
import { FormCheckbox } from './FormCheckbox';
import { FormFileInput } from './FormFileInput';

interface FormGeneratorProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  fields: FormFieldConfig[];
  className?: string;
}

export function FormGenerator<T extends FieldValues>({
  form,
  fields,
  className = '',
}: FormGeneratorProps<T>) {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = form;

  const renderField = (field: FormFieldConfig) => {
    if (field.hidden) return null;

    const fieldName = field.name as FieldPath<T>;
    const error = errors[fieldName];
    const commonProps = {
      label: field.label,
      required: field.required,
      description: field.description,
      disabled: field.disabled,
      error: error,
    };

    switch (field.type) {
      case 'text':
      case 'email':
      case 'password':
      case 'number':
        return (
          <FormInput
            key={field.name}
            type={field.type}
            placeholder={field.placeholder}
            {...commonProps}
            {...register(fieldName)}
          />
        );

      case 'textarea':
        return (
          <FormTextarea
            key={field.name}
            placeholder={field.placeholder}
            rows={field.rows}
            {...commonProps}
            {...register(fieldName)}
          />
        );

      case 'select':
        return (
          <FormSelect
            key={field.name}
            options={field.options || []}
            placeholder={field.placeholder}
            {...commonProps}
            {...register(fieldName)}
          />
        );

      case 'multiselect':
        return (
          <FormSelect
            key={field.name}
            options={field.options || []}
            placeholder={field.placeholder}
            multiple={true}
            {...commonProps}
            {...register(fieldName)}
          />
        );

      case 'checkbox':
        return (
          <FormCheckbox
            key={field.name}
            {...commonProps}
            {...register(fieldName)}
          />
        );

      case 'file':
        return (
          <FormFileInput
            key={field.name}
            accept={field.accept}
            multiple={field.multiple}
            {...commonProps}
            onFileChange={(files) => {
              setValue(fieldName, field.multiple ? files : files?.[0] || null);
            }}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>{fields.map(renderField)}</div>
  );
}

// Field configuration generators for common entities
export const getUserFormFields = (isCreate = false): FormFieldConfig[] => [
  {
    name: 'firstName',
    label: 'First Name',
    type: 'text',
    required: true,
    placeholder: 'Enter first name',
  },
  {
    name: 'lastName',
    label: 'Last Name',
    type: 'text',
    required: true,
    placeholder: 'Enter last name',
  },
  {
    name: 'username',
    label: 'Username',
    type: 'text',
    required: true,
    placeholder: 'Enter username',
  },
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    required: true,
    placeholder: 'Enter email address',
  },
  ...(isCreate
    ? [
        {
          name: 'password',
          label: 'Password',
          type: 'password' as const,
          required: true,
          placeholder: 'Enter password',
        },
      ]
    : []),
  {
    name: 'role',
    label: 'Role',
    type: 'select',
    required: true,
    options: [
      { value: 0, label: 'Customer' },
      { value: 1, label: 'Admin' },
      { value: 2, label: 'Developer' },
    ],
  },
  {
    name: 'isActive',
    label: 'Active',
    type: 'checkbox',
  },
];

export const getFileUploadFormFields = (): FormFieldConfig[] => [
  {
    name: 'file',
    label: 'File',
    type: 'file',
    required: true,
    description: 'Select a file to upload',
  },
  {
    name: 'description',
    label: 'Description',
    type: 'textarea',
    placeholder: 'Enter file description',
    rows: 3,
  },
  {
    name: 'alt',
    label: 'Alt Text',
    type: 'text',
    placeholder: 'Enter alt text for images',
  },
  {
    name: 'isPublic',
    label: 'Public File',
    type: 'checkbox',
    description: 'Make this file publicly accessible',
  },
  {
    name: 'generateThumbnail',
    label: 'Generate Thumbnail',
    type: 'checkbox',
    description: 'Generate thumbnail for image files',
  },
];

export const getFileEditFormFields = (): FormFieldConfig[] => [
  {
    name: 'description',
    label: 'Description',
    type: 'textarea',
    placeholder: 'Enter file description',
    rows: 3,
  },
  {
    name: 'alt',
    label: 'Alt Text',
    type: 'text',
    placeholder: 'Enter alt text for images',
  },
  {
    name: 'isPublic',
    label: 'Public File',
    type: 'checkbox',
    description: 'Make this file publicly accessible',
  },
];

export const getFolderFormFields = (): FormFieldConfig[] => [
  {
    name: 'name',
    label: 'Folder Name',
    type: 'text',
    required: true,
    placeholder: 'Enter folder name',
  },
  {
    name: 'description',
    label: 'Description',
    type: 'textarea',
    placeholder: 'Enter folder description',
    rows: 3,
  },
  {
    name: 'folderType',
    label: 'Folder Type',
    type: 'select',
    required: true,
    options: [
      { value: 0, label: 'General' },
      { value: 1, label: 'Images' },
      { value: 2, label: 'Documents' },
      { value: 3, label: 'Videos' },
      { value: 4, label: 'Audio' },
      { value: 5, label: 'User Avatars' },
      { value: 6, label: 'Company Assets' },
      { value: 7, label: 'Temporary' },
    ],
  },
  {
    name: 'isPublic',
    label: 'Public Folder',
    type: 'checkbox',
    description: 'Make this folder publicly accessible',
  },
];

export const getAddressFormFields = (): FormFieldConfig[] => [
  {
    name: 'street',
    label: 'Street Address',
    type: 'text',
    required: true,
    placeholder: 'Enter street address',
  },
  {
    name: 'street2',
    label: 'Street Address 2',
    type: 'text',
    placeholder: 'Apartment, suite, etc.',
  },
  {
    name: 'city',
    label: 'City',
    type: 'text',
    required: true,
    placeholder: 'Enter city',
  },
  {
    name: 'state',
    label: 'State/Province',
    type: 'text',
    required: true,
    placeholder: 'Enter state or province',
  },
  {
    name: 'country',
    label: 'Country',
    type: 'text',
    required: true,
    placeholder: 'Enter country',
  },
  {
    name: 'postalCode',
    label: 'Postal Code',
    type: 'text',
    required: true,
    placeholder: 'Enter postal code',
  },
  {
    name: 'addressType',
    label: 'Address Type',
    type: 'select',
    options: [
      { value: 'home', label: 'Home' },
      { value: 'work', label: 'Work' },
      { value: 'other', label: 'Other' },
    ],
  },
  {
    name: 'isDefault',
    label: 'Default Address',
    type: 'checkbox',
  },
];

export const getContactDetailsFormFields = (): FormFieldConfig[] => [
  {
    name: 'primaryPhone',
    label: 'Primary Phone',
    type: 'text',
    placeholder: 'Enter primary phone number',
  },
  {
    name: 'mobile',
    label: 'Mobile',
    type: 'text',
    placeholder: 'Enter mobile number',
  },
  {
    name: 'email',
    label: 'Contact Email',
    type: 'email',
    placeholder: 'Enter contact email',
  },
  {
    name: 'website',
    label: 'Website',
    type: 'text',
    placeholder: 'Enter website URL',
  },
  {
    name: 'linkedInProfile',
    label: 'LinkedIn',
    type: 'text',
    placeholder: 'Enter LinkedIn profile URL',
  },
  {
    name: 'contactType',
    label: 'Contact Type',
    type: 'select',
    options: [
      { value: 'personal', label: 'Personal' },
      { value: 'business', label: 'Business' },
      { value: 'emergency', label: 'Emergency' },
    ],
  },
  {
    name: 'isDefault',
    label: 'Default Contact',
    type: 'checkbox',
  },
];

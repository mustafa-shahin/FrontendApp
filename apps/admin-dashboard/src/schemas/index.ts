import { z } from 'zod';
import { UserRole, FileType, FolderType } from '@frontend-app/types';

// Address Schema
export const addressSchema = z.object({
  id: z.number().optional(),
  street: z.string().min(1, 'Street is required'),
  street2: z.string().nullable().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  country: z.string().min(1, 'Country is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
  region: z.string().nullable().optional(),
  district: z.string().nullable().optional(),
  isDefault: z.boolean().default(false),
  addressType: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
});

// Contact Details Schema
export const contactDetailsSchema = z.object({
  id: z.number().optional(),
  primaryPhone: z.string().nullable().optional(),
  secondaryPhone: z.string().nullable().optional(),
  mobile: z.string().nullable().optional(),
  fax: z.string().nullable().optional(),
  email: z.string().email().nullable().optional(),
  secondaryEmail: z.string().email().nullable().optional(),
  website: z.string().url().nullable().optional(),
  linkedInProfile: z.string().nullable().optional(),
  twitterProfile: z.string().nullable().optional(),
  facebookProfile: z.string().nullable().optional(),
  instagramProfile: z.string().nullable().optional(),
  whatsAppNumber: z.string().nullable().optional(),
  telegramHandle: z.string().nullable().optional(),
  additionalContacts: z.record(z.unknown()).default({}),
  isDefault: z.boolean().default(false),
  contactType: z.string().nullable().optional(),
});

// User Schema
export const userSchema = z.object({
  id: z.number().optional(),
  email: z.string().email('Invalid email address'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  isActive: z.boolean().default(true),
  pictureFileId: z.number().nullable().optional(),
  role: z.nativeEnum(UserRole),
  addresses: z.array(addressSchema).default([]),
  contactDetails: z.array(contactDetailsSchema).default([]),
  picture: z.instanceof(File).nullable().optional(),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .optional(),
});

export const createUserSchema = userSchema.extend({
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const updateUserSchema = userSchema.partial().extend({
  id: z.number(),
});

// File Schema
export const fileUploadSchema = z.object({
  file: z.instanceof(File, { message: 'File is required' }),
  description: z.string().optional(),
  alt: z.string().optional(),
  folderId: z.number().nullable().optional(),
  isPublic: z.boolean().default(false),
  tags: z.record(z.unknown()).default({}),
  generateThumbnail: z.boolean().default(true),
});

export const updateFileSchema = z.object({
  id: z.number(),
  description: z.string().optional(),
  alt: z.string().optional(),
  isPublic: z.boolean(),
  tags: z.record(z.unknown()).default({}),
  folderId: z.number().nullable().optional(),
});

export const fileSearchSchema = z.object({
  searchTerm: z.string().optional(),
  fileType: z.nativeEnum(FileType).optional(),
  folderId: z.number().optional(),
  isPublic: z.boolean().optional(),
  createdFrom: z.string().optional(),
  createdTo: z.string().optional(),
  minSize: z.number().optional(),
  maxSize: z.number().optional(),
  tags: z.array(z.string()).default([]),
  page: z.number().default(1),
  pageSize: z.number().default(20),
  sortBy: z.string().default('createdAt'),
  sortDirection: z.string().default('desc'),
});

// Folder Schema
export const folderSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, 'Folder name is required'),
  description: z.string().optional(),
  parentFolderId: z.number().nullable().optional(),
  isPublic: z.boolean().default(false),
  folderType: z.nativeEnum(FolderType).default(FolderType.General),
  metadata: z.record(z.unknown()).default({}),
});

export const createFolderSchema = folderSchema;
export const updateFolderSchema = folderSchema.extend({
  id: z.number(),
});

// Form Field Configuration
export interface FormFieldConfig {
  name: string;
  label: string;
  type:
    | 'text'
    | 'email'
    | 'password'
    | 'number'
    | 'select'
    | 'checkbox'
    | 'textarea'
    | 'file'
    | 'multiselect';
  required?: boolean;
  placeholder?: string;
  description?: string;
  options?: Array<{ value: string | number; label: string }>;
  multiple?: boolean;
  accept?: string;
  rows?: number;
  disabled?: boolean;
  hidden?: boolean;
}

// Export types
export type AddressFormData = z.infer<typeof addressSchema>;
export type ContactDetailsFormData = z.infer<typeof contactDetailsSchema>;
export type UserFormData = z.infer<typeof userSchema>;
export type CreateUserFormData = z.infer<typeof createUserSchema>;
export type UpdateUserFormData = z.infer<typeof updateUserSchema>;
export type FileUploadFormData = z.infer<typeof fileUploadSchema>;
export type UpdateFileFormData = z.infer<typeof updateFileSchema>;
export type FileSearchFormData = z.infer<typeof fileSearchSchema>;
export type FolderFormData = z.infer<typeof folderSchema>;
export type CreateFolderFormData = z.infer<typeof createFolderSchema>;
export type UpdateFolderFormData = z.infer<typeof updateFolderSchema>;

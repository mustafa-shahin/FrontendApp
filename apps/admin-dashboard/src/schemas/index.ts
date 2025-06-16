import { z } from 'zod';
import { UserRole, FileType, FolderType } from '@frontend-app/types';

// Base schemas
export const AddressSchema = z.object({
  id: z.number().optional(),
  street: z.string().min(1, 'Street is required'),
  street2: z.string().optional().nullable(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  country: z.string().min(1, 'Country is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
  region: z.string().optional().nullable(),
  district: z.string().optional().nullable(),
  isDefault: z.boolean().default(false),
  addressType: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const ContactDetailsSchema = z.object({
  id: z.number().optional(),
  primaryPhone: z.string().optional().nullable(),
  secondaryPhone: z.string().optional().nullable(),
  mobile: z.string().optional().nullable(),
  fax: z.string().optional().nullable(),
  email: z.string().email('Invalid email').optional().nullable(),
  secondaryEmail: z.string().email('Invalid email').optional().nullable(),
  website: z.string().url('Invalid URL').optional().nullable(),
  linkedInProfile: z.string().optional().nullable(),
  twitterProfile: z.string().optional().nullable(),
  facebookProfile: z.string().optional().nullable(),
  instagramProfile: z.string().optional().nullable(),
  whatsAppNumber: z.string().optional().nullable(),
  telegramHandle: z.string().optional().nullable(),
  additionalContacts: z.record(z.any()).default({}),
  isDefault: z.boolean().default(false),
  contactType: z.string().optional().nullable(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const UserSchema = z.object({
  id: z.number().optional(),
  email: z.string().email('Invalid email address'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  isActive: z.boolean().default(true),
  isLocked: z.boolean().default(false),
  lastLoginAt: z.string().optional().nullable(),
  avatarFileId: z.number().optional().nullable(),
  avatarUrl: z.string().optional().nullable(),
  timezone: z.string().optional().nullable(),
  language: z.string().optional().nullable(),
  emailVerifiedAt: z.string().optional().nullable(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  role: z.nativeEnum(UserRole).default(UserRole.Customer),
  roleName: z.string().optional(),
  preferences: z.record(z.any()).default({}),
  addresses: z.array(AddressSchema).default([]),
  contactDetails: z.array(ContactDetailsSchema).default([]),
});

export const CreateUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  isActive: z.boolean().default(true),
  avatarFileId: z.number().optional().nullable(),
  timezone: z.string().optional().nullable(),
  language: z.string().optional().nullable(),
  role: z.nativeEnum(UserRole).default(UserRole.Customer),
  preferences: z.record(z.any()).default({}),
  addresses: z
    .array(AddressSchema.omit({ id: true, createdAt: true, updatedAt: true }))
    .default([]),
  contactDetails: z
    .array(
      ContactDetailsSchema.omit({ id: true, createdAt: true, updatedAt: true })
    )
    .default([]),
  avatar: z.instanceof(File).optional().nullable(),
});

export const UpdateUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  isActive: z.boolean(),
  avatarFileId: z.number().optional().nullable(),
  timezone: z.string().optional().nullable(),
  language: z.string().optional().nullable(),
  role: z.nativeEnum(UserRole),
  preferences: z.record(z.any()).default({}),
  addresses: z
    .array(AddressSchema.omit({ createdAt: true, updatedAt: true }))
    .default([]),
  contactDetails: z
    .array(ContactDetailsSchema.omit({ createdAt: true, updatedAt: true }))
    .default([]),
  avatar: z.instanceof(File).optional().nullable(),
});

export const ChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'New password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export const FileSchema = z.object({
  id: z.number().optional(),
  originalFileName: z.string().min(1, 'File name is required'),
  storedFileName: z.string(),
  contentType: z.string(),
  fileSize: z.number().positive('File size must be positive'),
  fileExtension: z.string(),
  fileType: z.nativeEnum(FileType),
  description: z.string().optional().nullable(),
  alt: z.string().optional().nullable(),
  metadata: z.record(z.any()).default({}),
  isPublic: z.boolean().default(false),
  folderId: z.number().optional().nullable(),
  downloadCount: z.number().default(0),
  lastAccessedAt: z.string().optional().nullable(),
  width: z.number().optional().nullable(),
  height: z.number().optional().nullable(),
  duration: z.string().optional().nullable(),
  hash: z.string().optional().nullable(),
  isProcessed: z.boolean().default(false),
  processingStatus: z.string().optional().nullable(),
  tags: z.record(z.any()).default({}),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const FileUploadSchema = z.object({
  file: z.instanceof(File, { message: 'File is required' }),
  description: z.string().optional(),
  alt: z.string().optional(),
  folderId: z.number().optional().nullable(),
  isPublic: z.boolean().default(false),
  tags: z.record(z.any()).default({}),
  generateThumbnail: z.boolean().default(true),
});

export const UpdateFileSchema = z.object({
  description: z.string().optional(),
  alt: z.string().optional(),
  isPublic: z.boolean(),
  tags: z.record(z.any()).default({}),
  folderId: z.number().optional().nullable(),
});

export const FolderSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, 'Folder name is required'),
  description: z.string().optional().nullable(),
  path: z.string(),
  parentFolderId: z.number().optional().nullable(),
  parentFolderPath: z.string().optional().nullable(),
  subFolders: z.array(z.lazy((): z.ZodType<any> => FolderSchema)).default([]),
  files: z.array(FileSchema).default([]),
  isPublic: z.boolean().default(false),
  metadata: z.record(z.any()).default({}),
  folderType: z.nativeEnum(FolderType).default(FolderType.General),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  fileCount: z.number().default(0),
  subFolderCount: z.number().default(0),
  totalSize: z.number().default(0),
  totalSizeFormatted: z.string().default('0 B'),
});

export const CreateFolderSchema = z.object({
  name: z.string().min(1, 'Folder name is required'),
  description: z.string().optional(),
  parentFolderId: z.number().optional().nullable(),
  isPublic: z.boolean().default(false),
  folderType: z.nativeEnum(FolderType).default(FolderType.General),
  metadata: z.record(z.any()).default({}),
});

export const UpdateFolderSchema = z.object({
  name: z.string().min(1, 'Folder name is required'),
  description: z.string().optional(),
  isPublic: z.boolean(),
  metadata: z.record(z.any()).default({}),
});

// Search schemas
export const FileSearchSchema = z.object({
  searchTerm: z.string().optional(),
  fileType: z.nativeEnum(FileType).optional(),
  folderId: z.number().optional().nullable(),
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

// Type exports
export type AddressFormData = z.infer<typeof AddressSchema>;
export type ContactDetailsFormData = z.infer<typeof ContactDetailsSchema>;
export type UserFormData = z.infer<typeof UserSchema>;
export type CreateUserFormData = z.infer<typeof CreateUserSchema>;
export type UpdateUserFormData = z.infer<typeof UpdateUserSchema>;
export type ChangePasswordFormData = z.infer<typeof ChangePasswordSchema>;
export type FileFormData = z.infer<typeof FileSchema>;
export type FileUploadFormData = z.infer<typeof FileUploadSchema>;
export type UpdateFileFormData = z.infer<typeof UpdateFileSchema>;
export type FolderFormData = z.infer<typeof FolderSchema>;
export type CreateFolderFormData = z.infer<typeof CreateFolderSchema>;
export type UpdateFolderFormData = z.infer<typeof UpdateFolderSchema>;
export type FileSearchFormData = z.infer<typeof FileSearchSchema>;

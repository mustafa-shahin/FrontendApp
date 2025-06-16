import { z } from 'zod';
import { UserSchema, CreateUserSchema, UpdateUserSchema } from '../schemas';

export type UserFormData = z.infer<typeof UserSchema>;
export type CreateUserFormData = z.infer<typeof CreateUserSchema>;
export type UpdateUserFormData = z.infer<typeof UpdateUserSchema>;

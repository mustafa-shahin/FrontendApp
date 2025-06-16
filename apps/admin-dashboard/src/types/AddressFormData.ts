import { z } from 'zod';
import { AddressSchema } from '../schemas';

export type AddressFormData = z.infer<typeof AddressSchema>;

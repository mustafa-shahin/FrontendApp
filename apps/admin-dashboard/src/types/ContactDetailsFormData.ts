import { z } from 'zod';
import { ContactDetailsSchema } from '../schemas';

export type ContactDetailsFormData = z.infer<typeof ContactDetailsSchema>;

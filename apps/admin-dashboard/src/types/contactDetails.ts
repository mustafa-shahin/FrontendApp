export interface ContactDetails {
  id: number;
  primaryPhone: string;
  email: string;
  website?: string;
  contactType: string;
  isDefault: boolean;
}

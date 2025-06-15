import { BaseEntity } from './baseEntity';

export interface ContactDetails extends BaseEntity {
  primaryPhone: string | null;
  secondaryPhone: string | null;
  mobile: string | null;
  fax: string | null;
  email: string | null;
  secondaryEmail: string | null;
  website: string | null;
  linkedInProfile: string | null;
  twitterProfile: string | null;
  facebookProfile: string | null;
  instagramProfile: string | null;
  whatsAppNumber: string | null;
  telegramHandle: string | null;
  additionalContacts: { [key: string]: any }; // Dictionary<string, object> in C#
  isDefault: boolean;
  contactType: string | null;
}
export interface ContactDetailsDto {
  id: number;
  primaryPhone: string | null;
  secondaryPhone: string | null;
  mobile: string | null;
  fax: string | null;
  email: string | null;
  secondaryEmail: string | null;
  website: string | null;
  linkedInProfile: string | null;
  twitterProfile: string | null;
  facebookProfile: string | null;
  instagramProfile: string | null;
  whatsAppNumber: string | null;
  telegramHandle: string | null;
  additionalContacts: { [key: string]: any };
  isDefault: boolean;
  contactType: string | null;
  createdAt: string;
  updatedAt: string;
}
export interface CreateContactDetailsDto {
  primaryPhone: string | null;
  secondaryPhone: string | null;
  mobile: string | null;
  fax: string | null;
  email: string | null;
  secondaryEmail: string | null;
  website: string | null;
  linkedInProfile: string | null;
  twitterProfile: string | null;
  facebookProfile: string | null;
  instagramProfile: string | null;
  whatsAppNumber: string | null;
  telegramHandle: string | null;
  additionalContacts: { [key: string]: any };
  isDefault: boolean;
  contactType: string | null;
}

export interface UpdateContactDetailsDto {
  primaryPhone: string | null;
  secondaryPhone: string | null;
  mobile: string | null;
  fax: string | null;
  email: string | null;
  secondaryEmail: string | null;
  website: string | null;
  linkedInProfile: string | null;
  twitterProfile: string | null;
  facebookProfile: string | null;
  instagramProfile: string | null;
  whatsAppNumber: string | null;
  telegramHandle: string | null;
  additionalContacts: { [key: string]: any };
  isDefault: boolean;
  contactType: string | null;
}

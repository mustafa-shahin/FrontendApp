import { ValidationRule } from '../../../hooks/useEntityForm';
import {
  validationRules,
  commonValidations,
  createFieldValidations,
} from '../../../utils/validation';
import { UserRole } from '../../../types';

// User form data type
interface UserFormData {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  role: UserRole;
  timezone: string;
  language: string;
  avatarFileId: number | null;
  addresses: any[];
  contactDetails: any[];
  preferences: Record<string, unknown>;
}

export function createUserValidationRules(
  isEditing: boolean
): { field: keyof UserFormData; validator: ValidationRule<UserFormData> }[] {
  const configs = [
    {
      field: 'firstName' as keyof UserFormData,
      rules: commonValidations.name('First Name'),
      tab: 'basic',
    },
    {
      field: 'lastName' as keyof UserFormData,
      rules: commonValidations.name('Last Name'),
      tab: 'basic',
    },
    {
      field: 'email' as keyof UserFormData,
      rules: commonValidations.email(),
      tab: 'basic',
    },
    {
      field: 'username' as keyof UserFormData,
      rules: commonValidations.username(),
      tab: 'basic',
    },
    {
      field: 'role' as keyof UserFormData,
      rules: [
        validationRules.required('Role'),
        validationRules.custom<UserFormData>(
          (value) => Object.values(UserRole).includes(value),
          'Please select a valid role'
        ),
      ],
      tab: 'basic',
    },
    {
      field: 'timezone' as keyof UserFormData,
      rules: [validationRules.maxLength(50, 'Timezone')],
      tab: 'basic',
    },
    {
      field: 'language' as keyof UserFormData,
      rules: [
        validationRules.maxLength(10, 'Language'),
        validationRules.pattern(
          /^[a-z]{2}(-[A-Z]{2})?$/,
          'Language must be in format "en" or "en-US"'
        ),
      ],
      tab: 'basic',
    },
  ];

  // Add password validation only for new users
  if (!isEditing) {
    configs.push({
      field: 'password' as keyof UserFormData,
      rules: commonValidations.password(),
      tab: 'basic',
    });
  }

  // Add address validations
  configs.push({
    field: 'addresses' as keyof UserFormData,
    rules: [
      validationRules.custom<UserFormData>((addresses: any[]) => {
        if (!addresses || addresses.length === 0) return true;

        // Validate each address
        for (let i = 0; i < addresses.length; i++) {
          const address = addresses[i];
          if (!address.street?.trim()) {
            return false;
          }
          if (!address.city?.trim()) {
            return false;
          }
          if (!address.state?.trim()) {
            return false;
          }
          if (!address.country?.trim()) {
            return false;
          }
          if (!address.postalCode?.trim()) {
            return false;
          }
        }

        // Check that only one address is marked as default
        const defaultAddresses = addresses.filter((addr) => addr.isDefault);
        return defaultAddresses.length <= 1;
      }, 'Please ensure all address fields are filled and only one address is marked as default'),
    ],
    tab: 'addresses',
  });

  // Add contact details validations
  configs.push({
    field: 'contactDetails' as keyof UserFormData,
    rules: [
      validationRules.custom<UserFormData>((contacts: any[]) => {
        if (!contacts || contacts.length === 0) return true;

        // Validate each contact
        for (let i = 0; i < contacts.length; i++) {
          const contact = contacts[i];

          // If email is provided, validate it
          if (contact.email && !validationRules.email()(contact.email)) {
            return false;
          }

          // If phone numbers are provided, validate them
          if (
            contact.primaryPhone &&
            !validationRules.phone()(contact.primaryPhone)
          ) {
            return false;
          }
          if (contact.mobile && !validationRules.phone()(contact.mobile)) {
            return false;
          }

          // If website is provided, validate it
          if (contact.website && !validationRules.url()(contact.website)) {
            return false;
          }
        }

        // Check that only one contact is marked as default
        const defaultContacts = contacts.filter((contact) => contact.isDefault);
        return defaultContacts.length <= 1;
      }, 'Please ensure all contact details are valid and only one contact is marked as default'),
    ],
    tab: 'contacts',
  });

  return createFieldValidations(configs);
}

// Additional utility functions for user-specific validation
export const userValidationUtils = {
  validateUniqueEmail: (users: UserFormData[], currentUserId?: number) =>
    validationRules.unique(users, 'email', currentUserId),

  validateUniqueUsername: (users: UserFormData[], currentUserId?: number) =>
    validationRules.unique(users, 'username', currentUserId),

  validatePasswordStrength: (
    password: string
  ): { score: number; feedback: string[] } => {
    const feedback: string[] = [];
    let score = 0;

    if (password.length >= 8) {
      score += 1;
    } else {
      feedback.push('Use at least 8 characters');
    }

    if (/[a-z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Include lowercase letters');
    }

    if (/[A-Z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Include uppercase letters');
    }

    if (/\d/.test(password)) {
      score += 1;
    } else {
      feedback.push('Include numbers');
    }

    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Include special characters');
    }

    return { score, feedback };
  },
};

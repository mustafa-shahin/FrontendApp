export type ValidationRule<T> = (
  value: any,
  formData?: T
) => string | undefined;

export const validationRules = {
  required:
    (fieldName: string): ValidationRule<any> =>
    (value) => {
      if (value === null || value === undefined || value === '') {
        return `${fieldName} is required`;
      }
      if (typeof value === 'string' && value.trim() === '') {
        return `${fieldName} is required`;
      }
      return undefined;
    },

  email: (): ValidationRule<string> => (value) => {
    if (!value) return undefined;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return 'Please enter a valid email address';
    }
    return undefined;
  },

  minLength:
    (min: number, fieldName: string): ValidationRule<string> =>
    (value) => {
      if (!value) return undefined;
      if (typeof value === 'string' && value.length < min) {
        return `${fieldName} must be at least ${min} characters long`;
      }
      return undefined;
    },

  maxLength:
    (max: number, fieldName: string): ValidationRule<string> =>
    (value) => {
      if (!value) return undefined;
      if (typeof value === 'string' && value.length > max) {
        return `${fieldName} must be no more than ${max} characters long`;
      }
      return undefined;
    },

  pattern:
    (pattern: RegExp, message: string): ValidationRule<string> =>
    (value) => {
      if (!value) return undefined;
      if (!pattern.test(value)) {
        return message;
      }
      return undefined;
    },

  numeric:
    (fieldName: string): ValidationRule<number> =>
    (value) => {
      if (value === null || value === undefined || value === '')
        return undefined;
      if (isNaN(value) || isNaN(parseFloat(value))) {
        return `${fieldName} must be a valid number`;
      }
      return undefined;
    },

  integer:
    (fieldName: string): ValidationRule<number> =>
    (value) => {
      if (value === null || value === undefined || value === '')
        return undefined;
      if (!Number.isInteger(Number(value))) {
        return `${fieldName} must be a whole number`;
      }
      return undefined;
    },

  min:
    (min: number, fieldName: string): ValidationRule<number> =>
    (value) => {
      if (value === null || value === undefined || value === '')
        return undefined;
      const numValue = Number(value);
      if (numValue < min) {
        return `${fieldName} must be at least ${min}`;
      }
      return undefined;
    },

  max:
    (max: number, fieldName: string): ValidationRule<number> =>
    (value) => {
      if (value === null || value === undefined || value === '')
        return undefined;
      const numValue = Number(value);
      if (numValue > max) {
        return `${fieldName} must be no more than ${max}`;
      }
      return undefined;
    },

  url: (): ValidationRule<string> => (value) => {
    if (!value) return undefined;
    try {
      new URL(value);
      return undefined;
    } catch {
      return 'Please enter a valid URL';
    }
  },

  phone: (): ValidationRule<string> => (value) => {
    if (!value) return undefined;
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    const cleanValue = value.replace(/[\s\-\(\)]/g, '');
    if (!phoneRegex.test(cleanValue)) {
      return 'Please enter a valid phone number';
    }
    return undefined;
  },

  password: (): ValidationRule<string> => (value) => {
    if (!value) return undefined;

    const errors: string[] = [];

    if (value.length < 8) {
      errors.push('at least 8 characters');
    }
    if (!/[A-Z]/.test(value)) {
      errors.push('one uppercase letter');
    }
    if (!/[a-z]/.test(value)) {
      errors.push('one lowercase letter');
    }
    if (!/\d/.test(value)) {
      errors.push('one number');
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) {
      errors.push('one special character');
    }

    if (errors.length > 0) {
      return `Password must contain ${errors.join(', ')}`;
    }
    return undefined;
  },

  confirmPassword:
    <T extends { password?: string }>(
      passwordField = 'password'
    ): ValidationRule<T> =>
    (value, formData) => {
      if (!value) return undefined;
      if (!formData || value !== formData[passwordField as keyof T]) {
        return 'Passwords do not match';
      }
      return undefined;
    },

  unique:
    <T>(
      items: T[],
      field: keyof T,
      currentId?: number | string,
      idField: keyof T = 'id' as keyof T
    ): ValidationRule<any> =>
    (value) => {
      if (!value) return undefined;

      const isDuplicate = items.some(
        (item) =>
          item[field] === value &&
          (currentId === undefined || item[idField] !== currentId)
      );

      if (isDuplicate) {
        return `This ${String(field)} is already in use`;
      }
      return undefined;
    },

  custom:
    <T>(
      validator: (value: any, formData?: T) => boolean,
      message: string
    ): ValidationRule<T> =>
    (value, formData) => {
      if (!validator(value, formData)) {
        return message;
      }
      return undefined;
    },

  // Utility to combine multiple validation rules
  combine:
    <T>(...rules: ValidationRule<T>[]): ValidationRule<T> =>
    (value, formData) => {
      for (const rule of rules) {
        const error = rule(value, formData);
        if (error) return error;
      }
      return undefined;
    },
};

export interface FieldValidationConfig<T> {
  field: keyof T;
  rules: ValidationRule<T>[];
  tab?: string; // For tab-specific error grouping
}

export function createFieldValidations<T>(
  configs: FieldValidationConfig<T>[]
): { field: keyof T; validator: ValidationRule<T>; tab?: string }[] {
  return configs.map((config) => ({
    field: config.field,
    validator: validationRules.combine(...config.rules),
    tab: config.tab,
  }));
}

// Common validation sets for reuse
export const commonValidations = {
  email: (fieldName = 'Email') => [
    validationRules.required(fieldName),
    validationRules.email(),
  ],

  password: (fieldName = 'Password') => [
    validationRules.required(fieldName),
    validationRules.password(),
  ],

  name: (fieldName: string, maxLength = 50) => [
    validationRules.required(fieldName),
    validationRules.maxLength(maxLength, fieldName),
    validationRules.pattern(
      /^[a-zA-Z\s\-']+$/,
      `${fieldName} can only contain letters, spaces, hyphens, and apostrophes`
    ),
  ],

  username: (fieldName = 'Username') => [
    validationRules.required(fieldName),
    validationRules.minLength(3, fieldName),
    validationRules.maxLength(20, fieldName),
    validationRules.pattern(
      /^[a-zA-Z0-9_-]+$/,
      `${fieldName} can only contain letters, numbers, hyphens, and underscores`
    ),
  ],

  phone: (fieldName = 'Phone') => [validationRules.phone()],

  url: (fieldName = 'URL') => [validationRules.url()],
};

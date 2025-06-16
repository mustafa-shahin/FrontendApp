import React, { forwardRef } from 'react';
import { FormField } from './FormField';
import { Input } from '../ui/Input';
import { FieldError, FieldErrorsImpl, Merge } from 'react-hook-form';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | string;
  icon?: string;
  iconPosition?: 'left' | 'right';
  description?: string;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, required, className, description, ...props }, ref) => {
    return (
      <FormField
        label={label}
        error={error}
        required={required}
        className={className}
        description={description}
      >
        <Input ref={ref} {...props} />
      </FormField>
    );
  }
);
FormInput.displayName = 'FormInput';

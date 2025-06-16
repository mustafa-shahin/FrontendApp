import React, { forwardRef } from 'react';
import { FormField } from './FormField';
import { Checkbox } from '../ui/Checkbox';
import { FieldError, FieldErrorsImpl, Merge } from 'react-hook-form';

interface FormCheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | string;
  description?: string;
}

export const FormCheckbox = forwardRef<HTMLInputElement, FormCheckboxProps>(
  ({ label, error, className, description, ...props }, ref) => {
    return (
      <FormField error={error} className={className} description={description}>
        <Checkbox ref={ref} label={label} {...props} />
      </FormField>
    );
  }
);

FormCheckbox.displayName = 'FormCheckbox';

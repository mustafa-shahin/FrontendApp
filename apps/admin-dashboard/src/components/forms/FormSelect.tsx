import React, { forwardRef } from 'react';
import { FormField } from './FormField';
import { Select } from '../ui/Select';
import { FieldError, FieldErrorsImpl, Merge } from 'react-hook-form';

interface SelectOption {
  value: string | number;
  label: string;
}

interface FormSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | string;
  options: SelectOption[];
  placeholder?: string;
  description?: string;
}

export const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  (
    {
      label,
      error,
      required,
      options,
      placeholder,
      className,
      description,
      ...props
    },
    ref
  ) => {
    return (
      <FormField
        label={label}
        error={error}
        required={required}
        className={className}
        description={description}
      >
        <Select
          ref={ref}
          options={options}
          placeholder={placeholder}
          {...props}
        />
      </FormField>
    );
  }
);

FormSelect.displayName = 'FormSelect';

import React, { forwardRef } from 'react';
import { FormField } from './FormField';
import { Textarea } from '../ui/Textarea';
import { FieldError, FieldErrorsImpl, Merge } from 'react-hook-form';

interface FormTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | string;
  description?: string;
}

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ label, error, required, className, description, ...props }, ref) => {
    return (
      <FormField
        label={label}
        error={error}
        required={required}
        className={className}
        description={description}
      >
        <Textarea ref={ref} {...props} />
      </FormField>
    );
  }
);

FormTextarea.displayName = 'FormTextarea';

import React from 'react';
import { Control, FieldErrors, useFieldArray } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { FormInput, FormCheckbox } from '../../forms';
import { Button } from '../../ui/Button';
import { CreateUserFormData, UpdateUserFormData } from '../../../schemas';

interface ContactDetailsFormProps {
  control: Control<CreateUserFormData | UpdateUserFormData>;
  errors: FieldErrors<CreateUserFormData | UpdateUserFormData>;
}

export const ContactDetailsForm: React.FC<ContactDetailsFormProps> = ({
  control,
  errors,
}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'contactDetails',
  });

  const addContactDetails = () => {
    append({
      primaryPhone: '',
      secondaryPhone: '',
      mobile: '',
      fax: '',
      email: '',
      secondaryEmail: '',
      website: '',
      linkedInProfile: '',
      twitterProfile: '',
      facebookProfile: '',
      instagramProfile: '',
      whatsAppNumber: '',
      telegramHandle: '',
      additionalContacts: {},
      isDefault: fields.length === 0,
      contactType: 'Personal',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Contact Details
        </h3>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          icon="plus"
          onClick={addContactDetails}
        >
          Add Contact Details
        </Button>
      </div>

      {fields.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <i className="fas fa-address-book text-3xl mb-2" />
          <p>No contact details added yet</p>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={addContactDetails}
            className="mt-2"
          >
            Add contact details
          </Button>
        </div>
      )}

      {fields.map((field, index) => (
        <div
          key={field.id}
          className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-900 dark:text-white">
              Contact Details {index + 1}
            </h4>
            {fields.length > 1 && (
              <Button
                type="button"
                variant="danger"
                size="sm"
                icon="trash"
                onClick={() => remove(index)}
              >
                Remove
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name={`contactDetails.${index}.primaryPhone`}
              control={control}
              render={({ field: { value, ...fieldProps } }) => (
                <FormInput
                  {...fieldProps}
                  value={value ?? ''}
                  type="tel"
                  label="Primary Phone"
                  placeholder="Enter primary phone"
                  icon="phone"
                  error={errors.contactDetails?.[index]?.primaryPhone}
                />
              )}
            />

            <Controller
              name={`contactDetails.${index}.mobile`}
              control={control}
              render={({ field: { value, ...fieldProps } }) => (
                <FormInput
                  {...fieldProps}
                  value={value ?? ''}
                  type="tel"
                  label="Mobile"
                  placeholder="Enter mobile number"
                  icon="mobile-alt"
                  error={errors.contactDetails?.[index]?.mobile}
                />
              )}
            />

            <Controller
              name={`contactDetails.${index}.email`}
              control={control}
              render={({ field: { value, ...fieldProps } }) => (
                <FormInput
                  {...fieldProps}
                  value={value ?? ''}
                  type="email"
                  label="Contact Email"
                  placeholder="Enter contact email"
                  icon="envelope"
                  error={errors.contactDetails?.[index]?.email}
                />
              )}
            />

            <Controller
              name={`contactDetails.${index}.website`}
              control={control}
              render={({ field: { value, ...fieldProps } }) => (
                <FormInput
                  {...fieldProps}
                  value={value ?? ''}
                  type="url"
                  label="Website"
                  placeholder="https://example.com"
                  icon="globe"
                  error={errors.contactDetails?.[index]?.website}
                />
              )}
            />

            <Controller
              name={`contactDetails.${index}.linkedInProfile`}
              control={control}
              render={({ field: { value, ...fieldProps } }) => (
                <FormInput
                  {...fieldProps}
                  value={value ?? ''}
                  label="LinkedIn Profile"
                  placeholder="LinkedIn profile URL"
                  icon="linkedin"
                  error={errors.contactDetails?.[index]?.linkedInProfile}
                />
              )}
            />

            <Controller
              name={`contactDetails.${index}.twitterProfile`}
              control={control}
              render={({ field: { value, ...fieldProps } }) => (
                <FormInput
                  {...fieldProps}
                  value={value ?? ''}
                  label="Twitter Profile"
                  placeholder="Twitter profile URL"
                  icon="twitter"
                  error={errors.contactDetails?.[index]?.twitterProfile}
                />
              )}
            />

            <Controller
              name={`contactDetails.${index}.contactType`}
              control={control}
              render={({ field: { value, ...fieldProps } }) => (
                <FormInput
                  {...fieldProps}
                  value={value ?? ''}
                  label="Contact Type"
                  placeholder="Personal, Work, etc."
                  error={errors.contactDetails?.[index]?.contactType}
                />
              )}
            />
          </div>

          <Controller
            name={`contactDetails.${index}.isDefault`}
            control={control}
            render={({ field: { value, onChange, ...field } }) => (
              <FormCheckbox
                {...field}
                checked={value}
                onChange={(e) => onChange(e.target.checked)}
                label="Set as default contact details"
                error={errors.contactDetails?.[index]?.isDefault}
              />
            )}
          />
        </div>
      ))}
    </div>
  );
};

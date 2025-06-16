import React from 'react';
import { Control, FieldErrors, useFieldArray } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { FormInput, FormCheckbox } from '../../forms';
import { Button } from '../../ui/Button';
import { CreateUserFormData, UpdateUserFormData } from '../../../schemas';

interface AddressFormProps {
  control: Control<CreateUserFormData | UpdateUserFormData>;
  errors: FieldErrors<CreateUserFormData | UpdateUserFormData>;
}

export const AddressForm: React.FC<AddressFormProps> = ({
  control,
  errors,
}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'addresses',
  });

  const addAddress = () => {
    append({
      street: '',
      street2: '',
      city: '',
      state: '',
      country: '',
      postalCode: '',
      region: '',
      district: '',
      isDefault: fields.length === 0, // First address is default
      addressType: 'Home',
      notes: '',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Addresses
        </h3>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          icon="plus"
          onClick={addAddress}
        >
          Add Address
        </Button>
      </div>

      {fields.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <i className="fas fa-map-marker-alt text-3xl mb-2" />
          <p>No addresses added yet</p>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={addAddress}
            className="mt-2"
          >
            Add your first address
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
              Address {index + 1}
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
              name={`addresses.${index}.street`}
              control={control}
              render={({ field }) => (
                <FormInput
                  {...field}
                  label="Street Address"
                  placeholder="Enter street address"
                  required
                  error={errors.addresses?.[index]?.street}
                />
              )}
            />

            <Controller
              name={`addresses.${index}.street2`}
              control={control}
              render={({ field: { value, ...field } }) => (
                <FormInput
                  {...field}
                  value={value ?? ''}
                  label="Street Address 2"
                  placeholder="Apartment, suite, etc."
                  error={errors.addresses?.[index]?.street2}
                />
              )}
            />

            <Controller
              name={`addresses.${index}.city`}
              control={control}
              render={({ field }) => (
                <FormInput
                  {...field}
                  label="City"
                  placeholder="Enter city"
                  required
                  error={errors.addresses?.[index]?.city}
                />
              )}
            />

            <Controller
              name={`addresses.${index}.state`}
              control={control}
              render={({ field }) => (
                <FormInput
                  {...field}
                  label="State/Province"
                  placeholder="Enter state or province"
                  required
                  error={errors.addresses?.[index]?.state}
                />
              )}
            />

            <Controller
              name={`addresses.${index}.postalCode`}
              control={control}
              render={({ field }) => (
                <FormInput
                  {...field}
                  label="Postal Code"
                  placeholder="Enter postal code"
                  required
                  error={errors.addresses?.[index]?.postalCode}
                />
              )}
            />

            <Controller
              name={`addresses.${index}.country`}
              control={control}
              render={({ field }) => (
                <FormInput
                  {...field}
                  label="Country"
                  placeholder="Enter country"
                  required
                  error={errors.addresses?.[index]?.country}
                />
              )}
            />

            <Controller
              name={`addresses.${index}.addressType`}
              control={control}
              render={({ field: { value, ...field } }) => (
                <FormInput
                  {...field}
                  value={value ?? ''}
                  label="Address Type"
                  placeholder="Home, Work, etc."
                  error={errors.addresses?.[index]?.addressType}
                />
              )}
            />
          </div>

          <Controller
            name={`addresses.${index}.isDefault`}
            control={control}
            render={({ field: { value, onChange, ...field } }) => (
              <FormCheckbox
                {...field}
                checked={value}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  onChange(e.target.checked)
                }
                label="Set as default address"
                error={errors.addresses?.[index]?.isDefault}
              />
            )}
          />
        </div>
      ))}
    </div>
  );
};

import React from 'react';
import { Input } from '../Input';
import { Checkbox } from '../Checkbox';
import { Button } from '../Button';
import { Textarea } from '../Textarea';
import { AddressDto } from '../../../types/adress';

interface AddressFormProps {
  address: Partial<AddressDto>;
  onChange: (address: Partial<AddressDto>) => void;
  onRemove?: () => void;
  showRemove?: boolean;
}

export const AddressForm: React.FC<AddressFormProps> = ({
  address,
  onChange,
  onRemove,
  showRemove = false,
}) => {
  const handleFieldChange = (
    field: keyof AddressDto,
    value: AddressDto[keyof AddressDto]
  ) => {
    onChange({
      ...address,
      [field]: value,
    });
  };

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
          Address
        </h4>
        {showRemove && onRemove && (
          <Button
            variant="ghost"
            size="sm"
            icon="trash"
            onClick={onRemove}
            className="text-red-600 hover:text-red-700 dark:text-red-400"
          />
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Input
            label="Street Address"
            value={address.street || ''}
            onChange={(e) => handleFieldChange('street', e.target.value)}
            placeholder="Enter street address"
            required
          />
        </div>

        <div className="md:col-span-2">
          <Input
            label="Street Address 2"
            value={address.street2 || ''}
            onChange={(e) => handleFieldChange('street2', e.target.value)}
            placeholder="Apartment, suite, etc. (optional)"
          />
        </div>

        <Input
          label="City"
          value={address.city || ''}
          onChange={(e) => handleFieldChange('city', e.target.value)}
          placeholder="Enter city"
          required
        />

        <Input
          label="State/Province"
          value={address.state || ''}
          onChange={(e) => handleFieldChange('state', e.target.value)}
          placeholder="Enter state or province"
          required
        />

        <Input
          label="Postal Code"
          value={address.postalCode || ''}
          onChange={(e) => handleFieldChange('postalCode', e.target.value)}
          placeholder="Enter postal code"
          required
        />

        <Input
          label="Country"
          value={address.country || ''}
          onChange={(e) => handleFieldChange('country', e.target.value)}
          placeholder="Enter country"
          required
        />

        <Input
          label="Region"
          value={address.region || ''}
          onChange={(e) => handleFieldChange('region', e.target.value)}
          placeholder="Enter region (optional)"
        />

        <Input
          label="District"
          value={address.district || ''}
          onChange={(e) => handleFieldChange('district', e.target.value)}
          placeholder="Enter district (optional)"
        />

        <Input
          label="Address Type"
          value={address.addressType || ''}
          onChange={(e) => handleFieldChange('addressType', e.target.value)}
          placeholder="Home, Work, etc."
        />
      </div>

      <Textarea
        label="Notes"
        value={address.notes || ''}
        onChange={(e) => handleFieldChange('notes', e.target.value)}
        placeholder="Additional notes (optional)"
        rows={3}
      />

      <Checkbox
        label="Set as default address"
        checked={address.isDefault || false}
        onChange={(e) => handleFieldChange('isDefault', e.target.checked)}
      />
    </div>
  );
};

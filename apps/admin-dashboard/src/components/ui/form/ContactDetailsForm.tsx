import React from 'react';
import { Input } from '../Input';
import { Checkbox } from '../Checkbox';
import { Button } from '../Button';
import { ContactDetailsDto } from '../../../types/contactDetail';

interface ContactDetailsFormProps {
  contactDetails: Partial<ContactDetailsDto>;
  onChange: (contactDetails: Partial<ContactDetailsDto>) => void;
  onRemove?: () => void;
  showRemove?: boolean;
}

export const ContactDetailsForm: React.FC<ContactDetailsFormProps> = ({
  contactDetails,
  onChange,
  onRemove,
  showRemove = false,
}) => {
  const handleFieldChange = <K extends keyof ContactDetailsDto>(
    field: K,
    value: ContactDetailsDto[K]
  ) => {
    onChange({
      ...contactDetails,
      [field]: value,
    });
  };

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
          Contact Details
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

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Primary Phone"
            type="tel"
            value={contactDetails.primaryPhone || ''}
            onChange={(e) => handleFieldChange('primaryPhone', e.target.value)}
            placeholder="Enter primary phone"
            icon="phone"
          />

          <Input
            label="Secondary Phone"
            type="tel"
            value={contactDetails.secondaryPhone || ''}
            onChange={(e) =>
              handleFieldChange('secondaryPhone', e.target.value)
            }
            placeholder="Enter secondary phone"
            icon="phone"
          />

          <Input
            label="Mobile"
            type="tel"
            value={contactDetails.mobile || ''}
            onChange={(e) => handleFieldChange('mobile', e.target.value)}
            placeholder="Enter mobile number"
            icon="mobile-alt"
          />

          <Input
            label="Fax"
            type="tel"
            value={contactDetails.fax || ''}
            onChange={(e) => handleFieldChange('fax', e.target.value)}
            placeholder="Enter fax number"
            icon="fax"
          />

          <Input
            label="Email"
            type="email"
            value={contactDetails.email || ''}
            onChange={(e) => handleFieldChange('email', e.target.value)}
            placeholder="Enter email"
            icon="envelope"
          />

          <Input
            label="Secondary Email"
            type="email"
            value={contactDetails.secondaryEmail || ''}
            onChange={(e) =>
              handleFieldChange('secondaryEmail', e.target.value)
            }
            placeholder="Enter secondary email"
            icon="envelope"
          />

          <Input
            label="Website"
            type="url"
            value={contactDetails.website || ''}
            onChange={(e) => handleFieldChange('website', e.target.value)}
            placeholder="Enter website URL"
            icon="globe"
          />

          <Input
            label="Contact Type"
            value={contactDetails.contactType || ''}
            onChange={(e) => handleFieldChange('contactType', e.target.value)}
            placeholder="Personal, Business, etc."
          />
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
            Social Media & Messaging
          </h5>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="LinkedIn Profile"
              value={contactDetails.linkedInProfile || ''}
              onChange={(e) =>
                handleFieldChange('linkedInProfile', e.target.value)
              }
              placeholder="LinkedIn profile URL"
              icon="linkedin"
            />

            <Input
              label="Twitter Profile"
              value={contactDetails.twitterProfile || ''}
              onChange={(e) =>
                handleFieldChange('twitterProfile', e.target.value)
              }
              placeholder="Twitter profile URL"
              icon="twitter"
            />

            <Input
              label="Facebook Profile"
              value={contactDetails.facebookProfile || ''}
              onChange={(e) =>
                handleFieldChange('facebookProfile', e.target.value)
              }
              placeholder="Facebook profile URL"
              icon="facebook"
            />

            <Input
              label="Instagram Profile"
              value={contactDetails.instagramProfile || ''}
              onChange={(e) =>
                handleFieldChange('instagramProfile', e.target.value)
              }
              placeholder="Instagram profile URL"
              icon="instagram"
            />

            <Input
              label="WhatsApp Number"
              type="tel"
              value={contactDetails.whatsAppNumber || ''}
              onChange={(e) =>
                handleFieldChange('whatsAppNumber', e.target.value)
              }
              placeholder="WhatsApp number"
              icon="whatsapp"
            />

            <Input
              label="Telegram Handle"
              value={contactDetails.telegramHandle || ''}
              onChange={(e) =>
                handleFieldChange('telegramHandle', e.target.value)
              }
              placeholder="Telegram handle"
              icon="telegram-plane"
            />
          </div>
        </div>

        <Checkbox
          label="Set as default contact details"
          checked={contactDetails.isDefault || false}
          onChange={(e) => handleFieldChange('isDefault', e.target.checked)}
        />
      </div>
    </div>
  );
};

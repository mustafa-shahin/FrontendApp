export interface AddressDto {
  id: number;
  street: string;
  street2: string | null;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  region: string | null;
  district: string | null;
  isDefault: boolean;
  addressType: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAddressDto {
  street: string;
  street2: string | null;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  region: string | null;
  district: string | null;
  isDefault: boolean;
  addressType: string | null;
  notes: string | null;
}

export interface UpdateAddressDto {
  street: string;
  street2: string | null;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  region: string | null;
  district: string | null;
  isDefault: boolean;
  addressType: string | null;
  notes: string | null;
}

export interface ShippingAddress {
  id: string;
  user?: string;
  full_name: string;
  phone_number: string;
  description: string;
  city: string;
  district?: string;
  ward?: string;
  is_default: boolean;
  created_at?: string;
}

export interface CreateShippingAddressRequest {
  full_name: string;
  phone_number: string;
  description: string;
  city: string;
  district?: string;
  ward?: string;
  is_default?: boolean;
}

export interface UpdateShippingAddressRequest {
  full_name?: string;
  phone_number?: string;
  description?: string;
  city?: string;
  district?: string;
  ward?: string;
  is_default?: boolean;
}

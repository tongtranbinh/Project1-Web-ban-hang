import http from './http';
import type { ShippingAddress, CreateShippingAddressRequest, UpdateShippingAddressRequest } from './models/ShippingAddress';

export const shippingAddressService = {
  /**
   * Lấy danh sách địa chỉ của user hiện tại
   */
  getAll: () => http.get<ShippingAddress[]>('/accounts/shipping-addresses/'),

  /**
   * Lấy chi tiết 1 địa chỉ
   */
  getById: (id: string) => http.get<ShippingAddress>(`/accounts/shipping-addresses/${id}/`),

  /**
   * Lấy địa chỉ mặc định
   */
  getDefault: () => http.get<ShippingAddress>('/accounts/shipping-addresses/default/'),

  /**
   * Tạo địa chỉ mới
   */
  create: (data: CreateShippingAddressRequest) => 
    http.post<ShippingAddress>('/accounts/shipping-addresses/', data),

  /**
   * Cập nhật địa chỉ
   */
  update: (id: string, data: UpdateShippingAddressRequest) => 
    http.patch<ShippingAddress>(`/accounts/shipping-addresses/${id}/`, data),

  /**
   * Xóa địa chỉ
   */
  delete: (id: string) => 
    http.delete(`/accounts/shipping-addresses/${id}/`),

  /**
   * Đặt địa chỉ làm mặc định
   */
  setDefault: (id: string) => 
    http.post<ShippingAddress>(`/accounts/shipping-addresses/${id}/set_default/`),
};

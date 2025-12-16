import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { shippingAddressService } from './shippingAddressApiService';
import type { ShippingAddress, CreateShippingAddressRequest, UpdateShippingAddressRequest } from './models/ShippingAddress';

/**
 * Hook lấy danh sách địa chỉ của user
 */
export function useShippingAddresses(autoFetch = true) {
  const [addresses, setAddresses] = useState<ShippingAddress[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await shippingAddressService.getAll();
      setAddresses(response.data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Không thể tải danh sách địa chỉ';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchAddresses();
    }
  }, [autoFetch]);

  return { addresses, loading, error, refetch: fetchAddresses };
}

/**
 * Hook tạo địa chỉ mới
 */
export function useCreateAddress() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createAddress = async (data: CreateShippingAddressRequest) => {
    try {
      setLoading(true);
      setError(null);
      const response = await shippingAddressService.create(data);
      toast.success('Thêm địa chỉ thành công!');
      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Không thể tạo địa chỉ';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createAddress, loading, error };
}

/**
 * Hook cập nhật địa chỉ
 */
export function useUpdateAddress() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateAddress = async (id: string, data: UpdateShippingAddressRequest) => {
    try {
      setLoading(true);
      setError(null);
      const response = await shippingAddressService.update(id, data);
      toast.success('Cập nhật địa chỉ thành công!');
      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Không thể cập nhật địa chỉ';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateAddress, loading, error };
}

/**
 * Hook xóa địa chỉ
 */
export function useDeleteAddress() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteAddress = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await shippingAddressService.delete(id);
      toast.success('Đã xóa địa chỉ!');
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Không thể xóa địa chỉ';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deleteAddress, loading, error };
}

/**
 * Hook đặt địa chỉ làm mặc định
 */
export function useSetDefaultAddress() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setDefaultAddress = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await shippingAddressService.setDefault(id);
      toast.success('Đã đặt làm địa chỉ mặc định!');
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Không thể đặt địa chỉ mặc định';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { setDefaultAddress, loading, error };
}

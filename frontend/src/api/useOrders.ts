import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { ordersService } from './ordersApiService';
import type { Cart, Order } from './models/Order';

export const useCart = () => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCart = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ordersService.getMyCart();
      setCart(data);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Không thể tải giỏ hàng';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product_id: string, quantity: number) => {
    try {
      const data = await ordersService.addToCart({ product_id, quantity });
      setCart(data);
      toast.success('Đã thêm vào giỏ hàng');
      return true;
    } catch (err: any) {
      const message = err.response?.data?.error || 'Không thể thêm vào giỏ hàng';
      toast.error(message);
      return false;
    }
  };

  const updateCartItem = async (item_id: string, quantity: number) => {
    try {
      const data = await ordersService.updateCartItem({ item_id, quantity });
      setCart(data);
      if (quantity === 0) {
        toast.success('Đã xóa sản phẩm khỏi giỏ hàng');
      } else {
        toast.success('Đã cập nhật số lượng');
      }
      return true;
    } catch (err: any) {
      const message = err.response?.data?.error || 'Không thể cập nhật giỏ hàng';
      toast.error(message);
      return false;
    }
  };

  const clearCart = async () => {
    try {
      await ordersService.clearCart();
      setCart(null);
      toast.success('Đã xóa giỏ hàng');
      return true;
    } catch (err: any) {
      const message = err.response?.data?.error || 'Không thể xóa giỏ hàng';
      toast.error(message);
      return false;
    }
  };


  return { cart, loading, error, fetchCart, addToCart, updateCartItem, clearCart };
};

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ordersService.getMyOrders();
      setOrders(data);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Không thể tải danh sách đơn hàng';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (shipping_address: string) => {
    try {
      const data = await ordersService.createOrderFromCart({ shipping_address });
      toast.success('Đặt hàng thành công!');
      return data;
    } catch (err: any) {
      const message = err.response?.data?.error || 'Không thể tạo đơn hàng';
      toast.error(message);
      return null;
    }
  };

  const cancelOrder = async (id: string) => {
    try {
      await ordersService.cancelOrder(id);
      toast.success('Đã hủy đơn hàng');
      await fetchOrders(); // Refresh list
      return true;
    } catch (err: any) {
      const message = err.response?.data?.error || 'Không thể hủy đơn hàng';
      toast.error(message);
      return false;
    }
  };

  return { orders, loading, error, fetchOrders, createOrder, cancelOrder };
};

export const useOrderDetail = (
  id: string,
  options?: { autoFetch?: boolean; refetchOnFocus?: boolean }
) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await ordersService.getOrderById(id);
      setOrder(data);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Không thể tải thông tin đơn hàng';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // Auto fetch on mount/id change (default: true)
  useEffect(() => {
    const auto = options?.autoFetch !== false;
    if (auto && id) {
      fetchOrder();
    }
  }, [id]);

  // Optional: refetch when tab gains focus
  useEffect(() => {
    if (!options?.refetchOnFocus) return;
    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        fetchOrder();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [id, options?.refetchOnFocus]);

  return { order, loading, error, refetch: fetchOrder };
};

import http from './http';
import type { Cart, Order, AddToCartRequest, UpdateCartItemRequest, CreateOrderRequest, OrderStatus } from './models/Order';

export const ordersService = {
  // Cart
  getMyCart: async () => {
    const response = await http.get<Cart>('/orders/cart/my_cart/');
    return response.data;
  },

  addToCart: async (data: AddToCartRequest) => {
    const response = await http.post<Cart>('/orders/cart/add_item/', data);
    return response.data;
  },

  updateCartItem: async (data: UpdateCartItemRequest) => {
    const response = await http.post<Cart>('/orders/cart/update_item/', data);
    return response.data;
  },

  clearCart: async () => {
    await http.delete('/orders/cart/clear/');
  },

  // Orders
  getMyOrders: async () => {
    const response = await http.get<Order[]>('/orders/orders/');
    return response.data;
  },

  // Admin: lấy tất cả đơn (staff sẽ nhận toàn bộ)
  getAllOrders: async () => {
    const response = await http.get<Order[]>('/orders/orders/');
    return response.data;
  },

  getOrderById: async (id: string) => {
    const response = await http.get<Order>(`/orders/orders/${id}/`);
    return response.data;
  },

  createOrderFromCart: async (data: CreateOrderRequest) => {
    const response = await http.post<Order>('/orders/orders/create_from_cart/', data);
    return response.data;
  },

  // Admin: cập nhật trạng thái đơn
  updateOrderStatus: async (id: string, status: OrderStatus) => {
    const response = await http.patch<Order>(`/orders/orders/${id}/`, { status });
    return response.data;
  },

  cancelOrder: async (id: string) => {
    const response = await http.post<{ message: string }>(`/orders/orders/${id}/cancel/`);
    return response.data;
  },
};

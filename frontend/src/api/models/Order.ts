import type { Product } from './Product';

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
}

export interface Cart {
  id: string;
  items: CartItem[];
  total_items: number;
  created_at: string;
  updated_at: string;
}

export interface AddToCartRequest {
  product_id: string;
  quantity: number;
}

export interface UpdateCartItemRequest {
  item_id: string;
  quantity: number;
}

export interface OrderItem {
  id: string;
  product: Product;
  quantity: number;
  unit_price: string;
  subtotal: string;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  username: string;
  order_number: string;
  items: OrderItem[];
  total_amount: string;
  status: OrderStatus;
  shipping_address: string;
  created_at: string;
  updated_at: string;
}

export interface CreateOrderRequest {
  shipping_address: string;
}

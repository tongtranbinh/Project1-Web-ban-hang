import http from './http';

export interface DashboardOverview {
  revenue_total: number;
  orders_total: number;
  avg_order_value: number;
  period_days: number;
}

export interface RevenueByTime {
  date: string;
  revenue: number;
  orders: number;
}

export interface RevenueByCategory {
  category_id: string | null;
  category_name: string;
  revenue: number;
  quantity: number;
}

export interface TopProduct {
  product_id: string;
  product_name: string;
  revenue: number;
  quantity: number;
}

export interface OrderStatus {
  status: string;
  count: number;
  total_value: number;
}

export interface LowStockProduct {
  id: string;
  name: string;
  stock: number;
  sold: number;
}

export interface DashboardData {
  overview: DashboardOverview;
  revenue_by_time: RevenueByTime[];
  revenue_by_category: RevenueByCategory[];
  top_products: TopProduct[];
  order_status: OrderStatus[];
  low_stock_products: LowStockProduct[];
}

export interface DashboardParams {
  days?: number;
  group_by?: 'day' | 'month';
  stock_threshold?: number;
}

export const dashboardService = {
  /**
   * Lấy dữ liệu dashboard
   */
  async getDashboard(params?: DashboardParams): Promise<DashboardData> {
    const response = await http.get('/orders/dashboard/', { params });
    return response.data;
  },
};

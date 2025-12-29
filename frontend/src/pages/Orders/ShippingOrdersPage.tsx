import { Link } from 'react-router-dom';
import { useOrders } from '../../api/useOrders';
import { useMemo, useState } from 'react';
import type { OrderStatus } from '../../api/models/Order';

const STATUS_OPTIONS: { value: OrderStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Tất cả' },
  { value: 'pending', label: 'Chờ xử lý' },
  { value: 'processing', label: 'Đang xử lý' },
  { value: 'shipped', label: 'Đang giao' },
  { value: 'completed', label: 'Hoàn thành' },
  { value: 'cancelled', label: 'Đã hủy' },
];

export default function ShippingOrdersPage() {
  const { orders, loading, cancelOrder } = useOrders();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');

  // Lọc đơn hàng theo tìm kiếm và trạng thái
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.order_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.shipping_address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' ? true : order.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, statusFilter]);

  const handleCancelOrder = async (orderId: string) => {
    if (window.confirm('Bạn có chắc muốn HỦY đơn hàng này?')) {
      await cancelOrder(orderId);
    }
  };

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND' 
    }).format(parseFloat(price));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: OrderStatus) => {
    const statusConfig = {
      pending: { label: 'Chờ xử lý', color: 'bg-yellow-100 text-yellow-800' },
      processing: { label: 'Đang xử lý', color: 'bg-blue-100 text-blue-800' },
      shipped: { label: 'Đang giao', color: 'bg-purple-100 text-purple-800' },
      completed: { label: 'Hoàn thành', color: 'bg-green-100 text-green-800' },
      cancelled: { label: 'Đã hủy', color: 'bg-red-100 text-red-800' },
    };
    const config = statusConfig[status];
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.color}`}>
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Danh Sách Đơn Hàng</h1>
              <p className="text-gray-600 mt-1">
                Theo dõi và quản lý các đơn hàng của bạn
              </p>
            </div>
            <div className="flex gap-3">
              <Link 
                to="/products" 
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Mua sắm
              </Link>
              <Link 
                to="/" 
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
              >
                ← Trang Chủ
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Bộ lọc và tìm kiếm */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tìm kiếm
              </label>
              <input
                type="text"
                placeholder="Tìm theo mã đơn, địa chỉ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trạng thái
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'all')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            Tìm thấy <span className="font-semibold text-gray-900">{filteredOrders.length}</span> đơn hàng
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Không tìm thấy đơn hàng nào
            </h2>
            <p className="text-gray-600 mb-6">
              {searchTerm || statusFilter !== 'all' 
                ? 'Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm'
                : 'Bạn chưa đặt đơn hàng nào'}
            </p>
            <Link
              to="/products"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Bắt đầu mua sắm
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mã đơn hàng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ngày đặt
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Địa chỉ giao hàng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tổng tiền
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          #{order.order_number}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">
                          {formatDate(order.created_at)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600 max-w-xs truncate">
                          {order.shipping_address}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          {formatPrice(order.total_amount)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          {(order.status === 'pending' || order.status === 'processing') && (
                            <button
                              onClick={() => handleCancelOrder(order.id)}
                              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                            >
                              Hủy đơn
                            </button>
                          )}
                          <Link
                            to={`/orders/${order.id}`}
                            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                          >
                            Chi tiết
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

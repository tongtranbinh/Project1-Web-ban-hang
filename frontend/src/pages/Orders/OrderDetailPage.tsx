import { useParams, Link } from 'react-router-dom';
import { useOrderDetail } from '../../api/useOrders';
import type { OrderStatus } from '../../api/models/Order';

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { order, loading, error } = useOrderDetail(id!);

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
      <span className={`px-4 py-2 rounded-full text-sm font-semibold ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getStatusTimeline = (status: OrderStatus) => {
    const statuses = ['pending', 'processing', 'shipped', 'completed'];
    const currentIndex = statuses.indexOf(status);
    
    if (status === 'cancelled') {
      return (
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-3xl">✕</span>
            </div>
            <p className="font-semibold text-gray-900">Đơn hàng đã bị hủy</p>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-between">
        {[
          { key: 'pending', label: 'Chờ xử lý', icon: '📋' },
          { key: 'processing', label: 'Đang xử lý', icon: '⚙️' },
          { key: 'shipped', label: 'Đang giao', icon: '🚚' },
          { key: 'completed', label: 'Hoàn thành', icon: '✓' }
        ].map((step, index) => {
          const isActive = index <= currentIndex;
          return (
            <div key={step.key} className="flex-1 flex flex-col items-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                isActive ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'
              }`}>
                {step.icon}
              </div>
              <p className={`text-sm mt-2 ${isActive ? 'text-gray-900 font-semibold' : 'text-gray-500'}`}>
                {step.label}
              </p>
              {index < 3 && (
                <div className={`absolute w-full h-1 ${
                  index < currentIndex ? 'bg-blue-600' : 'bg-gray-200'
                }`} style={{ top: '24px', left: '50%', right: '-50%', zIndex: -1 }} />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center">
        <p className="text-red-500 mb-4">{error || 'Không tìm thấy đơn hàng'}</p>
        <Link to="/orders" className="text-blue-600 hover:underline">
          ← Quay lại danh sách đơn hàng
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Đơn hàng #{order.order_number}
              </h1>
              <p className="text-gray-600 mt-1">Đặt ngày: {formatDate(order.created_at)}</p>
            </div>
            <Link 
              to="/orders" 
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
            >
              ← Danh sách đơn hàng
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Timeline */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-6">Trạng thái đơn hàng</h2>
              <div className="relative">
                {getStatusTimeline(order.status)}
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Sản phẩm đã đặt</h2>
              <div className="divide-y">
                {order.items.map((item) => (
                  <div key={item.id} className="py-4 flex gap-4">
                    <Link to={`/products/${item.product.id}`}>
                      <div className="w-20 h-20 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                        {item.product.images && item.product.images.length > 0 ? (
                          <img
                            src={item.product.images[0].image}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-gray-400 text-xs">
                            No Image
                          </div>
                        )}
                      </div>
                    </Link>
                    <div className="flex-1">
                      <Link 
                        to={`/products/${item.product.id}`}
                        className="font-semibold text-gray-900 hover:text-blue-600 block mb-1"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-sm text-gray-500 mb-2">
                        {item.product.category.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {formatPrice(item.unit_price)} x {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-lg text-gray-900">
                        {formatPrice(item.subtotal)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Tóm tắt đơn hàng</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Trạng thái:</span>
                  {getStatusBadge(order.status)}
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Số lượng sản phẩm:</span>
                  <span className="font-semibold">{order.items.length}</span>
                </div>
                <div className="border-t pt-3 flex justify-between">
                  <span className="text-lg font-semibold">Tổng cộng:</span>
                  <span className="text-xl font-bold text-blue-600">
                    {formatPrice(order.total_amount)}
                  </span>
                </div>
              </div>
            </div>

            {/* Shipping Info */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Thông tin giao hàng</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Người nhận:</p>
                  <p className="font-semibold">{order.username}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Địa chỉ:</p>
                  <p className="text-gray-900 whitespace-pre-line">{order.shipping_address}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

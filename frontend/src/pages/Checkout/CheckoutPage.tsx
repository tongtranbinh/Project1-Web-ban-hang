import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../api/useOrders';
import { useOrders } from '../../api/useOrders';
import { shippingAddressService } from '../../api/shippingAddressApiService';
import type { ShippingAddress } from '../../api/models/ShippingAddress';
import { toast } from 'react-hot-toast';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, loading: cartLoading } = useCart();
  const { createOrder } = useOrders();
  const [shippingAddresses, setShippingAddresses] = useState<ShippingAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [loadingAddresses, setLoadingAddresses] = useState(true);

  // Fetch shipping addresses khi component mount
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await shippingAddressService.getAll();
        const addresses = response.data;
        setShippingAddresses(addresses);
        
        // Nếu không có địa chỉ nào, redirect đến trang profile
        if (addresses.length === 0) {
          toast.error('Vui lòng thêm địa chỉ giao hàng trước khi đặt hàng');
          navigate('/profile', { state: { openAddressForm: true } });
          return;
        }
        
        // Tự động chọn địa chỉ mặc định hoặc địa chỉ đầu tiên
        const defaultAddress = addresses.find(addr => addr.is_default);
        setSelectedAddressId(defaultAddress?.id || addresses[0].id);
      } catch (error: any) {
        console.error('Error fetching addresses:', error);
        toast.error('Không thể tải danh sách địa chỉ');
      } finally {
        setLoadingAddresses(false);
      }
    };

    fetchAddresses();
  }, [navigate]);

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND' 
    }).format(parseFloat(price));
  };

  const calculateTotal = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((sum, item) => {
      return sum + (parseFloat(item.product.price) * item.quantity);
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAddressId) {
      toast.error('Vui lòng chọn địa chỉ giao hàng');
      return;
    }

    const selectedAddress = shippingAddresses.find(addr => addr.id === selectedAddressId);
    if (!selectedAddress) {
      toast.error('Địa chỉ không hợp lệ');
      return;
    }

    // Format địa chỉ đầy đủ
    const fullAddress = `${selectedAddress.full_name} - ${selectedAddress.phone_number}\n${selectedAddress.description}\n${selectedAddress.ward ? selectedAddress.ward + ', ' : ''}${selectedAddress.district ? selectedAddress.district + ', ' : ''}${selectedAddress.city}`;

    setSubmitting(true);
    const order = await createOrder(fullAddress);
    setSubmitting(false);

    if (order) {
      navigate(`/orders/${order.id}`);
    }
  };

  if (cartLoading || loadingAddresses) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center">
        <p className="text-gray-600 mb-4">Giỏ hàng trống</p>
        <button
          onClick={() => navigate('/products')}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Quay lại mua sắm
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Thanh Toán</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Shipping Info */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Thông tin giao hàng</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chọn địa chỉ giao hàng <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedAddressId}
                    onChange={(e) => setSelectedAddressId(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3"
                  >
                    <option value="">-- Chọn địa chỉ --</option>
                    {shippingAddresses.map((address) => (
                      <option key={address.id} value={address.id}>
                        {address.full_name} - {address.phone_number} | {address.description}, {address.ward && `${address.ward}, `}{address.district && `${address.district}, `}{address.city}
                        {address.is_default && ' ⭐ (Mặc định)'}
                      </option>
                    ))}
                  </select>

                  {/* Preview địa chỉ đã chọn */}
                  {selectedAddressId && shippingAddresses.find(a => a.id === selectedAddressId) && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h3 className="font-semibold text-blue-900 mb-2">📍 Địa chỉ giao hàng:</h3>
                      {(() => {
                        const addr = shippingAddresses.find(a => a.id === selectedAddressId)!;
                        return (
                          <div className="text-sm text-blue-800 space-y-1">
                            <p><strong>Người nhận:</strong> {addr.full_name}</p>
                            <p><strong>Số điện thoại:</strong> {addr.phone_number}</p>
                            <p><strong>Địa chỉ:</strong> {addr.description}</p>
                            <p>{addr.ward && `${addr.ward}, `}{addr.district && `${addr.district}, `}{addr.city}</p>
                          </div>
                        );
                      })()}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => navigate('/profile')}
                    className="mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    + Quản lý địa chỉ giao hàng
                  </button>
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Sản phẩm ({cart.total_items})
                </h2>
                <div className="divide-y">
                  {cart.items.map((item) => (
                    <div key={item.id} className="py-4 flex gap-4">
                      <div className="w-16 h-16 bg-gray-200 rounded overflow-hidden flex-shrink-0">
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
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{item.product.name}</h3>
                        <p className="text-sm text-gray-500">
                          {formatPrice(item.product.price)} x {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          {formatPrice((parseFloat(item.product.price) * item.quantity).toString())}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow p-6 sticky top-4">
                <h2 className="text-xl font-semibold mb-4">Tổng đơn hàng</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tạm tính:</span>
                    <span className="font-semibold">{formatPrice(calculateTotal().toString())}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phí vận chuyển:</span>
                    <span className="font-semibold">Miễn phí</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between">
                    <span className="text-lg font-semibold">Tổng cộng:</span>
                    <span className="text-xl font-bold text-blue-600">
                      {formatPrice(calculateTotal().toString())}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting || !selectedAddressId}
                  className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Đang xử lý...' : 'Đặt hàng'}
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/cart')}
                  className="w-full mt-3 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold"
                >
                  Quay lại giỏ hàng
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

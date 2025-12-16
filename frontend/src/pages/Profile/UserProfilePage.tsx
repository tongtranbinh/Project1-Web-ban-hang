import { useState, useEffect } from 'react';
import { useAuthStatus } from '../../api/useAuth';
import { 
  useShippingAddresses, 
  useCreateAddress, 
  useUpdateAddress, 
  useDeleteAddress, 
  useSetDefaultAddress 
} from '../../api/useShippingAddress';
import type { ShippingAddress, CreateShippingAddressRequest } from '../../api/models/ShippingAddress';

export default function UserProfilePage() {
  const { user } = useAuthStatus();
  const { addresses, loading: loadingAddresses, refetch } = useShippingAddresses();
  const { createAddress, loading: creating } = useCreateAddress();
  const { updateAddress, loading: updating } = useUpdateAddress();
  const { deleteAddress, loading: deleting } = useDeleteAddress();
  const { setDefaultAddress, loading: settingDefault } = useSetDefaultAddress();

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateShippingAddressRequest>({
    full_name: '',
    phone_number: '',
    description: '',
    city: '',
    district: '',
    ward: '',
    is_default: false,
  });

  const resetForm = () => {
    setFormData({
      full_name: '',
      phone_number: '',
      description: '',
      city: '',
      district: '',
      ward: '',
      is_default: false,
    });
    setEditingId(null);
    setShowAddForm(false);
  };

  const handleEdit = (address: ShippingAddress) => {
    setFormData({
      full_name: address.full_name,
      phone_number: address.phone_number,
      description: address.description,
      city: address.city,
      district: address.district || '',
      ward: address.ward || '',
      is_default: address.is_default,
    });
    setEditingId(address.id);
    setShowAddForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateAddress(editingId, formData);
      } else {
        await createAddress(formData);
      }
      await refetch();
      resetForm();
    } catch (error) {
      // Error handled in hooks
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc muốn xóa địa chỉ này?')) {
      try {
        await deleteAddress(id);
        await refetch();
      } catch (error) {
        // Error handled in hook
      }
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await setDefaultAddress(id);
      await refetch();
    } catch (error) {
      // Error handled in hook
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* User Info Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-2xl font-bold mb-4">Thông tin cá nhân</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">Username</p>
            <p className="font-semibold">{user?.username}</p>
          </div>
          <div>
            <p className="text-gray-600">Email</p>
            <p className="font-semibold">{user?.email}</p>
          </div>
          <div>
            <p className="text-gray-600">Họ tên</p>
            <p className="font-semibold">{user?.full_name || 'Chưa cập nhật'}</p>
          </div>
          <div>
            <p className="text-gray-600">Số điện thoại</p>
            <p className="font-semibold">{user?.phone_number || 'Chưa cập nhật'}</p>
          </div>
        </div>
      </div>

      {/* Shipping Addresses Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Địa chỉ giao hàng</h2>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {showAddForm ? 'Hủy' : '+ Thêm địa chỉ'}
          </button>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded bg-gray-50">
            <h3 className="font-semibold mb-3">
              {editingId ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Họ tên người nhận *"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className="border rounded px-3 py-2"
                required
              />
              <input
                type="tel"
                placeholder="Số điện thoại *"
                value={formData.phone_number}
                onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                className="border rounded px-3 py-2"
                required
              />
              <input
                type="text"
                placeholder="Địa chỉ chi tiết *"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="border rounded px-3 py-2 md:col-span-2"
                required
              />
              <input
                type="text"
                placeholder="Thành phố *"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="border rounded px-3 py-2"
                required
              />
              <input
                type="text"
                placeholder="Quận/Huyện"
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className="border rounded px-3 py-2"
              />
              <input
                type="text"
                placeholder="Phường/Xã"
                value={formData.ward}
                onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
                className="border rounded px-3 py-2"
              />
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.is_default}
                  onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
                />
                <span>Đặt làm địa chỉ mặc định</span>
              </label>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                type="submit"
                disabled={creating || updating}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
              >
                {creating || updating ? 'Đang lưu...' : editingId ? 'Cập nhật' : 'Thêm'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Hủy
              </button>
            </div>
          </form>
        )}

        {/* Addresses List */}
        {loadingAddresses ? (
          <p className="text-center py-8">Đang tải...</p>
        ) : addresses.length === 0 ? (
          <p className="text-center text-gray-500 py-8">Chưa có địa chỉ nào</p>
        ) : (
          <div className="space-y-4">
            {addresses.map((address) => (
              <div
                key={address.id}
                className={`border rounded p-4 ${
                  address.is_default ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="font-semibold">{address.full_name}</p>
                      {address.is_default && (
                        <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">
                          Mặc định
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600">SĐT: {address.phone_number}</p>
                    <p className="text-gray-600">
                      {address.description}
                      {address.ward && `, ${address.ward}`}
                      {address.district && `, ${address.district}`}
                      {`, ${address.city}`}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 ml-4">
                    {!address.is_default && (
                      <button
                        onClick={() => handleSetDefault(address.id)}
                        disabled={settingDefault}
                        className="text-blue-600 hover:underline text-sm disabled:opacity-50"
                      >
                        Đặt mặc định
                      </button>
                    )}
                    <button
                      onClick={() => handleEdit(address)}
                      className="text-green-600 hover:underline text-sm"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(address.id)}
                      disabled={deleting}
                      className="text-red-600 hover:underline text-sm disabled:opacity-50"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

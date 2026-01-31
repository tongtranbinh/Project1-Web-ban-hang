import { Link } from 'react-router-dom';

export default function AdminHomePage() {
  const adminMenus = [
    {
      title: 'Dashboard Thống Kê',
      icon: '📊',
      href: '/admin/dashboard',
      color: 'from-indigo-600 to-indigo-800',
    },
    {
      title: 'Quản Lý Sản Phẩm',
      icon: '📦',
      href: '/admin/products',
      color: 'from-pink-500 to-red-600',
    },
    {
      title: 'Quản Lý Đơn Hàng',
      icon: '🛒',
      href: '/admin/orders',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Quản Lý Người Dùng',
      icon: '👥',
      href: '/admin/users',
      color: 'from-green-500 to-teal-500',
    },
    {
      title: 'Quản Lý Thông Báo',
      icon: '🔔',
      href: '/admin/notifications',
      color: 'from-yellow-500 to-orange-500',
    }

  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🛡️ Admin Panel</h1>
          <p className="text-lg text-gray-600">
            Chào mừng bạn quay lại. Chọn một tính năng để bắt đầu quản lý cửa hàng.
          </p>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {adminMenus.map((menu) => (
            <Link
              key={menu.href}
              to={menu.href}
              className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${menu.color} opacity-90 group-hover:opacity-100 transition-opacity`} />

              {/* Content */}
              <div className="relative p-6 text-white h-full flex flex-col justify-between">
                <div>
                  <div className="text-5xl mb-4">{menu.icon}</div>
                  <h2 className="text-xl font-bold mb-2">{menu.title}</h2>
                </div>

                {/* Arrow indicator */}
                <div className="mt-4 flex items-center text-sm font-semibold group-hover:translate-x-2 transition-transform">
                  Đi tới
                  <span className="ml-2">→</span>
                </div>
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-5 transition-opacity" />
            </Link>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">📋 Thông Tin Nhanh</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
              <p className="text-sm text-indigo-600 font-medium mb-1">Tổng Sản Phẩm</p>
              <p className="text-2xl font-bold text-indigo-900">--</p>
              <p className="text-xs text-indigo-600 mt-1">Cập nhật từ dashboard</p>
            </div>
            <div className="p-4 bg-pink-50 rounded-lg border border-pink-200">
              <p className="text-sm text-pink-600 font-medium mb-1">Đơn Hàng Hôm Nay</p>
              <p className="text-2xl font-bold text-pink-900">--</p>
              <p className="text-xs text-pink-600 mt-1">Cập nhật từ dashboard</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-600 font-medium mb-1">Doanh Thu Hôm Nay</p>
              <p className="text-2xl font-bold text-blue-900">--</p>
              <p className="text-xs text-blue-600 mt-1">Cập nhật từ dashboard</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-600 font-medium mb-1">Tồn Kho Thấp</p>
              <p className="text-2xl font-bold text-green-900">--</p>
              <p className="text-xs text-green-600 mt-1">Cần nhập thêm hàng</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Link } from 'react-router-dom'
import toast from 'react-hot-toast';
import { useEffect } from 'react';
import { getUserProfile, useAuthStatus, useLogout } from '../../api/useAuth'

export default function Home() {
  const { isAuthenticated, user } = useAuthStatus();
  const { logout, loading: loggingOut } = useLogout();
  const { UserProfile, profile, loading: loadingProfile, error: profileError } = getUserProfile();

  const handleLogout = () => {
    if (window.confirm('Bạn có chắc muốn đăng xuất?')) {
      logout();
    }
  };

  const loadProfile = async () => {
    await UserProfile();
    if (profileError) {
      toast.error(profileError);
    }
  }

  useEffect(() => {
    loadProfile();
  }, []);


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-indigo-600">Project1 Shop</h1>
          
          {isAuthenticated ? (
            <nav className="flex items-center gap-4">
              <span className="text-gray-700">
                Xin chào, <span className="font-semibold text-indigo-600">{profile?.full_name}</span>
              </span>
              <Link 
                to="/profile" 
                className="px-6 py-2 text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
              >
                Tài khoản
              </Link>
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium disabled:bg-red-300"
              >
                {loggingOut ? 'Đang xuất...' : 'Đăng xuất'}
              </button>
            </nav>
          ) : (
            <nav className="flex gap-4">
              <Link 
                to="/login" 
                className="px-6 py-2 text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
              >
                Đăng nhập
              </Link>
              <Link 
                to="/register" 
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                Đăng ký
              </Link>
            </nav>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold mb-6">
            Chào mừng đến với cửa hàng của chúng tôi
          </h2>
          <p className="text-xl mb-8 text-indigo-100">
            Khám phá hàng ngàn sản phẩm chất lượng với giá tốt nhất
          </p>
          <Link 
            to="/products" 
            className="inline-block px-8 py-4 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition-all transform hover:scale-105 shadow-lg"
          >
            Xem sản phẩm
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow">
              <h3 className="text-2xl font-bold mb-4 text-gray-800">
                🚚 Giao hàng nhanh
              </h3>
              <p className="text-gray-600">
                Miễn phí vận chuyển cho đơn hàng trên 500k
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow">
              <h3 className="text-2xl font-bold mb-4 text-gray-800">
                🔒 Thanh toán an toàn
              </h3>
              <p className="text-gray-600">
                Bảo mật thông tin 100%
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow">
              <h3 className="text-2xl font-bold mb-4 text-gray-800">
                🎁 Ưu đãi hấp dẫn
              </h3>
              <p className="text-gray-600">
                Khuyến mãi liên tục mỗi tuần
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

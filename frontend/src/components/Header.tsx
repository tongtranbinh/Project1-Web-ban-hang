import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  ShoppingCart, 
  User, 
  Menu, 
  X,
} from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('access_token');
  const cartNumber = localStorage.getItem('cart_number');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${searchQuery}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">K</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Kshop</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/products" 
              className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
            >
              Sản phẩm
            </Link>
            {isAuthenticated && (
              <Link
                to="/orders"
                className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
              >
                Đơn hàng
              </Link>
            )}
          { user.is_staff && (
            <Link 
              to="/admin"
              className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
            >
              Quản trị
            </Link>
          )}
            

          </nav>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </form>

          {/* Right Icons */}
          <div className="flex items-center space-x-4">

            {/* Cart */}
            <Link 
              to="/cart" 
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="w-6 h-6 text-gray-700" />
              {/* Cart badge */}
              {cartNumber && (parseInt(cartNumber) > 0) && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {parseInt(cartNumber) > 9 ? '9+' : cartNumber}
                </span>
              )}
            </Link>

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <div className="hidden md:flex items-center space-x-2">
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span>{user.full_name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </form>

            {/* Mobile Navigation */}
            <nav className="space-y-2">
              <Link 
                to="/products" 
                className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Sản phẩm
              </Link>

              {isAuthenticated && (
                <Link
                  to="/orders"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Đơn hàng
                </Link>
              )}

              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Hồ sơ
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-center font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

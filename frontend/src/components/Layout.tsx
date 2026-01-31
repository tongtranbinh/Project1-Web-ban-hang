import type { ReactNode } from 'react';
import { MessageCircle, Bell } from 'lucide-react';
import { useState, useEffect } from 'react';
import { notificationService } from '../api/notificationApiService';
import Header from './Header';
import NotificationBell from './NotificationBell';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const isAuthenticated = localStorage.getItem('access_token');

  // Load unread count khi component mount
  useEffect(() => {
    if (isAuthenticated) {
      loadUnreadCount();
      // Refresh mỗi 30s khi popup đóng, mỗi 10s khi popup mở
      const interval = setInterval(loadUnreadCount, 60000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, showNotificationPopup]);

  const loadUnreadCount = async () => {
    try {
      const count = await notificationService.getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error('Error loading unread count:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1">
        {children}
      </main>

      {/* Floating Buttons */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        {/* Notification Floating Button - chỉ hiển thị khi đăng nhập */}
        {isAuthenticated && (
          <div className="relative">
            <button
              onClick={() => setShowNotificationPopup(!showNotificationPopup)}
              className="bg-orange-600 text-white p-4 rounded-full shadow-lg hover:bg-orange-700 transition-all hover:scale-110 relative"
              aria-label="Notifications"
            >
              <Bell className="w-6 h-6" />
              { (unreadCount > 0) && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>)}
            </button>
            
            {/* Popup NotificationBell */}
            {showNotificationPopup && (
              <div className="absolute bottom-full right-0 mb-3">
                <div className="bg-white rounded-lg shadow-2xl border border-gray-200 w-96 max-h-[500px] overflow-hidden">
                  <NotificationBell onClose={() => setShowNotificationPopup(false)} />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Messenger Floating Button */}
        <a
          href="https://www.facebook.com/binh.tongtran.75"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all hover:scale-110"
          aria-label="Chat on Messenger"
        >
          <MessageCircle className="w-6 h-6" />
        </a>
      </div>

      <footer className="bg-gray-900 text-white py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Column 1: Giao hàng nhanh */}
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start mb-3">
                <span className="text-3xl mr-3">🚚</span>
                <h4 className="text-lg font-bold">Giao hàng nhanh chóng</h4>
              </div>
              <p className="text-gray-400 text-sm">
                Miễn phí vận chuyển cho đơn hàng trên 500k. 
                Giao hàng nhanh trong 24-48h tại nội thành.
              </p>
            </div>

            {/* Column 2: Cam kết đổi trả */}
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start mb-3">
                <span className="text-3xl mr-3">🔄</span>
                <h4 className="text-lg font-bold">Cam kết đổi trả</h4>
              </div>
              <p className="text-gray-400 text-sm">
                Đổi trả miễn phí trong vòng 7 ngày nếu sản phẩm 
                có lỗi từ nhà sản xuất hoặc không đúng mô tả.
              </p>
            </div>

            {/* Column 3: Contact */}
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start mb-3">
                <span className="text-3xl mr-3">📞</span>
                <h4 className="text-lg font-bold">Liên hệ hỗ trợ</h4>
              </div>
              <p className="text-gray-400 text-sm">
                Hotline: 1900-xxxx<br />
                Email: support@kshop.com<br />
                Thời gian: 8:00 - 22:00 hàng ngày
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
              <p className="mb-4 md:mb-0">
                &copy; {new Date().getFullYear()} KShop. All rights reserved.
              </p>
              <p className="text-gray-500">
                Designed by <span className="text-white font-semibold">SoundClown #666                   
                </span>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

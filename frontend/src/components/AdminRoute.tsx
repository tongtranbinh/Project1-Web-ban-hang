import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStatus } from '../api/useAuth';
import toast from 'react-hot-toast';

interface AdminRouteProps {
  children: React.ReactNode;
}

/**
 * Component bảo vệ route - chỉ admin mới được truy cập
 * Nếu chưa đăng nhập sẽ redirect về /login
 * Nếu không phải admin sẽ redirect về trang chủ
 */
export default function AdminRoute({ children }: AdminRouteProps) {
  const { isAuthenticated, user } = useAuthStatus();
  const location = useLocation();

  if (!isAuthenticated) {
    toast.error('Vui lòng đăng nhập');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Kiểm tra quyền admin
  if (!user?.is_staff && !user?.is_superuser) {
    toast.error('Bạn không có quyền truy cập trang này');
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

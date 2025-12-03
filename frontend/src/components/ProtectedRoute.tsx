import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStatus } from '../api/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Component bảo vệ route - yêu cầu authentication
 * Nếu chưa đăng nhập sẽ redirect về /login
 */
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuthStatus();
  const location = useLocation();

  if (!isAuthenticated) {
    // Lưu đường dẫn hiện tại để redirect lại sau khi login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

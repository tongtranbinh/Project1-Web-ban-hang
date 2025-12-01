import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { accountsService } from './accountsApiService';
import type { LoginRequest, RegisterRequest } from './models/User';

/**
 * Hook xử lý đăng nhập
 */
export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const login = async (data: LoginRequest) => {
    try {
      setLoading(true);
      setError(null);

      const response = await accountsService.login(data);

      // Lưu thông tin vào localStorage
      localStorage.setItem('access_token', response.access);
      localStorage.setItem('refresh_token', response.refresh);
      localStorage.setItem('user', JSON.stringify(response.user));

      toast.success(`Chào mừng ${response.user.username}!`);
      
      // Chuyển về trang chủ
      navigate('/', { replace: true });
    } catch (err: any) {
      // Xử lý lỗi từ backend LoginSerializer
      const errorMessage = err.response?.data?.non_field_errors?.[0] ||
                          err.response?.data?.detail || 
                          'Đăng nhập thất bại';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
}

/**
 * Hook xử lý đăng ký
 */
export function useRegister() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const register = async (data: RegisterRequest) => {
    try {
      setLoading(true);
      setError(null);

      const response = await accountsService.register(data);

      localStorage.setItem('access_token', response.access);
      localStorage.setItem('refresh_token', response.refresh);
      localStorage.setItem('user', JSON.stringify(response.user));

      toast.success('Đăng ký thành công!');
      
      navigate('/', { replace: true });
    } catch (err: any) {
      const errorData = err.response?.data;
      if (errorData && typeof errorData === 'object') {
        const firstError = Object.values(errorData)[0];
        const errorMessage = Array.isArray(firstError) ? firstError[0] : 'Đăng ký thất bại';
        setError(errorMessage);
        toast.error(errorMessage);
      } else {
        setError('Đăng ký thất bại');
        toast.error('Đăng ký thất bại');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { register, loading, error };
}

/**
 * Hook xử lý đăng xuất
 */
export function useLogout() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const logout = async () => {
    try {
      setLoading(true);
      const refreshToken = localStorage.getItem('refresh_token');

      if (refreshToken) {
        await accountsService.logout(refreshToken);
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      
      toast.success('Đã đăng xuất thành công');
      
      setLoading(false);
      navigate('/login', { replace: true });
    }
  };

  return { logout, loading };
}

/**
 * Hook kiểm tra trạng thái đăng nhập
 */
export function useAuthStatus() {
  const token = localStorage.getItem('access_token');
  const userStr = localStorage.getItem('user');
  
  const isAuthenticated = !!token;
  const user = userStr ? JSON.parse(userStr) : null;

  return { isAuthenticated, user };
}

export function getUserProfile() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);

  const UserProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const profileData = await accountsService.getProfile();
      setProfile(profileData);
      return profile;
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Lấy thông tin thất bại';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }
  return { UserProfile, profile, loading, error };
}

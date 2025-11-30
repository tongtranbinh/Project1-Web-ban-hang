import http from './http';
import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, User } from './models/User';

export const accountsService = {
  /**
   * Đăng nhập
   */
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await http.post<LoginResponse>('/accounts/login/', data);
    return response.data;
  },

  /**
   * Đăng ký tài khoản mới
   */
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await http.post<RegisterResponse>('/accounts/register/', data);
    return response.data;
  },

  /**
   * Đăng xuất (blacklist refresh token)
   */
  logout: async (refreshToken: string): Promise<void> => {
    await http.post('/accounts/logout/', { refresh: refreshToken });
  },

  /**
   * Lấy thông tin profile user hiện tại
   */
  getProfile: async (): Promise<User> => {
    const response = await http.get<User>('/accounts/users/me/');
    return response.data;
  },

  /**
   * Refresh access token
   */
  refreshToken: async (refreshToken: string): Promise<{ access: string }> => {
    const response = await http.post<{ access: string }>('/accounts/token/refresh/', {
      refresh: refreshToken,
    });
    return response.data;
  },
};

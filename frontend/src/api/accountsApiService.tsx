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

  /**
   * Lấy danh sách tất cả người dùng (admin only)
   */
  getAllUsers: async (): Promise<User[]> => {
    const response = await http.get<User[]>('/accounts/users/');
    return response.data;
  },

  /**
   * Lấy chi tiết người dùng theo ID (admin only)
   */
  getUserById: async (id: string): Promise<User> => {
    const response = await http.get<User>(`/accounts/users/${id}/`);
    return response.data;
  },

  /**
   * Cập nhật người dùng (admin only)
   */
  updateUser: async (
    id: string,
    data: Partial<{
      username: string;
      email: string;
      phone_number: string;
      full_name: string;
      first_name: string;
      last_name: string;
      is_staff: boolean;
      is_superuser: boolean;
    }>
  ): Promise<User> => {
    const response = await http.patch<User>(`/accounts/users/${id}/`, data);
    return response.data;
  },

  /**
   * Xóa người dùng (admin only)
   */
  deleteUser: async (id: string): Promise<void> => {
    await http.delete(`/accounts/users/${id}/`);
  },

  /**
   * Đặt lại mật khẩu cho người dùng (admin only)
   */
  resetUserPassword: async (id: string, newPassword: string): Promise<void> => {
    await http.post(`/accounts/users/${id}/set_password/`, {
      password: newPassword,
    });
  },
};

import axios from 'axios';

const baseURL = '/api';

const http = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Interceptor để tự động thêm token vào mỗi request
http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor để xử lý refresh token khi access token hết hạn
http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Nếu lỗi 401 và chưa retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await axios.post(
          `${baseURL}/accounts/token/refresh/`,
          null,
          { withCredentials: true }
        );

        const { access } = response.data;
        localStorage.setItem('access_token', access);

        // Retry request với token mới
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return http(originalRequest);
      } catch (refreshError) {
        // Refresh token hết hạn, đăng xuất user
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default http;

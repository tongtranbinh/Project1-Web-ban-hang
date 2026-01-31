import http from './http';

export interface Notification {
  id: string;
  title: string;
  message: string;
  notification_type: 'order' | 'system' | 'promotion' | 'info';
  category: 'order' | 'system' | 'promotion' | 'info';
  is_read: boolean;
  is_dismissed: boolean;
  created_at: string;
}

export interface UnreadCountResponse {
  unread_count: number;
}

export const notificationService = {
  /**
   * Lấy danh sách thông báo
   */
  getNotifications: async (): Promise<Notification[]> => {
    const response = await http.get<Notification[]>('/notifications/');
    return response.data;
  },

  /**
   * Lấy số lượng thông báo chưa đọc
   */
  getUnreadCount: async (): Promise<number> => {
    const response = await http.get<UnreadCountResponse>('/notifications/unread_count/');
    return response.data.unread_count;
  },

  /**
   * Đánh dấu 1 thông báo đã đọc
   */
  markAsRead: async (id: string): Promise<void> => {
    await http.post(`/notifications/${id}/mark_as_read/`);
  },

  /**
   * Đánh dấu tất cả thông báo đã đọc
   */
  markAllAsRead: async (): Promise<void> => {
    await http.post('/notifications/mark_all_as_read/');
  },

  /**
   * Dismiss thông báo (ẩn khỏi danh sách)
   */
  dismissNotification: async (id: string): Promise<void> => {
    await http.post(`/notifications/${id}/dismiss/`);
  },

};

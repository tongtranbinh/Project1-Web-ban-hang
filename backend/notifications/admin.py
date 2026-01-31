from django.contrib import admin
from django.utils.html import format_html
from .models import Notification, NotificationReceipt


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    """
    Admin cho quản lý thông báo chung (không bao gồm thông báo đơn hàng riêng)
    """
    list_display = ('title', 'category_badge', 'notification_type', 'created_by', 'recipient_count', 'created_at', 'is_deleted')
    list_filter = ('category', 'notification_type', 'is_deleted', 'created_at')
    search_fields = ('title', 'message')
    ordering = ('-created_at',)
    readonly_fields = ('id', 'created_at', 'updated_at')
    
    fieldsets = (
        ('Thông tin chính', {
            'fields': ('title', 'message', 'category', 'notification_type')
        }),
        ('Người gửi & Trạng thái', {
            'fields': ('user_id', 'is_deleted')
        }),
        ('Thông tin hệ thống', {
            'fields': ('id', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def get_queryset(self, request):
        """
        Chỉ hiển thị thông báo chung (không phải thông báo đơn hàng riêng)
        Hoặc có thể filter theo category != 'order'
        """
        qs = super().get_queryset(request)
        # Nếu muốn ẩn thông báo order riêng, uncomment dòng dưới:
        # qs = qs.exclude(category='order')
        return qs
    
    def category_badge(self, obj):
        """Hiển thị badge màu cho category"""
        colors = {
            'order': 'blue',
            'system': 'gray',
            'promotion': 'green',
            'info': 'orange'
        }
        color = colors.get(obj.category, 'gray')
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 10px; border-radius: 3px;">{}</span>',
            color,
            obj.get_category_display()
        )
    category_badge.short_description = 'Loại'
    
    def created_by(self, obj):
        """Hiển thị người tạo"""
        if obj.user:
            return obj.user.username
        return "Hệ thống"
    created_by.short_description = 'Người tạo'
    
    def recipient_count(self, obj):
        """Đếm số người nhận"""
        return obj.receipts.count()
    recipient_count.short_description = 'Số người nhận'
    
    actions = ['mark_as_deleted', 'mark_as_active']
    
    def mark_as_deleted(self, request, queryset):
        """Đánh dấu xóa thông báo"""
        updated = queryset.update(is_deleted=True)
        self.message_user(request, f'Đã đánh dấu xóa {updated} thông báo.')
    mark_as_deleted.short_description = "Đánh dấu đã xóa"
    
    def mark_as_active(self, request, queryset):
        """Khôi phục thông báo"""
        updated = queryset.update(is_deleted=False)
        self.message_user(request, f'Đã khôi phục {updated} thông báo.')
    mark_as_active.short_description = "Khôi phục"


@admin.register(NotificationReceipt)
class NotificationReceiptAdmin(admin.ModelAdmin):
    """
    Admin cho xem trạng thái đọc của từng user (read-only)
    """
    list_display = ('notification_title', 'user_name', 'is_read', 'is_dismissed', 'read_at', 'created_at')
    list_filter = ('is_read', 'is_dismissed', 'created_at')
    search_fields = ('notification_id__title', 'user_id__username')
    ordering = ('-created_at',)
    readonly_fields = ('id', 'notification_id', 'user_id', 'is_read', 'is_dismissed', 'read_at', 'dismissed_at', 'created_at')
    
    def has_add_permission(self, request):
        """Không cho phép thêm mới từ admin"""
        return False
    
    def has_delete_permission(self, request, obj=None):
        """Không cho phép xóa từ admin"""
        return False
    
    def notification_title(self, obj):
        return obj.notification.title
    notification_title.short_description = 'Thông báo'
    
    def user_name(self, obj):
        return obj.user.username
    user_name.short_description = 'User'

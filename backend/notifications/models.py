import uuid
from django.db import models
from django.conf import settings


class NotificationType(models.TextChoices):
    ORDER = "order", "Đơn hàng"
    SYSTEM = "system", "Hệ thống"
    PROMOTION = "promotion", "Khuyến mãi"
    INFO = "info", "Thông tin"


class Notification(models.Model):
    """
    Bảng chứa thông báo gốc (có thể gửi cho 1 hoặc nhiều users)
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    notification_type = models.CharField(max_length=50, choices=NotificationType.choices, default=NotificationType.INFO)
    title = models.CharField(max_length=255)
    message = models.TextField()
    category = models.CharField(max_length=50, choices=NotificationType.choices, default=NotificationType.INFO)  # Duplicate for compatibility
    is_deleted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="created_notifications",
        null=True,
        blank=True,
        db_column='user_id',
        help_text="User nào tạo notification này (null nếu là hệ thống)"
    )

    class Meta:
        db_table = 'notifications_notification'
        ordering = ["-created_at"]
        verbose_name = "Notification"
        verbose_name_plural = "Notifications"

    def __str__(self):
        return f"{self.title}"


class NotificationReceipt(models.Model):
    """
    Bảng theo dõi trạng thái đọc/dismiss của từng user với từng notification
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    notification = models.ForeignKey(
        Notification,
        on_delete=models.CASCADE,
        related_name="receipts",
        db_column="notification_id"
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="notification_receipts",
        db_column="user_id"
    )
    is_read = models.BooleanField(default=False)
    is_dismissed = models.BooleanField(default=False)
    read_at = models.DateTimeField(null=True, blank=True)
    dismissed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'notifications_notificationreceipt'
        unique_together = ('notification', 'user')
        ordering = ["-created_at"]
        verbose_name = "Notification Receipt"
        verbose_name_plural = "Notification Receipts"

    def __str__(self):
        return f"{self.user.username} - {self.notification.title}"

from rest_framework import serializers
from notifications.models import Notification, NotificationReceipt


class NotificationSerializer(serializers.ModelSerializer):
    """Serializer cho Notification với thêm trường is_read và is_dismissed từ receipt"""
    is_read = serializers.SerializerMethodField()
    is_dismissed = serializers.SerializerMethodField()
    recipients = serializers.ListField(
        child=serializers.UUIDField(),
        write_only=True,
        required=False,
        help_text="Danh sách user IDs để gửi thông báo (dùng khi tạo broadcast)"
    )

    class Meta:
        model = Notification
        fields = [
            'id',
            'notification_type',
            'title',
            'message',
            'category',
            'is_deleted',
            'is_read',
            'is_dismissed',
            'recipients',
            'created_at',
            'updated_at',
        ]
        read_only_fields = [
            'id',
            'is_read',
            'is_dismissed',
            'created_at',
            'updated_at',
        ]

    def get_is_read(self, obj):
        """Lấy is_read từ NotificationReceipt của user hiện tại"""
        request = self.context.get('request')
        if not request or not request.user:
            return False
        
        try:
            receipt = NotificationReceipt.objects.get(
                notification=obj,
                user=request.user
            )
            return receipt.is_read
        except NotificationReceipt.DoesNotExist:
            return False

    def get_is_dismissed(self, obj):
        """Lấy is_dismissed từ NotificationReceipt của user hiện tại"""
        request = self.context.get('request')
        if not request or not request.user:
            return False
        
        try:
            receipt = NotificationReceipt.objects.get(
                notification=obj,
                user=request.user
            )
            return receipt.is_dismissed
        except NotificationReceipt.DoesNotExist:
            return False


class NotificationReceiptSerializer(serializers.ModelSerializer):
    """Serializer cho NotificationReceipt"""
    
    class Meta:
        model = NotificationReceipt
        fields = [
            'id',
            'notification',
            'user',
            'is_read',
            'is_dismissed',
            'read_at',
            'dismissed_at',
            'created_at',
        ]
        read_only_fields = [
            'id',
            'created_at',
        ]

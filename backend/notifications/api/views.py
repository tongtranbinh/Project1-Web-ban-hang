from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from drf_spectacular.utils import extend_schema, extend_schema_view
from notifications.models import Notification, NotificationReceipt
from accounts.models import User
from .serializers import NotificationSerializer, NotificationReceiptSerializer


@extend_schema_view(
    list=extend_schema(tags=['Notifications']),
    create=extend_schema(tags=['Notifications']),
    retrieve=extend_schema(tags=['Notifications']),
    update=extend_schema(tags=['Notifications']),
    partial_update=extend_schema(tags=['Notifications']),
    destroy=extend_schema(tags=['Notifications']),
    mark_as_read=extend_schema(tags=['Notifications']),
    mark_all_as_read=extend_schema(tags=['Notifications']),
    unread_count=extend_schema(tags=['Notifications']),
    dismiss=extend_schema(tags=['Notifications']),
)
class NotificationViewSet(viewsets.ModelViewSet):
    """
    ViewSet cho Notifications
    - User có thể xem/đánh dấu notifications của mình
    - Admin có thể create/update/delete notifications
    """
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Lấy notifications dựa trên quyền user"""
        user = self.request.user
        
        # Admin có thể xem tất cả notifications
        if user.is_staff:
            return Notification.objects.filter(
                is_deleted=False
            ).order_by('-created_at')
        
        # User thường chỉ xem notifications của mình (qua receipt)
        notification_ids = NotificationReceipt.objects.filter(
            user=user,
            is_dismissed=False
        ).values_list('notification', flat=True)
        
        return Notification.objects.filter(
            id__in=notification_ids,
            is_deleted=False
        ).order_by('-created_at')
    
    def create(self, request, *args, **kwargs):
        """Chỉ admin có thể tạo notifications"""
        if not request.user.is_staff:
            return Response(
                {'detail': 'Chỉ admin mới có thể tạo thông báo'},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().create(request, *args, **kwargs)
    
    def perform_create(self, serializer):
        """Set user là người tạo và tạo receipt cho tất cả users"""
        notification = serializer.save(user=self.request.user)
        
        # Tạo NotificationReceipt cho người nhận
        recipients_data = self.request.data.get('recipients')
        if recipients_data:
            # Nếu clients gửi danh sách recipients cụ thể
            for user_id in recipients_data:
                try:
                    user = User.objects.get(id=user_id)
                    NotificationReceipt.objects.get_or_create(
                        notification=notification,
                        user=user
                    )
                except User.DoesNotExist:
                    pass
        else:
            # Nếu không gửi recipients, tạo cho tất cả users (broadcast)
            all_users = User.objects.filter(is_active=True)
            for user in all_users:
                NotificationReceipt.objects.get_or_create(
                    notification=notification,
                    user=user
                )
    
    def update(self, request, *args, **kwargs):
        """Chỉ admin có thể sửa notifications"""
        if not request.user.is_staff:
            return Response(
                {'detail': 'Chỉ admin mới có thể sửa thông báo'},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().update(request, *args, **kwargs)
    
    def destroy(self, request, *args, **kwargs):
        """Chỉ admin có thể xóa notifications (soft delete)"""
        if not request.user.is_staff:
            return Response(
                {'detail': 'Chỉ admin mới có thể xóa thông báo'},
                status=status.HTTP_403_FORBIDDEN
            )
        notification = self.get_object()
        notification.is_deleted = True
        notification.save()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def get_serializer_context(self):
        """Thêm request vào context để serializer có thể lấy user"""
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    @action(detail=True, methods=['post'])
    def mark_as_read(self, request, pk=None):
        """Đánh dấu 1 thông báo đã đọc"""
        notification = self.get_object()
        receipt, created = NotificationReceipt.objects.get_or_create(
            notification=notification,
            user=request.user
        )
        receipt.is_read = True
        receipt.read_at = timezone.now()
        receipt.save()
        return Response({'status': 'notification marked as read'})

    @action(detail=False, methods=['post'])
    def mark_all_as_read(self, request):
        """Đánh dấu tất cả thông báo đã đọc"""
        NotificationReceipt.objects.filter(
            user=request.user, 
            is_read=False
        ).update(is_read=True, read_at=timezone.now())
        return Response({'status': 'all notifications marked as read'})

    @action(detail=False, methods=['get'])
    def unread_count(self, request):
        """Lấy số lượng thông báo chưa đọc"""
        count = NotificationReceipt.objects.filter(
            user=request.user, 
            is_read=False,
            notification__is_deleted=False
        ).count()
        return Response({'unread_count': count})

    @action(detail=True, methods=['post'])
    def dismiss(self, request, pk=None):
        """Dismiss một thông báo (ẩn khỏi danh sách)"""
        notification = self.get_object()
        receipt, created = NotificationReceipt.objects.get_or_create(
            notification=notification,
            user=request.user
        )
        receipt.is_dismissed = True
        receipt.dismissed_at = timezone.now()
        receipt.save()
        return Response({'status': 'notification dismissed'})

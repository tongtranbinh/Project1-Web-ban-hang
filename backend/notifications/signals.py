from django.db.models.signals import post_save
from django.dispatch import receiver
from orders.models import Order, OrderStatus
from notifications.models import Notification, NotificationReceipt, NotificationType


@receiver(post_save, sender=Order)
def create_order_notification(sender, instance, created, **kwargs):
    """
    Tự động tạo thông báo khi trạng thái đơn hàng thay đổi
    """
    # Mapping trạng thái sang tiêu đề và message
    status_messages = {
        'pending': {
            'title': 'Đơn hàng đang chờ xử lý',
            'message': f'Đơn hàng #{instance.id} của bạn đang chờ xử lý. Chúng tôi sẽ xác nhận sớm nhất có thể.'
        },
        'processing': {
            'title': 'Đơn hàng đang được xử lý',
            'message': f'Đơn hàng #{instance.id} đang được chuẩn bị. Chúng tôi sẽ thông báo khi hàng được giao cho đơn vị vận chuyển.'
        },
        'shipped': {
            'title': 'Đơn hàng đã được giao cho vận chuyển',
            'message': f'Đơn hàng #{instance.id} đã được giao cho đơn vị vận chuyển. Vui lòng theo dõi trạng thái giao hàng.'
        },
        'completed': {
            'title': 'Đơn hàng hoàn thành',
            'message': f'Đơn hàng #{instance.id} đã được giao thành công. Cảm ơn bạn đã tin tưởng chúng tôi!'
        },
        'cancelled': {
            'title': 'Đơn hàng đã bị hủy',
            'message': f'Đơn hàng #{instance.id} đã bị hủy. Nếu có thắc mắc, vui lòng liên hệ với chúng tôi.'
        }
    }
    
    # Chỉ tạo notification khi order được update (không phải lần đầu tạo)
    # hoặc khi trạng thái thay đổi
    if not created:
        status_info = status_messages.get(instance.status)
        
        if status_info:
            try:
                # Tạo notification
                notification = Notification.objects.create(
                    notification_type=NotificationType.ORDER,
                    title=status_info['title'],
                    message=status_info['message'],
                    category=NotificationType.ORDER,
                    user=instance.user  # Lưu user đặt hàng
                )
                
                # Tạo receipt cho user đặt hàng
                NotificationReceipt.objects.create(
                    notification=notification,
                    user=instance.user,
                    is_read=False,
                    is_dismissed=False
                )
                print(f"[OK] Created notification for order {instance.id} with status {instance.status}")
            except Exception as e:
                print(f"[ERROR] Creating notification for order {instance.id}: {str(e)}")

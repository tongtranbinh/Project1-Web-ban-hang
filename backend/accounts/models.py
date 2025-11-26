import uuid
from django.db import models
from django.conf import settings
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    """
    Bảng user riêng của hệ thống, kế thừa sẵn:
    username, password, email, first_name, last_name, is_staff, is_superuser, ...
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4(), editable=False)
    phone_number = models.CharField(max_length=20, blank=True)
    full_name = models.CharField(max_length=150, blank=True)


    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Users"

    def __str__(self):
        # hiển thị đẹp hơn trong admin
        if self.full_name:
            return f"{self.username} ({self.full_name})"
        return self.username


class ShippingAddress(models.Model):
    """
    Địa chỉ giao hàng của user.
    1 User có thể có nhiều địa chỉ.
    """
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,         
        on_delete=models.CASCADE,
        related_name="shipping_addresses",
    )
    full_name = models.CharField(max_length=150)        # tên người nhận
    phone_number = models.CharField(max_length=20)      # sđt người nhận

    line1 = models.CharField(max_length=255)            # địa chỉ chi tiết
    line2 = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=100)
    district = models.CharField(max_length=100, blank=True)
    ward = models.CharField(max_length=100, blank=True)

    is_default = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-is_default", "-created_at"]

    def __str__(self):
        return f"{self.full_name} - {self.line1}, {self.city}"

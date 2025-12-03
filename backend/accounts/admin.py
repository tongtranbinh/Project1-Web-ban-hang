from django.contrib import admin
from .models import User, ShippingAddress
# Register your models here.

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ("username", "email", "full_name", "is_staff", "is_active")
    search_fields = ("username", "email", "full_name")
    ordering = ("username",)

@admin.register(ShippingAddress)
class ShippingAddressAdmin(admin.ModelAdmin):
    list_display = ("user", "full_name", "phone_number", "description", "city", "district", "ward", "is_default", "created_at")
    search_fields = ("user__username", "full_name", "city", "district", "ward", "phone_number")
    ordering = ("user",)
from rest_framework import serializers
from accounts.models import User, ShippingAddress

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'phone_number', 'full_name',
            'first_name', 'last_name', 'is_staff', 'is_superuser',
        ]
        read_only_fields = ['id', 'is_staff', 'is_superuser']

class ShippingAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShippingAddress
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'user']

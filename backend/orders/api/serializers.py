from rest_framework import serializers
from orders.models import Cart, CartItem, Order, OrderItem
from products.api.serializers import ProductSerializer


class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.UUIDField(write_only=True)
    
    class Meta:
        model = CartItem
        fields = ['id', 'product', 'product_id', 'quantity']
        read_only_fields = ['id']


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_items = serializers.SerializerMethodField()
    
    class Meta:
        model = Cart
        fields = ['id', 'user', 'items', 'total_items', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']
    
    def get_total_items(self, obj):
        return obj.items.count()


class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.UUIDField(write_only=True)
    subtotal = serializers.SerializerMethodField()
    
    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_id', 'quantity', 'unit_price', 'subtotal']
        read_only_fields = ['id']
    
    def get_subtotal(self, obj):
        return obj.quantity * obj.unit_price


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = Order
        fields = [
            'id', 'user', 'username', 'total_amount', 'status', 
            'shipping_address', 'items', 'created_at'
        ]
        read_only_fields = ['id', 'user', 'created_at']


class CreateOrderSerializer(serializers.Serializer):
    """Serializer for creating order from cart"""
    shipping_address = serializers.CharField(max_length=255)
    
    def validate(self, data):
        user = self.context['request'].user
        try:
            cart = Cart.objects.get(user=user)
            if not cart.items.exists():
                raise serializers.ValidationError("Giỏ hàng trống")
        except Cart.DoesNotExist:
            raise serializers.ValidationError("Không tìm thấy giỏ hàng")
        return data

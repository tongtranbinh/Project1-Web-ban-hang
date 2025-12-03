from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import transaction
from drf_spectacular.utils import extend_schema, extend_schema_view
from orders.models import Cart, CartItem, Order, OrderItem
from products.models import Product
from .serializers import (
    CartSerializer, CartItemSerializer, 
    OrderSerializer, OrderItemSerializer, CreateOrderSerializer
)


class IsOwnerOrAdmin(permissions.BasePermission):
    """Chỉ owner hoặc admin mới được xem/sửa"""
    def has_object_permission(self, request, view, obj):
        if request.user.is_staff:
            return True
        # Cart/Order có user field
        return obj.user == request.user


@extend_schema_view(
    list=extend_schema(tags=['Cart']),
    retrieve=extend_schema(tags=['Cart']),
    create=extend_schema(tags=['Cart']),
    update=extend_schema(tags=['Cart']),
    partial_update=extend_schema(tags=['Cart']),
    destroy=extend_schema(tags=['Cart']),
)
class CartViewSet(viewsets.ModelViewSet):
    serializer_class = CartSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]
    
    def get_queryset(self):
        if self.request.user.is_staff:
            return Cart.objects.all()
        return Cart.objects.filter(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def my_cart(self, request):
        """Lấy giỏ hàng của user hiện tại (tự động tạo nếu chưa có)"""
        cart, created = Cart.objects.get_or_create(user=request.user)
        serializer = self.get_serializer(cart)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def add_item(self, request):
        """Thêm sản phẩm vào giỏ hàng"""
        cart, created = Cart.objects.get_or_create(user=request.user)
        product_id = request.data.get('product_id')
        quantity = int(request.data.get('quantity', 1))
        
        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response(
                {'error': 'Không tìm thấy sản phẩm'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        cart_item, created = CartItem.objects.get_or_create(
            cart=cart, 
            product=product,
            defaults={'quantity': quantity}
        )
        
        if not created:
            cart_item.quantity += quantity
            cart_item.save()
        
        serializer = CartSerializer(cart)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def update_item(self, request):
        """Cập nhật số lượng sản phẩm trong giỏ"""
        cart = Cart.objects.get(user=request.user)
        item_id = request.data.get('item_id')
        quantity = int(request.data.get('quantity'))
        
        try:    
            cart_item = CartItem.objects.get(id=item_id, cart=cart)
            if quantity <= 0:
                cart_item.delete()
            else:
                cart_item.quantity = quantity
                cart_item.save()
        except CartItem.DoesNotExist:
            return Response(
                {'error': 'Không tìm thấy item'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = CartSerializer(cart)
        return Response(serializer.data)
    
    @action(detail=False, methods=['delete'])
    def clear(self, request):
        """Xóa toàn bộ giỏ hàng"""
        cart = Cart.objects.get(user=request.user)
        cart.items.all().delete()
        return Response({'message': 'Đã xóa giỏ hàng'})


@extend_schema_view(
    list=extend_schema(tags=['Orders']),
    retrieve=extend_schema(tags=['Orders']),
    create=extend_schema(tags=['Orders']),
    update=extend_schema(tags=['Orders']),
    partial_update=extend_schema(tags=['Orders']),
    destroy=extend_schema(tags=['Orders']),
)
class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]
    
    def get_queryset(self):
        if self.request.user.is_staff:
            return Order.objects.all()
        return Order.objects.filter(user=self.request.user)
    
    @action(detail=False, methods=['post'])
    @extend_schema(
        request=CreateOrderSerializer,
        responses={201: OrderSerializer}
    )
    def create_from_cart(self, request):
        """Tạo đơn hàng từ giỏ hàng hiện tại"""
        serializer = CreateOrderSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        
        with transaction.atomic():
            cart = Cart.objects.get(user=request.user)
            
            # Tính total
            total_amount = sum(
                item.product.price * item.quantity 
                for item in cart.items.all()
            )
            
            # Tạo order
            order = Order.objects.create(
                user=request.user,
                total_amount=total_amount,
                shipping_address=serializer.validated_data['shipping_address'],
                status='pending'
            )
            
            # Tạo order items từ cart items
            for cart_item in cart.items.all():
                OrderItem.objects.create(
                    order=order,
                    product=cart_item.product,
                    quantity=cart_item.quantity,
                    unit_price=cart_item.product.price
                )
            
            # Xóa giỏ hàng
            cart.items.all().delete()
        
        order_serializer = OrderSerializer(order)
        return Response(order_serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """Hủy đơn hàng"""
        order = self.get_object()
        if order.status in ['shipped', 'completed', 'cancelled']:
            return Response(
                {'error': 'Không thể hủy đơn hàng này'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        order.status = 'cancelled'
        order.save()
        serializer = self.get_serializer(order)
        return Response(serializer.data)

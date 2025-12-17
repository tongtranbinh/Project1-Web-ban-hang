from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db import transaction
from django.db.models import Sum, Count, F, Q
from django.db.models.functions import TruncDate, TruncMonth
from django.utils import timezone
from datetime import timedelta
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

            # Kiểm tra tồn kho trước khi tạo
            for cart_item in cart.items.select_related('product').all():
                if cart_item.quantity > cart_item.product.stock:
                    return Response(
                        {'error': f'Sản phẩm {cart_item.product.name} không đủ tồn kho'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
            
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
            for cart_item in cart.items.select_related('product').all():
                OrderItem.objects.create(
                    order=order,
                    product=cart_item.product,
                    quantity=cart_item.quantity,
                    unit_price=cart_item.product.price
                )
                # Trừ tồn kho và cộng sold
                cart_item.product.stock = max(0, cart_item.product.stock - cart_item.quantity)
                cart_item.product.sold = cart_item.product.sold + cart_item.quantity
                cart_item.product.save(update_fields=['stock', 'sold'])
            
            # Xóa giỏ hàng
            cart.items.all().delete()
        
        order_serializer = OrderSerializer(order)
        return Response(order_serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['post', 'delete'])
    def cancel(self, request, pk=None):
        """Hủy đơn hàng: hoàn tồn kho, trừ sold, sau đó xóa order"""
        order = self.get_object()
        if order.status in ['shipped', 'completed']:
            return Response(
                {'error': 'Không thể hủy đơn hàng đã giao hoặc hoàn thành'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        order_id = order.id
        with transaction.atomic():
            for item in order.items.select_related('product').all():
                product = item.product
                product.stock = product.stock + item.quantity
                product.sold = max(0, product.sold - item.quantity)
                product.save(update_fields=['stock', 'sold'])
            order.delete()
        return Response(
            {'message': f'Đã hủy và hoàn tồn kho đơn hàng #{order_id}'}, 
            status=status.HTTP_200_OK
        )


class DashboardView(APIView):
    """API dashboard cho admin - trả về dữ liệu thống kê"""
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        # Query params cho filter tùy chỉnh
        days = int(request.query_params.get('days', 30))
        group_by = request.query_params.get('group_by', 'day')  # day hoặc month
        
        valid_status = ['shipped', 'completed']
        start_date = timezone.now() - timedelta(days=days)
        
        # Filter orders trong khoảng thời gian
        orders_qs = Order.objects.filter(status__in=valid_status, created_at__gte=start_date)

        # === OVERVIEW STATS ===
        revenue_total = orders_qs.aggregate(total=Sum('total_amount'))['total'] or 0
        orders_total = orders_qs.count()
        avg_order_value = float(revenue_total / orders_total) if orders_total else 0

        # === REVENUE BY TIME ===
        if group_by == 'month':
            revenue_by_time = (
                orders_qs.annotate(period=TruncMonth('created_at'))
                .values('period')
                .annotate(revenue=Sum('total_amount'), orders=Count('id'))
                .order_by('period')
            )
        else:
            revenue_by_time = (
                orders_qs.annotate(period=TruncDate('created_at'))
                .values('period')
                .annotate(revenue=Sum('total_amount'), orders=Count('id'))
                .order_by('period')
            )

        # === REVENUE BY CATEGORY ===
        revenue_by_category = (
            OrderItem.objects.filter(order__status__in=valid_status, order__created_at__gte=start_date)
            .values('product__category__id', 'product__category__name')
            .annotate(revenue=Sum(F('quantity') * F('unit_price')), quantity=Sum('quantity'))
            .order_by('-revenue')
        )

        # === TOP PRODUCTS ===
        top_products = (
            OrderItem.objects.filter(order__status__in=valid_status, order__created_at__gte=start_date)
            .values('product__id', 'product__name')
            .annotate(revenue=Sum(F('quantity') * F('unit_price')), quantity=Sum('quantity'))
            .order_by('-revenue')[:10]
        )

        # === ORDER STATUS DISTRIBUTION ===
        all_orders = Order.objects.filter(created_at__gte=start_date)
        order_status_stats = (
            all_orders.values('status')
            .annotate(count=Count('id'), total=Sum('total_amount'))
            .order_by('-count')
        )

        # === LOW STOCK PRODUCTS (admin cần biết) ===
        low_stock_threshold = int(request.query_params.get('stock_threshold', 10))
        low_stock_products = Product.objects.filter(
            stock__lte=low_stock_threshold,
            is_active=True
        ).values('id', 'name', 'stock', 'sold').order_by('stock')[:10]

        # Response data
        data = {
            'overview': {
                'revenue_total': float(revenue_total),
                'orders_total': orders_total,
                'avg_order_value': avg_order_value,
                'period_days': days,
            },
            'revenue_by_time': [
                {
                    'date': item['period'].isoformat(),
                    'revenue': float(item['revenue']),
                    'orders': item['orders']
                }
                for item in revenue_by_time
            ],
            'revenue_by_category': [
                {
                    'category_id': str(item['product__category__id']) if item['product__category__id'] else None,
                    'category_name': item['product__category__name'] or 'Chưa phân loại',
                    'revenue': float(item['revenue']),
                    'quantity': item['quantity']
                }
                for item in revenue_by_category
            ],
            'top_products': [
                {
                    'product_id': str(item['product__id']),
                    'product_name': item['product__name'],
                    'revenue': float(item['revenue']),
                    'quantity': item['quantity']
                }
                for item in top_products
            ],
            'order_status': [
                {
                    'status': item['status'],
                    'count': item['count'],
                    'total_value': float(item['total']) if item['total'] else 0
                }
                for item in order_status_stats
            ],
            'low_stock_products': list(low_stock_products),
        }
        return Response(data)

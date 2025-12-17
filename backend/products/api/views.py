
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from drf_spectacular.utils import extend_schema, extend_schema_view, OpenApiExample
from products.models import Product, Category, ProductImage 
from .serializers import ProductSerializer, CategorySerializer, ProductImageSerializer, ProductListSerializer
from django.db import transaction

# Custom permission to allow only staff users to create, update, delete
class IsStaffOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_staff
@extend_schema_view(
    list=extend_schema(tags=['Products']),
    retrieve=extend_schema(tags=['Products']),
    create=extend_schema(tags=['Products']),
    update=extend_schema(tags=['Products']),
    partial_update=extend_schema(tags=['Products']),
    destroy=extend_schema(tags=['Products']),
    images=extend_schema(tags=['Products']),
    search=extend_schema(tags=['Products']),
)
class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsStaffOrReadOnly]

    def get_serializer_class(self):
        """Dùng ProductListSerializer cho list, ProductSerializer cho detail"""
        if self.action == 'list' or self.action == 'search':
            return ProductListSerializer
        return ProductSerializer

    @action(detail=True, methods=['get'], url_path='images')
    def images(self, request, pk=None):
        images = ProductImage.objects.filter(product_id=pk)
        serializer = ProductImageSerializer(images, many=True)
        return Response(serializer.data)
    @action(detail=False, methods=['get'])
    def search(self, request):
        q = (request.query_params.get('q') or '').strip()
        category_id = (request.query_params.get('category_id') or '').strip()

        qs = Product.objects.filter(is_active=True)

        if q:
            qs = qs.filter(name__icontains=q)

        if category_id:
            qs = qs.filter(category_id=category_id)

        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAdminUser])
    def low_stock(self, request):
        threshold = int(request.query_params.get('threshold', 5))
        qs = Product.objects.filter(stock__lte=threshold).order_by('stock')
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def best_sellers(self, request):
        limit = int(request.query_params.get('limit', 10))
        qs = Product.objects.filter(is_active=True).order_by('-sold')[:limit]
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def adjust_stock(self, request, pk=None):
        """Điều chỉnh tồn kho: truyền new_stock hoặc delta."""
        product = self.get_object()
        new_stock = request.data.get('new_stock')
        delta = request.data.get('delta')
        if new_stock is None and delta is None:
            return Response({'error': 'Cần truyền new_stock hoặc delta'}, status=status.HTTP_400_BAD_REQUEST)
        with transaction.atomic():
            if new_stock is not None:
                product.stock = int(new_stock)
            else:
                product.stock = max(0, product.stock + int(delta))
            product.save(update_fields=['stock'])
        serializer = self.get_serializer(product)
        return Response(serializer.data)


@extend_schema_view(
    list=extend_schema(tags=['Categories']),
    retrieve=extend_schema(tags=['Categories']),
    create=extend_schema(tags=['Categories']),
    update=extend_schema(tags=['Categories']),
    partial_update=extend_schema(tags=['Categories']),
    destroy=extend_schema(tags=['Categories']),
)
class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsStaffOrReadOnly]
@extend_schema_view(
    list=extend_schema(tags=['Products']),
    retrieve=extend_schema(tags=['Products']),
    create=extend_schema(tags=['Products']),
    update=extend_schema(tags=['Products']),
    partial_update=extend_schema(tags=['Products']),
    destroy=extend_schema(tags=['Products']),
)
class ProductImageViewSet(viewsets.ModelViewSet):
    queryset = ProductImage.objects.all()
    serializer_class = ProductImageSerializer
    permission_classes = [IsStaffOrReadOnly]

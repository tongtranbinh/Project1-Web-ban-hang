# Product serializers
from rest_framework import serializers
from products.models import Category, Product, ProductImage

class CategorySerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'description']
        read_only_fields = ['id']

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'product', 'image']
        read_only_fields = ['id']

class ProductListSerializer(serializers.ModelSerializer):
    """Serializer cho trang list - chỉ trả ảnh cover (ảnh đầu tiên)"""
    category = CategorySerializer(read_only=True)
    cover_image = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'description', 'price', 'stock', 'sold',
            'category', 'created_at', 'cover_image', 'is_active'
        ]
        read_only_fields = ['id', 'created_at']

    def get_cover_image(self, obj) -> dict:
        """Lấy ảnh đầu tiên của sản phẩm"""
        first_image = obj.images.first()
        if first_image:
            return ProductImageSerializer(first_image).data
        return None

class ProductSerializer(serializers.ModelSerializer):
    """Serializer cho trang detail - trả tất cả ảnh"""
    category = CategorySerializer(read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'description', 'price', 'stock', 'sold',
            'category', 'created_at', 'images', 'is_active'
        ]
        read_only_fields = ['id', 'created_at']


class ProductCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer dùng cho tạo/cập nhật, nhận category_id để gán FK"""
    category_id = serializers.UUIDField(write_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'description', 'price', 'stock', 'is_active', 'category_id'
        ]
        read_only_fields = ['id']

    def validate_category_id(self, value):
        if not Category.objects.filter(id=value).exists():
            raise serializers.ValidationError('Category không tồn tại')
        return value

    def create(self, validated_data):
        category_id = validated_data.pop('category_id')
        category = Category.objects.get(id=category_id)
        return Product.objects.create(category=category, **validated_data)

    def update(self, instance, validated_data):
        category_id = validated_data.pop('category_id', None)
        for attr, val in validated_data.items():
            setattr(instance, attr, val)
        if category_id:
            instance.category = Category.objects.get(id=category_id)
        instance.save()
        return instance
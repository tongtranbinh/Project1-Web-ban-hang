
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from accounts.models import User, ShippingAddress
from .serializers import UserSerializer, ShippingAddressSerializer

class UserViewSet(viewsets.ModelViewSet):
	queryset = User.objects.all()
	serializer_class = UserSerializer
	permission_classes = [permissions.IsAuthenticated]

	def get_queryset(self):
		# Chỉ cho phép user xem thông tin của chính mình
		return User.objects.filter(id=self.request.user.id)

class ShippingAddressViewSet(viewsets.ModelViewSet):
	queryset = ShippingAddress.objects.all()
	serializer_class = ShippingAddressSerializer
	permission_classes = [permissions.IsAuthenticated]

	def get_queryset(self):
		# Chỉ trả về địa chỉ của user hiện tại
		return ShippingAddress.objects.filter(user=self.request.user)

	def perform_create(self, serializer):
		# Gán user hiện tại khi tạo mới
		serializer.save(user=self.request.user)
	
	@action(detail=False, methods=['get'])
	def default(self, request):
		"""API lấy địa chỉ mặc định của user"""
		address = ShippingAddress.objects.filter(
			user=request.user, 
			is_default=True
		).first()
		if address:
			serializer = self.get_serializer(address)
			return Response(serializer.data)
		return Response(
			{"detail": "Không tìm thấy địa chỉ mặc định"}, 
			status=status.HTTP_404_NOT_FOUND
		)
	
	@action(detail=True, methods=['post'])
	def set_default(self, request, pk=None):
		"""API đặt địa chỉ này làm mặc định"""
		address = self.get_object()
		# Bỏ default của các địa chỉ khác
		ShippingAddress.objects.filter(
			user=request.user, 
			is_default=True
		).update(is_default=False)
		# Set địa chỉ này làm default
		address.is_default = True
		address.save()
		serializer = self.get_serializer(address)
		return Response(serializer.data)

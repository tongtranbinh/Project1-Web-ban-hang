
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from drf_spectacular.utils import extend_schema, extend_schema_view, OpenApiExample
from accounts.models import User, ShippingAddress
from .serializers import UserSerializer, ShippingAddressSerializer, RegisterSerializer, LoginSerializer

@extend_schema_view(
	list=extend_schema(tags=['Users']),
	retrieve=extend_schema(tags=['Users']),
	create=extend_schema(tags=['Users']),
	update=extend_schema(tags=['Users']),
	partial_update=extend_schema(tags=['Users']),
	destroy=extend_schema(tags=['Users']),
	me=extend_schema(tags=['Users']),
)
class UserViewSet(viewsets.ModelViewSet):
	queryset = User.objects.all()
	serializer_class = UserSerializer
	permission_classes = [permissions.IsAuthenticated]

	def get_queryset(self):
		# Chỉ cho phép user xem thông tin của chính mình
		return User.objects.filter(id=self.request.user.id)
	@action(detail=False, methods=['get'])
	def me(self, request):
		"""API lấy thông tin user hiện tại"""
		serializer = self.get_serializer(request.user)
		return Response(serializer.data)

@extend_schema_view(
	list=extend_schema(tags=['Shipping Addresses']),
	retrieve=extend_schema(tags=['Shipping Addresses']),
	create=extend_schema(tags=['Shipping Addresses']),
	update=extend_schema(tags=['Shipping Addresses']),
	partial_update=extend_schema(tags=['Shipping Addresses']),
	destroy=extend_schema(tags=['Shipping Addresses']),
	default=extend_schema(tags=['Shipping Addresses']),
	set_default=extend_schema(tags=['Shipping Addresses']),
)
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

@extend_schema(tags=['Authentication'])
class RegisterView(APIView):
	permission_classes = [permissions.AllowAny]
	serializer_class = RegisterSerializer
	
	@extend_schema(
		request=RegisterSerializer,
		responses={201: UserSerializer}
	)
	def post(self, request):
		serializer = RegisterSerializer(data=request.data)
		if serializer.is_valid():
			user = serializer.save()
			refresh = RefreshToken.for_user(user)
			return Response({
				'user': UserSerializer(user).data,
				'refresh': str(refresh),
				'access': str(refresh.access_token),
			}, status=status.HTTP_201_CREATED)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@extend_schema(tags=['Authentication'])
class LoginView(APIView):
	permission_classes = [permissions.AllowAny]
	serializer_class = LoginSerializer
	
	@extend_schema(
		request=LoginSerializer,
		responses={200: UserSerializer}
	)
	def post(self, request):
		serializer = LoginSerializer(data=request.data)
		if serializer.is_valid():
			user = serializer.validated_data
			refresh = RefreshToken.for_user(user)
			return Response({
				'user': UserSerializer(user).data,
				'refresh': str(refresh),
				'access': str(refresh.access_token),
			}, status=status.HTTP_200_OK)
		return Response(serializer.errors, status=status.HTTP_401_UNAUTHORIZED)

@extend_schema(tags=['Authentication'])
class LogoutView(APIView):
	permission_classes = [permissions.IsAuthenticated]

	@extend_schema(
		request={'type': 'object', 'properties': {'refresh': {'type': 'string'}}},
		responses={200: {'type': 'object', 'properties': {'detail': {'type': 'string'}}}}
	)
	def post(self, request):
		try:
			refresh_token = request.data.get('refresh')
			if refresh_token:
				token = RefreshToken(refresh_token)
				token.blacklist()
			return Response({"detail": "Logout successful"}, status=status.HTTP_200_OK)
		except Exception as e:
			return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

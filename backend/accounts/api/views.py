
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from drf_spectacular.utils import extend_schema, OpenApiExample
from accounts.models import User, ShippingAddress
from .serializers import UserSerializer, ShippingAddressSerializer, RegisterSerializer, LoginSerializer

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
	@extend_schema(
		description="Trả về địa chỉ giao hàng mặc định của người dùng hiện tại.",
		examples=[
			OpenApiExample(
				name="Default address",
				description="Ví dụ phản hồi khi có địa chỉ mặc định",
				value={
					"id": "0c3f2e0a-4c23-4e1a-a1c7-9d6d6b3f4c10",
					"user": "9a8f7b6c-1234-5678-9abc-def012345678",
					"full_name": "Nguyen Van A",
					"phone_number": "0901234567",
					"line1": "123 Đường Lê Lợi",
					"line2": "Tầng 2",
					"city": "Hà Nội",
					"district": "Ba Đình",
					"ward": "Phúc Xá",
					"is_default": True,
					"created_at": "2025-11-30T10:15:00Z"
				}
			)
		]
	)
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
	@extend_schema(
		description="Đặt địa chỉ giao hàng có ID cung cấp làm mặc định cho người dùng hiện tại.",
		examples=[
			OpenApiExample(
				name="Set default result",
				description="Ví dụ phản hồi sau khi đặt mặc định",
				value={
					"id": "0c3f2e0a-4c23-4e1a-a1c7-9d6d6b3f4c10",
					"user": "9a8f7b6c-1234-5678-9abc-def012345678",
					"full_name": "Nguyen Van A",
					"phone_number": "0901234567",
					"line1": "123 Đường Lê Lợi",
					"line2": "Tầng 2",
					"city": "Hà Nội",
					"district": "Ba Đình",
					"ward": "Phúc Xá",
					"is_default": True,
					"created_at": "2025-11-30T10:15:00Z"
				}
			)
		]
	)
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

class RegisterView(APIView):
	permission_classes = [permissions.AllowAny]

	@extend_schema(
		description="Đăng ký tài khoản mới và trả về thông tin user cùng với JWT access/refresh token.",
		request=RegisterSerializer,
		responses={201: UserSerializer},
		examples=[
			OpenApiExample(
				name="Register response",
				description="Ví dụ phản hồi đăng ký thành công",
				value={
					"user": {
						"id": "9a8f7b6c-1234-5678-9abc-def012345678",
						"username": "binh",
						"email": "binh@example.com",
						"phone_number": "0901234567",
						"full_name": "Binh Tran",
						"first_name": "Binh",
						"last_name": "Tran",
						"is_staff": False,
						"is_superuser": False
					},
					"refresh": "<refresh_token>",
					"access": "<access_token>"
				}
			)
		]
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

class LoginView(APIView):
	permission_classes = [permissions.AllowAny]

	@extend_schema(
		description="Đăng nhập bằng username/password và nhận JWT access/refresh token.",
		request=LoginSerializer,
		examples=[
			OpenApiExample(
				name="Login response",
				description="Ví dụ phản hồi đăng nhập thành công",
				value={
					"user": {
						"id": "9a8f7b6c-1234-5678-9abc-def012345678",
						"username": "binh",
						"email": "binh@example.com",
						"phone_number": "0901234567",
						"full_name": "Binh Tran",
						"first_name": "Binh",
						"last_name": "Tran",
						"is_staff": False,
						"is_superuser": False
					},
					"refresh": "<refresh_token>",
					"access": "<access_token>"
				}
			)
		]
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

class LogoutView(APIView):
	permission_classes = [permissions.IsAuthenticated]

	@extend_schema(
		description="Đăng xuất bằng cách blacklist refresh token. Truyền 'refresh' trong body.",
		examples=[
			OpenApiExample(
				name="Logout response",
				description="Ví dụ phản hồi đăng xuất thành công",
				value={"detail": "Logout successful"}
			)
		]
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

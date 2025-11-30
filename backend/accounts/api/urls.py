
from django.urls import path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from .views import UserViewSet, ShippingAddressViewSet, RegisterView, LoginView, LogoutView

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'shipping-addresses', ShippingAddressViewSet, basename='shippingaddress')

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
] + router.urls

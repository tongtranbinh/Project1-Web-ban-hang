
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, ShippingAddressViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'shipping-addresses', ShippingAddressViewSet, basename='shippingaddress')

urlpatterns = router.urls

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DriverLogViewSet, DutyEntryViewSet

router = DefaultRouter()
router.register(r'logs', DriverLogViewSet, basename='driverlog')

router.register(r'duty-entries', DutyEntryViewSet, basename='dutyentry')

urlpatterns = [
    path('', include(router.urls)),
]
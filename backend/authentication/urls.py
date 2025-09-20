# authentication/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ZitadelAuthViewSet

router = DefaultRouter()
router.register(r'auth', ZitadelAuthViewSet, basename='auth')

urlpatterns = [
    path('', include(router.urls)),
]
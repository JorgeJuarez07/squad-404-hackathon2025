from django.urls import path
from .views import RegisterView, LoginView
from .views import UserListAPIView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
     path('api/users/', UserListAPIView.as_view(), name='user-list'),
]
from django.urls import path
from .views import ProductListCreateView, ProductDetailView, UserMetricsView # <-- Make sure all are imported

urlpatterns = [
    path('products/', ProductListCreateView.as_view(), name='product-list-create'),
    path('products/<int:pk>/', ProductDetailView.as_view(), name='product-detail'),
    path('metrics/', UserMetricsView.as_view(), name='user-metrics'),
]
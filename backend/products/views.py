from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Product
from .serializers import ProductSerializer
from django.db.models import Sum

class ProductListCreateView(generics.ListCreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

class UserMetricsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_products = Product.objects.filter(user=request.user)
        total_sales = user_products.filter(is_sold=True).aggregate(Sum('price'))['price__sum'] or 0
        sold_products_count = user_products.filter(is_sold=True).count()
        
        return Response({
            'total_sales': total_sales,
            'sold_products_count': sold_products_count
        })
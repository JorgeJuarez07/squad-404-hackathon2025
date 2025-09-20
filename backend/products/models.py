from django.db import models
from django.conf import settings

class Product(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    unit = models.CharField(max_length=50)
    image = models.ImageField(upload_to='product_images/', blank=True, null=True)
    
    is_delivery_available = models.BooleanField(default=False)
    is_pickup_available = models.BooleanField(default=False)
    is_published = models.BooleanField(default=False) # <-- Nuevo campo

    def __str__(self):
        return self.name
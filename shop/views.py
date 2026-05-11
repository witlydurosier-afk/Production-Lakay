from rest_framework import generics
from .models import Product, GalleryImage
from .serializers import ProductSerializer, GalleryImageSerializer

class ProductListView(generics.ListAPIView):
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductSerializer

class GalleryImageView(generics.ListAPIView):
    queryset = GalleryImage.objects.filter(is_active=True)
    serializer_class = GalleryImageSerializer

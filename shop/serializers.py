from rest_framework import serializers
from .models import Product, GalleryImage

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'price', 'image', 'description', 'is_active', 'created_at']

class GalleryImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = GalleryImage
        fields = ['id', 'title', 'image', 'order', 'is_active']

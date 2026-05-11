from django.urls import path
from .views import ProductListView, GalleryImageView

urlpatterns = [
    path('products/', ProductListView.as_view(), name='product-list'),
    path('gallery/', GalleryImageView.as_view(), name='gallery-list'),
]

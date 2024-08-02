from django.urls import path
from . import views
urlpatterns = [
    path('checkroom',views.checkroom, name='checkroom'),
    path('send',views.send, name='send')
]

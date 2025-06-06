from django.contrib import admin
from django.urls import path, include # Import include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/user/', include('app_user.urls')), # Add this line
]
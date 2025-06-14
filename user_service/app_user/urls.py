from django.urls import path
from .views import UserRegistrationView, UserLoginView, UserLogoutView, UserDetailView

urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='user-registration'),
    path('login/', UserLoginView.as_view(), name='user-login'),
    path('logout/', UserLogoutView.as_view(), name='user-logout'),
    path('me/', UserDetailView.as_view(), name='user-detail'),
]
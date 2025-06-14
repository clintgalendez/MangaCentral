from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from rest_framework.throttling import ScopedRateThrottle

from django.contrib.auth import authenticate
from django.core.cache import cache

from .serializers import UserRegistrationSerializer, UserDetailSerializer


class UserRegistrationView(APIView):
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'register'

    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token, created = Token.objects.get_or_create(user=user)
            return Response(
                {
                    "user_info": {
                        "id": user.id,
                        "username": user.username,
                        "email": user.email
                    },
                    "token": token.key
                },
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class UserLoginView(APIView):
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'login'

    def post(self, request):        
        username = request.data.get('username')
        password = request.data.get('password')
                
        if not username or not password:
            return Response(
                {"error": "Username and password are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = authenticate(username=username, password=password)

        if user:
            token, _ = Token.objects.get_or_create(user=user)
            return Response(
                {
                    "user_info": {
                        "id": user.id,
                        "username": user.username,
                        "email": user.email
                    },
                    "token": token.key
                },
                status=status.HTTP_200_OK
            )
        return Response(
            {"error": "Invalid Credentials"},
            status=status.HTTP_400_BAD_REQUEST
        )
    
class UserLogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            cache_key = f"user_detail_{request.user.id}"
            cache.delete(cache_key)
            request.user.auth_token.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class UserDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        cache_key = f"user_detail_{request.user.id}"
        user_data = cache.get(cache_key)
        if not user_data:
            serializer = UserDetailSerializer(request.user)
            user_data = serializer.data
            cache.set(cache_key, user_data, timeout=60 * 5)
        return Response(user_data, status=status.HTTP_200_OK)
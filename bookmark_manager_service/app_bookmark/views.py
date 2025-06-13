from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.shortcuts import get_object_or_404
from .models import Bookmark, SupportedSite
from .serializers import BookmarkSerializer, BookmarkCreateSerializer, SupportedSiteSerializer
from .tasks import scrape_manga_info_task
from urllib.parse import urlparse
from celery.result import AsyncResult
import requests

def get_user_id_from_request(request):
    """Extract user ID from request headers or session"""
    user_id = request.META.get('HTTP_X_USER_ID')
    if not user_id:
        raise ValueError("User ID not provided in request")
    return int(user_id)

def verify_user_exists(user_id):
    """Verify user exists by calling user service"""
    try:
        # This would be the actual user service URL in production
        # For now, we'll assume the user exists
        # response = requests.get(f"http://user_service:8000/api/users/{user_id}/")
        # return response.status_code == 200
        return True
    except:
        return False

class BookmarkListCreateView(generics.ListCreateAPIView):
    serializer_class = BookmarkSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def get_queryset(self):
        user_id = self.request.query_params.get('user_id')
        if user_id:
            return Bookmark.objects.filter(user_id=user_id).order_by('-created_at')
        return Bookmark.objects.none()

    def create(self, request, *args, **kwargs):
        try:
            user_id = get_user_id_from_request(request)
        except ValueError as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Verify user exists
        if not verify_user_exists(user_id):
            return Response(
                {"error": "User not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = BookmarkCreateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        url = serializer.validated_data['url']

        # Check if bookmark already exists for this user and URL
        existing_bookmark = Bookmark.objects.filter(user_id=user_id, url=url).first()
        if existing_bookmark:
            return Response(
                BookmarkSerializer(existing_bookmark).data,
                status=status.HTTP_200_OK
            )

        # Queue the scraping task with Celery
        task = scrape_manga_info_task.delay(user_id, url)
        return Response(
            {"detail": "Scraping started", "task_id": task.id},
            status=status.HTTP_202_ACCEPTED
        )

class BookmarkDetailView(generics.RetrieveDestroyAPIView):
    serializer_class = BookmarkSerializer

    def get_queryset(self):
        user_id = get_user_id_from_request(self.request)
        return Bookmark.objects.filter(user_id=user_id)

    def destroy(self, request, *args, **kwargs):
        user_id = get_user_id_from_request(request)
        instance = self.get_object()
        if instance.user_id != user_id:
            return Response({"error": "You do not have permission to delete this bookmark."},
                            status=status.HTTP_403_FORBIDDEN)
        self.perform_destroy(instance)
        return Response({"detail": "Bookmark deleted successfully."}, status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
def task_status(request, task_id):
    """Get Celery task status by task_id"""
    result = AsyncResult(task_id)
    return Response({"status": result.status})

@api_view(['GET'])
def supported_sites(request):
    """Get list of supported manga sites"""
    sites = SupportedSite.objects.filter(is_active=True)
    serializer = SupportedSiteSerializer(sites, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def refresh_bookmark(request, bookmark_id):
    """Re-scrape bookmark data asynchronously"""
    try:
        user_id = get_user_id_from_request(request)
    except ValueError as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    bookmark = get_object_or_404(Bookmark, id=bookmark_id, user_id=user_id)

    # Queue the scraping task with Celery for refresh
    task = scrape_manga_info_task.delay(user_id, bookmark.url, str(bookmark.id))
    return Response(
        {"detail": "Refresh started", "task_id": task.id},
        status=status.HTTP_202_ACCEPTED
    )
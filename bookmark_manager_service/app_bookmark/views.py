from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.shortcuts import get_object_or_404
from .models import Bookmark, SupportedSite
from .serializers import BookmarkSerializer, BookmarkCreateSerializer, SupportedSiteSerializer
from .tasks import scrape_manga_info_task
from celery.result import AsyncResult
from django.views.decorators.cache import cache_page
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes

class BookmarkListCreateView(generics.ListCreateAPIView):
    serializer_class = BookmarkSerializer
    permission_classes = [IsAuthenticated] # Require authentication

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def get_queryset(self):
        # request.user will be SimpleAuthenticatedUser if authentication was successful
        return Bookmark.objects.filter(user_id=self.request.user.id).order_by('-created_at')

    def create(self, request, *args, **kwargs):
        user_id = request.user.id # Get user_id from authenticated user

        serializer = BookmarkCreateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        url = serializer.validated_data['url']

        existing_bookmark = Bookmark.objects.filter(user_id=user_id, url=url).first()
        if existing_bookmark:
            return Response(
                BookmarkSerializer(existing_bookmark, context={'request': request}).data, # Pass context
                status=status.HTTP_200_OK
            )

        task = scrape_manga_info_task.delay(user_id, url)
        return Response(
            {"detail": "Scraping started", "task_id": task.id},
            status=status.HTTP_202_ACCEPTED
        )

class BookmarkDetailView(generics.RetrieveDestroyAPIView):
    serializer_class = BookmarkSerializer
    permission_classes = [IsAuthenticated] # Require authentication

    def get_queryset(self):
        return Bookmark.objects.filter(user_id=self.request.user.id)

    def destroy(self, request, *args, **kwargs):
        user_id = request.user.id # Get user_id from authenticated user
        instance = self.get_object()
        if instance.user_id != user_id:
            return Response({"error": "You do not have permission to delete this bookmark."},
                            status=status.HTTP_403_FORBIDDEN)
        self.perform_destroy(instance)
        return Response({"detail": "Bookmark deleted successfully."}, status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def task_status(request, task_id):
    
    """Get Celery task status by task_id"""
    result = AsyncResult(task_id)
    return Response({"status": result.status})

@api_view(['GET'])
@cache_page(60 * 15)
def supported_sites(request):
    """Get list of supported manga sites"""
    sites = SupportedSite.objects.filter(is_active=True)
    serializer = SupportedSiteSerializer(sites, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def refresh_bookmark(request, bookmark_id):
    """Re-scrape bookmark data asynchronously"""
    user_id = request.user.id # Get user_id from authenticated user

    bookmark = get_object_or_404(Bookmark, id=bookmark_id, user_id=user_id)

    task = scrape_manga_info_task.delay(user_id, bookmark.url, str(bookmark.id))
    return Response(
        {"detail": "Refresh started", "task_id": task.id},
        status=status.HTTP_202_ACCEPTED
    )
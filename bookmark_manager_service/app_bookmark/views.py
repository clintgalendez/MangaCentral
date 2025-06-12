from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.shortcuts import get_object_or_404
from django.db import transaction
from .models import Bookmark, SupportedSite, ScrapingLog
from .serializers import BookmarkSerializer, BookmarkCreateSerializer, SupportedSiteSerializer
from .scrapers import get_scraper_for_url
from urllib.parse import urlparse
import time
import requests

def get_user_id_from_request(request):
    """Extract user ID from request headers or session"""
    # This would typically come from JWT token or session
    # For now, assuming it's passed in headers
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
        
        # Get scraper for the URL
        scraper_class = get_scraper_for_url(url)
        domain = urlparse(url).netloc.lower()
        if domain.startswith('www.'):
            domain = domain[4:]
        
        # Get or create supported site
        site, created = SupportedSite.objects.get_or_create(
            domain=domain,
            defaults={
                'name': scraper_class().get_site_name(),
                'scraper_class': scraper_class.__name__
            }
        )
        
        # Scrape manga info
        scraper = scraper_class()
        start_time = time.time()
        result = scraper.scrape_manga_info(url)
        scraping_duration = time.time() - start_time
        
        with transaction.atomic():
            # Create bookmark
            bookmark_data = {
                'user_id': user_id,
                'url': url,
                'site': site,
                'title': result.title or 'Unknown Title',
            }
            
            if result.thumbnail_url:
                bookmark_data['thumbnail_url'] = result.thumbnail_url
            
            bookmark = Bookmark.objects.create(**bookmark_data)
            
            # Save thumbnail if available
            if result.thumbnail_data:
                thumbnail_file = scraper.create_thumbnail_file(
                    result.thumbnail_data,
                    f"thumbnail_{bookmark.id}.jpg"
                )
                bookmark.thumbnail.save(
                    thumbnail_file.name,
                    thumbnail_file,
                    save=True
                )
            
            # Log scraping attempt
            ScrapingLog.objects.create(
                bookmark=bookmark,
                url=url,
                status='SUCCESS' if result.success else 'FAILED',
                error_message=result.error_message,
                scraping_duration=scraping_duration
            )
        
        if result.success:
            return Response(
                BookmarkSerializer(bookmark, context={'request': request}).data,
                status=status.HTTP_201_CREATED
            )
        else:
            return Response(
                {
                    "error": "Failed to scrape manga info",
                    "details": result.error_message,
                    "bookmark": BookmarkSerializer(bookmark, context={'request': request}).data
                },
                status=status.HTTP_206_PARTIAL_CONTENT
            )

class BookmarkDetailView(generics.RetrieveDestroyAPIView):
    serializer_class = BookmarkSerializer
    
    def get_queryset(self):
        user_id = get_user_id_from_request(self.request)
        return Bookmark.objects.filter(user_id=user_id)

@api_view(['GET'])
def supported_sites(request):
    """Get list of supported manga sites"""
    sites = SupportedSite.objects.filter(is_active=True)
    serializer = SupportedSiteSerializer(sites, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def refresh_bookmark(request, bookmark_id):
    """Re-scrape bookmark data"""
    try:
        user_id = get_user_id_from_request(request)
    except ValueError as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    bookmark = get_object_or_404(Bookmark, id=bookmark_id, user_id=user_id)
    
    # Get scraper for the URL
    scraper_class = get_scraper_for_url(bookmark.url)
    if not scraper_class:
        return Response(
            {"error": "Site no longer supported"}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Scrape updated info
    scraper = scraper_class()
    start_time = time.time()
    result = scraper.scrape_manga_info(bookmark.url)
    scraping_duration = time.time() - start_time
    
    with transaction.atomic():
        # Update bookmark
        if result.title:
            bookmark.title = result.title
        if result.thumbnail_url:
            bookmark.thumbnail_url = result.thumbnail_url
        
        # Update thumbnail if available
        if result.thumbnail_data:
            # Delete old thumbnail
            if bookmark.thumbnail:
                bookmark.thumbnail.delete(save=False)
            
            thumbnail_file = scraper.create_thumbnail_file(
                result.thumbnail_data,
                f"thumbnail_{bookmark.id}.jpg"
            )
            bookmark.thumbnail.save(
                thumbnail_file.name,
                thumbnail_file,
                save=False
            )
        
        bookmark.save()
        
        # Log scraping attempt
        ScrapingLog.objects.create(
            bookmark=bookmark,
            url=bookmark.url,
            status='SUCCESS' if result.success else 'FAILED',
            error_message=result.error_message,
            scraping_duration=scraping_duration
        )
    
    return Response(BookmarkSerializer(bookmark).data)
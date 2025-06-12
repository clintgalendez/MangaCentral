from rest_framework import serializers
from .models import Bookmark, SupportedSite

class BookmarkSerializer(serializers.ModelSerializer):
    thumbnail_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Bookmark
        fields = ['id', 'title', 'url', 'thumbnail_url', 'created_at']
    
    def get_thumbnail_url(self, obj):
        # Prioritize locally stored thumbnail
        if obj.thumbnail and hasattr(obj.thumbnail, 'url'):
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.thumbnail.url)
        # Fallback to external URL only if no local thumbnail exists
        return obj.thumbnail_url

class BookmarkCreateSerializer(serializers.Serializer):
    url = serializers.URLField()
    
    def validate_url(self, value):
        """Validate that the URL is from a supported site"""
        from .scrapers import get_scraper_for_url
        scraper_class = get_scraper_for_url(value)
        if not scraper_class:
            from urllib.parse import urlparse
            domain = urlparse(value).netloc
            raise serializers.ValidationError(
                f"Site '{domain}' is not supported. Currently supported sites: hitomi.la"
            )
        return value

class SupportedSiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = SupportedSite
        fields = ['name', 'domain', 'is_active']
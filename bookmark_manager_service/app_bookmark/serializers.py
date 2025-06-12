from rest_framework import serializers
from .models import Bookmark, SupportedSite

class BookmarkSerializer(serializers.ModelSerializer):
    site_name = serializers.CharField(source='site.name', read_only=True)
    
    class Meta:
        model = Bookmark
        fields = ['id', 'url', 'title', 'thumbnail', 'thumbnail_url', 
                 'site_name', 'created_at', 'updated_at']
        read_only_fields = ['id', 'title', 'thumbnail', 'thumbnail_url', 
                           'site_name', 'created_at', 'updated_at']

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
from django.contrib import admin
from .models import Bookmark, SupportedSite, ScrapingLog

@admin.register(Bookmark)
class BookmarkAdmin(admin.ModelAdmin):
    list_display = ['title', 'user_id', 'site', 'created_at']
    list_filter = ['site', 'created_at']
    search_fields = ['title', 'url']
    readonly_fields = ['id', 'created_at', 'updated_at']

@admin.register(SupportedSite)
class SupportedSiteAdmin(admin.ModelAdmin):
    list_display = ['name', 'domain', 'is_active', 'created_at']
    list_filter = ['is_active']

@admin.register(ScrapingLog)
class ScrapingLogAdmin(admin.ModelAdmin):
    list_display = ['url', 'status', 'scraping_duration', 'created_at']
    list_filter = ['status', 'created_at']
    readonly_fields = ['created_at']
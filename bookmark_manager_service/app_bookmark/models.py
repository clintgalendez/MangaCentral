from django.db import models
from django.core.validators import URLValidator
import uuid
import os

def bookmark_thumbnail_path(instance, filename):
    """Generate file path for bookmark thumbnails"""
    ext = filename.split('.')[-1]
    filename = f"{uuid.uuid4().hex}.{ext}"
    return os.path.join('bookmark_thumbnails', str(instance.user_id), filename)

class SupportedSite(models.Model):
    """Model to track supported manga sites"""
    name = models.CharField(max_length=100, unique=True)
    domain = models.CharField(max_length=255, unique=True)
    scraper_class = models.CharField(max_length=100)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name

class Bookmark(models.Model):
    """Model to store user bookmarks with scraped data"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_id = models.IntegerField()  # Reference to user from user_service
    url = models.URLField(validators=[URLValidator()])
    title = models.CharField(max_length=500)
    thumbnail = models.ImageField(upload_to=bookmark_thumbnail_path, null=True, blank=True)
    thumbnail_url = models.URLField(null=True, blank=True)  # Original thumbnail URL
    site = models.ForeignKey(SupportedSite, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['user_id', 'url']
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} - User {self.user_id}"

class ScrapingLog(models.Model):
    """Model to log scraping attempts and results"""
    STATUS_CHOICES = [
        ('SUCCESS', 'Success'),
        ('FAILED', 'Failed'),
        ('ERROR', 'Error'),
    ]
    
    bookmark = models.ForeignKey(Bookmark, on_delete=models.CASCADE, null=True, blank=True)
    url = models.URLField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)
    error_message = models.TextField(null=True, blank=True)
    scraping_duration = models.FloatField(null=True, blank=True)  # in seconds
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.url} - {self.status}"
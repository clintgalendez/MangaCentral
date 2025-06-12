from abc import ABC, abstractmethod
from typing import Dict, Optional
import requests
from PIL import Image
from io import BytesIO
from django.core.files.base import ContentFile
import time

class ScrapingResult:
    """Data class to hold scraping results"""
    def __init__(self, title: str = None, thumbnail_url: str = None, 
                 thumbnail_data: bytes = None, success: bool = False, 
                 error_message: str = None):
        self.title = title
        self.thumbnail_url = thumbnail_url
        self.thumbnail_data = thumbnail_data
        self.success = success
        self.error_message = error_message

class BaseMangaScraper(ABC):
    """Base class for all manga site scrapers"""
    
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })
    
    @abstractmethod
    def get_site_name(self) -> str:
        """Return the name of the site this scraper handles"""
        pass
    
    @abstractmethod
    def get_domain(self) -> str:
        """Return the domain this scraper handles"""
        pass
    
    @abstractmethod
    def scrape_manga_info(self, url: str) -> ScrapingResult:
        """Scrape manga title and thumbnail from the given URL"""
        pass
    
    def download_thumbnail(self, thumbnail_url: str) -> Optional[bytes]:
        """Download thumbnail image and return bytes"""
        try:
            response = self.session.get(thumbnail_url, timeout=30)
            response.raise_for_status()
            
            # Validate that it's an image
            try:
                img = Image.open(BytesIO(response.content))
                img.verify()
                return response.content
            except Exception:
                return None
                
        except Exception as e:
            print(f"Error downloading thumbnail: {e}")
            return None
    
    def create_thumbnail_file(self, thumbnail_data: bytes, filename: str = None) -> ContentFile:
        """Create Django ContentFile from thumbnail data"""
        if not filename:
            filename = f"thumbnail_{int(time.time())}.jpg"
        return ContentFile(thumbnail_data, name=filename)
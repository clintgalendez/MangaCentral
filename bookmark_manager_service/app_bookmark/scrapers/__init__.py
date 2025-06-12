from .base import BaseMangaScraper
from .hitomi import HitomiScraper

# Registry of available scrapers
SCRAPER_REGISTRY = {
    'hitomi.la': HitomiScraper,
}

def get_scraper_for_url(url):
    """Get appropriate scraper for a given URL"""
    from urllib.parse import urlparse
    domain = urlparse(url).netloc.lower()
    
    # Remove www. prefix if present
    if domain.startswith('www.'):
        domain = domain[4:]
    
    return SCRAPER_REGISTRY.get(domain)
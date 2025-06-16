from .base import BaseMangaScraper
from .hitomi import HitomiScraper
from .bato import BatoScraper

SCRAPER_REGISTRY = {
    'hitomi.la': HitomiScraper,
    'bato.to': BatoScraper,
}

def get_scraper_for_url(url):
    """Get appropriate scraper for a given URL"""
    from urllib.parse import urlparse
    domain = urlparse(url).netloc.lower()
    
    if domain.startswith('www.'):
        domain = domain[4:]
    
    return SCRAPER_REGISTRY.get(domain)
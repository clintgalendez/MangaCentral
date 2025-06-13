from celery import shared_task
from .scrapers import get_scraper_for_url
from .models import Bookmark, SupportedSite, ScrapingLog
from django.db import transaction
from urllib.parse import urlparse
import time

@shared_task
def scrape_manga_info_task(user_id, url, bookmark_id=None):
    scraper_class = get_scraper_for_url(url)
    if not scraper_class:
        return {"success": False, "error": "Unsupported site"}

    domain = urlparse(url).netloc.lower()
    if domain.startswith('www.'):
        domain = domain[4:]

    site, _ = SupportedSite.objects.get_or_create(
        domain=domain,
        defaults={
            'name': scraper_class().get_site_name(),
            'scraper_class': scraper_class.__name__
        }
    )

    scraper = scraper_class()
    start_time = time.time()
    result = scraper.scrape_manga_info(url)
    scraping_duration = time.time() - start_time

    with transaction.atomic():
        if bookmark_id:
            bookmark = Bookmark.objects.get(id=bookmark_id)
            if result.title:
                bookmark.title = result.title
            if result.thumbnail_url:
                bookmark.thumbnail_url = result.thumbnail_url
            if result.thumbnail_data:
                if bookmark.thumbnail:
                    bookmark.thumbnail.delete(save=False)
                thumbnail_file = scraper.create_thumbnail_file(result.thumbnail_data, f"thumbnail_{bookmark.id}.jpg")
                bookmark.thumbnail.save(thumbnail_file.name, thumbnail_file, save=False)
            bookmark.save()
        else:
            bookmark_data = {
                'user_id': user_id,
                'url': url,
                'site': site,
                'title': result.title or 'Unknown Title',
            }
            if result.thumbnail_url:
                bookmark_data['thumbnail_url'] = result.thumbnail_url
            bookmark = Bookmark.objects.create(**bookmark_data)
            if result.thumbnail_data:
                thumbnail_file = scraper.create_thumbnail_file(result.thumbnail_data, f"thumbnail_{bookmark.id}.jpg")
                bookmark.thumbnail.save(thumbnail_file.name, thumbnail_file, save=True)

        ScrapingLog.objects.create(
            bookmark=bookmark,
            url=url,
            status='SUCCESS' if result.success else 'FAILED',
            error_message=result.error_message,
            scraping_duration=scraping_duration
        )

    return {"success": result.success, "bookmark_id": str(bookmark.id), "error": result.error_message}
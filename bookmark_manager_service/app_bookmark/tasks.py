from celery import shared_task
from .scrapers import get_scraper_for_url
from .models import Bookmark, SupportedSite, ScrapingLog
from django.db import transaction
from urllib.parse import urlparse, urlunparse
import time
import re

# Helper function to shorten Hitomi.la URLs
def shorten_hitomi_url(original_url: str) -> str:
    """
    Shortens a Hitomi.la URL to its essential parts if it matches the common pattern.
    Example: https://hitomi.la/doujinshi/long-title-here-12345.html#1
    Becomes: https://hitomi.la/doujinshi/-12345.html#1
    Otherwise, returns the original URL.
    """
    parsed_url = urlparse(original_url)
    # Check if the domain is hitomi.la or www.hitomi.la
    if parsed_url.netloc.endswith('hitomi.la'):
        path = parsed_url.path
        # Regex to find:
        # 1. base_path: The content type part like "/doujinshi/" or "/manga/"
        # 2. slug: The descriptive (long) part of the URL slug.
        # 3. id_part: The crucial "-<numbers>.html" part at the end of the path.
        match = re.match(r'(?P<base_path>/[^/]+/)(?P<slug>.*?)(?P<id_part>-\d+\.html)$', path)
        if match:
            # Reconstruct path with only base_path and id_part
            new_path = match.group('base_path') + match.group('id_part')
            # Reconstruct the full URL with the new path, preserving other components
            return urlunparse((
                parsed_url.scheme,
                parsed_url.netloc,
                new_path,
                '',
                '',
                parsed_url.fragment
            ))
    return original_url # Return original if not a matching Hitomi.la URL or pattern mismatch

@shared_task
def scrape_manga_info_task(user_id, submitted_url, bookmark_id=None):
    url_for_scraping = submitted_url
    # Determine the canonical URL that should be stored in the database
    canonical_db_url = shorten_hitomi_url(submitted_url)
    print(f"DEBUG: Original submitted URL: {submitted_url}")
    print(f"DEBUG: Canonical DB URL determined: {canonical_db_url}")

    scraper_class = get_scraper_for_url(url_for_scraping)
    if not scraper_class:
        ScrapingLog.objects.create(
            url=canonical_db_url, status='FAILED',
            error_message="Unsupported site (task level check)"
        )
        return {"success": False, "error": "Unsupported site", "bookmark_id": None}

    parsed_canonical_url = urlparse(canonical_db_url)
    domain_for_site_model = parsed_canonical_url.netloc.lower()
    if domain_for_site_model.startswith('www.'):
        domain_for_site_model = domain_for_site_model[4:]

    site = None
    try:
        site, _ = SupportedSite.objects.get_or_create(
            domain=domain_for_site_model,
            defaults={
                'name': scraper_class().get_site_name(),
                'scraper_class': scraper_class.__name__
            }
        )
    except Exception as e:
        ScrapingLog.objects.create(
            url=canonical_db_url, status='ERROR',
            error_message=f"Failed to get/create SupportedSite: {str(e)}"
        )
        return {"success": False, "error": f"Internal error with site configuration: {str(e)}", "bookmark_id": None}

    scraper = scraper_class()
    start_time = time.time()
    result = scraper.scrape_manga_info(url_for_scraping)
    scraping_duration = time.time() - start_time

    with transaction.atomic():
        bookmark_to_save = None
        log_status = 'SUCCESS' if result.success else 'FAILED'
        log_error_message = result.error_message

        if bookmark_id:
            try:
                bookmark_to_save = Bookmark.objects.select_for_update().get(id=bookmark_id, user_id=user_id)
                
                if bookmark_to_save.url != canonical_db_url:
                    if Bookmark.objects.filter(user_id=user_id, url=canonical_db_url).exclude(id=bookmark_id).exists():
                        conflict_error_msg = f"Refresh conflict: Canonical URL '{canonical_db_url}' already exists for another bookmark. URL for bookmark ID {bookmark_id} not updated."
                        log_error_message = f"{log_error_message or ''} {conflict_error_msg}".strip()
                        log_status = 'ERROR'
                    else:
                        bookmark_to_save.url = canonical_db_url
                
            except Bookmark.DoesNotExist:
                log_error_message = "Bookmark to refresh not found or access denied."
                log_status = 'FAILED'
                ScrapingLog.objects.create(
                    url=canonical_db_url, status=log_status,
                    error_message=log_error_message,
                    scraping_duration=scraping_duration
                )
                return {"success": False, "error": log_error_message, "bookmark_id": None}
        else:
            bookmark_to_save, created = Bookmark.objects.get_or_create(
                user_id=user_id,
                url=canonical_db_url,
                defaults={
                    'site': site,
                    'title': result.title or 'Unknown Title',
                    'thumbnail_url': result.thumbnail_url if result.thumbnail_url else None,
                }
            )
            if not created:
                bookmark_to_save.site = site

        if bookmark_to_save:
            if result.title:
                bookmark_to_save.title = result.title
            if result.thumbnail_url:
                bookmark_to_save.thumbnail_url = result.thumbnail_url
            
            if result.thumbnail_data:
                if bookmark_to_save.thumbnail:
                    bookmark_to_save.thumbnail.delete(save=False)
                thumbnail_file_name = f"thumbnail_{bookmark_to_save.id}.jpg" 
                thumbnail_file = scraper.create_thumbnail_file(result.thumbnail_data, thumbnail_file_name)
                bookmark_to_save.thumbnail.save(thumbnail_file.name, thumbnail_file, save=False)
            
            print(f"DEBUG: Final URL to be saved for bookmark ID {bookmark_to_save.id if bookmark_to_save.id else 'NEW'}: {bookmark_to_save.url}")
            bookmark_to_save.save()

            ScrapingLog.objects.create(
                bookmark=bookmark_to_save,
                url=canonical_db_url, 
                status=log_status,
                error_message=log_error_message,
                scraping_duration=scraping_duration
            )
            return {
                "success": result.success and log_status != 'ERROR',
                "bookmark_id": str(bookmark_to_save.id), 
                "error": log_error_message,
                "stored_url": bookmark_to_save.url 
            }
        else:
            ScrapingLog.objects.create(
                url=canonical_db_url, status='ERROR',
                error_message="Failed to determine bookmark for saving.",
                scraping_duration=scraping_duration
            )
            return {"success": False, "error": "Failed to determine bookmark for saving.", "bookmark_id": None}
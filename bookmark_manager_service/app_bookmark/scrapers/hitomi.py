from selenium.webdriver.common.by import By
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from .webdriver_manager import SingletonWebDriver
import time
import base64
from .base import BaseMangaScraper, ScrapingResult

class HitomiScraper(BaseMangaScraper):
    """Scraper for hitomi.la manga site"""

    def __init__(self):
        super().__init__()
        self.driver = None

    def get_site_name(self) -> str:
        return "Hitomi.la"

    def get_domain(self) -> str:
        return "hitomi.la"

    def _setup_driver(self):
        self.driver = SingletonWebDriver.get_driver()

    def _fetch_image_bytes_browser_context(self, image_url: str) -> bytes | None:
        """
        Fetch image bytes using browser context (JavaScript fetch).
        Returns image bytes or None.
        """
        print(f"[DEBUG] Fetching image via browser context: {image_url}")
        js = """
            const url = arguments[0];
            const callback = arguments[arguments.length - 1];
            fetch(url)
                .then(resp => resp.blob())
                .then(blob => {
                    const reader = new FileReader();
                    reader.onloadend = () => callback(reader.result);
                    reader.onerror = () => callback(null);
                    reader.readAsDataURL(blob);
                })
                .catch(() => callback(null));
        """
        try:
            self.driver.set_script_timeout(20)
            data_url = self.driver.execute_async_script(js, image_url)
            if data_url and isinstance(data_url, str) and data_url.startswith('data:image'):
                print("[DEBUG] Image fetched successfully via browser context.")
                header, encoded = data_url.split(',', 1)
                return base64.b64decode(encoded)
            else:
                print("[DEBUG] Failed to fetch image or invalid data URL returned.")
        except Exception as e:
            print(f"[ERROR] Error fetching image via browser context: {e}")
        return None

    def scrape_manga_info(self, url: str) -> ScrapingResult:
        """Scrape manga info from hitomi.la"""
        print(f"[DEBUG] Starting scrape for URL: {url}")
        try:
            self._setup_driver()
            print(f"[DEBUG] Navigating to URL: {url}")
            self.driver.get(url)
            print("[DEBUG] Waiting for page to load...")
            time.sleep(10)

            title = None
            thumbnail_url = None
            thumbnail_data = None

            try:
                print("[DEBUG] Attempting to find title element...")
                gallery_brand = self.driver.find_element(By.ID, "gallery-brand")
                title_link = gallery_brand.find_element(By.TAG_NAME, "a")
                title = title_link.text.strip()
                print(f"[DEBUG] Title found: {title}")
            except NoSuchElementException:
                print("[ERROR] Title element not found")

            try:
                print("[DEBUG] Attempting to find thumbnail element...")
                thumbnail_element = self.driver.find_element(By.ID, "bigtn_img")
                thumbnail_url = thumbnail_element.get_attribute("src") or thumbnail_element.get_attribute("data-src")
                print(f"[DEBUG] Thumbnail URL found: {thumbnail_url}")
                if thumbnail_url:
                    thumbnail_data = self._fetch_image_bytes_browser_context(thumbnail_url)
                    if thumbnail_data:
                        print("[DEBUG] Thumbnail image data fetched successfully.")
                    else:
                        print("[ERROR] Failed to fetch thumbnail image data.")
            except NoSuchElementException:
                print("[ERROR] Thumbnail element not found")

            success = bool(title or thumbnail_data)
            error_message = None if success else "Could not find title or thumbnail"

            print(f"[DEBUG] Scraping result - Success: {success}, Title: {title}, Thumbnail URL: {thumbnail_url}")

            return ScrapingResult(
                title=title,
                thumbnail_url=thumbnail_url,
                thumbnail_data=thumbnail_data,
                success=success,
                error_message=error_message
            )

        except TimeoutException:
            print("[ERROR] Page load timeout - site may be slow or blocking automated access")
            return ScrapingResult(
                success=False,
                error_message="Page load timeout - site may be slow or blocking automated access"
            )
        except Exception as e:
            print(f"[ERROR] Scraping error: {str(e)}")
            return ScrapingResult(
                success=False,
                error_message=f"Scraping error: {str(e)}"
            )
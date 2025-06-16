from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException, TimeoutException
from .webdriver_manager import SingletonWebDriver
import time
import base64
from .base import BaseMangaScraper, ScrapingResult

class BatoScraper(BaseMangaScraper):
    """Scraper for bato.to manga site"""

    def __init__(self):
        super().__init__()
        self.driver = None

    def get_site_name(self) -> str:
        return "Bato.to"

    def get_domain(self) -> str:
        return "bato.to"

    def _setup_driver(self):
        self.driver = SingletonWebDriver.get_driver()

    def _fetch_image_bytes_browser_context(self, image_url: str) -> bytes | None:
        """
        Fetch image bytes using browser context (JavaScript fetch).
        Returns image bytes or None.
        """
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
                header, encoded = data_url.split(',', 1)
                return base64.b64decode(encoded)
        except Exception as e:
            print(f"[ERROR] Error fetching image via browser context: {e}")
        return None

    def scrape_manga_info(self, url: str) -> ScrapingResult:
        """Scrape manga info from bato.to"""
        try:
            self._setup_driver()
            self.driver.get(url)
            time.sleep(10)  # Wait for page to load

            title = None
            thumbnail_url = None
            thumbnail_data = None

            # Try both possible XPaths for title
            title_xpaths = [
                "/html/body/div/div[1]/div[1]/div[1]/h3/a",
                "/html/body/div/div[1]/div[2]/div[1]/h3/a"
            ]
            for xpath in title_xpaths:
                try:
                    title_elem = self.driver.find_element(By.XPATH, xpath)
                    title = title_elem.text.strip()
                    if title:
                        break
                except NoSuchElementException:
                    continue

            # Try both possible XPaths for thumbnail
            thumbnail_xpaths = [
                "/html/body/div/div[1]/div[1]/div[3]/div[1]/img",
                "/html/body/div/div[1]/div[2]/div[3]/div[1]/img"
            ]
            for xpath in thumbnail_xpaths:
                try:
                    thumb_elem = self.driver.find_element(By.XPATH, xpath)
                    thumbnail_url = thumb_elem.get_attribute("src") or thumb_elem.get_attribute("data-src")
                    if thumbnail_url:
                        break
                except NoSuchElementException:
                    continue

            if thumbnail_url:
                thumbnail_data = self._fetch_image_bytes_browser_context(thumbnail_url)

            success = bool(title or thumbnail_data)
            error_message = None if success else "Could not find title or thumbnail"

            return ScrapingResult(
                title=title,
                thumbnail_url=thumbnail_url,
                thumbnail_data=thumbnail_data,
                success=success,
                error_message=error_message
            )

        except TimeoutException:
            return ScrapingResult(
                success=False,
                error_message="Page load timeout - site may be slow or blocking automated access"
            )
        except Exception as e:
            return ScrapingResult(
                success=False,
                error_message=f"Scraping error: {str(e)}"
            )
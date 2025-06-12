from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service
import time
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
        """Setup Chrome WebDriver with appropriate options"""
        chrome_options = Options()
        chrome_options.add_argument("--headless")  # Run in background
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        chrome_options.add_argument("--disable-gpu")
        chrome_options.add_argument("--window-size=1920,1080")
        chrome_options.add_argument("--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36")
        
        service = Service(ChromeDriverManager().install())
        self.driver = webdriver.Chrome(service=service, options=chrome_options)
        self.driver.set_page_load_timeout(30)
    
    def _cleanup_driver(self):
        """Clean up WebDriver"""
        if self.driver:
            self.driver.quit()
            self.driver = None
    
    def scrape_manga_info(self, url: str) -> ScrapingResult:
        """Scrape manga info from hitomi.la"""
        start_time = time.time()
        
        try:
            self._setup_driver()
            
            # Load the page
            self.driver.get(url)
            
            # Wait for the page to load and JavaScript to execute
            wait = WebDriverWait(self.driver, 20)
            
            # Wait for either the thumbnail or title to be present
            wait.until(
                lambda driver: driver.find_elements(By.ID, "bigtn_img") or 
                              driver.find_elements(By.ID, "gallery-brand")
            )
            
            # Give extra time for JavaScript rendering
            time.sleep(3)
            
            title = None
            thumbnail_url = None
            
            # Scrape title
            try:
                gallery_brand = self.driver.find_element(By.ID, "gallery-brand")
                title_link = gallery_brand.find_element(By.TAG_NAME, "a")
                title = title_link.text.strip()
            except NoSuchElementException:
                print("Title element not found")
            
            # Scrape thumbnail
            try:
                thumbnail_element = self.driver.find_element(By.ID, "bigtn_img")
                thumbnail_url = thumbnail_element.get_attribute("src")
                if not thumbnail_url:
                    # Sometimes the src might be in data-src or other attributes
                    thumbnail_url = thumbnail_element.get_attribute("data-src")
            except NoSuchElementException:
                print("Thumbnail element not found")
            
            # Download thumbnail if URL found
            thumbnail_data = None
            if thumbnail_url:
                thumbnail_data = self.download_thumbnail(thumbnail_url)
            
            success = bool(title or thumbnail_url)
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
        finally:
            self._cleanup_driver()
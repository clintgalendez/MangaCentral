from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
import threading

class SingletonWebDriver:
    _instance = None
    _lock = threading.Lock()

    def __init__(self):
        if not hasattr(self, 'driver'):
            chrome_options = Options()
            chrome_options.page_load_strategy = "eager"
            chrome_options.add_argument("--headless")
            chrome_options.add_argument("--no-sandbox")
            chrome_options.add_argument("--disable-dev-shm-usage")
            chrome_options.add_argument("--disable-gpu")
            chrome_options.add_argument("--window-size=1920,1080")
            chrome_options.add_argument("--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36")
            service = Service('/usr/local/bin/chromedriver')
            self.driver = webdriver.Chrome(service=service, options=chrome_options)
            self.driver.set_page_load_timeout(30)

    @classmethod
    def get_driver(cls):
        with cls._lock:
            if cls._instance is None:
                cls._instance = SingletonWebDriver()
            return cls._instance.driver
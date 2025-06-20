FROM python:3.11-slim

RUN apt-get update && apt-get install -y \
    wget \
    curl \
    unzip \
    gnupg \
    pkg-config \
    default-libmysqlclient-dev \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list \
    && apt-get update \
    && apt-get install -y google-chrome-stable \
    && rm -rf /var/lib/apt/lists/*

RUN CHROME_VERSION=$(google-chrome --version | grep -oP '\d+\.\d+\.\d+') \
    && CHROME_MAJOR_VERSION=$(echo $CHROME_VERSION | cut -d. -f1) \
    && echo "Chrome version: $CHROME_VERSION, Major version: $CHROME_MAJOR_VERSION" \
    && if [ "$CHROME_MAJOR_VERSION" -ge "115" ]; then \
        DRIVER_VERSION=$(curl -s "https://googlechromelabs.github.io/chrome-for-testing/LATEST_RELEASE_$CHROME_MAJOR_VERSION") \
        && wget -N "https://edgedl.me.gvt1.com/edgedl/chrome/chrome-for-testing/$DRIVER_VERSION/linux64/chromedriver-linux64.zip" -P ~/ \
        && unzip ~/chromedriver-linux64.zip -d ~/ \
        && mv ~/chromedriver-linux64/chromedriver /usr/local/bin/chromedriver; \
    else \
        DRIVER_VERSION=$(curl -s "https://chromedriver.storage.googleapis.com/LATEST_RELEASE_$CHROME_MAJOR_VERSION") \
        && wget -N "https://chromedriver.storage.googleapis.com/$DRIVER_VERSION/chromedriver_linux64.zip" -P ~/ \
        && unzip ~/chromedriver_linux64.zip -d ~/ \
        && mv ~/chromedriver /usr/local/bin/chromedriver; \
    fi \
    && chmod +x /usr/local/bin/chromedriver \
    && rm -rf ~/chromedriver* \
    && echo "ChromeDriver version: $(chromedriver --version)"

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN useradd --create-home --shell /bin/bash app \
    && chown -R app:app /app
USER app

EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
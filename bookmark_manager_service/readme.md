# Bookmark Manager Service

This service is responsible for managing manga bookmarks. It allows users to add, view, and delete their manga bookmarks. It also scrapes metadata (like title and thumbnail) from supported manga websites.

## Features

-   User-specific bookmark management (CRUD operations).
-   Asynchronous scraping of manga metadata using Celery.
-   Fetches manga title and thumbnail.
-   Stores thumbnails locally.
-   Supports multiple manga websites via a pluggable scraper system.
-   Authentication via a separate User Service.
-   API for frontend interaction.

## Tech Stack

-   **Python**
-   **Django** & **Django REST Framework** for the API
-   **Celery** for asynchronous task processing
-   **Redis** as a Celery message broker and cache backend
-   **MySQL** as the primary database
-   **Selenium** for web scraping
-   **Requests** for HTTP requests
-   **Pillow** for image processing

## Project Structure

```
bookmark_manager_service/
├── Dockerfile              # Docker configuration
├── manage.py               # Django's command-line utility
├── requirements.txt        # Python dependencies
├── app_bookmark/           # Core application logic
│   ├── __init__.py
│   ├── admin.py            # Django admin configurations
│   ├── apps.py             # Application configuration
│   ├── authentication.py   # Custom token authentication
│   ├── models.py           # Database models (Bookmark, SupportedSite, ScrapingLog)
│   ├── serializers.py      # Data serialization (for API responses)
│   ├── tasks.py            # Celery tasks (e.g., scraping)
│   ├── tests.py
│   ├── urls.py             # API endpoint definitions
│   ├── views.py            # API request handlers
│   ├── migrations/         # Database schema migrations
│   └── scrapers/           # Website-specific scraping logic
│       ├── __init__.py
│       ├── base.py         # Base scraper class
│       ├── hitomi.py       # Scraper for hitomi.la
│       ├── bato.py         # Scraper for bato.to
│       └── webdriver_manager.py # Selenium WebDriver singleton
├── media/                  # Directory for uploaded media (e.g., thumbnails)
└── project_bookmark/       # Django project configuration
    ├── __init__.py
    ├── asgi.py             # ASGI config
    ├── celery.py           # Celery app definition
    ├── settings.py         # Django project settings
    ├── urls.py             # Project-level URL routing
    └── wsgi.py             # WSGI config
```

## Environment Variables

This service relies on environment variables for configuration. Create a `.env` file in the `bookmark_manager_service` root directory. Key variables include:

-   `DJANGO_SECRET_KEY`: Your Django secret key.
-   `DEBUG`: Set to `True` for development, `False` for production.
-   `DJANGO_ALLOWED_HOSTS`: Space-separated list of allowed hosts (e.g., `localhost 127.0.0.1`).
-   `MYSQL_DATABASE`: Name of the MySQL database.
-   `MYSQL_USER`: MySQL username.
-   `MYSQL_PASSWORD`: MySQL password.
-   `MYSQL_HOST`: Hostname for the MySQL database (e.g., `mysql_db` if using Docker Compose, `localhost` otherwise).
-   `MYSQL_PORT`: Port for the MySQL database (default `3306`).
-   `CELERY_BROKER_URL`: URL for the Celery message broker (e.g., `redis://redis:6379/0` or `redis://localhost:6379/0`).
-   `REDIS_CACHE_URL`: URL for the Redis cache (e.g., `redis://redis:6379/1` or `redis://localhost:6379/1`).
-   `USER_SERVICE_VALIDATE_TOKEN_URL`: Full URL to the user service's token validation endpoint (e.g., `http://localhost:8001/api/user/me/`).

Refer to [`project_bookmark/settings.py`](bookmark_manager_service/project_bookmark/settings.py) for a comprehensive list of settings that can be configured via environment variables.

## Getting Started

### Prerequisites

-   Python (3.11 recommended, see [`Dockerfile`](bookmark_manager_service/Dockerfile))
-   Pip
-   MySQL
-   Redis
-   Google Chrome and ChromeDriver (if running scrapers locally without Docker, see [`Dockerfile`](bookmark_manager_service/Dockerfile) for setup)

### Installation

1.  **Clone the repository** (if you haven't already):
    ```bash
    git clone <repository-url>
    cd MangaCentral/bookmark_manager_service
    ```

2.  **Create and activate a virtual environment** (recommended):
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```

3.  **Install dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

4.  **Set up your `.env` file** as described in the "Environment Variables" section.

5.  **Apply database migrations**:
    ```bash
    python manage.py migrate
    ```

### Running the Development Server

1.  **Start Django development server**:
    ```bash
    python manage.py runserver
    ```
    The server will typically run on `http://localhost:8000`.

2.  **Start Celery worker** (in a separate terminal):
    ```bash
    celery -A project_bookmark worker -l info
    ```

## API Endpoints

The main API endpoints are defined in [`app_bookmark/urls.py`](bookmark_manager_service/app_bookmark/urls.py):

-   `POST /bookmarks/`: Add a new bookmark. Triggers asynchronous scraping.
-   `GET /bookmarks/`: List all bookmarks for the authenticated user.
-   `GET /bookmarks/<uuid:pk>/`: Retrieve a specific bookmark.
-   `DELETE /bookmarks/<uuid:pk>/`: Delete a specific bookmark.
-   `POST /bookmarks/<uuid:bookmark_id>/refresh/`: Re-scrape a specific bookmark.
-   `GET /supported-sites/`: Get a list of currently supported manga sites.
-   `GET /tasks/<str:task_id>/status/`: Check the status of an asynchronous scraping task.

Authentication is required for most endpoints and is handled by validating a token against the User Service.

## Docker

A [`Dockerfile`](bookmark_manager_service/Dockerfile) is provided to containerize the application.

### Building the Docker Image

```bash
docker build -t manga-central-bookmark-service .
```

### Running with Docker

To run the service using Docker, you'll typically use Docker Compose along with other services (like MySQL, Redis, and the User Service). Refer to the main `docker-compose.yml` in the project root.

If running standalone (ensure MySQL and Redis are accessible):

```bash
# Example:
docker run -p 8000:8000 \
  -e DJANGO_SECRET_KEY='your-secret' \
  -e MYSQL_HOST='your_mysql_host' \
  -e MYSQL_DATABASE='your_db' \
  -e MYSQL_USER='your_user' \
  -e MYSQL_PASSWORD='your_password' \
  -e CELERY_BROKER_URL='redis://your_redis_host:6379/0' \
  -e USER_SERVICE_VALIDATE_TOKEN_URL='http://your_user_service_host/api/user/me/' \
  manga-central-bookmark-service
```

You would also need to run a Celery worker in a similar containerized fashion, overriding the CMD:
```bash
# Example for Celery worker:
docker run \
  -e DJANGO_SECRET_KEY='your-secret' \
  # ... other necessary environment variables ...
  manga-central-bookmark-service celery -A project_bookmark worker -l info
```
It's highly recommended to use Docker Compose for managing multi-container
# User Service

This service is responsible for managing user accounts, authentication, and authorization for the Manga Central application.

## Features

-   User registration with email and password.
-   User login and token-based authentication (using Django REST Framework's TokenAuthentication).
-   Secure password hashing.
-   Endpoint to retrieve authenticated user details.
-   User logout and token invalidation.
-   Rate limiting for login and registration endpoints.
-   Caching for user details to improve performance.

## Tech Stack

-   **Python**
-   **Django** & **Django REST Framework** for the API
-   **MySQL** as the primary database
-   **Redis** for caching
-   **Gunicorn** as the WSGI HTTP server (for production)
-   **django-cors-headers** for Cross-Origin Resource Sharing

## Project Structure

```
user_service/
├── Dockerfile              # Docker configuration
├── manage.py               # Django's command-line utility
├── requirements.txt        # Python dependencies
├── app_user/               # Core application logic for user management
│   ├── __init__.py
│   ├── admin.py            # Django admin configurations
│   ├── apps.py             # Application configuration
│   ├── models.py           # (Uses Django's built-in User model)
│   ├── serializers.py      # Data serialization (UserRegistrationSerializer, UserDetailSerializer)
│   ├── tests.py
│   ├── urls.py             # API endpoint definitions (register, login, logout, me)
│   ├── views.py            # API request handlers (UserRegistrationView, UserLoginView, etc.)
│   └── migrations/         # Database schema migrations (mostly for Django's auth system)
└── project_user/           # Django project configuration
    ├── __init__.py
    ├── asgi.py             # ASGI config
    ├── settings.py         # Django project settings
    ├── urls.py             # Project-level URL routing
    └── wsgi.py             # WSGI config
```

## Environment Variables

This service relies on environment variables for configuration. Create a `.env` file in the `user_service` root directory or set them in your deployment environment. Key variables include:

-   `DJANGO_SECRET_KEY`: Your Django secret key.
-   `DEBUG`: Set to `True` for development, `False` for production.
-   `DJANGO_ALLOWED_HOSTS`: Space-separated list of allowed hosts (e.g., `localhost 127.0.0.1 yourdomain.com`).
-   `MYSQL_DATABASE`: Name of the MySQL database.
-   `MYSQL_USER`: MySQL username.
-   `MYSQL_PASSWORD`: MySQL password.
-   `MYSQL_HOST`: Hostname for the MySQL database (e.g., `mysql_db` if using Docker Compose, `localhost` otherwise).
-   `MYSQL_PORT`: Port for the MySQL database (default `3306`).
-   `REDIS_CACHE_URL`: URL for the Redis cache (e.g., `redis://redis:6379/2` or `redis://localhost:6379/2`). Note: The cache number (e.g., `/2`) should be distinct from other services using the same Redis instance.

Refer to [`project_user/settings.py`](user_service/project_user/settings.py) for a comprehensive list of settings that can be configured via environment variables.

## Getting Started

### Prerequisites

-   Python (3.11 recommended, see [`Dockerfile`](user_service/Dockerfile))
-   Pip
-   MySQL
-   Redis

### Installation

1.  **Clone the repository** (if you haven't already):
    ```bash
    git clone <repository-url>
    cd MangaCentral/user_service
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
    python manage.py runserver 8001 # Or any other port not in use
    ```
    The server will typically run on `http://localhost:8001`.

## API Endpoints

The main API endpoints are defined in [`app_user/urls.py`](user_service/app_user/urls.py) and are prefixed with `/api/user/`:

-   `POST /api/user/register/`: Register a new user.
    -   **Request Body**: `{ "username": "testuser", "email": "test@example.com", "password": "StrongPassword123", "password2": "StrongPassword123" }`
    -   **Response**: `{ "user_info": { "id": 1, "username": "testuser", "email": "test@example.com" }, "token": "yourtokenstring" }`
-   `POST /api/user/login/`: Log in an existing user.
    -   **Request Body**: `{ "username": "testuser", "password": "StrongPassword123" }`
    -   **Response**: `{ "user_info": { "id": 1, "username": "testuser", "email": "test@example.com" }, "token": "yourtokenstring" }`
-   `POST /api/user/logout/`: Log out the currently authenticated user (requires Token authentication).
    -   **Response**: `204 No Content`
-   `GET /api/user/me/`: Get details of the currently authenticated user (requires Token authentication).
    -   **Response**: `{ "id": 1, "username": "testuser", "email": "test@example.com", "first_name": "", "last_name": "" }`

## Docker

A [`Dockerfile`](user_service/Dockerfile) is provided to containerize the application.

### Building the Docker Image

```bash
docker build -t manga-central-user-service .
```

### Running with Docker

To run the service using Docker, you'll typically use Docker Compose along with other services (like MySQL and Redis). Refer to the main `docker-compose.yml` in the project root.

If running standalone (ensure MySQL and Redis are accessible):

```bash
# Example:
docker run -p 8001:8000 \
  -e DJANGO_SECRET_KEY='your-secret' \
  -e MYSQL_HOST='your_mysql_host' \
  -e MYSQL_DATABASE='your_db' \
  -e MYSQL_USER='your_user' \
  -e MYSQL_PASSWORD='your_password' \
  -e REDIS_CACHE_URL='redis://your_redis_host:6379/2' \
  manga-central-user-service
```
The Docker container exposes port 8000 by default. The `-p 8001:8000` maps port 8001 on your host to port 8000 in the container. The `CMD` in the `docker-compose.yml` will typically use Gunicorn to run the application.